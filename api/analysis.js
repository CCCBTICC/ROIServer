/**
 * Created by l.li on 7/16/15.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var Rmodule = require('./modules/Rmodule');
var ObjectId = require('mongodb').ObjectID;

router.post('/planforward', function (req, res) {
    var reqData = req.body.data;
    var reqUsername = req.body.username;
    var objectId = new ObjectId();
    var scenario = {
        _id: objectId,
        AlgStartingTime: reqData.AlgStartingTime,
        StartingTime: reqData.StartingTime,
        EndingTime: reqData.EndingTime,
        lmtouch: reqData.lmTouch,
        Spend: reqData.Spend,
        Revenue: reqData.Revenue,
        Brand: reqData.Brand,
        Owner: reqData.username,
        Name: "",
        Note: "",
        Final: "No",
        DataThrough: reqData.StartingTime,
        Share: "No"
    };
    if (reqData.Algorithm !== 1) {
        req.db.collection("scenarios").insertOne(scenario, function (err, scenarioDoc) {
            req.db.collection('users').findOneAndUpdate({username: reqUsername}, {$push: {scenarios: scenarioDoc.ops[0]._id}}, function () {
                res.send(scenarioDoc.ops[0]._id);
            });
        });
    } else {
        res.send(objectId);
    }
    //  use Rmodule.sendRcompute function to write file and use commend line to send file to R
    console.log('after send');
    //Rmodule.sendRcompute(objectId, req.body.data);
});

// using get method to  check the file change
router.get('/:objectId', function (req, res) {
    var objectId = req.params.objectId;
    var result = Rmodule.getRoutput(objectId);
    res.send(result);
});
module.exports = router;