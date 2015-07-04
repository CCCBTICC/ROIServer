var mongoose = require('mongoose');
var ScenarioSchema = require('../schemas/scenario');
var Scenario = mongoose.model('Scenario', ScenarioSchema)

module.exports = Scenario;