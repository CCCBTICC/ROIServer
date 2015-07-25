/**
 * Created by ypling on 5/4/15.
 */
'use strict';

var app = angular.module('ROIClientApp', ['ngRoute', 'ui.bootstrap', 'ngSanitize', 'CompareChart', 'forwardModule'])
    .config(function ($routeProvider) {
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
            .when('/planforward/save', {
                templateUrl: './views/planforward/save.html',
                controller: 'forwardSaveCtrl'
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
            .when('/lookback/save', {
                templateUrl: './views/lookback/save.html',
                controller: 'backSaveCtrl'
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
            .when('/lookback/save', {
                templateUrl: './views/lookback/save.html',
                controller: 'saveLookCtrl'
            })
            .when('/planforward/edit', {
                templateUrl: './views/planforward/save.html',
                controller: 'savePlanCtrl'
            })
            .otherwise({
                templateUrl: './views/dashboard.html',
                controller: ''
            })
    });

app.controller("loginCtrl", function ($scope, user, $http) {
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
                user.setUser($scope.login.username);
                window.location.href=('http://' + window.location.hostname + ':3001/home.html');
            } else {
                console.log('uncorrect')
            }
        });
    };
});
app.controller("indexCtrl",function($scope,user){
    user.getUser(function(user){
        console
        $scope.user=user;
    });
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
app.factory('user', function () {
    var user = {};
        user.name="user1";
        user.recentlyLoginDate =new Date();
    return {
        getUser: function (cb) {
            cb(user)
        },
        setUser: function (name) {
            user.name = name;
            user.recentlyLoginDate=new Date();
            console.log(user);
        }
    }
});