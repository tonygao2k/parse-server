const ParseServer = require('parse-server').ParseServer;
const config = require('./live-query.json');

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

console.log(config.liveQueryServer)
ParseServer.createLiveQueryServer(attachedServer, config.liveQueryServer);
