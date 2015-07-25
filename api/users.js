/**
 * Created by l.li on 7/16/15.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;


router.post('/', function (req, res) {
    var reqData = req.body.data;
    var reqAction = req.body.action;
    switch (reqAction) {
        case "login":
            var username = reqData.username;
            var password = reqData.password;
            req.db.collection('users').findOne({username:username},{fields:{password:1}},function(err,result){
                if(result ===null){
                    res.send(false);
                    return;
                }
                if(result.password === password){
                    res.send(true);
                }else{
                    res.send(false);
                }
            });
            break;
        default:
            res.send(false);
    }
});

module.exports = router;