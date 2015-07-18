/**
 * Created by l.li on 7/16/15.
 */
var express = require('express');
var router = express.Router();

router.get('/list',function(req,res){
    Scenario.find(function(err, scenarios) {
        if (err)
            res.send(err);

        res.json(scenarios);
    });
});

router.post('/',function(req,res){
    //var data = fs.readFileSync('R/output/input_temp_run.json', 'utf-8');
    

    var scenario = new Scenario(JSON.parse(data));

    scenario.save(function(err) {
        if (err)
            res.send(err);
        res.json(scenario);
    });
});

router.get('/:scenario_id',function(req,res){
    Scenario.findById(req.params.scenario_id, function(err, scenario) {
        if (err)
            res.send(err);
        res.json(scenario);
    });
});