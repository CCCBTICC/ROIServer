/**
 * Created by Chenghuijin on 2015/7/28.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var ObjectId = require('mongodb').ObjectID;

router.post('/history', function (req, res) {
    var begin = req.body.begin;
    var end = req.body.end;
    var allMonth = getAllMonth(begin, end);

    req.db.collection("history").find({Month:{$in:allMonth}}).toArray(function (err, result) {
        console.log(result);
        if (!err) {
            res.send(result);
        } else {
            res.send({err: err});
        }
    });
});
router.get('/history', function (req, res) {
    req.db.collection('history').find({},{"Month":1}).sort({"Month":1}).toArray(function (err, result) {
        console.log(result[-1]);
        res.send({
            min: result[0].Month,
            max: result[result.length-1].Month
        });
    });
});
function getAllMonth(begin, end) {
    var year = end.slice(0, 4) - begin.slice(0, 4);
    var month = end.slice(5) - begin.slice(5);
    var output = [];
    var temp = "";
    var i, j;
    if (year > 0) {
        for (i = Number(begin.slice(5, 7)); i <= 12; i++) {
            if (i < 10) {
                temp = begin.slice(0, 5) + "0" + i;
                output.push(temp);
            } else {
                temp = begin.slice(0, 5) + i;
                output.push(temp);
            }
        }
        for (i = 1; i < year; i++) {
            for (j = 1; j <= 12; j++) {
                if (j < 10) {
                    temp = Number(Number(begin.slice(0, 4)) + i) + "-0" + j;
                    output.push(temp);
                } else {
                    temp = Number(Number(begin.slice(0, 4)) + i) + "-" + j;
                    output.push(temp);
                }
            }
        }
        for (i = 1; i <= Number(end.slice(5)); i++) {
            if (i < 10) {
                temp = end.slice(0, 4) + "-0" + i;
                output.push(temp);
            } else {
                temp = end.slice(0, 4) + "-" + i;
                output.push(temp);
            }
        }
    } else {
        for (i = Number(begin.slice(5, 7)); i <= Number(end.slice(5, 7)); i++) {
            if (i < 10) {
                temp = begin.slice(0, 5) + "0" + i;
                output.push(temp);
            } else {
                temp = begin.slice(0, 5) + i;
                output.push(temp);
            }
        }
    }
    return output;
}
module.exports = router;