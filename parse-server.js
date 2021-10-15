const app = require('express')();
const ParseServer = require('parse-server').ParseServer;
const RedisCacheAdapter = require('parse-server').RedisCacheAdapter;
const ParseDashboard = require('parse-dashboard');
const config = require('./config/parse-server.json');

config.parseServer.cacheAdapter = new RedisCacheAdapter(config.parseServer.cacheAdaptorOptions);
config.dashboard.options = {"allowInsecureHTTP": !config.production};
let api = new ParseServer(config.parseServer);
let dashboard = new ParseDashboard(config.dashboard, config.dashboard.options);

app.all('*',  (req, res, next)=>{
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', true);
    next();
})

app.use('/parse', api);
app.use('/', dashboard);

let attachedServer = null, port = 0;

if (config.production) {
    const fs = require('fs');
    let options = {
        key: fs.readFileSync(config.ssl_key),
        cert: fs.readFileSync(config.ssl_cert)
    };

    attachedServer = require('https').createServer(options);
    port = config.https_port;
} else {
    attachedServer = require('http').createServer();
    port = config.http_port;
}

if (attachedServer !== null && port !== 0) {
    attachedServer.listen(port, ()=> {
        console.log('PARSE_SERVER is running on port ' + port);
    });
} else {
    console.log("NO ATTACHED SERVER");
}
