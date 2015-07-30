/**
 * Created by l.li on 7/16/15.
 */
var fs = require('fs');
var Rmodule = {

    // sendRcompute service for the Run step and reRun step  is designed for sendR api 
    sendRcompute: function (filename, data) {
        //write dynimic filename
        fs.writeFile('R/input/' + filename + '.json', JSON.stringify(data));
        //send the generated file to R via commend line 
        var cmd = 'R CMD BATCH --no-save --no-restore "--args ' + filename + '.json" R/algorithms/RM.R R/log/' + filename + '.Rout';
        var exec = require('child_process').exec;
        var last = exec(cmd);
        last.stdout.on('data', function (data) {
            console.log('output：' + data);
        });
        last.on('exit', function (code) {
            // 0 = success   >1 fail
            console.log('child process closed . code：' + code);
            return !code;

        });
    },
    getRoutput: function (filename) {
        var exist = fs.existsSync('R/output/' + filename + '.json');
        if (exist) {
            return JSON.parse(fs.readFileSync('R/output/' + filename + '.json', 'utf-8'));
        } else {
            //read file error
            return false;
        }
    }


};


module.exports = Rmodule;