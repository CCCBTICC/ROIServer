/**
 * Created by l.li on 7/16/15.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var Rmodule = require('./modules/Rmodule');
var ObjectId = require('mongodb').ObjectID;

router.post('/planforward', function (req, res) {
    console.log('in api');
    var reqData = req.body.data;
    var reqUsername = req.body.username;
    var objectId = new ObjectId();
    var d = new Date();
    var scenario={};
    if (reqData.Algorithm !== 1) {
        scenario = {
            _id: objectId,
            ScenarioID:reqData.scenarioId,
            StartingTime: reqData.StartingTime,
            EndingTime: reqData.EndingTime,
            lmTouch: reqData.lmTouch === 'Last Touch' ? 'Last Touch' : 'Multi Touch',
            Spend: reqData.Spend,
            CreateDate: d,
            Revenue: reqData.Revenue,
            Brand: reqData.Brand,
            owner: reqData.UserName,
            Name: "",
            Note: "",
            Final: "No",
            DataThrough: reqData.dataThrough,
            HistoryIncluded: reqData.included,
            Share: "No",
            Exist:false,
            From:reqData.from
        };
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
    Rmodule.sendRcompute(objectId, req.body.data);
});

// using get method to  check the file change
router.get('/:objectId', function (req, res) {
    var objectId = req.params.objectId;
    var result = Rmodule.getRoutput(objectId);
    res.send(result);
});
module.exports = router;