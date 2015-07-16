/**
 * Created by ypling on 5/4/15.
 */
'use strict';

var app = angular.module('ROIClientApp', ['ngRoute', 'ui.bootstrap', 'ngSanitize','CompareChart'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/planforward', {
                templateUrl: './views/planforward.html',
                controller: 'forwardCtrl'
            })
            .when('/lookback', {
                templateUrl: './views/lookback.html',
                controller: 'backCtrl'
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
            .when('/planforward/save', {
                templateUrl: './views/planforward/save.html',
                controller: 'savePlanCtrl'
            })
            .otherwise({
                templateUrl: './views/dashboard.html',
                controller: ''
            })
    });





app.factory('actionObjInfo',function(){
    var actionObjInfo = [];
    return actionObjInfo;
});

app.factory('planforwardSaveInfo',function(){
    var planforwardSaveInfo = {};
    return planforwardSaveInfo;
});


app.controller("indexCtrl", function ($scope) {
    $scope.users = {};
    $scope.users.name = "Ed";
    $scope.users.recentlyLoginDate = new Date();
});

app.controller("savePlanCtrl", function ($scope,$http) {
    console.log('saveCtrl work');
    //$scope.savePlanForwardId = planforwardSaveInfo.id;
    $scope.message = "hello";
    $scope.savePlanForward = function(){
        var sendData = {};
        $http.post('/scenarios',sendData).success(function(data){
            if(data) alert("saved!");
    });
    };  
    
});


app.controller("scenariosCompareCtrl", function ($scope,$http,actionObjInfo) {
    var compareList = {};
    $http.get('/scenarios/'+actionObjInfo[0]).success(function(data){
           compareList.first = data;
    });
    $http.get('/scenarios/'+actionObjInfo[1]).success(function(data){
           compareList.second = data;
    });
});