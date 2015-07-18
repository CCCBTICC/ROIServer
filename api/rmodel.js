/**
 * Created by l.li on 7/16/15.
 */
var express = require('express');
var router = express.Router();


function initRCompute(filename,){

		var cmd = "R CMD BATCH --no-save --no-restore '--args input_temp.json' /home/daviddong/ROI_V2/20150715/ROIServer/R/algorithms/RM.R";
            var exec = require('child_process').exec;
            last = exec(cmd);
            last.stdout.on('data', function (data) {
                console.log('output：' + data);
            });
            last.on('exit', function (code) {
                res.send(JSON.parse(fs.readFileSync('/home/daviddong/ROI_V2/20150715/ROIServer/R/output/input_temp.json', 'utf-8')));
                console.log('child process closed . code：' + code);
            });
}