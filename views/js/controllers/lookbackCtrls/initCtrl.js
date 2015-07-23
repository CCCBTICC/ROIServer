/**
 * Created by Chenghuijin on 2015/7/22.
 */
define(['controllers',function(back){
    back.controller('backInitCtrl', ['$scope', 'backManager', 'user', function ($scope, manager, user) {
        // tooltips
        $scope.brandTooltips = 'brandTooltips';
        $scope.attrTooltips = 'attrTooltips';
        $scope.beginPeriodTooltips = 'beginPeriodTooltips';
        $scope.endPeriodTooltips = 'endPeriodTooltips';


        // Calendar settings
        $scope.opened = {};
        $scope.format = 'MMMM-dd-yyyy';
        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1,
            minMode: 'month'
        };
        $scope.maxDate = new Date('2014', '11', '30');
        $scope.today = function () {
            var date = new Date();
            $scope.lookBack.beginPeriod = new Date(date.getFullYear(), date.getMonth() - 1, 1);
            $scope.lookBack.endPeriod = new Date(date.getFullYear(), date.getMonth(), 0);
            $scope.maxDate = new Date();
            $scope.maxDate.setMonth($scope.maxDate.getMonth() - 1);
        };
        $scope.open = function ($event, model) {
            $event.preventDefault();
            $event.stopPropagation();

            if (model === 'lookBackBeginPeriod') {
                $scope.opened.lookBackBeginPeriod = !$scope.opened.lookBackBeginPeriod;
                $scope.opened.lookBackEndPeriod = false;
            } else {
                $scope.minDate = new Date($scope.lookBack.beginPeriod);
                $scope.opened.lookBackEndPeriod = !$scope.opened.lookBackEndPeriod;
                $scope.opened.lookBackBeginPeriod = false;
            }
        };
        $scope.getLastDate = function () {
            $scope.lookBack.endPeriod = new Date($scope.lookBack.endPeriod);
            $scope.lookBack.endPeriod = new Date($scope.lookBack.endPeriod.getFullYear(), $scope.lookBack.endPeriod.getMonth() + 1, 0);
        };
        //calendar settings -END-

        // init data default
        $scope.initForm = function () {
            console.log('from init');
            $scope.lookBack = {};

            // Brand
            $scope.brands = ['Shutterfly'];
            $scope.lookBack.brand = $scope.brands[0];
            // Attribution
            $scope.lookBack.attribution = 'MTA';
            // spend
            $scope.lookBack.spend = 50000000;
            // Include data through
            $scope.lookBack.include = true;
            // Calendar
            $scope.today();
            // init input
            $scope.lookBack.init = {};
        };
        $scope.initForm();

        //get User Info
        user.getUser(function (user) {
            $scope.user = user;
        });
        // get data template
        manager.getTempData(function (data) {
            $scope.lookBack.init = data;
        });
        //set tempData
        $scope.nextPage = function () {
            console.log('clicked');
            var length = ($scope.lookBack.endPeriod.getFullYear() - $scope.lookBack.beginPeriod.getFullYear()) * 12 + $scope.lookBack.endPeriod.getMonth() - $scope.lookBack.beginPeriod.getMonth() + 1;
            // first step input init
            $scope.lookBack.init.UserName = $scope.user.name;
            $scope.lookBack.init.Brand = $scope.lookBack.brand;
            $scope.lookBack.init.lmTouch = $scope.lookBack.attribution === 'LTA' ? 'Last Touch' : 'Multi-Touch';
            $scope.lookBack.init.StartingTime = $scope.lookBack.beginPeriod;
            $scope.lookBack.init.EndingTime = $scope.lookBack.endPeriod;
            $scope.lookBack.init.Spend = $scope.lookBack.spend;
            $scope.lookBack.init.PlanMonths = length;
            manager.setTempData($scope.lookBack.init);
            console.log("data updated");
        };
    }]);
}]);