'use strict';

describe('ndslabs module', function() {

  beforeEach(angular.mock.module('ndslabs'));

  describe('LoginController', function () {
    it('should allow valid login', angular.mock.inject(function ($controller) {
      var $scope = {};
      // this is the line that caused me pain
      $controller('LoginController', { $scope: $scope }); 

      $scope.settings.namespace = 'fake';
      $scope.settings.password = 'password';

      $scope.login();
      expect($scope.progressMessage).toBe('Please wait...');
    }));
  });
});