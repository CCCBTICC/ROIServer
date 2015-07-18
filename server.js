// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var path = require("path");
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

//require api
var apiFolderName = 'api';//Todo: Change to 'api' for integration test
var scenarios = require('./'+apiFolderName+'/scenarios');
var analysis = require('./'+apiFolderName+'/analysis');

var app      = express();
var port     = process.env.PORT || 3001;

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application


app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'ROIServersessionkey' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(__dirname + '/views'));

app.use('/scenarios', scenarios);
app.use('/analysis', analysis);

//=============================route API  user and scenario ======================

// routes ======================================================================
//require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The Server is listening on port ' + port);
