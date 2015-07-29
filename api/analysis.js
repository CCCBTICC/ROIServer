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
            scenarioId:reqData.scenarioId,
            begin: reqData.StartingTime,
            end: reqData.EndingTime,
            lmTouch: reqData.lmTouch === 'Last Touch' ? 'Last Touch' : 'Multi Touch',
            spend: reqData.Spend,
            createDate: d,
            brand: reqData.Brand,
            owner: reqData.UserName,
            name: "",
            note: "",
            final: "No",
            dataThrough: reqData.dataThrough,
            included: reqData.included ? reqData.included : 'No',
            share: "No",
            exist:false,
            from:reqData.from
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
    console.log(begin);

        allMonth = getAllMonth(begin,end);
        allMonth.forEach(function (monthStr,index){
            req.db.collection("history").findOne({Month:monthStr},{}, function (err, result){
                console.log(result);
                allMonthObj.push(result);
                console.log(allMonthObj);
                //allMonthObj[index] = result;

            });
            if(allMonth.length === allMonthObj.length){
                res.send(allMonthObj);
            }
        });
        setTimeout(function(){res.send(allMonthObj);},500);


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
    var i,j;
    if(year>0){
    for( i=Number(begin.slice(5,7));i<=12;i++){
        if(i<10){
        temp = begin.slice(0,5)+"0"+i;
        output.push(temp);
        }else{
        temp = begin.slice(0,5)+i; 
        output.push(temp);   
        }
    }
    for( i=1;i<year;i++){
       for(j=1;j<=12;j++){
             if(j<10){ 
                 temp = Number(Number(begin.slice(0,4))+i)+"-0"+j;
                 output.push(temp);
             }else{
                 temp = Number(Number(begin.slice(0,4))+i)+"-"+j;
                 output.push(temp);
             }
            }
    }
    for( i=1;i<=Number(end.slice(5));i++){
        if(i<10){
        temp = end.slice(0,4)+"-0"+i;
        output.push(temp);
        }else{
        temp = end.slice(0,4)+"-"+i;  
        output.push(temp);
        }
    }       
    }else{
      for( i=Number(begin.slice(5,7));i<=Number(end.slice(5,7));i++){
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
