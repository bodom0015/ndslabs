'use strict';

describe('ndslabs module', function() {

	var testUser = 'test';
	var testPassword = '123456';

  beforeEach(module('ndslabs'),  inject(function(_$value_) {
	$value = _$value_;
  }));

  //beforeEach(angular.mock.http.init);
  //afterEach(angular.mock.http.reset);

  describe('Api', function () {
    it('should define ApiHost', inject(function ($controller) {
    	expect($value('ApiHost')).toBeDefined();
    }));
    it('should define ApiPort', inject(function ($controller) {
    	expect($value('ApiPort')).toBe(30001);
    }));
  });

  describe('LoginController', function () {
	beforeEach(inject(function(_$controller_, _$httpBackend_) {
	  $controller = _$controller_;
	  $scope = {};
	  $httpBackend = _$httpBackend_;

	  ApiHost = $value('ApiHost');
	  ApiPort = $value('ApiPort');

      // Note that this HTTP backend is ngMockE2E's, and will make a real HTTP request
	  $httpBackend.whenGET('http://' + ApiHost + ':' + ApiPort + '/authenticate').respond(function() {
	  	return $scope.settings.namespace === testUser && $scope.settings.password === testPassword;
	  });
	}));

    it('should allow valid login', inject(function ($controller) {
      $controller('LoginController', { $scope: $scope }); 

      $scope.settings.namespace = testUser;
      $scope.settings.password = testPassword;

      $scope.login();
      expect($scope.progressMessage).toBe('Please wait...');
    }));
  });
});