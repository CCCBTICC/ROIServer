/**
 * Created by l.li on 7/16/15.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var assert = require('assert');
var Rmodule = require('./modules/Rmodule');
var ObjectId = require('mongodb').ObjectID;

router.post('/status',function(req, res){
    var list = req.body;
    list.forEach(function(single, index){
        single.scenario = Rmodule.getRoutput(single.id);
    });
    res.send(list);
});

//  the list json data
router.get('/:objectId', function (req, res) {
    var objectId = req.params.objectId;
    req.db.collection('scenarios').findOne({_id:new ObjectId(objectId)},{}, function (err,scenario) {
        if(scenario){
            res.send(scenario);
        }else{
            res.send(false);
        }
    });
});

router.post('/', function (req, res) {
    var requestData = req.body.data;
    var reqAction = req.body.action;
    switch (reqAction) {
        case "list":
            list(req.db, requestData, res);
            break;
        case "share":
            share(req.db, requestData, res);
            break;
        case "edit":
            edit(req.db, requestData, res);
            break;
        case "remove":
            remove(req.db, requestData, res);
            break;
        default:
            res.send('invalid actions');
            break;
    }
});

function share(db, requestData, res) {
    var scenarioId = requestData.scenarioId;
    var targetUsername = requestData.targetUsername;
    db.collection('users').findOneAndUpdate({username: targetUsername}, {$push: {scenarios: new ObjectId(scenarioId)}}, function (err, result) {
        res.send(scenarioId);
    });
}

function list(db, requestData, res) {
    var username = requestData.username;
    db.collection('users').findOne({username: username}, {fields: {scenarios: 1}}, function (err, user) {
        var scenariosList = [];
        user.scenarios.forEach(function (id) {
            scenariosList.push(new ObjectId(id));
        });
        db.collection('scenarios').find({_id: {$in: scenariosList}}).toArray(function (err, result) {
            console.log(result);
            if (!err) {
                res.send(result);
            } else {
                res.send({err: err});
            }
        });
    });
}

function edit(db, requestData, res) {
    var username = requestData.username;
    var scenarioId = requestData.scenarioId;
    var update = requestData.update;
    db.collection('scenarios').findOne({_id: new ObjectId(scenarioId)}, {}, function (err, scenario) {
        if (scenario) {
            if (scenario.owner === username) {
               Object.keys(update).forEach(function(key){
                   scenario[key]=update[key];
               });
                db.collection('scenarios').findOneAndUpdate({_id:scenario._id}, scenario, function (err, result) {
                    res.send(true);
                });
            } else {
                res.send(false);
            }
        }
    });
}
//function edit(db, requestData, res) {
//    var username = requestData.username;
//    var scenarioId = requestData.scenarioId;
//    var name = requestData.scenarioName;
//    var note = requestData.scenarioNote;
//    var final=requestData.scenarioFinal;
//    db.collection('scenarios').findOne({_id: new ObjectId(scenarioId)}, {}, function (err, scenario) {
//        if (scenario) {
//            if (scenario.owner === username) {
//                scenario.name= name;
//                scenario.note= note;
//                scenario.final=final;
//                //scenario.exist=exist;
//                db.collection('scenarios').findOneAndUpdate({_id:scenario._id}, scenario, function (err, result) {
//                    res.send(true);
//                });
//            } else {
//                res.send(false);
//            }
//        }
//    });
//}

function remove(db, requestData, res) {
    var scenarioId = requestData.scenarioId;
    db.collection('scenarios').findOne({_id: new ObjectId(scenarioId)}, {owner: 1, _id: 1}, function (err, scenario) {
        if (scenario) {
            if (scenario.owner === requestData.username) {
                db.collection('scenarios').removeOne({_id: new ObjectId(scenarioId)}, {w: 1}, function () {
                    res.send(true);
                });
            } else {
                res.send(false);
            }
        }
    });
}

module.exports = router;