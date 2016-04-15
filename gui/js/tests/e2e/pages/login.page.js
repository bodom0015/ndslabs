'use strict'

var LoginPage = function () {
  browser.get('#/login');
  expect(browser.getLocationAbsUrl()).toMatch("/login");
};

LoginPage.prototype = Object.create({}, {
  // Page Elements:
  loginForm: { get: function () { return element(by.id('loginForm')); }},
  userInput: { get: function () { return element(by.model('settings.namespace')); }},
  passInput: { get: function () { return element(by.model('settings.password')); }},
  signInBtn: { get: function () { return element(by.id('submitBtn')); }},

  // User Interactions:
  typeUsername: { value: function (keys) { return this.userInput.sendKeys(keys); }},
  typePassword: { value: function (keys) { return this.passInput.sendKeys(keys); }},
  clickSignIn: { value: function () { return this.signInBtn.click(); }}
});

module.exports = LoginPage;