const compression = require('compression');
const app = require('express')();
const fs = require('fs');
const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');
const config = require('./config.json');

app.use(compression());
app.all('*',  (req, res, next)=>{
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', true);
    next();
})

let RedisCacheAdapter = require('parse-server').RedisCacheAdapter;
config.parseServer.cacheAdapter = new RedisCacheAdapter(config.cacheAdapter);
let parseServer = new ParseServer(config.parseServer);
let dashboard = new ParseDashboard(config.dashboard.conf, config.dashboard.options);

app.use('/parse', parseServer);
app.use('/', dashboard);

let attachedServer;
if (config.production) {
    let options = {
        key: fs.readFileSync('./cert/XXX.key'),
        cert: fs.readFileSync('./cert/XXX.crt')
    };

    attachedServer = require('https').createServer(options, app);
    attachedServer.listen(config.https_port, () => {
        console.log('HTTPS is running on port', config.https_port);
    });
} else {
    attachedServer = require('http').createServer(app);
    attachedServer.listen(config.http_port, ()=> {
        console.log('HTTP is running on port ' + config.http_port);
    });
}

ParseServer.createLiveQueryServer(attachedServer, config.liveQueryServer);