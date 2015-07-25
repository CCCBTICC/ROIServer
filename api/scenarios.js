/**
 * Created by l.li on 7/16/15.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

//  the list json data

router.post('/', function (req, res) {
    console.log('in scenarios');
    var reqData = req.body;
    var resData;
    switch (reqData.action) {
        case "list":
            resData = list(req, res, reqData);
            break;
        case "share":
            res.redirect("home.html#/myscenarios/share.html");
            res.send(resData);
            break;
        case "remove":
            req.db.collection("scenarios").findAndRemove({_id: new ObjectId(req.body.id)}, [['b', 1]], function (err, result) {
                if (result) {
                    console.log(result);
                    res.send(result);
                }
            });
            break;
        default:
            //res.redirect("home.html#/myscenarios/list.html");
            res.send(resData);
            break;
    }
});

function list(req, res, reqData) {
    var username = reqData.username;
    req.db.collection('users').findOne({username: username}, {fields: {scenarios: 1}}, function (err, user) {
        var scenariosList = [];
        user.scenarios.forEach(function (id) {
            scenariosList.push(new ObjectId(id));
        });
        req.db.collection('scenarios').find({_id: {$in: scenariosList}}).toArray(function (err, result) {
            console.log(result);
            if (!err) {
                res.send(result);
            } else {
                res.send({err: err});
            }
        });
    });
}

module.exports = router;