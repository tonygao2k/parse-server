const app = require('express')();
const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');

let mongodbURL = 'mongodb://127.0.0.1:27017/parsedb';
let serverURL = 'http://127.0.0.1:8081/parse';

let api = new ParseServer({
    appId: '123456',
    masterKey: '123456',
    serverURL: serverURL,
    databaseURI: mongodbURL
});

let dashboard = new ParseDashboard({
    apps: [
        {
            serverURL: serverURL,
            appId: '123456',
            masterKey: '123456',
            appName: 'TonyGao'
        }
    ],
    users: [
        {
            user: 'admin',
            pass: 'admin'
        }
    ]
}, {allowInsecureHTTP: true});

app.use('/parse', api);
app.use('/', dashboard);

let httpServer = require('http').createServer(app);

httpServer.listen(8081, ()=> {
    console.log('parse server is running on port ' + 8081);
});

ParseServer.createLiveQueryServer(httpServer);
