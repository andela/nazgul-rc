/* global module */
const APP_BASE_PATH = "http://localhost:3000";

module.exports = {
  "User should be able to take tour anytime": browser => {
    browser
      .url(APP_BASE_PATH)
      .waitForElementVisible("body", 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/`)
      .pause(2000)
      .assert.visible("body")
      .assert.visible("span")
      .assert.visible(".accounts-dropdown")
      .click(".accounts-dropdown")
      .setValue(".email-edit-input", "admin@localhost")
      .setValue(".password-edit-input", "r3@cti0n")
      .click(".rui.btn.btn-primary.solid.btn-block")
      .pause(3000)
      .click(".take-tour")
      .assert.containsText(".introjs-tooltiptext > h3", "Welcome to Reaction Commerce")

      // close browser when simulation finishes
      .end();
    // .waitForElementVisible(".container-medium.index > h5", 1000);
  }
};
