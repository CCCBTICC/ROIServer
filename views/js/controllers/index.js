/**
 * Created by l.li on 7/19/15.
 */
define(['app'],function(app){
    app.controller("indexCtrl", function ($scope) {
        $scope.users = {};
        $scope.users.name = "Ed";
        $scope.users.recentlyLoginDate = new Date();
    });
});

