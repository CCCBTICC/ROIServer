/**
 * Created by Chenghuijin on 2015/7/27.
 */

var Importmodule = {
    deleteCollection:function (collectionName){
        //  drop the collection collectionName  ---query

    },
    importCollection:function (collectionName){
        // use child process to run termial commend line to import data in to collectionName
        //import file should locate in the R/import folder
        var cmd = 'mongoimport -d ROIDB -c '+collectionName+' R/import/'+collectionName+'.json';
        var exec = require('child_process').exec;
        var last = exec(cmd);
        last.stdout.on('data', function (data) {
            console.log('output:' + data);
        });
        last.on('exit', function (code) {
            //code 0 --> success    code >1  --> fail
            console.log("import action finished. code:" + code);
            return !code;

        });
    },
    exportCollection:function (collectionName){
        // use child process to run termial commend line to import data in to collectionName
        //import file should locate in the R/import folder
        var cmd = 'mongoexport -d ROIDB -c '+collectionName+' -o R/import/'+collectionName+'.json';
        var exec = require('child_process').exec;
        var last = exec(cmd);
        last.stdout.on('data', function (data) {
            console.log('output:' + data);
        });
        last.on('exit', function (code) {
            //code 0 --> success    code >1  --> fail
            console.log("import action finished. code:" + code);
            return !code;

        });
    }
};



module.exports = Importmodule;