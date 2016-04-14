/* global angular:false */
'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('ndslabs', function() {
  var testUser = 'test';
  var testPass = '123456';

  beforeEach(function() {
    //$httpBackend = _$httpBackend_;
    browser.addMockModule('NdsLabsApi', function() {
      angular.module('NdsLabsApi', ['ngMockE2E']).run(function($httpBackend, ApiHost, ApiPort, _) {
        var projects = [];
        var services = [];
        var stacks = [];
        var volumes = [];

        $httpBackend.whenGET('http://' + ApiHost + ':' + ApiPort + '/version').respond('1.0-test');
        //$httpBackend.whenPOST('http://' + ApiHost + ':' + ApiPort + '/projects/').respond(function(data) {
        //  projects.push();
        //});


        /*$httpBackend.whenPOST('http://' + ApiHost + ':' + ApiPort + '/authenticate').respond(function(method, url, data) {
          return [401, data, {}];
        });*/
        $httpBackend.whenPOST('http://' + ApiHost + ':' + ApiPort + '/authenticate', { 'auth': { 'username': 'test', 'password': '123456' } }).respond(function(method, url, data) {
          return [200, data, {}];
        });
        $httpBackend.whenGET(/.+/).passThrough();
      });
    });
  });

  /*afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });*/

  it('should automatically redirect to /login without a valid session', function() {
    browser.get('/');
    expect(browser.getLocationAbsUrl()).toMatch("/login");
    expect(browser.getTitle()).toMatch("NDS Labs");
  });

  describe('login', function() {
    beforeEach(function() {
      browser.get('#/login');
      expect(browser.getLocationAbsUrl()).toMatch("/login");
    });

    it('should allow login when user navigates to /login', function() {
      expect(element(by.id('loginForm')).isPresent()).toBe(true);

      var namespaceInput = element(by.model('settings.namespace'));
      expect(namespaceInput.isPresent()).toBe(true);
      namespaceInput.sendKeys(testUser);

      var passwordInput = element(by.model('settings.password'));
      expect(passwordInput.isPresent()).toBe(true);
      passwordInput.sendKeys(testPass);

      var submitBtn = element(by.id('submitBtn'));
      expect(submitBtn.isPresent()).toBe(true);
      submitBtn.click();

      browser.waitForAngular();
      expect(browser.getLocationAbsUrl()).toMatch("/home");
    });
  });
});
