/**
 * Created by l.li on 7/16/15.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');



// init the file changed variable as false
var tmpFileCheck = false;

    //  first step  Algorithm = 1    *****init ****** start ******
	router.post('/planforwardInitial', function(req, res) {
        //read dummy_data output folder
       res.send(JSON.parse(fs.readFileSync('dummy_data/output/input_temp.json', 'utf-8')));
    });

    //  first step  Algorithm = 1    *****init ****** end ******

    //  second step  Algorithm = 2    ****** run ****** start *****

    //  using post method to get the data and let R run 
    router.post('/sendR', function(req, res){
       // response the sendR post request 
        res.send({post:"ture"});

        setTimeout(function(){
            tmpFileCheck = true;
        },1000*10);
        
    });

    // using get method to get the global variable tmpFileCheck to check the input_temp file change
    router.post('/testGet', function(req, res) {
        var data;
        var data = {'test':false, 'outputData':{}};
        if(tmpFileCheck){
            data.test = true;
            data.outputData = res.send(JSON.parse(fs.readFileSync('dummy_data/output/input_temp_run.json', 'utf-8')));
            //init as defult
            tmpFileCheck = false;
        }else{
            res.json(data); 
        }
        console.log(data);
        
    });

    //  second step  Algorithm = 2    ****** run ****** start *****




module.exports = router;