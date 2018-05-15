/* global module, require */
require("babel-register");
module.exports = (settings => {
  settings.test_workers = false;
  return settings;
})(require("./nightwatch.json"));
