/**
 * Created by Chenghuijin on 2015/7/22.
 */
define(['controllers'],function(back){
    back.controller('backAddCtrl', ['$scope', 'backManager', function ($scope, manager) {
        $scope.lookBack = {};
        $scope.lookBack.output = {};
        $scope.spendTooltips = 'spendTooltips';
        $scope.includeTooltips = 'includeTooltips';
        manager.getTempData(function (data) {
                $scope.lookBack.output = data;
                $scope.lookBack.output.Spend = 5000000;
                $scope.lookBack.output.included="true";
                console.log($scope.lookBack.output);
            }
        );
        $scope.run = function () {
            if($scope.lookBack.output.include){
                $scope.lookBack.output.dataThrough=$scope.lookBack.output.EndingTime;
            }
            else{
                var d =   new Date($scope.lookBack.output.StartingTime);
                if (d.getMonth() < 9) {
                    $scope.lookBack.output.dataThrough = d.getFullYear() + '-0' + (d.getMonth() + 1);
                }
                else {
                    $scope.lookBack.output.dataThrough = d.getFullYear() + '-' + (d.getMonth() + 1);
                }
            }
            $scope.lookBack.output.Algorithm = 2;
            console.log($scope.lookBack.output.Algorithm);
            manager.postData($scope.lookBack.output, function (result) {
                console.log(result);
            });
        }
    }]);
});