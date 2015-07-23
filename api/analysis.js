/**
 * Created by l.li on 7/16/15.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var Rmodule = require('./modules/Rmodule');
var ObjectId = require('mongodb').ObjectID;

router.post('/planforward', function (req, res) {
    var data = req.body.data;
    var objectId = new ObjectId();
    var scenario = {
        _id: objectId,
        AlgStartingTime: data.AlgStartingTime,
        StaringTime: data.StartingTime,
        EndingTime: data.EndingTime,
        Imtouch: data.Imtouch,
        Spend: data.Spend,
        Revenue: data.Revenue,
        ROI: data.ROI
    };
    if (req.body.data.Algorithm !== 1) {
        req.db.collection("scenarios").insertOne(scenario, function (err, result) {
            res.send(result.ops[0]._id);
        });
    } else {
        res.send(objectId);
    }
    //  use Rmodule.sendRcompute function to write file and use commend line to send file to R
    console.log('after send');
    Rmodule.sendRcompute(objectId, req.body.data);
});

 //using get method to  check the file change
router.get('/:objectId', function (req, res) {
    var objectId = req.params.objectId;
    var result = Rmodule.getRoutput(objectId);
    res.send(result);
});

module.exports = router;