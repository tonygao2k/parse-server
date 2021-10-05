const app = require('express')();
const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');

let api = new ParseServer({
    "appId": "123456",
    "masterKey": "123456",
    "serverURL": "http://192.168.1.102:8081/parse",
    "databaseURI": "mongodb://localhost:27017/parsedb"
});

let dashboard = new ParseDashboard({
    "apps": [
        {
            "serverURL": "http://192.168.1.102:8081/parse",
            "appId": "123456",
            "masterKey": "123456",
            "appName": "TonyGao"
        }
    ],
    "users": [
        {
            "user": "admin",
            "pass": "admin"
        }
    ]
}, {"allowInsecureHTTP": true});

app.use('/parse', api);
app.use('/', dashboard);

let httpServer = require('http').createServer(app);

httpServer.listen(8081, ()=> {
    console.log('parse server is running on port ' + 8081);
});

ParseServer.createLiveQueryServer(httpServer);
