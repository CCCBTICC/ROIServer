/**
 * Created by l.li on 7/19/15.
 */
define(['app','planForwardPageModule'],function(app){
    app.config(function ($routeProvider, $locationProvider) {
            $routeProvider
                .when('/planforward', {
                    templateUrl: './views/planforward.html',
                    controller: 'forwardCtrl'
                })
                //.when('/lookback', {
                //    templateUrl: './views/lookback.html',
                //    controller: 'backCtrl'
                //})
                //.when('/myscenarios', {
                //    templateUrl: './views/myscenarios/list.html',
                //    controller: 'scenariosCtrl'
                //})
                //.when('/myscenarios/compare', {
                //    templateUrl: './views/myscenarios/compare.html',
                //    controller: 'scenariosCompareCtrl'
                //})
                //.when('/myscenarios/export', {
                //    templateUrl: './views/myscenarios/export.html',
                //    controller: 'scenariosExportCtrl'
                //})
                //.when('/myscenarios/share', {
                //    templateUrl: './views/myscenarios/share.html',
                //    controller: 'scenariosShareCtrl'
                //})
                //.when('/lookback/save', {
                //    templateUrl: './views/lookback/edit.html',
                //    controller: 'saveLookCtrl'
                //})
                //.when('/planforward/save', {
                //    templateUrl: './views/planforward/edit.html',
                //    controller: 'savePlanCtrl'
                //})
                .otherwise({
                    templateUrl: './views/dashboard.html',
                    controller: ''
                })
        });


    //app.controller("savePlanCtrl", function ($scope, $http) {
    //    console.log('saveCtrl work');
    //
    //    $scope.savePlanForward = function () {
    //        var sendData = {};
    //        $http.post('/scenarios', sendData).success(function (data) {
    //            if (data) alert("saved!");
    //        });
    //    };
    //});
});