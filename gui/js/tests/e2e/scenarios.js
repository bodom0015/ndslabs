/* global angular:false */
'use strict';

var LoginPage = require('./pages/login.page.js');
var MockApiModule;

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('ndslabs', function() {
  var testUser = 'test';
  var testPass = '123456';

  beforeEach(function() {
    MockApiModule = require('./mock/api.mock.js');
  });

  it('should automatically redirect to /login without a valid session', function() {
    browser.get('/');
    expect(browser.getLocationAbsUrl()).toMatch("/login");
    expect(browser.getTitle()).toMatch("NDS Labs");
  });

  describe('login view', function() {
    var loginPage;

    beforeEach(function() {
      // Initialize PageObject
      loginPage = new LoginPage();
    });

    it('should allow login when user navigates to /login', function() {
      loginPage.typeUsername(testUser);
      loginPage.typePassword(testPass);
      loginPage.clickSignIn().then(function() { expect(browser.getLocationAbsUrl()).toMatch("/home"); });
    });
  });
});
