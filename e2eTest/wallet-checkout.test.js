/* global module */
const APP_BASE_PATH = "http://localhost:3000";

let cardNumber;
module.exports = {
  "User should be able to pay via wallet": browser => {
    browser
      .url(APP_BASE_PATH)
      .waitForElementVisible("body", 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/`)
      .pause(2000)
      .assert.visible("body")
      .assert.visible("span")
      .click(".accounts-dropdown")

      // input admin user data to log in admin
      .setValue(".email-edit-input", "amandeolaoluwa@gmail.com")
      .setValue(".password-edit-input", "password")
      .click(".rui.btn.btn-primary.solid.btn-block")
      .pause(3000)
      .assert.visible(".product-grid-item-images")
      .click(".product-grid-item-images")
      .waitForElementVisible(".row.variant-product-options .variant-select-option", 3000)
      .click(".row.variant-product-options .variant-select-option")
      .click(".input-group-addon.add-to-cart-text.js-add-to-cart")
      .waitForElementVisible(".rui.btn.btn-success.solid.btn-lg.btn-block", 3000)
      .click(".rui.btn.btn-success.solid.btn-lg.btn-block")
      .pause(2000)
      .assert.visible(".checkout-shipping.list-group")
      .click(".checkout-shipping.list-group")
      .waitForElementVisible(".core-payment-method-form:nth-of-type(2)", 15000)
      .click(".core-payment-method-form:nth-of-type(2)")
      .waitForElementVisible("#completeWalletOrder", 15000)
      .click("#completeWalletOrder")
      .waitForElementVisible(
        ".swal2-container.swal2-center.swal2-fade.swal2-shown .swal2-modal.swal2-show .swal2-buttonswrapper .swal2-confirm.swal2-styled",
        3000)
      .click(".swal2-container.swal2-center.swal2-fade.swal2-shown .swal2-modal.swal2-show .swal2-buttonswrapper .swal2-confirm.swal2-styled")
      .end();
  }
};
