module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      '../../bower_components/lodash/dist/lodash.js',
      '../../bower_components/angular/angular.js',
      '../../bower_components/angular-mocks/angular-mocks.js',
      '../../bower_components/angular-route/angular-route.js',
      '../../bower_components/angular-resource/angular-resource.js',
      '../../bower_components/angular-cookies/angular-cookies.js',
      '../../bower_components/angular-messages/angular-messages.js',
      '../../bower_components/angular-animate/angular-animate.js',
      '../../bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
      '../../bower_components/angular-gage/dist/angular-gage.min.js',
      '../../bower_components/angular-bootstrap-pwgen/angular-bootstrap-pwgen.js',
      '../../bower_components/angular-alert/angular-alert.js',
      '../../bower_components/angular-wizard/angular-wizard.js',
      '../../bower_components/angular-grid/angular-grid.js',
      '../../app/shared/**/*.js',
      '../../app/app.js',
      '../../app/expert/**/*.js',
      '../../app/login/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
