const app = require('express')();
const fs = require('fs');
const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');

app.set('production', require('./config.json').production);
app.set('port', require('./config.json').port);
app.set('ssl_port', require('./config.json').ssl_port);
app.set('debug_port', require('./config.json').debug_port);
app.set('api', require('./config.json').parse.api);
app.set('dashboard', require('./config.json').parse.dashboard);

app.all('*',  (req, res, next)=>{
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', true);
    next();
})

let api = new ParseServer(app.get('api'));
let dashboard = new ParseDashboard(app.get('dashboard'), app.get('dashboard').options);

app.use('/parse', api);
app.use('/', dashboard);

let httpServer = require('http').createServer(app);
let port = (app.get('production')) ? app.get('port') : app.get('debug_port');

httpServer.listen(port, ()=> {
    console.log('HTTP is running on port ' + port);

    if (app.get('production')) {
        let httpsServer = require('https').createServer({
            key: fs.readFileSync('./cert/XXX.key'),
            cert: fs.readFileSync('./cert/XXX.crt')
        }, app);

        httpsServer.listen(app.get('ssl_port'), () => {
            console.log('HTTPS is running on port', app.get('ssl_port'));
        });
    }
});
