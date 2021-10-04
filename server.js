const app = require('express')();
const fs = require('fs');
const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');
const config = require('./config.json');

app.all('*',  (req, res, next)=>{
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', true);
    next();
})

let RedisCacheAdapter = require('parse-server').RedisCacheAdapter;
config.parse.api.cacheAdapter = new RedisCacheAdapter(config.parse.redis);
let api = new ParseServer(config.parse.api);
let dashboard = new ParseDashboard(config.parse.dashboard, config.parse.dashboard.options);

app.use('/parse', api);
app.use('/', dashboard);

let attachedServer;

if (config.production) {
    let options = {
        key: fs.readFileSync('./cert/XXX.key'),
        cert: fs.readFileSync('./cert/XXX.crt')
    };

    let httpsServer = require('https').createServer(options, app);
    attachedServer = httpsServer;

    httpsServer.listen(config.https_port, () => {
        console.log('HTTPS is running on port', config.https_port);
    });
} else {
    let httpServer = require('http').createServer(app);
    attachedServer = httpServer;

    httpServer.listen(config.http_port, ()=> {
        console.log('HTTP is running on port ' + config.http_port);
    });
}

ParseServer.createLiveQueryServer(attachedServer);