// Import utilities
const path = require('path');
const http = require('http');
const request = require('request');

// Import express and middleware modules
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Cookies options must be EXACTLY the same to properly clear a cookie
const secureCookie = process.env.API_SECURE || true;
const cookieDomain = '.' + (process.env.DOMAIN || 'local.ndslabs.org');
const cookieOpts = { domain: cookieDomain, path: '/', secure: secureCookie };

// Declare a new express app
const app = express();

const basedir = process.env.BASEDIR;
const port = 3000;

// Build up a Workbench API URL
const apiProtocol = 'http:'; // HTTP, since this isn't going through the loadbalancer
const apiHost = process.env.NDSLABS_APISERVER_SERVICE_HOST || 'localhost';
const apiPort = process.env.NDSLABS_APISERVER_SERVICE_PORT || '';
const apiPath = '/api';
let apiBase = apiProtocol + '//' + apiHost;
if (apiPort) { apiBase += ':' + apiPort }
if (apiPath) { apiBase += apiPath }

// Configure gzip compression
app.use(compression());

// Configure HTTP parser middleware (only log HTTP errors)
app.use(morgan('combined', {
  skip: function (req, res) { return res.statusCode < 400 }
}));

// Configure bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// AngularJS app dependencies
app.use('/bower_components', express.static('bower_components'));

// Our AngularJS apps/assets
app.use('/dist', express.static('dist'));
app.use('/login', express.static('login'));
app.use('/shared', express.static('shared'));
app.use('/asset', express.static('asset'));
app.use('/ConfigModule.js', express.static('ConfigModule.js'));

// Use optimized versions of the images (drop-in)
app.use('/asset/png', express.static('dist/png'));
app.use('/asset/png/logos', express.static('dist/png/logos'));

// TODO: Restrict CORS
app.use(cors());

// Parse cookies into helpful structures for manipulation
app.use(cookieParser());

// Parse request body
app.use(bodyParser.json());

/** DefaultBackend endpoints here */

// Configure a route to redirect to our login app
app.get('/', function(req, res){
  res.redirect('/login/');
});

// Configure a route to check pod healthz
app.get('/healthz', function(req, res){
  res.sendStatus(200);
});

let logger = {
  log: function(level, message, timestamp) {
    console.log(`${timestamp || new Date()} - ${level.toUpperCase()} - ${message}`);
  }
} 


/** CAuth endpoints/paths here */

// Simple auth endpoint
app.post('/cauth/login', bodyParser.urlencoded({ extended: false }), function (req, res) {
  
  // Pull username/password from POST body
  let username = req.body.username;
  logger.log("info", `Logging in: ${username}`);
  let postData = { 
      username: username, 
      password: req.body.password 
  };
  
  // Configure our POST target
  let postOptions = { 
    url: apiBase + '/authenticate', 
    method: 'POST', 
    body: JSON.stringify(postData),
    headers: {
      'Content-Type': 'application/json'
    }
  };
   
  // Generic error handler for this request
  req.on('error', function (err) {
    console.log('ERROR: Failed to send login request -', err);
  });
  
  // Send login request
  request(postOptions, function (error, response, responseBody) {
    console.log("ERROR: ", error);
    console.log("RESPONSE: ", response);
    console.log("RESPONSE BODY: ", responseBody);

    let status = response && response.statusCode ? response.statusCode : 500;
    
    if (error || status >= 400) {
      console.log('ERROR: Failed to login -', status, error); // Print the error if one occurred 
      res.sendStatus(status);
    } else {
      let body = JSON.parse(responseBody);
      let tokenString = body.token;
      logger.log('info', `Logged in as ${username}: ${tokenString}`);
      
      if (tokenString) {
          // Attach token to response as a cookie
          res.cookie('token', tokenString, cookieOpts);
          res.cookie('namespace', username, cookieOpts);
          res.sendStatus(status);
      } else {
          res.sendStatus(401);
      }
    }
  });
});

// Serve our static login page
app.get('/cauth/sign_in', function (req, res) {
  //logger.log('info', "", "User was redirected to /cauth/sign_in.");
  console.log("User redirected to sign-in.");
  res.sendFile(path.join(__dirname + '/login/'));
});

// Check to see if the current user is logged in
// NOTE: Current JWT secret is hostname (pod name) of apiserver
// TODO: Will we need a mechanism to share JWT secret? ConfigMap?
app.get('/cauth/auth', function(req, res) {
  // No token? Denied.
  let token = req.cookies['token'];
  //logger.log('info', "", "Checking user session: " + token);
  logger.log("info", "Checking user session: " + token);
  
  let requestedUrl = req.headers['x-original-url'];
  let prefix = secureCookie ? 'https://www' : 'http://www';
  let checkHost = '';
  
  if (!token) {
      res.sendStatus(401);
      return;
  } else if (requestedUrl.indexOf(prefix+cookieDomain) !== 0) {
     // if request starts with an arbitrary host (e.g. not 'www.'), 
     //    we need to check authorization
    checkHost = requestedUrl.replace(/https?:\/\//, '').replace(/\/.*$/, '');
    console.log(`Checking token's access to ${checkHost}`);
  }

  // If token was given, check that it's valid
  http.get({ 
      protocol: apiProtocol,
      host: apiHost,
      port: apiPort,
      path: apiPath + '/check_token' + (checkHost ? '?host=' + checkHost : ''), 
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
      }
  }, 
  (resp) => {
    const { statusCode } = resp;

    let error;
    if (statusCode >= 400) {
      error = new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`);
    }
    if (error) {
      console.error(error.message);
      // consume response data to free up memory
      resp.resume();
      res.sendStatus(statusCode);
      return;
    }

    resp.setEncoding('utf8');
    let rawData = '';
    resp.on('data', (chunk) => { rawData += chunk; });
    resp.on('end', () => {
      try {
        console.log(rawData);
        res.sendStatus(200);
      } catch (e) {
        console.error(e.message);
        res.sendStatus(statusCode);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
    res.sendStatus(401);
  });
});

// Clear session info
app.get('/cauth/logout', function (req, res) {
  // TODO: Delete session somehow?

  res.clearCookie("token", cookieOpts);
  res.clearCookie("namespace", cookieOpts);
  res.sendStatus(200);
});

// NOTE: Wildcards need to be done last, after all other endpoints

/** Set up routes to our AngularJS apps here */
app.get('/login/*', function(req, res) { res.sendFile('login/index.html', { root: basedir || __dirname }); });

// Start up our server
app.listen(port, function () {
  console.log('Workbench Login API listening on port', port);
  console.log('Connecting to Workbench API server at ' + apiBase);
});
