/**
 * Created by l.li on 7/22/15.
 */

var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var dbURL = 'mongodb://localhost:27017/ROIDB';

MongoClient.connect(dbURL, function (err, db) {
    assert.equal(null, err);
    console.log('mongoDB conntected');
    //
    db.collection('users').removeMany(function () {
        db.collection('users').insertMany(
            [
                {
                    username: 'user1',
                    password: 'test',
                    scenarios: []
                },
                {
                    username: 'user2',
                    password: 'test',
                    scenarios: []
                }
            ],
            {w:1},
            function(){
                console.log('user data inited');
            }
        );
    });
});
