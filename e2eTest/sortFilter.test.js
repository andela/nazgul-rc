/* global module */
const APP_BASE_PATH = "http://localhost:3000";

module.exports = {
  "beforeEach": function (browser, done) {
    browser.resizeWindow(1280, 1000, done);
  },
  "User should be able to filter search result by price": browser => {
    browser
      .url(APP_BASE_PATH)
      .waitForElementVisible("body", 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/`)
      .pause(2000)
      .assert.visible("body")
      .assert.visible("span")
      .click(".search")
      .setValue(".text-edit-input.search-input", "product")
      .pause(500)
      .assert.containsText(".search-modal .container-main li.product-grid-item .overlay-title", "ANOTHER PRODUCT")
      .assert.containsText(".search-modal .container-main li.product-grid-item:nth-child(2) .overlay-title", "BASIC REACTION PRODUCT")
      .click("#price option:nth-child(2)")
      .assert.containsText(".search-modal .container-main li.product-grid-item:nth-child(1) .overlay-title", "BASIC REACTION PRODUCT")
      .expect.element(".search-modal .container-main li.product-grid-item:nth-child(2)").to.not.be.present;
  },
  "User should be able to filter search result by vendors": browser => {
    browser
      .click("#price option:nth-child(1)")
      .click("#vendor option:nth-child(2)")
      .pause(500)
      .assert.containsText(".search-modal .container-main li.product-grid-item:nth-child(1) .overlay-title", "ANOTHER PRODUCT")
      .end();
  },
  "User should be able to sort search result by product price in ascending and decending orders": browser => {
    browser
      .url(APP_BASE_PATH)
      .waitForElementVisible("body", 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/`)
      .pause(2000)
      .assert.visible("body")
      .assert.visible("span")
      .click(".search")
      .setValue(".text-edit-input.search-input", "product")
      .click("#sort-type option:nth-child(2)")
      .assert.containsText(".search-modal .container-main li.product-grid-item:nth-child(1) .overlay-title", "ANOTHER PRODUCT")
      .assert.containsText(".search-modal .container-main li.product-grid-item:nth-child(2) .overlay-title", "BASIC REACTION PRODUCT")
      .click("#sort-order option:nth-child(1)")
      .assert.containsText(".search-modal .container-main li.product-grid-item:nth-child(1) .overlay-title", "BASIC REACTION PRODUCT")
      .assert.containsText(".search-modal .container-main li.product-grid-item:nth-child(2) .overlay-title", "ANOTHER PRODUCT")
      .end();
  },
  "User should be able to sort search result by newest product": browser => {
    browser
      .url(APP_BASE_PATH)
      .waitForElementVisible("body", 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/`)
      .pause(2000)
      .assert.visible("body")
      .assert.visible("span")
      .click(".search")
      .setValue(".text-edit-input.search-input", "product")
      .click("#sort-type option:nth-child(1)")
      .assert.containsText(".search-modal .container-main li.product-grid-item:nth-child(1) .overlay-title", "ANOTHER PRODUCT")
      .assert.containsText(".search-modal .container-main li.product-grid-item:nth-child(2) .overlay-title", "BASIC REACTION PRODUCT")
      .click("#sort-order option:nth-child(1)")
      .assert.containsText(".search-modal .container-main li.product-grid-item:nth-child(1) .overlay-title", "BASIC REACTION PRODUCT")
      .assert.containsText(".search-modal .container-main li.product-grid-item:nth-child(2) .overlay-title", "ANOTHER PRODUCT")
      .end();
  },
  "User should be able to sort search result by product vendor": browser => {
    browser
      .url(APP_BASE_PATH)
      .waitForElementVisible("body", 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/`)
      .pause(2000)
      .assert.visible("body")
      .assert.visible("span")
      .click(".search")
      .setValue(".text-edit-input.search-input", "product")
      .click("#sort-type option:nth-child(3)")
      .assert.containsText(".search-modal .container-main li.product-grid-item:nth-child(1) .overlay-title", "ANOTHER PRODUCT")
      .assert.containsText(".search-modal .container-main li.product-grid-item:nth-child(2) .overlay-title", "BASIC REACTION PRODUCT")
      .click("#sort-order option:nth-child(1)")
      .assert.containsText(".search-modal .container-main li.product-grid-item:nth-child(1) .overlay-title", "BASIC REACTION PRODUCT")
      .assert.containsText(".search-modal .container-main li.product-grid-item:nth-child(2) .overlay-title", "ANOTHER PRODUCT");
  }
};
