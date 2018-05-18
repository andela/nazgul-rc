/* global module */
const APP_BASE_PATH = "http://localhost:3000";

module.exports = {
  "A user should be able to rate and review a product": browser => {
    browser
      .url(APP_BASE_PATH)
      .waitForElementVisible("body", 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/`)
      .pause(2000)
      .assert.visible("body")
      .assert.visible(".product-grid-item-images")
      .click(".product-grid-item-images")
      .pause(5000)
      .assert.visible(".ratings-and-reviews")
      .assert.visible(".fa.fa-star.big-star")
      .click(".accounts-dropdown")
      .pause(2000)
      .setValue("input[name=email]", "faith.adekunle@andela.com")
      .setValue("input[name=password]", "faithspassword")
      .click("button[type=submit]")
      .pause(7000)
      .assert.visible(".rating-container")
      .click(".fa.fa-star.pointer")
      .assert.visible(".fa.fa-star.pointer.hover-rating")
      .setValue("textarea", "This is a test review")
      .click("input.submit-review");
  }
};
