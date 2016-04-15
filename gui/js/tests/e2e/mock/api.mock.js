'use strict'

var angular = require('angular');
var MockProjects = require('./projects.mock.js');
var MockServices = require('./services.mock.js');

browser.addMockModule('NdsLabsApi', function() {
  angular.module('NdsLabsApi', [ 'ngMockE2E' ]).run(function($log, $httpBackend, _) {
    var projects = MockProjects;
    var services = MockServices;
    var stacks = [];
    var volumes = [];

    // /version
    $httpBackend.when('GET', /version/).respond('1.0-mock ' + new Date());

    // /authenticate
    $httpBackend.when('POST', /authenticate/).respond({ token: '1234567890' });

    // /refresh_token
    $httpBackend.when('GET', /refresh_token/).respond({ token: '1234567890' });

    // /services
    $httpBackend.when('GET', /services/).respond(services);

    // /projects/{project-id}
    $httpBackend.when('GET', /projects\/test/).respond(function(method, url, data, headers){
      var project = _.find(projects, [ 'namespace', 'test' ]);
      return [ project === null ? 404 : 200, , {}];
    });

    // Make sure to pass all others through (for partial view template GET requests)
    $httpBackend.when('GET', /.+/).passThrough();
  })
});