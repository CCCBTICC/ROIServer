/**
 * Created by l.li on 7/16/15.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

//  the list json data
router.get('/list', function (req, res) {
    req.db.collection('scenarios').find().toArray(function(err,result){
        if(!err){
            res.send(result);
        }else{
            res.send({err:err});
        }
    });
});

router.post('/', function (req, res) {
    var resData = "test";
    //TODO:add switch logic base on reqData.action
    var reqData=req.body;
    switch (reqData.action) {
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


    }
});

module.exports = router;