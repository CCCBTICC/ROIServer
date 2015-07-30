/**
 * Created by Chenghuijin on 2015/7/22.
 */
define(['controllers'],function(Ctrls){
    Ctrls.controller('forwardInitCtrl', ['$scope', 'forwardManager', 'user', function ($scope, manager, user) {
        // Calendar settings
        $scope.opened = {};
        $scope.format = 'MMMM-dd-yyyy';
        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1,
            minMode: 'month'
        };
        $scope.minDate = new Date('2014', '6', '01');
        $scope.maxDate = new Date('2014', '11', '30');

        //adjust the date for the R Algorithm version 1.0
        $scope.today = function () {
            var date = new Date();
            $scope.planForward.beginPeriod = new Date(date.getFullYear(), date.getMonth(), 1);
            $scope.planForward.endPeriod = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            $scope.eMaxDate = new Date($scope.planForward.beginPeriod.getFullYear(), $scope.planForward.beginPeriod.getMonth() + 6, 0);

        };
        $scope.open = function ($event, model) {
            $event.preventDefault();
            $event.stopPropagation();
            if (model === 'planForwardBeginPeriod') {
                $scope.opened.planForwardBeginPeriod = !$scope.opened.planForwardBeginPeriod;
                $scope.opened.planForwardEndPeriod = false;
            } else {
                $scope.opened.planForwardEndPeriod = !$scope.opened.planForwardEndPeriod;
                $scope.opened.planForwardBeginPeriod = false;
            }
        };
        $scope.getLastDate = function () {
            var d = new Date($scope.planForward.endPeriod);
            $scope.planForward.endPeriod = new Date(d.getFullYear(), d.getMonth() + 1, 0);
            $scope.modifyEndDate();
        };
        $scope.modifyEndDate = function () {
            d = new Date($scope.planForward.beginPeriod);
            $scope.planForward.beginPeriod = new Date(d.getFullYear(), d.getMonth(), 1);
            if (new Date($scope.planForward.beginPeriod.getFullYear(), $scope.planForward.beginPeriod.getMonth() + 6, 0) < new Date($scope.minDate.getFullYear(), $scope.minDate.getMonth() + 9, 0)) {
                $scope.eMaxDate = new Date($scope.planForward.beginPeriod.getFullYear(), $scope.planForward.beginPeriod.getMonth() + 6, 0);
            } else {
                $scope.eMaxDate = new Date($scope.minDate.getFullYear(), $scope.minDate.getMonth() + 9, 0)
            }
            if ($scope.eMaxDate < $scope.planForward.endPeriod) {
                $scope.planForward.endPeriod = $scope.eMaxDate;
            }
            if ($scope.planForward.beginPeriod > $scope.planForward.endPeriod) {
                var d = new Date($scope.planForward.beginPeriod);
                $scope.planForward.endPeriod = new Date(d.getFullYear(), d.getMonth() + 1, 0);
            }
        };
        // calender settings END

        // init data default
        $scope.initForm = function () {
            $scope.planForward = {};
            $scope.brands = ['Shutterfly'];
            $scope.planForward.brand = $scope.brands[0];
            // Attribution
            $scope.planForward.attribution = 'LTA';
            //
            $scope.planForward.spend = "500000";
            // Calendar
            $scope.today();
            // init data
            $scope.planForward.init = {};


            // tooltips
            $scope.brandTooltips = 'brandTooltips';
            $scope.attrTooltips = 'attrTooltips';
            $scope.beginPeriodTooltips = 'beginPeriodTooltips';
            $scope.endPeriodTooltips = 'endPeriodTooltips';
            $scope.spendTooltips = 'spendTooltips';
            //$scope.includeTooltips = 'includeTooltips';
        };
        $scope.initForm();
        //get User Info
        user.getUser(function (user) {
            $scope.user = user;
        });
        // get data template
        manager.getTempData(function (data) {
            $scope.planForward.init = data;
        });

        // post data to R
        $scope.CInput = function () {
            var length = ($scope.planForward.endPeriod.getFullYear() - $scope.planForward.beginPeriod.getFullYear()) * 12 + $scope.planForward.endPeriod.getMonth() - $scope.planForward.beginPeriod.getMonth() + 1;

            // first step input init
            $scope.planForward.init.UserName = $scope.user.name;
            $scope.planForward.init.Brand = $scope.planForward.brand;
            $scope.planForward.init.lmTouch = $scope.planForward.attribution === 'LTA' ? 'Last Touch' : 'Multi-Touch';
            if ($scope.planForward.beginPeriod.getMonth() < 9) {
                $scope.planForward.init.StartingTime = $scope.planForward.beginPeriod.getFullYear() + '-0' + ($scope.planForward.beginPeriod.getMonth() + 1);
            }
            else {
                $scope.planForward.init.StartingTime = $scope.planForward.beginPeriod.getFullYear() + '-' + ($scope.planForward.beginPeriod.getMonth() + 1);
            }
            if ($scope.planForward.endPeriod.getMonth() < 9) {
                $scope.planForward.init.EndingTime = $scope.planForward.endPeriod.getFullYear() + '-0' + ($scope.planForward.endPeriod.getMonth() + 1);
            }
            else {
                $scope.planForward.init.EndingTime = $scope.planForward.endPeriod.getFullYear() + '-' + ($scope.planForward.endPeriod.getMonth() + 1);
            }
            $scope.planForward.init.Spend = $scope.planForward.spend;
            $scope.planForward.init.PlanMonths = length;
            $scope.planForward.init.Algorithm = 1;

            manager.postData($scope.planForward.init, function (res) {
                console.log(res);
            });
        };
    }]);
});