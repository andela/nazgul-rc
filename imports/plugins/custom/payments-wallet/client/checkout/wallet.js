/* global $ eslint camelcase: 0 */
import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
// import { ReactiveVar } from "meteor/reactive-var";
import { Template } from "meteor/templating";
import { Reaction } from "/client/api";
import { Cart, Shops, Packages, Accounts } from "/lib/collections";

import "./wallet.html";

Template.walletPaymentForm.helpers({
  balanceInWallet() {
    const user = Meteor.user();
    const balanceInWallet = Accounts.findOne({ userId: user._id }).wallet;
    return balanceInWallet.toFixed(2);
  }
});

// disables payment form on load
Template.walletPaymentForm.rendered = function () {
  $("#wallet").hide();
};

// toggle payment methods visibility
Template.walletPaymentForm.events({
  "click .checkie": (event) => {
    event.preventDefault();
    $("#wallet").slideToggle(1000);
  }
});

/**
 * @method takeAwayFromWallet
 * @summary Deduct productPrice from the wallet.
 * @param {Number} productPrice The productPrice to take away from the wallet
 */
const deductFromWallet = (productPrice) => {
  const user = Meteor.user();
  Meteor.call("accounts/deductFromWallet", productPrice, user._id);
};

Template.walletPaymentForm.events({
  "click #completeWalletOrder": (event) => {
    event.preventDefault();
    const productPrice = Number(Cart.findOne().getTotal());
    const currency = Shops.findOne().currency;

    Meteor.subscribe("Packages", Reaction.getShopId());
    const packageData = Packages.findOne({
      name: "wallet",
      shopId: Reaction.getShopId()
    });

    Meteor.call("accounts/getWalletBalance", (error, balance) => {
      if (productPrice > balance) {
        // Display an error alert
        Alerts.alert("Insufficient Funds, Kindly fund your wallet and retry!");
      } else {
        // Display a warning alert
        Alerts.alert({
          title: `₦${productPrice} will be deducted from your wallet`,
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Confirm"
        }, (willDeduct) => {
          // Make the payment
          if (willDeduct) {
            const paymentMethod = {
              processor: "Wallet",
              method: "credit",
              paymentPackageId: packageData._id,
              paymentSettingsKey: packageData.registry[0].settingsKey,
              transactionId: Random.id(),
              currency,
              amount: productPrice,
              status: "success" || "passed",
              mode: "authorize",
              createdAt: new Date(),
              transactions: []
            };
            Meteor.call("cart/submitPayment", paymentMethod, (submitPaymentError) => {
              if (submitPaymentError) {
                Alerts.toast(submitPaymentError.message, "error");
              } else {
                deductFromWallet(productPrice);
              }
            });
          }
        });
      }
    });
  }
});
