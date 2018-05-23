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
      .saveScreenshot("./reports/snap/search-result.png")
      .click("#price option:nth-child(2)")
      .pause(500)
      .saveScreenshot("./reports/snap/filter-result.png")
      .end();
  },
  "User should be able to filter search result by vendors": browser => {
    browser
      .url(APP_BASE_PATH)
      .waitForElementVisible("body", 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/`)
      .pause(2000)
      .assert.visible("body")
      .assert.visible("span")
      .click(".search")
      .setValue(".text-edit-input.search-input", "prod")
      .pause(500)
      .saveScreenshot("./reports/snap/vendor-search-result.png")
      .click("#vendor option:nth-child(2)")
      .pause(500)
      .saveScreenshot("./reports/snap/vendor-filter-result.png")
      .end();
  }
  // "User should be able to sort search result by newest product": browser => {
  //   browser
  //     .url(APP_BASE_PATH)
  //     .waitForElementVisible("body", 5000)
  //     .assert.urlEquals(`${APP_BASE_PATH}/`)
  //     .pause(2000)
  //     .assert.visible("body")
  //     .assert.visible("span")
  //     .click(".search")
  //     .setValue(".text-edit-input.search-input", "product")
  //     .click("#price option:nth-child(2)")
  //     .end();
  // }
  // "User should be able to sort search result by product price": browser => {
  //   browser
  //     .url(APP_BASE_PATH)
  //     .waitForElementVisible("body", 5000)
  //     .assert.urlEquals(`${APP_BASE_PATH}/`)
  //     .pause(2000)
  //     .assert.visible("body")
  //     .assert.visible("span")
  //     .click(".search")
  //     .setValue(".text-edit-input.search-input", "product")
  //     .click("#price option:nth-child(2)")
  //     .end();
  // },
  // "User should be able to sort search result by product vendor": browser => {
  //   browser
  //     .url(APP_BASE_PATH)
  //     .waitForElementVisible("body", 5000)
  //     .assert.urlEquals(`${APP_BASE_PATH}/`)
  //     .pause(2000)
  //     .assert.visible("body")
  //     .assert.visible("span")
  //     .click(".search")
  //     .setValue(".text-edit-input.search-input", "product")
  //     .click("#price option:nth-child(2)")
  //     .end();
  // }
};
