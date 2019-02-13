const http = require('http');
const api = require('./api');
const web = require('./web');

const apiPort = 5000;
const webPort = process.env.port || 8080;

const apiServer = http.createServer(api);
const webServer = http.createServer(web);

apiServer.listen(apiPort);
webServer.listen(webPort);

setTimeout(() => {
    console.log('hello server');
    
}, 7000);