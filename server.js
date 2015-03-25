// Require our dependencies
var express = require('express'),
    exphbs = require('express-handlebars'),
    http = require('http'),
    mongoose = require('mongoose'),
    routes = require('./routes'),
    config = require('./config');

// Create an express instance and set a port variable
var app = express();
var port = process.env.PORT || 8080;

// Set handlebars as the templating engine
app.use("/", express.static(__dirname + "/public/"));
app.set('views', __dirname + '/views');
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Index Route
app.get('/', routes.index);
app.get('/line/:lineName', routes.line);

// Fire it up (start our server)
var server = http.createServer(app).listen(port, function() {
    console.log('Express server listening on port ' + port);
});