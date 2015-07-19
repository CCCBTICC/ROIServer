var express = require('express');
var path = require("path");
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

//mongodb settings
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var dbURL = 'mongodb://localhost:27017/ROIDB';
var DB;

MongoClient.connect(dbURL, function (err, db) {
    assert.equal(null, err);
    console.log('mongoDB conntected');
    DB = db;
});

//require api
var apiFolderName = 'api';//Todo: Change to 'api' for integration test
var scenarios = require('./' + apiFolderName + '/scenarios');
var analysis = require('./' + apiFolderName + '/analysis');
var app = express();
var port = process.env.PORT || 3001;

// configuration ===============================================================

require('./config/passport')(passport); // pass passport for configuration

// set up our express application


app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'ROIServersessionkey'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(__dirname + '/views'));

app.use(function (req, res, next) {
    req.db = DB;
    next();
});

app.use('/scenarios', scenarios);
app.use('/analysis', analysis);

//=============================route API  user and scenario ======================

// routes ======================================================================
//require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The Server is listening on port ' + port);

module.exports = app;