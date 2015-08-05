/**
 * Created by l.li on 7/16/15.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var Rmodule = require('./modules/Rmodule');
var ObjectId = require('mongodb').ObjectID;

router.post('/R', function (req, res) {
    console.log('in api');
    var reqData = req.body.data;
    var reqInfo=req.body.info;
    var reqUsername = req.body.username;
    var objectId = new ObjectId();
    var d = new Date();
    var scenario={};
    if (reqData.Algorithm !== 1) {
        scenario = {
            _id: objectId,
            scenarioId:reqInfo.scenarioId,
            begin: reqInfo.beginDate,
            end: reqInfo.endDate,
            lmTouch: reqInfo.lmTouch === 'Last Touch' ? 'Last Touch' : 'Multi Touch',
            spend: reqInfo.spend,
            createDate: d,
            brand: reqInfo.brand,
            owner: reqData.UserName,
            name: "",
            note: "",
            final: "No",
            dataThrough: reqInfo.dataThrough,
            included: reqInfo.included,
            share: "No",
            exist:false,
            from:reqInfo.from
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