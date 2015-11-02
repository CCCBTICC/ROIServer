/**
 * Created by ypling on 5/4/15.
 */
'use strict';

var app = angular.module('ROIClientApp', ['ngRoute', 'ui.bootstrap', 'ngSanitize', 'CompareChart', 'forwardModule']);
app.config(function ($routeProvider) {
    $routeProvider
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
    $scope.login.remember=false;
    if(localStorage.getItem('ROIUserName')){
        console.log('set the localStorage');
        $scope.login.username = localStorage.getItem('ROIUserName');
        $scope.login.password = localStorage.getItem('ROIPassword');
        $scope.login.remember=true;
    }else{
        console.log('dont have  the localStorage copy');
        $scope.login.username = '';
        $scope.login.password = '';
    }

    $scope.login.authResult = '';
    $scope.login.error = {username : false, password: false};
    $scope.signIn = function () {
        $scope.login.error = {username : false, password: false};
        console.log("signin");
        $http({
            method: 'post',
            url: "http://" + window.location.hostname + ":3001/users/",
            data: {action: 'login', data: $scope.login}
        }).success(function (res) {
            console.log(res);
            switch  (res.authResult) {
                case 'falseUserName':
                    console.log('uncorrectUsername');
                    $scope.login.error.username = true;
                    break;
                case 'falsePassword':
                    console.log('uncorrectPassword');
                    $scope.login.error.password = true;
                    break;
                case 'success':
                    window.sessionStorage.setItem('username', res.username);
                    window.sessionStorage.setItem('loginedTime', res.loginedTime);
                    $scope.rememberCheck();
                    window.location.href = ('http://' + window.location.hostname + ':3001/home.html');
                    break;
            }

            //if (!res.authResult) {
            //    window.sessionStorage.setItem('username', res.username);
            //    window.location.href = ('http://' + window.location.hostname + ':3001/home.html');
            //} else {
            //    if(res.authResult ==='falseUserName'){
            //        console.log('uncorrectUsername');
            //    }else{
            //    console.log('uncorrectPassword');
            //    }
            //}
        });
    };
    $scope.rememberCheck = function (){
        console.log($scope.login);
        if ($scope.login.remember) {
            localStorage.setItem('ROIUserName',$scope.login.username) ;
            localStorage.setItem('ROIPassword',$scope.login.password) ;
        } else {
            localStorage.removeItem('ROIUserName');
            localStorage.removeItem('ROIPassword');
        }
    }
});
app.controller("indexCtrl", function ($scope, user) {
    console.log(window.sessionStorage);
    //var
    var username = window.sessionStorage.getItem('username');
    //function declare
    $scope.logout = function () {
        window.sessionStorage.removeItem('username');
        window.sessionStorage.removeItem('loginedTime');
        window.location.href = ('http://' + window.location.hostname + ':3001/index.html');
    };
    $scope.help=function(){
        var link = document.createElement('a');
        //link.href = 'http://tinyurl.com/sfly-roi-fback';
       // link.href = 'https://docs.google.com/document/d/1c6mq7FlHA69d23tmB7Q4jnDbzbSSinp1dTSbrPyj3gY/edit?usp=sharing';
       link.href='https://drive.google.com/file/d/0B1H50Y7riNUyRnF2YXNNNEhJU1k/view?usp=sharing';
        link.target="_blank";
        link.click();
    };
    //main
    if (!username) {
        //console.log(username);
        $scope.logout();
    } else {
        //console.log("in else");
        //console.log(username);
        user.setUser(username);
        user.getUser(function (user) {
            $scope.user = user;
        });
    }
});
app.factory('user', function ($http) {
    var user = {};
    var userUrl = "http://" + window.location.hostname + ":3001/users";
    var loginedTime = window.sessionStorage.getItem('loginedTime');
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
            user.recentlyLoginDate = loginedTime;
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
            if (historyDate.length) {
                cb(historyDate);
            }
            else {
                $http.get(historyUrl).success(function (res) {
                        historyDate = res;
                        cb(historyDate);
                    });
            }
        },
        getHistoryData: function (begin, end, cb) {
            var data = {begin: begin, end: end};
            post(data, function (res) {
                var sum = {DMS:{}};
                Object.keys(res[0]).forEach(function (key) {
                    sum[key] = 0;
                    res.forEach(function (month) {
                        sum[key] += Number(month[key]);
                    });
                });
                res.forEach(function (month) {
                    sum.DMS[month.Month] = month.DM;
                });
                console.log(sum);
                cb(sum);
            });
        }
    }
})
;
app.filter('name', function () {
    return function (input, scope) {
        if (input != null){
            input = input.toLowerCase();
        return input.substring(0, 1).toUpperCase() + input.substring(1);}
    }
});
app.filter('startFrom', function() {
    return function(input, start) {
        if(input[0]){
            start = +start; //parse to int
            return input.slice(start);}
    }
});