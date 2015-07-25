var express = require('express');
var path = require("path");
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
var DBinitModule = require('./utilities/DBInitModule');

MongoClient.connect(dbURL, function (err, db) {
    assert.equal(null, err);
    console.log('mongoDB conntected');
    DBinitModule.initDB(db);
    DB = db;
});

//require api
var apiFolderName = 'api';
var scenarios = require('./' + apiFolderName + '/scenarios');
var analysis = require('./' + apiFolderName + '/analysis');
var users = require('./' + apiFolderName + '/users');
var app = express();
var port = process.env.PORT || 3001;

// configuration ===============================================================

// set up our express application

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'ROIServersessionkey'}));
app.use(flash());
app.use(express.static(__dirname + '/views'));

app.use(function (req, res, next) {
    req.db = DB;
    next();
});

app.use('/scenarios', scenarios);
app.use('/analysis', analysis);
app.use('/users', users);

//=============================route API  user and scenario ======================

// routes ======================================================================
//require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The Server is listening on port ' + port);

module.exports = app;