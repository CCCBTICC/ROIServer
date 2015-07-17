/**
 * Created by l.li on 7/16/15.
 */
var express = require('express');
var router = express.Router();

router.get('/list',function(req,res){
    var resData = ['test1','test2'];
    res.send(resData);
});

router.post('/',function(req,res){
    var reqData = req.body;
    //TODO:add switch logic base on reqData.action
    var resData = {test:'aaa',reqData:reqData};
    res.send(resData)
});

router.get('/:scenario_id',function(req,res){
    var resData = {test:'test'};
    res.send(resData);
});

module.exports = router;