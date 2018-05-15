/* global module */
const APP_BASE_PATH = "http://localhost:3000";

module.exports = {
  "User should be able to see static page icon on dashboard": browser => {
    browser
      .url(APP_BASE_PATH)
      .waitForElementVisible("body", 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/`)
      .pause(2000)
      .assert.visible("body")
      .assert.visible("span")
      .click(".accounts-dropdown")

      // input admin user data to log in admin
      .setValue(".email-edit-input", "admin@localhost")
      .setValue(".password-edit-input", "r3@cti0n")
      .click(".rui.btn.btn-primary.solid.btn-block")
      .pause(3000)
      // check if static page dashboard icon is visible
      .assert.visible(".rui.btn.btn-default.flat.nazgul-for-all-1");
  },
  "user should see the create staic page modal on click of icon button": browser => {
    browser
      // click the static icon button to open create page modal
      .click(".rui.btn.btn-default.flat.nazgul-for-all-1")

      // open create page modal
      .assert.visible(".rmq-459cc65c.rui.admin.action-view-pane.action-view.open")
      .assert.containsText(
        ".rmq-459cc65c.rui.admin.action-view-pane.action-view.open .heading h3 span",
        "Static Pages"
      );
  },
  "user should be able to create a new page": browser => {
    browser
      .pause(2000)

      // check if page title field is visible
      .assert.visible("#sp-name")

      // check if page url field is visible
      .assert.visible("#sp-url")

      // check if page tinyMCE editor is visible
      .assert.visible("#sp-content_ifr")
      .assert.visible("#sp-show")
      .assert.visible(".form-group.save-static-page.btn.btn-default")
      .assert.containsText(".form-group.save-static-page.btn.btn-default", "Create Page")
      .setValue("#sp-name", "About Us")
      .setValue("#sp-url", "about-us")
      .click("#sp-show")
      .click(".form-group.save-static-page.btn.btn-default");

    // User should be able to navigate to newly created page  
    browser
      .url(APP_BASE_PATH + '/pages/about-us')
      .waitForElementVisible("body", 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/pages/about-us`)
      .pause(5000)
      .assert.visible('.section')

      // check if page title is visible
      .assert.visible('.static-title')

      // check if page title is correct
      .assert.containsText('.static-title', 'About Us')

      // close browser when simulation finishes
      .end();
  }
};
