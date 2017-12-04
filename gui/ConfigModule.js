/* global angular: false */

angular
.module('ndslabs-config', [ 'ndslabs-api', 'ndslabs-services', 'angular-google-analytics' ])

/**
 * If true, display verbose debug data as JSON
 */ 
.constant('DEBUG', false)

/**
 * Account number for Google Analytics tracking
 */
.constant('GaAccount', '')

/**
 * Make lodash available for injection into controllers
 */
.constant('_', window._)
/**
 * The back-up (default) administrator e-mail to use for support, 
 * in case the /api/contact endpoint is unavailable
 */
.constant('SupportEmail', 'lambert8@illinois.edu')


/**
 * The route to our "Landing Page" View
 */
.constant('LandingRoute', '/landing/')

/**
 * The route to our "Login" View
 */
.constant('LoginRoute', '/login/')

/**
 * The route to the "Contact Us" view
 */
.constant('ContactUsRoute', '/landing/contact')

/**
 * The route to our "Request Access" View
 */
.constant('SignUpRoute', '/login/register')

/**
 * The route to our "Verify Account" View
 */
.constant('VerifyAccountRoute', '/login/register/verify')

/**
 * The route to our "Recover Password" View
 */
.constant('ResetPasswordRoute', '/login/recover')

/**
 * The route to the "AppStore" view
 */
.constant('AppStoreRoute', '/dashboard/store')

/**
 * The route to the "Add Application Spec" view
 */
.constant('AddSpecRoute', '/dashboard/store/add')

/**
 * The route to the "Edit Application Spec" view
 */
.constant('EditSpecRoute', '/dashboard/store/edit/:specKey')

/**
 * The route to our "Dashboard" View
 */
.constant('HomeRoute', '/dashboard/home')

/**
 * The route to the "Add Application Service" view
 */
.constant('AddServiceRoute', '/dashboard/home/:stackId/add/:service')

/**
 * The route to the "Edit Application Service" view
 */
.constant('EditServiceRoute', '/dashboard/home/:stackId/edit/:service')

/**
 * The route to the "Application Service Console" view
 */
.constant('ConsoleRoute', '/dashboard/home/:stackId/console/:service')

/**
 * The name of the product to display in the UI and the URL to link to when clicked
 */
 
.constant('OrgName', 'NDS')
.constant('ProductName', 'Labs Workbench')
.constant('ProductUrl', 'http://www.nationaldataservice.org/projects/labs.html')

/**
 * Helpful links to include in the landing page / navbar
 */
.value('HelpLinks', [
  { name: "Feature Overview",       icon: 'fa-info-circle',        url: 'https://nationaldataservice.atlassian.net/wiki/display/NDSC/Feature+Overview' },
  { name: "F.A.Q.",                 icon: 'fa-question-circle',    url: 'https://nationaldataservice.atlassian.net/wiki/display/NDSC/Frequently+Asked+Questions'},
  { name: "User's Guide",           icon: 'fa-book',               url: 'https://nationaldataservice.atlassian.net/wiki/display/NDSC/User%27s+Guide' },
  { name: "Developer's Guide",      icon: 'fa-code-fork',          url: 'https://nationaldataservice.atlassian.net/wiki/display/NDSC/Developer%27s+Guide' },
  { name: "Acceptable Use Policy",  icon: 'fa-gavel',              url: 'https://nationaldataservice.atlassian.net/wiki/display/NDSC/Acceptable+Use+Policy' },
])

/**
 * The version/revision of this GUI
 */
.constant('BuildVersion', '1.0.13-devel')
.constant('BuildDate', '')

/**
 * Hostname / Port for communicating with etcd
 * 
 * This must be the external IP and nodePort (when running in k8)
 * 
 * TODO: We assume this is running on the same machine as the apiserver.
 */ 
.constant('ApiHost', 'www.local.ndslabs.org')
.constant('ApiPort', '')
.constant('ApiPath', '/api')
.constant('ApiSecure', true) 

.constant('WebsocketPath', '/console')

/** Store our built ApiUri here */
.value('ApiUri', { api: '', ws: '' })

/** Store the value of the "rd" querystring parameter */
.value('ReturnRoute', '')

.constant('CookieOptions', { domain: '.local.ndslabs.org', secure: true, path: '/' })

