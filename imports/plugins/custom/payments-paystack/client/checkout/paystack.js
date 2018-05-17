/* eslint camelcase: 0 */
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { AutoForm } from "meteor/aldeed:autoform";
import { $ } from "meteor/jquery";
import { Reaction } from "/client/api";
import { Cart, Packages } from "/lib/collections";
import { Paystack } from "../../lib/api";
import { Random } from "meteor/random";
import { PaystackPayment } from "../../lib/collections/schemas";

import "./paystack.html";

let submitting = false;

function uiEnd(template, buttonText) {
  template.$(":input").removeAttr("disabled");
  template.$("#btn-complete-order").text(buttonText);
  return template.$("#btn-processing").addClass("hidden");
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

Template.paystackPaymentForm.helpers({
  PaystackPayment() {
    return PaystackPayment;
  }
});

AutoForm.addHooks("paystack-payment-form", {
  onSubmit(doc) {
    /* load paystack keys */
    Meteor.call("paystack/loadApiKeys", (error, paystackKeys) => {
      if (paystackKeys) {
        const { secretKey, publicKey } = paystackKeys;

        /* Get the packages */
        Meteor.subscribe("Packages", Reaction.getShopId());
        const applicationPackages = Packages.findOne({
          name: "paystack-paymentmethod",
          shopId: Reaction.getShopId()
        });

        const cart = Cart.findOne().getTotal();
        const amount = Math.round(cart * 100);
        const template = this.template;

        const formData = {
          key: publicKey,
          name: doc.payerName,
          email: doc.payerEmail,
          reference: Random.id(),
          amount,
          callback(response) {
            const ref = response.reference;
            if (ref) {
              Paystack.verify(ref, secretKey, (err, res) => {
                if (err) {
                  handlePaystackSubmitError(error);
                  uiEnd(template, "Resubmit payment");
                } else {
                  const transaction = res.data;
                  submitting = false;
                  const paymentMethod = {
                    processor: "Paystack",
                    paymentPackageId: applicationPackages._id,
                    paymentSettingsKey: applicationPackages.registry[0].settingsKey,
                    storedCard: transaction.authorization.card_type,
                    method: "credit",
                    transactionId: transaction.reference,
                    riskLevel: transaction.riskLevel,
                    currency: transaction.currency,
                    amount: transaction.amount,
                    status: transaction.status,
                    mode: "authorize",
                    createdAt: new Date(),
                    transactions: []
                  };
                  Alerts.toast("Transaction successful");
                  paymentMethod.transactions.push(transaction.authorization);
                  Meteor.call("cart/submitPayment", paymentMethod);
                }
              });
            }
          },
          onClose() {
            uiEnd(template, "Resubmit payment");
          }
        };
        try {
          PaystackPop.setup(formData).openIframe();
          submitting = false;
        } catch (err) {
          handlePaystackSubmitError(err);
          uiEnd(template, "Complete payment");
        }
      }
    });
    return false;
  },
  beginSubmit() {
    this.template.$(":input").attr("disabled", true);
    this.template.$("#btn-complete-order").text("Submitting ");
    return this.template.$("#btn-processing").removeClass("hidden");
  },
  endSubmit() {
    if (!submitting) {
      return uiEnd(this.template, "Complete your order");
    }
  }
});
