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
    var d=new Date();
    var scenario = {
        _id: objectId,
        ScenarioID:"000",
        StartingTime: reqData.StartingTime,
        EndingTime: reqData.EndingTime,
        lmTouch: reqData.lmTouch,
        Spend: reqData.Spend,
        CreateDate: d,
        Revenue: reqData.Revenue,
        Brand: reqData.Brand,
        Owner: reqData.username,
        Name: "",
        Note: "",
        Final: "No",
        DataThrough: reqData.StartingTime,
        HistoryIncluded:'No',
        Share: "No"
    };
    if (reqData.Algorithm !== 1) {
        req.db.collection("scenarios").insertOne(scenario, function (err, scenarioDoc) {
            req.db.collection('users').findOneAndUpdate({username: reqUsername}, {$push: {scenarios: scenarioDoc.ops[0]._id}}, function () {
                //res.send(scenarioDoc.ops[0]._id);
                res.send('55ab282fce84683817469e03');
            });
        });
    } else {
        //res.send(objectId);
        res.send('55ab282fce84683817469e03-1');
    }
    //  use Rmodule.sendRcompute function to write file and use commend line to send file to R
    console.log('after send');
    //Rmodule.sendRcompute(objectId, req.body.data);
});

// using get method to  check the file change
router.get('/:objectId', function (req, res) {
    var objectId = req.params.objectId;

    //var result = Rmodule.getRoutput(objectId);
    //res.send(result);
    res.send({"AlgDuration":"6.876079 mins","AlgEndingTime":"2015-07-14 21:56:12","AlgStartingTime":"2015-07-14 21:49:19","Algorithm":"2","Brand":"Shutterfly","EndingTime":"2013-11","PlanMonths":"1","Spend":"6420305","SpendLB":"NULL","SpendUB":"NULL","StartingTime":"2013-11","UserName":"","__v":0,"_id":{"$oid":"55a7872121610f5810fc8244"},"affAR":"3803679","affAS":"335661","affLB":"43930","affMax":"1000000","affMin":"197934","affPR":"3803679","affSF":"1.0","affSR":"335661","affSlide":"335661","affSlideDivMax":"1087494","affSlideDivMin":"43930","affSlideLeft":"43930","affSlideRight":"1087494","affUB":"1087494","dirSpendM1":"10125936","dirSpendM2":"","dirSpendM3":"","disAR":"8243110","disAS":"1343700","disLB":"320915","disMax":"3000000","disMin":"1343700","disPR":"8243110","disSF":"1.0","disSR":"1343700","disSlide":"1343700","disSlideDivMax":"4068865","disSlideDivMin":"320915","disSlideLeft":"320915","disSlideRight":"4068865","disUB":"4068865","lmTouch":"Last Touch","parAR":"5603701","parAS":"986866","parLB":"286440","parMax":"986866","parMin":"986866","parPR":"5603701","parSF":"1.0","parSR":"986866","parSlide":"986866","parSlideDivMax":"4818540","parSlideDivMin":"286440","parSlideLeft":"286440","parSlideRight":"4818540","parUB":"4818540","run1ProjROI":"559%","run1ROIRange":"520%/599%","run1RevRange":"+/- 6%","run2ProjROI":"559%","semAR":"22133272","semAS":"3315269","semBLB":"0","semBAS":"279865","semBMax":"379865","semBMin":"279865","semBSF":"1.0","semBSR":"279865","semBSlide":"279865","semBSlideDivMax":"2221996","semBSlideDivMin":"59780","semBSlideLeft":"59780","semBSlideRight":"2221996","semBUB":"2221996","semCAS":"2519794","semCLB":"343858","semCMax":"10000000","semCMin":"1661220","semCSF":"1.0","semCSR":"2519794","semCSlide":"2519794","semCSlideDivMax":"10762858","semCSlideDivMin":"343858","semCSlideLeft":"343858","semCSlideRight":"10762858","semCUB":"10762858","semOAS":"270270","semOLB":"59297","semOMax":"1000000","semOMin":"268576","semOSF":"1.0","semOSR":"270270","semOSlide":"270270","semOSlideDivMax":"1495743","semOSlideDivMin":"59297","semOSlideLeft":"59297","semOSlideRight":"1495743","semOUB":"1495743","semPAS":"245340","semPLB":"72782","semPMax":"700000","semPMin":"244669","semPR":"22133272","semPSF":"1.0","semPSR":"245340","semPSlide":"245340","semPSlideDivMax":"774325","semPSlideDivMin":"72782","semPSlideLeft":"72782","semPSlideRight":"774325","semPUB":"774325","semSR":"3315269","socAR":"2539846","socAS":"438809","socLB":"59474","socMax":"1000000","socMin":"437474","socPR":"2539846","socSF":"1.0","socSR":"438809","socSlide":"438809","socSlideDivMax":"1167684","socSlideDivMin":"59474","socSlideLeft":"59474","socSlideRight":"1167684","socUB":"1167684","totAR":"42323608","totAS":"6420305","totPR":"42323608","totSR":"6420305","tvBeginDate":"2013-11-04","tvEndDate":"2013-11-30","tvImpressions":"193668000","tvSpend":"1826417"});

});
module.exports = router;