/**
 * A shared store for our AuthInfo, done as a provider so that we
 * can easily inject it into the .config() block below
 */ 
.provider('AuthInfo', function() {
  "use strict";

  this.authInfo = {
    namespace: '',
    password: '',
    saveCookie: false,
    project: null,
    token: null
  };

  this.$get = function() {
    var authInfo = this.authInfo;
    return {
      get: function() { return authInfo; },
      purge: function() {
        // We overwrite this stub function with "terminateSession" inside of the ".run()" handler below
        return true;
      }
    };
  };
})

/**
 * Logic for communicating with etcd (powered by swagger-js-codegen)
 * @param {string} ApiHost - the hostname defined above
 * @param {string} ApiPort - the port defined above
 * @param {string} ApiPath - the path defined above
 * @param {Object} ApiServer - the REST API client generated by swagger; see 'app/shared/NdsLabsRestApi.js'
 */ 
.factory('NdsLabsApi', [ 'ApiHost', 'ApiPort', 'ApiPath', 'ApiSecure', 'WebsocketPath', 'ApiUri', 'ApiServer', 
    function(ApiHost, ApiPort, ApiPath, ApiSecure, WebsocketPath, ApiUri, ApiServer) {
  "use strict";

  // TODO: Investigate options / caching
  // XXX: Caching may not be possible due to the unique token sent with every request
  
  // Start with the protocol
  if (ApiSecure) {
    ApiUri.api = 'https://' + ApiHost;
    ApiUri.ws = 'wss://' + ApiHost;
  } else {
    ApiUri.api = 'http://' + ApiHost;
    ApiUri.ws = 'ws://' + ApiHost;
  }
  
  // Add on the port suffix, if applicable
  if (ApiPort && !(ApiPort == 80 && !ApiSecure) && !(ApiPort == 443 && ApiSecure)) {
    var portSuffix = ':' + ApiPort; 
    
    ApiUri.api += portSuffix;
    ApiUri.ws += portSuffix;
  }
  
  // Add on the path suffix, if applicable
   ApiUri.api += ApiPath;
   ApiUri.ws += ApiPath + WebsocketPath;
  
  // Instantiate a new client for the ApiServer using our newly built uri
  return new ApiServer(ApiUri.api);
}])

/**
 * Configure routes / HTTP for our app using the services defined above
 */
