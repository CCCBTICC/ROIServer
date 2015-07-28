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
            name: "",
            note: "",
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

router.post('/lookback', function (req, res){
    var begin = req.body.begin;
    var end = req.body.end;
    var allMonth = [];
    var allMonthObj = [];

        allMonth = getAllMonth(begin,end);
        allMonth.forEach(function (monthStr,index){
            req.db.collection("history").findOne({Month:monthStr},{}, function (err, result){
                allMonthObj.push(result);
                if(allMonthObj.length >= allMonth.length){
                    res.send(allMonthObj);
                    allMonth = [];
                    allMonthObj = [];
                }
            });

        });
}); 

router.get('/lookback', function (req, res){
    var allMonth = [];
    var latestMonth = '';
    req.db.collection('history').find().toArray(function (err, result){
        console.log(result);
        result.forEach(function (single, index){
            allMonth.push(single.Month);
        });
        allMonth.sort();
        res.send({
            earliest:allMonth[0],
            latest:allMonth[allMonth.length-1]
        });
    });
}); 

// using get method to  check the file change
router.get('/:objectId', function (req, res) {
    var objectId = req.params.objectId;
    var result = Rmodule.getRoutput(objectId);
    res.send(result);
});
module.exports = router;



function getAllMonth (begin, end){
    var year = end.slice(0,4) - begin.slice(0,4);
    var month = end.slice(5)  - begin.slice(5);
    var output = [];
    var temp = "";
    if(year>0){
    for(var i=Number(begin.slice(5,7));i<=12;i++){
        if(i<10){
        temp = begin.slice(0,5)+"0"+i;
        output.push(temp);
        }else{
        temp = begin.slice(0,5)+i; 
        output.push(temp);   
        }
    }
    for(var i=1;i<year;i++){
       for(var j=1;j<=12;j++){
             if(j<10){ 
                 temp = Number(Number(begin.slice(0,4))+i)+"-0"+j;
                 output.push(temp);
             }else{
                 temp = Number(Number(begin.slice(0,4))+i)+"-"+j;
                 output.push(temp);
             }
            }
    }
    for(var i=1;i<=Number(end.slice(5));i++){
        if(i<10){
        temp = end.slice(0,4)+"-0"+i;
        output.push(temp);
        }else{
        temp = end.slice(0,4)+"-"+i;  
        output.push(temp);
        }
    }       
    }else{
      for(var i=Number(begin.slice(5,7));i<=Number(end.slice(5,7));i++){
        if(i<10){
        temp = begin.slice(0,5)+"0"+i;
        output.push(temp);
        }else{
        temp = begin.slice(0,5)+i; 
        output.push(temp);   
        }
    }
    }    
    return output;
}
