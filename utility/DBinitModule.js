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
                    "lmtouch": null,
                    "Spend": "data.Spend",
                    "Revenue": "data.Revenue",
                    "Brand": null,
                    "Owner": null,
                    "Name": "",
                    "Note": "",
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
}

module.exports = {initDB:initDB};
