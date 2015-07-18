/**
 * Created by ypling on 5/4/15.
 */
'use strict';

var app = angular.module('ROIClientApp', ['ngRoute', 'ui.bootstrap', 'ngSanitize','CompareChart','forwardModule'])
    .config(function ($routeProvider) {
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
                controller: 'forwardCtrl'
            })
            .when('/planforward/save', {
                templateUrl: './views/constrictedInput.html',
                controller: 'forwardSaveCtrl'
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

app.controller("indexCtrl", function ($scope,user) {
    user.getUser(function(user){
        $scope.user= user;

    });
    $scope.user.name='mike';

});

app.controller("savePlanCtrl", function ($scope,$http) {
    console.log('saveCtrl work');

    $scope.savePlanForward = function(){
        var sendData = {};
        $http.post('/scenarios',sendData).success(function(data){
            if(data) alert("saved!");
    });
    };  
    
});
app.factory('user',function(){
    var user={};
    user.name="Ed";
    user.recentlyLoginDate = new Date();
    return {
        getUser:function(cb){
            cb(user)
        }
    }
});