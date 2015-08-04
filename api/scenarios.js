/**
 * Created by l.li on 7/16/15.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var assert = require('assert');
var Rmodule = require('./modules/Rmodule');
var ObjectId = require('mongodb').ObjectID;



//router.post('/status',function(req, res) {
//    var list = req.body;
//    var currentDate = new Date();
//    list.forEach(function (listSingle, index) {
//        //listSingle.scenario = Rmodule.getRoutput(listSingle.id);
//        if(!Rmodule.getRoutput(listSingle.id)){
//            req.db.collection('scenarios').findOne({_id:new ObjectId(listSingle.id)},{}, function (err,scenario) {
//                if(scenario){
//                    //listSingle.runningTime = scenario.createDate;
//                    listSingle.runningTime = currentDate.getTime() - scenario.createDate.getTime();
//                    listSingle.final = scenario.final;
//                }else{
//                   console.log("can't find:"+listSingle.id);
//                }
//            });
//        }else{
//            listSingle.runningTime = "0";
//        }
//    });
//     setTimeout(function(){res.send(list);},500);
//    /*
//    list.forEach(function (listSingle, index) {
//        scenariosList.push(listSingle.id);
//        listSingle.scenario = Rmodule.getRoutput(listSingle.id);
//    if(scenariosList.length === list.length){
//        req.db.collection('scenarios').find({_id: {$in: scenariosList}}).toArray(function (err, result) {
//            console.log(result);
//            if (!err) {
//                result.forEach(function (resultSingle, index) {
//                    //single.runningTime = currentDate.getTime() - scenario.createDate.getTime();
//                    resultSingle.runningTime = resultSingle.createDate;
//                });
//                res.send(list);
//            } else {
//                res.send({err: err});
//            }
//        });
//    }
//    });
//    */
//
//});

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
        case "status":
            status(req.db, requestData, res);
            break;
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

function status(db, requestData, res){
    var currentDate = new Date();
    requestData.forEach(function (listSingle, index) {

            db.collection('scenarios').findOne({_id:new ObjectId(listSingle.id)},{}, function (err,scenario) {
                if(scenario){
                    listSingle.final = scenario.final;
                    if((!Rmodule.getRoutput(listSingle.id))) {
                        listSingle.runningTime = currentDate.getTime() - scenario.createDate.getTime();
                    }else{
                        listSingle.runningTime = "0";
                    }
                }else{
                    console.log("can't find:"+listSingle.id);
                }
            });
    });
    setTimeout(function(){res.send(requestData);},500);
}

function share(db, requestData, res) {
    var scenarioId = requestData.scenarioId;
    var targetUsername = requestData.targetUsername;
    db.collection('users').findOneAndUpdate({username: targetUsername}, {$push: {scenarios: new ObjectId(scenarioId)}}, function (err, result) {
        res.send(scenarioId);
    });
}

function list(db, requestData, res) {
    var currentDate = new Date();
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