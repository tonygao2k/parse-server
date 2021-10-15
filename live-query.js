const ParseServer = require('parse-server').ParseServer;
const config = require('./config/live-query.json');

let attachedServer, port;

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

attachedServer.listen(port, ()=> {
    console.log('LIVE_QUERY_SERVER is running on port ' + port);
});

/*
  Workaround:
  -- To enable log control, Must have an instance of parse-server with correct logLevel setting
  -- It is difference from the official document but works ...
*/
new ParseServer({
    appId: "NOT_ALLOWED_TO_ACCESS",
    masterKey: "NOT_ALLOWED_TO_ACCESS",
    databaseURI: require('./config/parse-server.json').parseServer.databaseURI,
    logLevel: require('./config/parse-server.json').parseServer.logLevel
});

ParseServer.createLiveQueryServer(attachedServer, config.liveQueryServer);