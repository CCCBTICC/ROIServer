/**
 * Created by ypling on 5/4/15.
 */
'use strict';

var app = angular.module('ROIClientApp', ['ngRoute', 'ui.bootstrap', 'ngSanitize', 'CompareChart', 'forwardModule']);
app.config(function ($routeProvider) {
    $routeProvider
        //.when('/',{
        //    templateUrl:'/index.html',
        //    controller:'indexCtrl'
        //})
        .when('/planforward/init', {
            templateUrl: './views/planforward/initialInput.html',
            controller: 'forwardInitCtrl'
        })
        .when('/planforward/constrict', {
            templateUrl: './views/planforward/constrictedInput.html',
            controller: 'forwardConstrictCtrl'
        })
        .when('/planforward/output', {
            templateUrl: './views/planforward/output.html',
            controller: 'forwardOutputCtrl'
        })
        .when('/planforward/edit', {
            templateUrl: './views/planforward/edit.html',
            controller: 'scenariosEditCtrl'
        })
        .when('/lookback/init', {
            templateUrl: './views/lookback/initialInput.html',
            controller: 'backInitCtrl'
        })
        .when('/lookback/add', {
            templateUrl: './views/lookback/additionalInput.html',
            controller: 'backAddCtrl'
        })
        .when('/lookback/output', {
            templateUrl: './views/lookback/output.html',
            controller: 'backOutputCtrl'
        })
        .when('/lookback/edit', {
            templateUrl: './views/lookback/edit.html',
            controller: 'scenariosEditCtrl'
        })
        .when('/myscenarios', {
            templateUrl: './views/myscenarios/list.html',
            controller: 'scenariosCtrl'
        })
        .when('/myscenarios/compare', {
            templateUrl: './views/myscenarios/compare.html',
            controller: 'scenariosCompareCtrl'
        })
        .when('/myscenarios/export', {
            templateUrl: './views/myscenarios/export.html',
            controller: 'scenariosExportCtrl'
        })
        .when('/myscenarios/share', {
            templateUrl: './views/myscenarios/share.html',
            controller: 'scenariosShareCtrl'
        })
        .when('/myscenarios/edit', {
            templateUrl: './views/myscenarios/edit.html',
            controller: 'scenariosEditCtrl'
        })
        .when('/lookback/edit', {
            templateUrl: './views/lookback/edit.html',
            controller: 'scenariosEditCtrl'
        })
        .when('/planforward/edit', {
            templateUrl: './views/planforward/edit.html',
            controller: 'scenariosEditCtrl'
        })
        .otherwise({
            templateUrl: './views/dashboard.html',
            controller: ''
        })
});

app.controller("loginCtrl", function ($scope, $http) {
    $scope.login = {};
    $scope.login.username = "user1";
    $scope.login.password = "test";
    $scope.signIn = function () {
        console.log("signin");
        $http({
            method: 'post',
            url: "http://" + window.location.hostname + ":3001/users/",
            data: {action: 'login', data: $scope.login}
        }).success(function (res) {
            if (res) {
                window.sessionStorage.setItem('username', res);
                window.location.href = ('http://' + window.location.hostname + ':3001/home.html');
            } else {
                console.log('uncorrect');
            }
        });
    };
});
app.controller("indexCtrl", function ($scope, user) {
    //var
    var username = window.sessionStorage.getItem('username');
    //function declare
    $scope.logout = function () {
        window.sessionStorage.removeItem('username');
        window.location.href = ('http://' + window.location.hostname + ':3001/index.html');
    };
    $scope.help=function(){
        //window.location.href = ('http://tinyurl.com/sfly-roi-fback');
        var link = document.createElement('a');
        link.href = 'http://tinyurl.com/sfly-roi-fback';
        link.target="_blank";
        link.click();
    };
    //main
    console.log(username);
    if (!username) {
        $scope.logout();
    } else {
        user.setUser(username);
        user.getUser(function (user) {
            $scope.user = user;
        });
    }
});
app.controller("savePlanCtrl", function ($scope, $http) {
    console.log('saveCtrl work');

    $scope.savePlanForward = function () {
        var sendData = {};
        $http.post('/scenarios', sendData).success(function (data) {
            if (data) alert("saved!");
        });
    };

});
app.factory('user', function ($http) {
    var user = {};
    user.recentlyLoginDate = new Date();
    var userUrl = "http://" + window.location.hostname + ":3001/users";
    var post = function (data, callback) {
        $http({
            method: 'post',
            url: userUrl,
            data: data
        }).success(callback);
    };
    return {
        getUser:function(cb){
            cb(user)
        },
        setUser: function (name) {
            user.name = name;
            user.recentlyLoginDate = new Date();
            console.log(user);
        },
        getUserList: function (username, cb) {
            var data = {
                action: 'userList',
                data: {username: username}
            };
            post(data, cb);
        }
    }
});
app.factory('history', function ($http) {
    var historyDate = [];
    var historyUrl = "http://" + window.location.hostname + ":3001/history/";
    var post = function (data, cb) {
        $http({
            method: 'post',
            url: historyUrl,
            data: data
        }).success(cb)
    };
    return {
        getHistoryDate: function (cb) {
            if (historyDate[0]) {
                cb(historyDate);
            }
            else {
                $http.get(historyUrl).success(function (res) {
                        historyDate = res;
                        cb(historyDate);
                    }
                );
            }
        },
        getHistoryData: function (begin, end, cb) {
            var data = {begin: begin, end: end};
            post(data, function (res) {
                console.log(res);
                var sum = {};
                Object.keys(res[0]).forEach(function (key) {
                    sum[key] = 0;
                    console.log(key);
                    res.forEach(function (month) {
                        sum[key] += Number(month[key]);
                        console.log(month[key])
                    });
                });
                cb(sum);
            });
        }
    }
})
;
app.filter('name', function () {
    return function (input, scope) {
        if (input != null)
            input = input.toLowerCase();
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    }
});