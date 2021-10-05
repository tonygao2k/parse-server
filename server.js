const app = require('express')();
const fs = require('fs');
const ParseServer = require('parse-server').ParseServer;
const config = require('./config.json');

/**** Start: Parse Server ****/
const compression = require('compression');
const ParseDashboard = require('parse-dashboard');

let RedisCacheAdapter = require('parse-server').RedisCacheAdapter;
config.parseServer.cacheAdapter = new RedisCacheAdapter(config.parseServer.cacheAdaptorOptions);
let parseServer = new ParseServer(config.parseServer);
let dashboard = new ParseDashboard(config.dashboard.conf, config.dashboard.options);

app.all('*',  (req, res, next)=>{
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', true);
    next();
})

app.use(compression());
app.use('/parse', parseServer);
app.use('/', dashboard);

if (config.production) {
    let options = {
        key: fs.readFileSync(config.ssl_key),
        cert: fs.readFileSync(config.ssl_crt)
    };

    require('https').createServer(options, app).listen(config.https_port, () => {
        console.log('PARSE (HTTPS) is running on port', config.https_port);
    });


} else {
    require('http').createServer(app).listen(config.http_port, ()=> {
        console.log('PARSE (HTTP) is running on port ' + config.http_port);
    });
}
/****! END: Parse Server !****/

// Live Query will be separate to other servers
/**** START: Live Query Server ****/
let attachedServer = ";"
if (config.production) {
    let options = {
        key: fs.readFileSync(config.ssl_key),
        cert: fs.readFileSync(config.ssl_crt)
    };

    let httpsServer = require('https').createServer(options, app);
    attachedServer = httpsServer;
    httpsServer.listen(config.liveQueryServer.https_port, () => {
        console.log('LIVE_QUERY (HTTPS) is running on port', config.liveQueryServer.https_port);
    });
} else {
    let httpServer = require('http').createServer(app);
    attachedServer = httpServer;
    httpServer.listen(config.liveQueryServer.http_port, ()=> {
        console.log('LIVE_QUERY (HTTP) is running on port ' + config.liveQueryServer.http_port);
    });
}

ParseServer.createLiveQueryServer(attachedServer, config.liveQueryServer);
/****! END: Live Query Server !****/