const ParseServer = require('parse-server').ParseServer;
const config = require('./config/live-query.json');

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
        console.log('LIVE_QUERY_SERVER is running on port ' + port);
    });

    new ParseServer({
        appId: "NOT_ALLOWED_TO_ACCESS",
        masterKey: "NOT_ALLOWED_TO_ACCESS",
        databaseURI: require('./config/parse-server.json').parseServer.databaseURI,
        logLevel: require('./config/parse-server.json').parseServer.logLevel
    });

    ParseServer.createLiveQueryServer(attachedServer, config.liveQueryServer);
} else {
    console.log("NO ATTACHED SERVER");
}