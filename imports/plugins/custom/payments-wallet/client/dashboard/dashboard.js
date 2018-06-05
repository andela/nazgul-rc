/* global $ */
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Reaction } from "/client/api";
import { Accounts } from "/lib/collections";
import { Random } from "meteor/random";

import { Paystack } from "../../../../custom/payments-paystack/lib/api";
import "./dashboard.html";

function uiEnd(template, buttonText) {
  return template.$("#btn-complete-order").text(buttonText);
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

Template.walletDashboard.helpers({
  balanceInWallet() {
    const user = Meteor.user();
    let balance;
    Meteor.subscribe("Accounts", Reaction.getShopId());

    if (Reaction.Subscriptions && Reaction.Subscriptions.Account && Reaction.Subscriptions.Account.ready()) {
      const balanceInWallet = Accounts.findOne({ userId: user._id }).wallet;
      return balanceInWallet.toFixed(2);
    }
  }
});

/**
 * @method fundWalletWithPaystack
 * @summary funds wallet via paystack payment.
 */
const fundWalletWithPaystack = (amount) => {
  return new Promise((resolve, reject) => {
    const template = Template.instance();
    const user = Meteor.user();

    Meteor.subscribe("Packages", Reaction.getShopId());
    const email = Accounts.findOne({ userId: user._id }).emails[0].address;
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
  const userId = Meteor.userId();

  // Perform some check here to ensure that amount is of the wright type
  Meteor.call("accounts/fundWallet", amount, userId);
};

const fundOtherCustomerWallet = (amount, email) => {
  console.log("amountfromfund", amount);
  console.log("emailfromfund", email);
  console.log("Metoer user", Meteor.user());
  console.log("Metoer email", Meteor.email());

  const template = Template.instance();
  Alerts.alert({
    title: `You are about to transfer ${amount} to ${email}`,
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Confirm"
  }, (isConfirm) => {
    if (isConfirm) {
      Meteor.call("accounts/fundOtherCustomerWallet", amount, email, (err, data) => {
        if (!err) {
          if (!data) {
            Alerts.toast("User with this email does not exist.", "error");
            uiEnd(template, "Resubmit Payment");
          } else {
            Alerts.toast(`Yassss! ₦${amount} has been transfered to ${email}`);
          }
        }
      });
    }
  });
};

Template.walletDashboard.events({
  "click #submitFund": (event) => {
    event.preventDefault();
    const template = Template.instance();
    let amount = $('input[name="addAmount"]').val();
    amount = +amount;
    if (!amount || isNaN(amount) || amount === 0) {
      Alerts.toast("Enter a valid amount", "error");
      uiEnd(template, "Resubmit Payment");
    } else {
      beginSubmit(template, "Submitting");
      fundWalletWithPaystack(amount)
        .then((result) => {
          fundWallet((result.amount / 100));
          endSubmit(template);
          $('input[name="addAmount"]').val("");
          Alerts.toast(`Yassss! ₦${(result.amount / 100)} has been added to your wallet`);
        })
        .catch((error) => {
          endSubmit(template);
          Alerts.toast(error.message, "error");
        });
    }
  },

  "click #transferFund"() {
    event.preventDefault();
    const template = Template.instance();
    let transferAmount = $('input[name="transferAmount"]').val();
    let email = $('input[name="transferEmail"]').val();
    transferAmount = +transferAmount;
    email = email.toLowerCase();
    console.log("transferAount", transferAmount);
    console.log("email", email);
    const regexForEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //eslint-disable-line
    const validEmail =  regexForEmail.test(email);
    console.log("validemail", validEmail);
    if (!transferAmount || isNaN(transferAmount) || transferAmount === 0) {
      Alerts.toast("Enter a valid amount", "error");
      uiEnd(template, "Retransfer Funds");
    } else if (!validEmail) {
      Alerts.toast("Enter a valid email", "error");
      uiEnd(template, "Retransfer Funds");
    } else if (Reaction.Subscriptions && Reaction.Subscriptions.Account && Reaction.Subscriptions.Account.ready()) {
      const user = Meteor.user();
      const senderAccount = Accounts.findOne({ userId: user._id });
      const senderEmail = senderAccount.emails[0].address;
      console.log("senderEmail", senderEmail);
      console.log("senderemail", senderAccount.emails[0]);

      if (validEmail === senderEmail) {
        Alerts.toast("You can't transfer funds to yourself");
        uiEnd(template, "Retransfer Funds");
      }

      Meteor.call("accounts/getWalletBalance", (error, balance) => {
        if (transferAmount > balance) {
          // Display an error alert
          Alerts.alert("Insufficient Funds, Kindly fund your wallet and retry!");
          uiEnd(template, "Retransfer Funds");
        } else {
          fundOtherCustomerWallet(transferAmount, validEmail);
          endSubmit(template);
        }
      });
      beginSubmit(template, "Submitting");
    }
  }
});
