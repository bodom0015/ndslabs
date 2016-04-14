'use strict';

describe('ndslabs module', function() {
	var testUser = 'test', testPassword = '123456';
  var ApiHost, ApiPort;

  beforeEach(module('ndslabs'), inject(function($injector) {
    ApiHost = $injector.get('ApiHost');
    ApiPort = $injector.get('ApiPort');
  }));

  afterEach(function() {
    //$httpBackend.verifyNoOutstandingExpectation();
    //$httpBackend.verifyNoOutstandingRequest();
  });

  //beforeEach(angular.mock.http.init);
  //afterEach(angular.mock.http.reset);

  describe('Test Harness', function () {
    it('should define Username', inject(function () {
      expect(testUser).toBe('test');
    }));
    it('should define Password', inject(function () {
      expect(testPassword).toBe('123456');
    }));
    it('should define ApiHost', inject(function (ApiHost) {
    	expect(ApiHost).toBe('192.168.99.100');
    }));
    it('should define ApiPort', inject(function (ApiPort) {
    	expect(ApiPort).toBe('30001');
    }));
  });

  describe('LoginController', function () {
    var $controller, $httpBackend, scope;
    var authRequestHandler, createController;

    var server;

    beforeEach(inject(function($injector) {
      $controller = $injector.get('$controller');
      $httpBackend = $injector.get('$httpBackend');
      scope = $injector.get('$rootScope');

      $controller('LoginController', {'$scope' : scope });
    }));

    it('should not allow login on invalid user', inject(function ($controller, $httpBackend, ApiHost, ApiPort) {
      // Populate scope with a mock LoginController
      expect(scope).toBeDefined();
      $controller('LoginController', { $scope: scope }); 

      scope.settings.namespace = testUser + 'x';
      scope.settings.password = testPassword;

      $httpBackend.expect('POST', 'http://' + ApiHost + ':' + ApiPort + '/authenticate').respond(401, '');

      scope.login();
      expect(scope.progressMessage).toBe('Please wait...');


      $httpBackend.expect('GET', '/app/login/login.html').respond(200);
      $httpBackend.flush();
      expect(scope.errorMessage).toBe('Invalid username or password');
      expect(scope.progressMessage).toBe('');
    }));

    it('should not allow login on invalid password', inject(function ($controller, $httpBackend, ApiHost, ApiPort) {
      // Populate scope with a mock LoginController
      expect(scope).toBeDefined();
      $controller('LoginController', { $scope: scope }); 

      scope.settings.namespace = testUser
      scope.settings.password = testPassword + 'x';

      $httpBackend.expect('POST','http://' + ApiHost + ':' + ApiPort + '/authenticate').respond(401, '');

      scope.login();
      expect(scope.progressMessage).toBe('Please wait...');

      // TODO: Why does this happen??
      $httpBackend.expect('GET', '/app/login/login.html').respond(200);
      $httpBackend.flush();

      expect(scope.errorMessage).toBe('Invalid username or password');
      expect(scope.progressMessage).toBe('');
    }));

    it('should allow login for valid credentials', inject(function ($controller, $httpBackend, ApiHost, ApiPort) {
      // Populate scope with a mock LoginController
      expect(scope).toBeDefined();
      $controller('LoginController', { $scope: scope }); 

      scope.settings.namespace = testUser;
      scope.settings.password = testPassword;

      $httpBackend.expect('POST', 'http://' + ApiHost + ':' + ApiPort + '/authenticate').respond(200, '');

      scope.login();
      expect(scope.progressMessage).toBe('Please wait...');

      $httpBackend.expect('GET', '/app/login/login.html').respond(200);
      $httpBackend.flush();

      expect(scope.errorMessage).toBe('');
      expect(scope.progressMessage).toBe('');
    }));
  });
});