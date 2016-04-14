exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    'scenarios.js'
  ],

  multiCapabilities: [
  /*{
    'browserName': 'phantomjs'
  },
  {
    'browserName': 'safari'
  },
   {
    'browserName': 'chrome'
  },*/
  {
    'browserName': 'firefox'
  }], 

  rootElement: 'body',

  baseUrl: 'http://localhost:8000',

  framework: 'jasmine2',

  jasmineNodeOpts: {
    isVerbose: true,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 30000
  }
};
