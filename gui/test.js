/** 
 * Hacky workaround to register users without admin access
 * 
 * FIXME: assumes kubectl is installed, assumes local kubectl access, assumes 
 *   no one sniffing insecure internal cluster traffic, highly insecure, etc etc etc
 * 
 * Setup:
 *    1. curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
 *    2. chmod +x kubectl
 *    3. mv kubectl /usr/bin/kubectl
 * 
 */

const request = require('request');

const { spawn } = require('child_process');


// Cookies options must be EXACTLY the same to properly clear a cookie
const cookieOpts = { domain: '.local.ndslabs.org', path: '/', secure: true };

const apiProtocol = 'http:'; // HTTP, since this isn't going through the loadbalancer
const apiHost = process.env.NDSLABS_APISERVER_SERVICE_HOST || '10.0.0.88';
const apiPort = process.env.NDSLABS_APISERVER_SERVICE_PORT || '';
const apiPath = '/api';
let apiBase = apiProtocol + '//' + apiHost;
if (apiPort) { apiBase += ':' + apiPort }
if (apiPath) { apiBase += apiPath }

// Get the API password for the "admin" user with a massive one-line command
const kubectl_exec_api_passwd = spawn('sh', ['-c', 'kubectl exec \$(kubectl get pods | grep apiserver | grep -v Terminating | awk \'{print \$1}\') -- cat /password.txt ' ]);
kubectl_exec_api_passwd.stdout.on('data', (data) => {
  let adminPw = data.toString();
  console.log("API server admin password found:", adminPw);
  
  // Build a request to authenticate as admin user
  console.log('Logging in as "admin" to ' + apiBase);
  let postOptions = { 
    url: apiBase + '/authenticate', 
    method: 'POST', 
    body: JSON.stringify({ 
      username: "admin", 
      password: adminPw
    }),
    headers: {
      'Content-Type': 'application/json',
      'Host': 'www.local.ndslabs.org'
    }
  };
  
  // Send admin login request
  request(postOptions, function (error, response, responseBody) {
    let status = response && response.statusCode ? response.statusCode : 500;
    
    if (error || status >= 400) {
      console.log('ERROR:', error); // Print the error if one occurred 
      //console.log('RESPONSE:', response); // Print the error if one occurred 
      console.log('RESPONSE BODY:', responseBody); // Print the error if one occurred 
      console.log('Failed to login as admin user - returning status: ' + status);
      //res.sendStatus(status);
    } else {
      let body = JSON.parse(responseBody);
      let tokenString = body.token;
      console.log(`Logged in as "admin"... JWT=${tokenString}`);
      
      if (tokenString) {
          // Attach token to response as a cookie
          //res.cookie('token', tokenString, cookieOpts);
          //res.cookie('namespace', username, cookieOpts);
          //res.sendStatus(status);
        console.log('creating shadow account...');
        console.log('creating JWT...');
        console.log('setting cookies...');
      } else {
        console.log('returning 401');
          //res.sendStatus(401);
      }
    }
  });
});

kubectl_exec_api_passwd.stderr.on('data', (data) => {
  console.error(`'kubectl exec' failed... stderr:\n${data}`);
});

kubectl_exec_api_passwd.on('exit', function (code, signal) {
  console.log('\'kubectl exec\' exited with ' +
              `code ${code} and signal ${signal}`);
});

/*
  const { spawn } = require('child_process');

  // NOTE: Order matters here
  const awk = spawn('awk', ['\'{print \$1}\'']);
  const grep = spawn('grep', ['apiserver']);
  const kubeGetPod = spawn('kubectl', ['get', 'pods']);

  
  // FIXME: HACKS HACKS HACKS HACKS HACKS
  let podName = '';
  let adminPassword = '';
  kubeGetPod.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    podName += data;
  });
  
  kubeGetPod.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
    podName = '';
  });
  
  kubeGetPod.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    const kubeExec = spawn('kubectl', ['exec', '-it', podName, '--', 'cat', '/password.txt']);
    kubeExec.stdout.on('data', (data) => {
      adminPassword += data;
    });
    
    kubeExec.stderr.on('data', (data) => {
      adminPassword = '';
    });
    
    kubeGetPod.on('close', (code) => {
      podName = '';
    });
  });
  
  kubeGetPod.stdout.pipe(grep).stdout.pipe(awk);
*/