/* eslint camelcase: 0 */
import { Meteor } from "meteor/meteor";
import { $ } from "meteor/jquery";
import { Template } from "meteor/templating";
import { Reaction, Logger } from "/client/api";
import { getCardType } from "/client/modules/core/helpers/globals";
import { Cart, Shops, Packages } from "/lib/collections";
import { AutoForm } from "meteor/aldeed:autoform";
import { AuthNetPayment } from "../../lib/collections/schemas";
import { AuthNet } from "../api";


import "./authnet.html";

function uiEnd(tpl, buttonText) {
  tpl.$(":input").removeAttr("disabled");
  tpl.$("#btn-complete-order").text(buttonText);
  tpl.$("#btn-processing").addClass("hidden");
}

function paymentAlert(errorMessage) {
  return $(".alert").removeClass("hidden").text(errorMessage);
}

function hidePaymentAlert() {
  $(".alert").addClass("hidden").text("");
}

function handleAuthNetSubmitError(error) {
  // TODO - this error handling needs to be reworked for the Authorize.net API
  paymentAlert(error);
  Logger.fatal(error);
}

// used to track asynchronous submitting for UI changes
let submitting = false;

Template.authnetPaymentForm.helpers({
  AuthNetPayment() {
    return AuthNetPayment;
  }
});

// disables payment form on load
Template.authnetPaymentForm.rendered = function () {
  $("#authnet").hide();
};

// toggle payment methods visibility
Template.authnetPaymentForm.events({
  "click .checkie": (event) => {
    event.preventDefault();
    $("#authnet").slideToggle(1000);
  }
});

AutoForm.addHooks("authnet-payment-form", {
  onSubmit(doc) {
    // Process form (pre-validated by autoform)
    submitting = true;
    const tpl = this.template;
    // regEx in the schema ensures that there will be exactly two names with one space between
    const payerNamePieces = doc.payerName.split(" ");
    const form = {
      first_name: payerNamePieces[0],
      last_name: payerNamePieces[1],
      number: doc.cardNumber,
      expire_date: doc.expireMonth.toString() + doc.expireYear.slice(-2),
      cvv2: doc.cvv,
      type: getCardType(doc.cardNumber)
    };

    // Reaction only stores type and 4 digits
    const storedCard = form.type.charAt(0).toUpperCase() + form.type.slice(1) + " " + doc.cardNumber.slice(-4);

    hidePaymentAlert();

    const cardInfo = {
      cardNumber: doc.cardNumber,
      expirationYear: doc.expireYear,
      expirationMonth: doc.expireMonth,
      cvv2: doc.cvv
    };
    const paymentInfo = {
      total: Cart.findOne().getTotal(),
      currency: Shops.findOne().currency
    };

    // Submit for processing
    AuthNet.authorize(cardInfo, paymentInfo, function (error, transaction) {
      if (error || !transaction) {
        handleAuthNetSubmitError(error);
        uiEnd(tpl, "Resubmit payment");
      } else {
        const normalizedMode = "authorize";
        let normalizedStatus = "failed";

        const transId = transaction.transactionId[0].toString();
        Meteor.subscribe("Packages", Reaction.getShopId());
        const packageData = Packages.findOne({
          name: "reaction-auth-net",
          shopId: Reaction.getShopId()
        });

        if (transaction._original.responseCode[0] === "1") {
          normalizedStatus = "created";
        }

        const paymentMethod = {
          processor: "AuthNet",
          paymentPackageId: packageData._id,
          paymentSettingsKey: packageData.registry[0].settingsKey,
          storedCard: storedCard,
          method: "credit",
          transactionId: transId,
          amount: +paymentInfo.total,
          status: normalizedStatus,
          mode: normalizedMode,
          createdAt: new Date(),
          updatedAt: new Date(),
          transactions: [
            transaction._original
          ]
        };
        Meteor.call("cart/submitPayment", paymentMethod);
        uiEnd(tpl, "Resubmit payment");
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
    // Hide processing UI here if form was not valid
    if (!submitting) {
      uiEnd(this.template, "Complete your order");
    }
  }
});
