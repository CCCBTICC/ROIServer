/**
 * Created by Chenghuijin on 2015/7/22.
 */
define(['../module'],function(module){
    module.controller('backOutputCtrl', ['$scope', 'backManager',  function ($scope, manager) {
        $scope.lookBack={};
        $scope.lookBack.output={};
        var count;
        $scope.getJson = false;
        count = setInterval(doGet, 1000 * 1); //set frequency
        function doGet() {
            if ($scope.getJson === false) {
                manager.getData(function (data) {
                    if (data) {
                        console.log("from init");
                        console.log(data);
                        $scope.getJson = true;
                        $scope.lookBack.output = data;

                    }
                });
            }
            else {
                clearInterval(count);
            }
        }

        $scope.$on('$destroy', function () {
            clearInterval(count);
        });
    }]);
});