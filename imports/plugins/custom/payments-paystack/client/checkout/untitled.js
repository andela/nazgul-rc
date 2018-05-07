AutoForm.addHooks("paystack-payment-form", {
  onSubmit(doc) {
    Meteor.call("paystack/loadApiKeys", (err, keys) => {
      if (keys) {
        const {
          pKey,
          sKey
        } = keys;
        const packageData = Packages.findOne({
          name: "paystack-paymentmethod",
          shopId: Reaction.getShopId()
        });
        const cart = Cart.findOne();
        const amount = Math.round(cart.cartTotal()) * 100;
        const template = this.template;
        const details = {
          key: pKey,
          name: doc.payerName,
          email: doc.email,
          reference: Random.id(),
          amount,
          callback(response) {
            if (response.reference) {
              Paystack.verify(response.reference, sKey, (error, res) => {
                if (error) {
                  handlePaystackSubmitError(template, error);
                  enableButton(template, "Resubmit payment");
                } else {
                  submitting = false;
                  const transaction = res.data;
                  const paymentMethod = {
                    paymentPackageId: packageData._id,
                    paymentSettingsKey: packageData.registry[0].settingsKey,
                    method: "credit",
                    processor: "Paystack",
                    storedCard: transaction.authorization.card_type,
                    transactionId: transaction.reference,
                    currency: transaction.currency,
                    amount: transaction.amount / 100,
                    status: "passed",
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
            enableButton(template, "Complete payment");
          }
        };
        try {
          PaystackPop.setup(details).openIframe();
        } catch (error) {
          handlePaystackSubmitError(template, error);
          enableButton(template, "Complete payment");
        }
      }
    });
    return false;
  },
  endSubmit: function () {
    if (!submitting) {
      return uiEnd(this.template, "Complete your order");
    }
  }
});


export const Paystack = {
  accountOptions: function () {
    const settings = Packages.findOne({
      name: "reaction-paymentmethod"
    }).settings;
    if (!settings.sKey && !settings.pkey) {
      throw new Meteor.Error("403", "Invalid Credentials");
    }
    return { secretKey: settings.sKey,
      publicKey: settings.pkey };
  },

  authorize: function (cardInfo, paymentInfo, callback) {
    Meteor.call("paystackSubmit", "authorize", cardInfo, paymentInfo, callback);
  },

  verify: (referenceNumber, secretKey, callback) => {
    const referenceId = referenceNumber;
    const headers = getPaystackHeader(secretKey);
    const paystackUrl = `https://api.paystack.co/transaction/verify/${referenceId}`;
    request.get(paystackUrl, {
      headers
    }, (error, response, body) => {
      const responseBody = JSON.parse(body);
      if (responseBody.status) {
        callback(null, responseBody);
      } else {
        callback(responseBody, null);
      }
    });
  }

  import { Meteor } from "meteor/meteor";
import { Packages } from "/lib/collections";

export const Paystack = {
  accountOptions: function () {
    const settings = Packages.findOne({
      name: "reaction-paymentmethod"
    }).settings;
    if (!settings.publicKey) {
      throw new Meteor.Error("403", "Invalid Credentials");
    }
    return settings.publicKey;
  },

  authorize: function (cardInfo, paymentInfo, callback) {
    Meteor.call("paystackSubmit", "authorize", cardInfo, paymentInfo, callback);
  },

  verify: (reference, secretKey, callback) => {
    const url = `https://api.paystack.co/transaction/verify/${reference}`;
    const headers = new Headers({
      "Authorization": `Bearer ${secretKey}`,
      "Content-Type": "application/json"
    });
    fetch(url, {
      headers
    })
      .then(res => res.json())
      .then(response => {
        if (response.status) {
          callback(null, response);
        } else {
          callback(response, null);
        }
      });
  }
};
};