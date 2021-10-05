const ParseServer = require('parse-server').ParseServer;
const config = require('./live-query.json');

/*
    Workaround:
    -- To enable log control for live-query, Must have an instance of parse-server with correct logLevel setting
    -- This is difference from the official document but works ...
*/
new ParseServer({
    "appId": config.liveQueryServer.appId,
    "masterKey": config.liveQueryServer.masterKey,
    "logLevel": config.liveQueryServer.logLevel
});

let attachedServer = require('http').createServer();
let port = config.http_port;

if (config.production) {
    const fs = require('fs');
    let options = {
        key: fs.readFileSync(config.ssl_key),
        cert: fs.readFileSync(config.ssl_cert)
    };

    attachedServer = require('https').createServer(options);
    port = config.https_port;
}

attachedServer.listen(port, ()=> {
    console.log('LIVE_QUERY_SERVER is running on port ' + port);
});

ParseServer.createLiveQueryServer(attachedServer, config.liveQueryServer);
