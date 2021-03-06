/**
 * Created by l.li on 7/16/15.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;


router.post('/', function (req, res) {
    var requestData = req.body.data;
    var reqAction = req.body.action;
    switch (reqAction) {
        case "login":
            userLogin(req.db, requestData, res);
            break;
        case "userList":
            userList(req.db, requestData, res);
            break;
        default:
            res.send('invalid action');
    }
});

function userLogin(db, requestData, res) {
    var username = requestData.username;
    var password = requestData.password;
    db.collection('users').findOne({username: username}, {fields: {password: 1}}, function (err, result) {
        if (result === null) {
            res.send(false);
            return;
        }
        if (result.password === password) {
            res.send(username);
        } else {
            res.send(false);
        }
    });
}

function userList(db, requestData, res) {
    var username = requestData.username;
    db.collection('users').find({}, {username: 1}).toArray(function (err, users) {
        var result = [];
        users.forEach(function(user){
            if(user.username !== username){
                result.push(user.username);
            }
        });
        res.send(result);
    });
}

module.exports = router;