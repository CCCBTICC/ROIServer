/**
 * Created by l.li on 7/16/15.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var Rmodule = require('./modules/Rmodule');


    //  first step  Algorithm = 1    *****init ****** start ******
    /*
    router.post('/planforward', function(req, res) {
    // use Rmodule.initRCompute function to write file and use commend line to send file to R
    // return value is the generated file by R in R/output folder
    var outputInit = Rmodule.initRCompute(req.body);
    res.send(outputInit);   
    });
    //  first step  Algorithm = 1    *****init ****** end ******
    */
    //  second step  Algorithm = 2    ****** run ****** start *****

    //  using post method to get the data and let R run 
    router.post('/planforward', function(req, res){

    //mongodb    req.body.data   add  ---- 
    //         filename =     find(_id)



    //  use Rmodule.sendRcompute function to write file and use commend line to send file to R
    var status = Rmodule.sendRcompute(filename, req.body.data);
    // response the sendR post request 
    res.send({post: status});   
    });

    // using get method to  check the file change
    router.get('/testGet':filename, function(req, res) {
        //init the response value as false
        var data = {'test':false, 'outputData':{}};
        // check the req.filename file exist or not 
        var exist = fs.existsSync('R/output/'+ filename +'.json');
        if(exist){
            data.outputData = JSON.parse(fs.readFileSync('R/output/'+ filename +'.json', 'utf-8'));
            data.test = true;
            res.send(data);
        }else{
            data.outputData = {};
            data.test = false;
            res.send(data);
        }
        console.log(data);
    });

    //  second step  Algorithm = 2    ****** run ****** start *****

module.exports = router;