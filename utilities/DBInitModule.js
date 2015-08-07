/**
 * Created by l.li on 7/22/15.
 */

var mongoDB = require('mongodb');
var ObjectID = mongoDB.ObjectID;

function initDB(db) {
    db.collection('users').removeMany(function () {
        db.collection('users').insertMany(
            [
                {
                    username: 'user1',
                    password: 'test',
                    scenarios: []
                },
                {
                    username: 'Jorie',
                    password: 'Jorie',
                    scenarios: []
                },
                {
                    username: 'Ed',
                    password: 'Ed',
                    scenarios: []
                },
                {
                    username: 'Ben',
                    password: 'Ben',
                    scenarios: []
                },
                {
                    username: 'Yun',
                    password: 'Yun',
                    scenarios: []
                },
                {
                    username: 'Sean',
                    password: 'Sean',
                    scenarios: []
                },
                {
                    username: 'David',
                    password: 'David',
                    scenarios: []
                },
                {
                    username: 'Ranny',
                    password: 'Ranny',
                    scenarios: []
                },
                {
                    username: 'Meena',
                    password: 'Meena',
                    scenarios: []
                },
                {
                    username: 'Mitra',
                    password: 'Mitra',
                    scenarios: []
                },
                {
                    username: 'Regina',
                    password: 'Regina',
                    scenarios: []
                },
                {
                    username: 'Nadir',
                    password: 'Nadir',
                    scenarios: []
                },
                {
                    username: 'Sara',
                    password: 'Sara',
                    scenarios: []
                },
                {
                    username: 'Kevin',
                    password: 'Kevin',
                    scenarios: []
                }

            ],
            {w: 1},
            function () {
                console.log('user data inited');
            }
        );
    });

    db.collection('scenarios').removeMany(function () {
        db.collection('scenarios').insertMany(
            [
                {
                    "_id": new ObjectID('55b068284038186f07f83a82'),
                    "scenarioId": "data.scenarioId",
                    "begin": null,
                    "end": "EndingTime",
                    "createDate": null,
                    "lmTouch": null,
                    "spend": "data.Spend",
                    "revenue": "data.Revenue",
                    "brand": null,
                    "owner": "user1",
                    "name": "data.name",
                    "note": "data.note",
                    "final": "No",
                    "dataThrough": null,
                    "included":"No",
                    "share": "No",
                    "exist":"false",
                    "from":null
                }
            ],
            {w: 1},
            function () {
                console.log('scenarios data inited');
            }
        );
    });

    db.collection('history').removeMany(function () {
            importCollection('history');
    });
}

function importCollection(collectionName){
        // use child process to run termial commend line to import data in to collectionName
        //import file should locate in the R/import folder
        var cmd = 'mongoimport -d ROIDB -c '+collectionName+' R/import/'+collectionName+'.json';
        var exec = require('child_process').exec;
        var last = exec(cmd);
        last.stdout.on('data', function (data) {
            console.log('output�?' + data);
        });
        last.on('exit', function (code) {
            //code 0 --> success    code >1  --> fail
            console.log('import action finished. code:' + code);
        return !code;

        });
}

module.exports = {initDB:initDB,importCollection:importCollection};
