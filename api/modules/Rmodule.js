/**
 * Created by l.li on 7/16/15.
 */
var fs = require('fs');
var Rmodule = {
    // initRCompute service for the Init step  is designed for init
    initRCompute: function(filename, data){
        //write dynimic filename
        fs.writeFile('R/input/' + filename + '.json',JSON.stringify(data));
        //send the generated file to R via commend line 
        var cmd = 'R CMD BATCH --no-save --no-restore "--args '+ filename + '.json" R/algorithms/RM.R';
        var exec = require('child_process').exec;
        last = exec(cmd);
        last.stdout.on('data', function (data) {
            console.log('output：' + data);
        });
        last.on('exit', function (code) {
            
            console.log('child process closed . code：' + code);
            var exist = fs.existsSync('R/output/' + filename + '.json');
            if(exist){
                return JSON.parse(fs.readFileSync('R/output/' + filename + '.json'));
            }else{
                //file does not exist
            }
            
        });
    },
    // sendRcompute service for the Run step and reRun step  is designed for sendR api 
    sendRcompute:function(filename, data){
        //write dynimic filename
        fs.writeFile('R/input/' + filename + '.json',JSON.stringify(data));
        //send the generated file to R via commend line 
        var cmd = 'R CMD BATCH --no-save --no-restore "--args '+ filename + '.json" R/algorithms/RM.R';
        var exec = require('child_process').exec;
        last = exec(cmd);
        last.stdout.on('data', function (data) {
            console.log('output：' + data);
        });
        last.on('exit', function (code) {
            console.log('child process closed . code：' + code);
        });
    }
};



module.exports = Rmodule;