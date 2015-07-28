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
                    scenarios: [new ObjectID('55b068284038186f07f83a82')]
                },
                {
                    username: 'user2',
                    password: 'test',
                    scenarios: []
                },
                {
                    username: 'user3',
                    password: 'test',
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
                    "AlgStartingTime": "data.AlgStartingTime",
                    "StartingTime": null,
                    "EndingTime": "data.EndingTime",
                    "lmTouch": null,
                    "Spend": "data.Spend",
                    "Revenue": "data.Revenue",
                    "Brand": null,
                    "owner": "user1",
                    "name": "",
                    "note": "",
                    "Final": "No",
                    "DataThrough": null,
                    "Share": "No"
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
            console.log('output：' + data);
        });
        last.on('exit', function (code) {
            //code 0 --> success    code >1  --> fail
            console.log('import action finished. code：' + code);
        return !code;

        });
}

module.exports = {initDB:initDB,importCollection:importCollection};
