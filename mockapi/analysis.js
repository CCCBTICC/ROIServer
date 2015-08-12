/**
 * Created by l.li on 7/16/15.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
//var Rmodule = require('./modules/Rmodule');
var ObjectId = require('mongodb').ObjectID;


router.post('/R', function (req, res) {
    var reqData = req.body.data;
    var reqInfo=req.body.info;
    var reqUsername = req.body.username;
    var objectId = new ObjectId();
    var d = new Date();
    var scenario = {};
    if (reqData.Algorithm !== 1) {
        scenario = {
            _id: objectId,
            scenarioId:reqInfo.scenarioId,
            beginDate: reqInfo.beginDate,
            endDate: reqInfo.endDate,
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
        console.log(scenario);
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
    //var result = Rmodule.getRoutput(objectId);
    //res.send(result);
    switch (objectId) {
        case "run1":
            res.send({
                "AlgDuration": "6.876079 mins",
                "AlgEndingTime": "2015-07-14 21:56:12",
                "AlgStartingTime": "2015-07-14 21:49:19",
                "Algorithm": "2",
                "Brand": "Shutterfly",
                "EndingTime": "2013-11",
                "PlanMonths": "1",
                "Spend": "6420305",
                "SpendLB": "1186696",
                "SpendUB": "26397505",
                "StartingTime": "2013-11",
                "UserName": "user1",
                "__v": 0,
                "_id": {"$oid": "55a7872121610f5810fc8244"},
                "affAR": "3803679",
                "affAS": "335661",
                "affLB": "43930",
                "affMax": "1000000",
                "affMin": "197934",
                "affPR": "3803679",
                "affSF": "1.0",
                "affSR": "335661",
                "affSlide": "335661",
                "affSlideDivMax": "1087494",
                "affSlideDivMin": "43930",
                "affSlideLeft": "43930",
                "affSlideRight": "1087494",
                "affUB": "1087494",
                "dirSpendM1": "10125936",
                "dirSpendM2": "",
                "dirSpendM3": "",
                "disAR": "8243110",
                "disAS": "1343700",
                "disLB": "320915",
                "disMax": "3000000",
                "disMin": "1343700",
                "disPR": "8243110",
                "disSF": "1.0",
                "disSR": "1343700",
                "disSlide": "1343700",
                "disSlideDivMax": "4068865",
                "disSlideDivMin": "320915",
                "disSlideLeft": "320915",
                "disSlideRight": "4068865",
                "disUB": "4068865",
                "lmTouch": "Last Touch",
                "parAR": "5603701",
                "parAS": "986866",
                "parLB": "286440",
                "parMax": "986866",
                "parMin": "986866",
                "parPR": "5603701",
                "parSF": "1.0",
                "parSR": "986866",
                "parSlide": "986866",
                "parSlideDivMax": "4818540",
                "parSlideDivMin": "286440",
                "parSlideLeft": "286440",
                "parSlideRight": "4818540",
                "parUB": "4818540",
                "run1ProjROI": "559%",
                "run1ROIRange": "520%/599%",
                "run1RevRange": "+/- 6%",
                "run2ProjROI": "559%",
                "semAR": "22133272",
                "semAS": "3315269",
                "semBLB": "0",
                "semBAS": "279865",
                "semBMax": "379865",
                "semBMin": "279865",
                "semBSF": "1.0",
                "semBSR": "279865",
                "semBSlide": "279865",
                "semBSlideDivMax": "2221996",
                "semBSlideDivMin": "59780",
                "semBSlideLeft": "59780",
                "semBSlideRight": "2221996",
                "semBUB": "2221996",
                "semCAS": "2519794",
                "semCLB": "343858",
                "semCMax": "10000000",
                "semCMin": "1661220",
                "semCSF": "1.0",
                "semCSR": "2519794",
                "semCSlide": "2519794",
                "semCSlideDivMax": "10762858",
                "semCSlideDivMin": "343858",
                "semCSlideLeft": "343858",
                "semCSlideRight": "10762858",
                "semCUB": "10762858",
                "semOAS": "270270",
                "semOLB": "59297",
                "semOMax": "1000000",
                "semOMin": "268576",
                "semOSF": "1.0",
                "semOSR": "270270",
                "semOSlide": "270270",
                "semOSlideDivMax": "1495743",
                "semOSlideDivMin": "59297",
                "semOSlideLeft": "59297",
                "semOSlideRight": "1495743",
                "semOUB": "1495743",
                "semPAS": "245340",
                "semPLB": "72782",
                "semPMax": "700000",
                "semPMin": "244669",
                "semPR": "22133272",
                "semPSF": "1.0",
                "semPSR": "245340",
                "semPSlide": "245340",
                "semPSlideDivMax": "774325",
                "semPSlideDivMin": "72782",
                "semPSlideLeft": "72782",
                "semPSlideRight": "774325",
                "semPUB": "774325",
                "semSR": "3315269",
                "socAR": "2539846",
                "socAS": "438809",
                "socLB": "59474",
                "socMax": "1000000",
                "socMin": "437474",
                "socPR": "2539846",
                "socSF": "1.0",
                "socSR": "438809",
                "socSlide": "438809",
                "socSlideDivMax": "1167684",
                "socSlideDivMin": "59474",
                "socSlideLeft": "59474",
                "socSlideRight": "1167684",
                "socUB": "1167684",
                "totAR": "42323608",
                "totAS": "6420305",
                "totPR": "42323608",
                "totSR": "6420305",
                "tvBeginDate": "2013-11-04",
                "tvEndDate": "2013-11-30",
                "tvImpressions": "193668000",
                "tvSpend": "1826417"
            });
            break;
        case "run2":
            res.send({
                "UserName": "user1",
                "Brand": "Shutterfly",
                "Spend": "3000000",
                "StartingTime": "2014-09",
                "PlanMonths": "1",
                "EndingTime": "2014-09",
                "lmTouch": "Last Touch",
                "Algorithm": "2",
                "AlgStartingTime": "2014-09-26 07:57:39",
                "AlgEndingTime": "2014-09-26 07:59:51",
                "AlgDuration": "2.199252 mins",
                "semCLB": "84101",
                "semPLB": "77755",
                "semOLB": "22504",
                "semBLB": "49265",
                "disLB": "259724",
                "socLB": "29850",
                "affLB": "20775",
                "parLB": "314175",
                "SpendLB": "NULL",
                "semCMin": "",
                "semPMin": "",
                "semOMin": "",
                "semBMin": "",
                "disMin": "",
                "socMin": "",
                "affMin": "",
                "parMin": "",
                "semCMax": "",
                "semPMax": "",
                "semOMax": "",
                "semBMax": "",
                "disMax": "",
                "socMax": "",
                "affMax": "",
                "parMax": "",
                "semCUB": "1322232",
                "semPUB": "552121",
                "semOUB": "345732",
                "semBUB": "754241",
                "disUB": "2168468",
                "socUB": "564316",
                "affUB": "376080",
                "parUB": "2593320",
                "SpendUB": "NULL",
                "semCSF": "1.0",
                "semPSF": "1.0",
                "semOSF": "1.0",
                "semBSF": "1.0",
                "disSF": "1.0",
                "socSF": "1.0",
                "affSF": "1.0",
                "parSF": "1.0",
                "dirSpendM1": "310263",
                "dirSpendM2": "",
                "dirSpendM3": "",
                "tvBeginDate": "",
                "tvEndDate": "",
                "tvImpressions": "0",
                "tvSpend": "0",
                "semSR": "1202034",
                "semCSR": "470036",
                "semPSR": "115306",
                "semOSR": "57358",
                "semBSR": "559334",
                "disSR": "686689",
                "socSR": "42239",
                "affSR": "128045",
                "parSR": "940992",
                "totSR": "3000000",
                "semPR": "4395215",
                "disPR": "1709162",
                "socPR": "193073",
                "affPR": "449803",
                "parPR": "2148935",
                "totPR": "8896187",
                "run1RevRange": "+/- 6%",
                "run1ProjROI": "197%",
                "run1ROIRange": "179%/214%",
                "semCSlideLeft": "84101",
                "semPSlideLeft": "77755",
                "semOSlideLeft": "22504",
                "semBSlideLeft": "49265",
                "disSlideLeft": "259724",
                "socSlideLeft": "29850",
                "affSlideLeft": "20775",
                "parSlideLeft": "314175",
                "semCSlide": "470036",
                "semPSlide": "115306",
                "semOSlide": "57358",
                "semBSlide": "559334",
                "disSlide": "686689",
                "socSlide": "42239",
                "affSlide": "128045",
                "parSlide": "940992",
                "semCSlideRight": "1322232",
                "semPSlideRight": "552121",
                "semOSlideRight": "345732",
                "semBSlideRight": "754241",
                "disSlideRight": "2168468",
                "socSlideRight": "564316",
                "affSlideRight": "376080",
                "parSlideRight": "2593320",
                "semCSlideDivMin": "84101",
                "semPSlideDivMin": "77755",
                "semOSlideDivMin": "22504",
                "semBSlideDivMin": "49265",
                "disSlideDivMin": "259724",
                "socSlideDivMin": "29850",
                "affSlideDivMin": "20775",
                "parSlideDivMin": "314175",
                "semCSlideDivMax": "1322232",
                "semPSlideDivMax": "552121",
                "semOSlideDivMax": "345732",
                "semBSlideDivMax": "754241",
                "disSlideDivMax": "2168468",
                "socSlideDivMax": "564316",
                "affSlideDivMax": "376080",
                "parSlideDivMax": "2593320",
                "semAS": "1202034",
                "semCAS": "470036",
                "semPAS": "115306",
                "semOAS": "57358",
                "semBAS": "559334",
                "disAS": "686689",
                "socAS": "42239",
                "affAS": "128045",
                "parAS": "940992",
                "totAS": "3000000",
                "semAR": "4395215",
                "disAR": "1709162",
                "socAR": "193073",
                "affAR": "449803",
                "parAR": "2148935",
                "totAR": "8896187",
                "run2ProjROI": "197%"
            });
            break;
        case "run3":
            res.send({
                "UserName": "user1",
                "Brand": "Shutterfly",
                "Spend": "3000000",
                "StartingTime": "2014-09",
                "PlanMonths": "1",
                "EndingTime": "2014-09",
                "lmTouch": "Last Touch",
                "Algorithm": "3",
                "AlgStartingTime": "2014-09-26 08:02:27",
                "AlgEndingTime": "2014-09-26 08:05:09",
                "AlgDuration": "2.704022 mins",
                "semCLB": "84101",
                "semPLB": "77755",
                "semOLB": "22504",
                "semBLB": "49265",
                "disLB": "259724",
                "socLB": "29850",
                "affLB": "20775",
                "parLB": "314175",
                "SpendLB": "NULL",
                "semCMin": "",
                "semPMin": "",
                "semOMin": "",
                "semBMin": "",
                "disMin": "",
                "socMin": "",
                "affMin": "",
                "parMin": "",
                "semCMax": "",
                "semPMax": "",
                "semOMax": "",
                "semBMax": "",
                "disMax": "",
                "socMax": "",
                "affMax": "",
                "parMax": "",
                "semCUB": "1322232",
                "semPUB": "552121",
                "semOUB": "345732",
                "semBUB": "754241",
                "disUB": "2168468",
                "socUB": "564316",
                "affUB": "376080",
                "parUB": "2593320",
                "SpendUB": "NULL",
                "semCSF": "1.0",
                "semPSF": "1.0",
                "semOSF": "1.0",
                "semBSF": "1.0",
                "disSF": "1.0",
                "socSF": "1.0",
                "affSF": "1.0",
                "parSF": "1.0",
                "dirSpendM1": "310263",
                "dirSpendM2": "",
                "dirSpendM3": "",
                "tvBeginDate": "",
                "tvEndDate": "",
                "tvImpressions": "0",
                "tvSpend": "0",
                "semSR": "1202034",
                "semCSR": "470036",
                "semPSR": "115306",
                "semOSR": "57358",
                "semBSR": "559334",
                "disSR": "686689",
                "socSR": "42239",
                "affSR": "128045",
                "parSR": "940992",
                "totSR": "3000000",
                "semPR": "4395215",
                "disPR": "1709162",
                "socPR": "193073",
                "affPR": "449803",
                "parPR": "2148935",
                "totPR": "8896187",
                "run1RevRange": "+/- 6%",
                "run1ProjROI": "197%",
                "run1ROIRange": "179%/214%",
                "semCSlideLeft": "84101",
                "semPSlideLeft": "77755",
                "semOSlideLeft": "22504",
                "semBSlideLeft": "49265",
                "disSlideLeft": "259724",
                "socSlideLeft": "29850",
                "affSlideLeft": "20775",
                "parSlideLeft": "314175",
                "semCSlide": "582569",
                "semPSlide": "219449",
                "semOSlide": "57358",
                "semBSlide": "424642",
                "disSlide": "686689",
                "socSlide": "42239",
                "affSlide": "128045",
                "parSlide": "940992",
                "semCSlideRight": "1322232",
                "semPSlideRight": "552121",
                "semOSlideRight": "345732",
                "semBSlideRight": "754241",
                "disSlideRight": "2168468",
                "socSlideRight": "564316",
                "affSlideRight": "376080",
                "parSlideRight": "2593320",
                "semCSlideDivMin": "84101",
                "semPSlideDivMin": "77755",
                "semOSlideDivMin": "22504",
                "semBSlideDivMin": "49265",
                "disSlideDivMin": "259724",
                "socSlideDivMin": "29850",
                "affSlideDivMin": "20775",
                "parSlideDivMin": "314175",
                "semCSlideDivMax": "1322232",
                "semPSlideDivMax": "552121",
                "semOSlideDivMax": "345732",
                "semBSlideDivMax": "754241",
                "disSlideDivMax": "2168468",
                "socSlideDivMax": "564316",
                "affSlideDivMax": "376080",
                "parSlideDivMax": "2593320",
                "semAS": "1280354",
                "semCAS": "582569",
                "semPAS": "219449",
                "semOAS": "53694",
                "semBAS": "424642",
                "disAS": "677274",
                "socAS": "43806",
                "affAS": "118086",
                "parAS": "880480",
                "totAS": "3000000",
                "semAR": "4511934",
                "disAR": "1700571",
                "socAR": "199007",
                "affAR": "444040",
                "parAR": "2045884",
                "totAR": "8901437",
                "run2ProjROI": "197%"
            });
            break;
        default:
            res.send({
                "AlgDuration": "6.876079 mins",
                "AlgEndingTime": "2015-07-14 21:56:12",
                "AlgStartingTime": "2015-07-14 21:49:19",
                "Algorithm": "2",
                "Brand": "Shutterfly",
                "EndingTime": "2013-11",
                "PlanMonths": "1",
                "Spend": "6420305",
                "SpendLB": "1186696",
                "SpendUB": "26397505",
                "StartingTime": "2013-11",
                "UserName": "user1",
                "__v": 0,
                "_id": {"$oid": "55a7872121610f5810fc8244"},
                "affAR": "3803679",
                "affAS": "335661",
                "affLB": "43930",
                "affMax": "1000000",
                "affMin": "197934",
                "affPR": "3803679",
                "affSF": "1.0",
                "affSR": "335661",
                "affSlide": "335661",
                "affSlideDivMax": "1087494",
                "affSlideDivMin": "43930",
                "affSlideLeft": "43930",
                "affSlideRight": "1087494",
                "affUB": "1087494",
                "dirSpendM1": "10125936",
                "dirSpendM2": "",
                "dirSpendM3": "",
                "disAR": "8243110",
                "disAS": "1343700",
                "disLB": "320915",
                "disMax": "3000000",
                "disMin": "1343700",
                "disPR": "8243110",
                "disSF": "1.0",
                "disSR": "1343700",
                "disSlide": "1343700",
                "disSlideDivMax": "4068865",
                "disSlideDivMin": "320915",
                "disSlideLeft": "320915",
                "disSlideRight": "4068865",
                "disUB": "4068865",
                "lmTouch": "Last Touch",
                "parAR": "5603701",
                "parAS": "986866",
                "parLB": "286440",
                "parMax": "986866",
                "parMin": "986866",
                "parPR": "5603701",
                "parSF": "1.0",
                "parSR": "986866",
                "parSlide": "986866",
                "parSlideDivMax": "4818540",
                "parSlideDivMin": "286440",
                "parSlideLeft": "286440",
                "parSlideRight": "4818540",
                "parUB": "4818540",
                "run1ProjROI": "559%",
                "run1ROIRange": "520%/599%",
                "run1RevRange": "+/- 6%",
                "run2ProjROI": "559%",
                "semAR": "22133272",
                "semAS": "3315269",
                "semBLB": "0",
                "semBAS": "279865",
                "semBMax": "379865",
                "semBMin": "279865",
                "semBSF": "1.0",
                "semBSR": "279865",
                "semBSlide": "279865",
                "semBSlideDivMax": "2221996",
                "semBSlideDivMin": "59780",
                "semBSlideLeft": "59780",
                "semBSlideRight": "2221996",
                "semBUB": "2221996",
                "semCAS": "2519794",
                "semCLB": "343858",
                "semCMax": "10000000",
                "semCMin": "1661220",
                "semCSF": "1.0",
                "semCSR": "2519794",
                "semCSlide": "2519794",
                "semCSlideDivMax": "10762858",
                "semCSlideDivMin": "343858",
                "semCSlideLeft": "343858",
                "semCSlideRight": "10762858",
                "semCUB": "10762858",
                "semOAS": "270270",
                "semOLB": "59297",
                "semOMax": "1000000",
                "semOMin": "268576",
                "semOSF": "1.0",
                "semOSR": "270270",
                "semOSlide": "270270",
                "semOSlideDivMax": "1495743",
                "semOSlideDivMin": "59297",
                "semOSlideLeft": "59297",
                "semOSlideRight": "1495743",
                "semOUB": "1495743",
                "semPAS": "245340",
                "semPLB": "72782",
                "semPMax": "700000",
                "semPMin": "244669",
                "semPR": "22133272",
                "semPSF": "1.0",
                "semPSR": "245340",
                "semPSlide": "245340",
                "semPSlideDivMax": "774325",
                "semPSlideDivMin": "72782",
                "semPSlideLeft": "72782",
                "semPSlideRight": "774325",
                "semPUB": "774325",
                "semSR": "3315269",
                "socAR": "2539846",
                "socAS": "438809",
                "socLB": "59474",
                "socMax": "1000000",
                "socMin": "437474",
                "socPR": "2539846",
                "socSF": "1.0",
                "socSR": "438809",
                "socSlide": "438809",
                "socSlideDivMax": "1167684",
                "socSlideDivMin": "59474",
                "socSlideLeft": "59474",
                "socSlideRight": "1167684",
                "socUB": "1167684",
                "totAR": "42323608",
                "totAS": "6420305",
                "totPR": "42323608",
                "totSR": "6420305",
                "tvBeginDate": "2013-11-04",
                "tvEndDate": "2013-11-30",
                "tvImpressions": "193668000",
                "tvSpend": "1826417"
            });
            break;
    }
});

module.exports = router;