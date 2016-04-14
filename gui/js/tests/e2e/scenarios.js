/* global angular:false */
'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('ndslabs', function() {
  var $httpBackend;
  var ApiHost, ApiPort;

  beforeEach(function() {
    //$httpBackend = _$httpBackend_;
    browser.addMockModule('NdsLabsApi', function() {
      angular.module('NdsLabsApi', ['ngMockE2E'])
      .run(function($httpBackend, ApiHost, ApiPort, _) {
        var projects = [];
        var services = [];
        var stacks = [];
        var volumes = [];

        $httpBackend.whenGET('http://' + ApiHost + ':' + ApiPort + '/version').respond('1.0-test');
        //$httpBackend.whenPOST('http://' + ApiHost + ':' + ApiPort + '/projects/.*').respond(_.find(projects, [ 'namespace', ]));
        //$httpBackend.whenPOST('http://' + ApiHost + ':' + ApiPort + '/authenticate').respond(200);
        $httpBackend.whenGET(/.+/).passThrough();
      })
    });
  });

  /*afterEach(function() {
    mock.verifyNoOutstandingExpectation();
    mock.verifyNoOutstandingRequest();
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

    it('should render login form when user navigates to /login', function() {
      expect(element(by.id('loginForm')).isPresent()).toBe(true);
    });
  });
});
