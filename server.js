// Require our dependencies
var express = require('express'),
    exphbs = require('express-handlebars'),
    http = require('http'),
    routes = require('./routes'),
    bodyParser = require('body-parser'),
    config = require('./config');

// Create an express instance and set a port variable
var app = express();
var port = config.values.port;

app.use(bodyParser.json());         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// Set handlebars as the templating engine
app.use("/", express.static(__dirname + "/public/"));
app.set('views', __dirname + '/views');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Index Route
app.get('/', routes.index);
app.get('/alerts', routes.alerts);
app.get('/alerts/:alert_id', routes.alertsUnit);
app.post('/line', routes.linePost);
app.get('/line/:titan_code', routes.lineStops);
app.get('/line/:titan_code/:stop_name', routes.lineByStop);
app.get('/search/line/:lineName', routes.suggestLines);
app.post('/search/stop', routes.suggestStopsPost);
app.get('/search/stop/:keyword', routes.suggestStops);

//Redirect no 200 status to /
app.use(function(req, res, next) {
    if(res.status != 200) {
        res.redirect('/');
    }
});

// Fire it up (start our server)
var server = http.createServer(app).listen(port, function () {
    console.log('Express server listening on port ' + port);
});