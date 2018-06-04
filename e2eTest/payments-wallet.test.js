/* global module */
const APP_BASE_PATH = "http://localhost:3000";

let cardNumber;
module.exports = {
  "User should be able to see wallet dashboard": browser => {
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
      .assert.visible(".accounts")
      .click(".accounts")
      .assert.visible(".rui.menu-item.accounts-a-tag")
      .pause(2000)
      .assert.visible(".accounts-li-tag a .rui.font-icon.fa.fa-google-wallet")
      .click(".accounts-li-tag a .rui.font-icon.fa.fa-google-wallet")
      .assert.visible(".payment-header")
      .setValue("#addAmount", 30)
      .click("#submitFund")
      .waitForElementVisible("iframe", 15000)
      .frame(0)
      .waitForElementVisible(".paystack-test-card .row .col-xs-12 .card-info", 15000)
      .getAttribute(".paystack-test-card .row .col-xs-12 .card-info", "data-clipboard-text", (result) => {
        cardNumber = result.value;
      })
      .end();
  }
};