.config([ '$provide', '$locationProvider', '$httpProvider', '$logProvider', 'GaAccount', 'AnalyticsProvider', 'DEBUG', 
    function($provide, $locationProvider, $httpProvider, $logProvider, GaAccount, AnalyticsProvider, DEBUG) {
  "use strict";
  
   // Squelch debug-level log messages
  $logProvider.debugEnabled(DEBUG); 
  
  // Enable HTML 5 mode
  $locationProvider.html5Mode(true); 
  
    // Setup default behaviors for encountering HTTP errors
  $httpProvider.interceptors.push(['$rootScope', '$cookies', '$cookieStore', '$q', '$location', '$log', '_', 'DEBUG', 'ApiUri', 'AuthInfo', 'CookieOptions',
      function (scope, $cookies, $cookieStore, $q, $location, $log, _, DEBUG, ApiUri, AuthInfo, CookieOptions) {
    return {
      // Attach our auth token to each outgoing request (to the api server)
      'request': function(config) {
        // If this is a request for our API server
        if (config && _.includes(config.url, ApiUri.api)) {
          // If this was *not* an attempt to authenticate
          if (!_.includes(config.url, '/authenticate')) {
            // We need to attach our token to this request
            config.headers.Authorization = 'Bearer ' + $cookies.get('token', CookieOptions);
          }
        }
        return config;
      },
      'requestError': function(rejection) {
        if (_.includes(rejection.config.url, ApiUri.api)) {
          $log.error("Request error encountered: " + rejection.config.url);
        }
        return $q.reject(rejection);
      },
      'response': function(response) {
        // If this is a response from our API server
        if (_.includes(response.config.url, ApiUri.api)) {
          // If this was in response to an /authenticate or /refresh_token request
          if ((_.includes(response.config.url, '/authenticate') && response.config.method === 'POST') ||
              (_.includes(response.config.url, '/refresh_token') && response.config.method === 'GET')) {
            // This response should contain a new token, so save it as a cookie
            $cookies.put('token', response.data.token, CookieOptions);
          }
        }
        
        return response;
      },
      'responseError': function(rejection) {
        // If this is a response from our API server
        if (_.includes(rejection.config.url, ApiUri.api)) {
          $log.error("Response error encountered: " + rejection.config.url);
        
          // Read out the HTTP error code
          var status = rejection.status;
          
          // Handle HTTP 401: Not Authorized - User needs to provide credentials
          if (status == 401) {
            // TODO: If we want to intercept the route to redirect them after a successful login
            //window.location = "/account/login?redirectUrl=" + Base64.encode(document.URL);
            
            // Purge current session data
            AuthInfo.authInfo.token = null;
            //$cookies.remove('token', CookieOptions);
            //$cookies.remove('namespace', CookieOptions);
            $cookieStore.remove('token', CookieOptions);
            //$cookieStore.remove('namespace', CookieOptions);
            
            $log.debug("Routing to login...");
            //window.location.href = LoginRoute;
            
            return $q.reject(rejection);
          }
        }
        
        // otherwise
        return $q.reject(rejection);
      }
    };
  }]);
  
  // Set up log decorator (log forwarding)
  $provide.decorator('$log', ['$delegate', 'Logging', function($delegate, Logging) {
    Logging.enabled = true;
    var methods = {
      debug: function() {
        if (Logging.enabled) {
          // Only logging debug messages to the console
          $delegate.debug.apply($delegate, arguments);
          //Logging.debug.apply(null, arguments);
        }
      },
      error: function() {
        if (Logging.enabled) {
          $delegate.error.apply($delegate, arguments);
          Logging.error.apply(null, arguments);
        }
      },
      log: function() {
        if (Logging.enabled) {
          $delegate.log.apply($delegate, arguments);
          Logging.log.apply(null, arguments);
        }
      },
      info: function() {
        if (Logging.enabled) {
          $delegate.info.apply($delegate, arguments);
          Logging.info.apply(null, arguments);
        }
      },
      warn: function() {
        if (Logging.enabled) {
          $delegate.warn.apply($delegate, arguments);
          Logging.warn.apply(null, arguments);
        }
      }
    };
    return methods;
  }]);
  
  // Set up Google Analytics
  AnalyticsProvider.setAccount(GaAccount)
                   .useECommerce(false, false)
                   .trackPages(true)
                   .trackUrlParams(true)
  //                 .ignoreFirstPageLoad(true)
                   .readFromRoute(true)
  //                 .setDomainName(ApiUri.api)
  //                 .setHybridMobileSupport(true)
                   .useDisplayFeatures(true)
                   .useEnhancedLinkAttribution(true);
}]).run(['$cookies', '$cookieStore', '$location', '$log', 'AuthInfo', 'Project', 'AutoRefresh', 'ServerData', 'CookieOptions',
    function($cookies, $cookieStore, $location, $log, AuthInfo, Project, AutoRefresh, ServerData, CookieOptions) {
  
  // Grab saved auth data from cookies and attempt to use the leftover session
  var token = $cookies.get('token', CookieOptions);
  var namespace = $cookies.get('namespace', CookieOptions);
  
  var path = $location.path();
  if (token && namespace) {
    console.log(`Found token for namespace ${namespace}:`, token);
    // Pull our token / namespace from cookies
    AuthInfo.get().token = token;
    AuthInfo.get().namespace = namespace;
  } else {
    $log.debug("No token detected");
    return;
  }
  
  var terminateSession = AuthInfo.purge = function() {
    if (AuthInfo.get().token) {
      // Purge current session data
      AuthInfo.get().token = null;
      $cookieStore.remove('token', CookieOptions);
      //$cookieStore.remove('namespace', CookieOptions);
      
      // Close any open modals
      //$uibModalStack.dismissAll();
      
      // Stop any running auto-refresh interval
      AutoRefresh.stop();
      
      // Purge any server data
      ServerData.purgeAll();
      
      $log.debug("Terminating session... routing to Landing");
      
      /*if ($routeParams.t) {
        // Remove any token from query string
        $location.search('t', null);
      }*/
      
      // redirect user to landing page
      //$location.path();
      //window.location.href = LoginRoute;
    }
  };
}]);