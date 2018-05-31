/* global module */
const APP_BASE_PATH = "http://localhost:3000";

module.exports = {
  "Unsigned user should not be able to rate shop": browser => {
    browser
      .url(APP_BASE_PATH)
      .waitForElementVisible("body", 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/`)
      .pause(2000)
      .assert.visible("body")
      .assert.visible("#openReviewsModal")
      .assert.hidden("#reviewsModal")
      .click("#openReviewsModal")
      .pause(2000)
      .assert.elementNotPresent("div.text-center.rate-shop")
      .assert.visible("div.average-rating.text-center.shop")
      .end();
  },
  "Admin should not be able to rate shop": browser => {
    browser
      .url(APP_BASE_PATH)
      .waitForElementVisible("body", 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/`)
      .pause(2000)
      .assert.visible("body")
      .assert.visible("#openReviewsModal")
      .click(".accounts-dropdown")
      .pause(2000)
      .setValue("input[name=email]", "admin@localhost")
      .setValue("input[name=password]", "r3@cti0n")
      .click("button[type=submit]")
      .pause(7000)
      .click("#openReviewsModal")
      .pause(2000)
      .assert.elementNotPresent("div.text-center.rate-shop")
      .assert.visible("div.average-rating.text-center.shop")
      .end();
  },
  "User who has not made a purchase should not be able to rate shop": browser => {
    browser
      .url(APP_BASE_PATH)
      .waitForElementVisible("body", 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/`)
      .pause(2000)
      .assert.visible("body")
      .assert.visible("#openReviewsModal")
      .click(".accounts-dropdown")
      .pause(2000)
      .setValue("input[name=email]", "user@gmail.com")
      .setValue("input[name=password]", "userpassword")
      .click("button[type=submit]")
      .pause(7000)
      .click("#openReviewsModal")
      .pause(2000)
      .assert.elementNotPresent("div.text-center.rate-shop")
      .assert.visible("div.average-rating.text-center.shop")
      .end();
  },
  "User who has made a purchase should be able to rate shop": browser => {
    browser
      .url(APP_BASE_PATH)
      .waitForElementVisible("body", 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/`)
      .pause(2000)
      .assert.visible("body")
      .assert.visible("#openReviewsModal")
      .click(".accounts-dropdown")
      .pause(2000)
      .setValue("input[name=email]", "faith.adekunle@andela.com")
      .setValue("input[name=password]", "faithspassword")
      .click("button[type=submit]")
      .pause(7000)
      .click("#openReviewsModal")
      .pause(2000)
      .assert.visible("div.text-center.rate-shop")
      .assert.visible("div.average-rating.text-center.shop")
      .click(".fa.fa-star.pointer.shop")
      .setValue("textarea.shop", "This is a another test review")
      .pause(1000)
      .submitForm("form.shopForm")
      .pause(5000)
      .assert.containsText(".r-and-r.shop", "This is a another test review")
      .pause(2000)
      .end();
  }
};
