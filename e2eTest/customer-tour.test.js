/* global module */
const APP_BASE_PATH = "http://localhost:3000";

module.exports = {
  "Customer(s) should not be able to see take a tour when they click the take tour button": browser => {
    browser
      .url(APP_BASE_PATH)
      .waitForElementVisible("body", 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/`)
      .pause(2000)
      .assert.visible("body")
      .assert.visible("span")
      .pause(3000)

      // take tour button should not be visble for non-product page
      .assert.cssClassNotPresent(".rui.navbar", ".takeTour.search")
      .end();
  },
  "Customer(s) should now see take tour button on shop page": browser => {
    browser
      .url(`${APP_BASE_PATH}/tag/shop`)
      .waitForElementVisible("body", 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/tag/shop`)
      .pause(2000)
      .assert.visible("body")
      .assert.visible("span")
      .pause(1000)

      // take tour button should be visble on product page
      .assert.elementPresent(".takeTour.search")

      // customer(s) should be able to see intro tour when 'Take a Tour button is clicked' "
      .click(".takeTour.search > .rui.btn.btn-default.flat.button")
      .pause(2000)
      .assert.visible(".introjs-tooltip.introjs-floating")
      .assert.containsText(
        ".introjs-tooltip.introjs-floating > .introjs-tooltiptext > h2",
        "Welcome to Reaction Commerce"
      )

      // close browser when simulation finishes
      .end();
  }
};
