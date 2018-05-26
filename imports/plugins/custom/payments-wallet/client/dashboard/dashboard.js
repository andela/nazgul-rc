/* global $ */
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Reaction } from "/client/api";
import { Accounts } from "/lib/collections";
import { Random } from "meteor/random";

// import { Paystack } from "../../../../../custom/payments-paystack/lib/api";
import { Paystack } from "../../../../custom/payments-paystack/lib/api";
import "./dashboard.html";

function uiEnd(template, buttonText) {
  // template.$(":input").removeAttr("disabled");
  return template.$("#btn-complete-order").text(buttonText);
  // return template.$("#btn-processing").addClass("hidden");
}

function paymentAlert(errorMessage) {
  return $(".alert").removeClass("hidden").text(errorMessage);
}

function handlePaystackSubmitError(error) {
  const serverError = error !== null ? error.message : void 0;
  if (serverError) {
    return paymentAlert("Oops! " + serverError);
  } else if (error) {
    return paymentAlert("Oops! " + error, null, 4);
  }
}

function beginSubmit(template) {
  template.$(":input").attr("disabled", true);
  template.$("#btn-complete-order").text("Submitting   ");
  return template.$("#btn-processing").removeClass("hidden");
}

function endSubmit(template) {
  template.$(":input").attr("disabled", false);
  template.$("#btn-complete-order").text("Submit Fund");
  return template.$("#btn-processing").addClass("hidden");
}

console.log("meteor.userId", Meteor.userId());
console.log("Accounts", Accounts);

Template.walletDashboard.helpers({
  balanceInWallet() {
    let balance;
    Meteor.subscribe("Accounts", Reaction.getShopId());

    if (Reaction.Subscriptions && Reaction.Subscriptions.Account && Reaction.Subscriptions.Account.ready()) {
      const balanceInWallet = Accounts.findOne(Meteor.userId()).wallet;
      console.log("balanceInWallet", balanceInWallet);
      return balanceInWallet;
    }
  }
});

/**
 * @method fundWalletWithPaystack
 * @summary funds wallet via paystack payment.
 */
const fundWalletWithPaystack = (amount) => {
  return new Promise((resolve, reject) => {
    Meteor.subscribe("Packages", Reaction.getShopId());

    const email = Accounts.findOne({ _id: Meteor.userId() }).emails[0].address;
    console.log("my email from paystack funding", email);

    Meteor.call("paystack/loadApiKeys", (getPublicKeyError, keys) => {
      if (!getPublicKeyError) {
        const { publicKey, secretKey } = keys;
        const payload = {
          key: publicKey,
          email,
          amount: (amount * 100),
          reference: Random.id(),
          callback: (response) => {
            const { reference } = response;
            Paystack.verify(reference, secretKey, (paystackVerifyError, res) => {
              if (!paystackVerifyError) {
                resolve(res.data);
              } else {
                reject(paystackVerifyError);
              }
            });
          },
          onClose: () => {
            reject(new Error("some error occured"));
            endSubmit(this.template);
          }
        };
        console.log("payload", payload);
        PaystackPop.setup(payload).openIframe();
      } else {
        reject(getPublicKeyError);
      }
    });
  });
};

/**
 * @method fundWallet
 * @summary funds wallet.
 * @param {Number} amount amount to be added.
 */
const fundWallet = (amount) => {
  // Perform some check here to ensure that amount is of the wright type
  Meteor.call("accounts/fundWallet", amount);
};

Template.walletDashboard.events({
  "click #submitFund": (event) => {
    event.preventDefault();
    console.log("event.target", event.target.addedAmount);

    const template = Template.instance();
    let amount = $('input[name="addAmount"]').val();
    amount = +amount;
    console.log("input value", $('input[id="addAmount"]'));
    console.log("amount", amount);

    if (!amount || isNaN(amount) || amount === 0) {
      Alerts.toast("Enter a valid amount", "error");
      uiEnd(template, "Resubmit Payment");
    } else {
      beginSubmit(template, "Submitting");
      fundWalletWithPaystack(amount)
        .then((result) => {
          console.log("result from fundwallet server method", result);
          fundWallet((result.amount / 100));
          endSubmit(template);
          $('input[name="addAmount"]').val("");
          Alerts.toast(`Yassss! ${(result.amount / 100)} has been added to your wallet`);
        })
        .catch((error) => {
          endSubmit(template);
          Alerts.toast(error.message, "error");
        });
    }
  }
});
