/**
 * Created by Haizhou on 5/8/2015.
 */
'use strict';
var back = angular.module("ROIClientApp");
back.factory('backManager', function ($http) {
    var tempData = {
        "UserName": "",
        "Brand": "",
        "lmTouch": "",
        "StartingTime": "",
        "EndingTime": "",
        "Spend": "",
        "PlanMonths": "",
        "Algorithm": "",
        "AlgStartingTime": "",
        "AlgEndingTime": "",
        "AlgDuration": "",
        "semLB": "",
        "semCLB": "",
        "semPLB": "",
        "semOLB": "",
        "semBLB": "",
        "disLB": "",
        "socLB": "",
        "affLB": "",
        "parLB": "",
        "semMin": "",
        "semCMin": "",
        "semPMin": "",
        "semOMin": "",
        "semBMin": "",
        "disMin": "",
        "socMin": "",
        "affMin": "",
        "parMin": "",
        "semMax": "",
        "semCMax": "",
        "semPMax": "",
        "semOMax": "",
        "semBMax": "",
        "disMax": "",
        "socMax": "",
        "affMax": "",
        "parMax": "",
        "semUB": "",
        "semCUB": "",
        "semPUB": "",
        "semOUB": "",
        "semBUB": "",
        "disUB": "",
        "socUB": "",
        "affUB": "",
        "parUB": "",
        "semSF": "",
        "semCSF": "",
        "semPSF": "",
        "semOSF": "",
        "semBSF": "",
        "disSF": "",
        "socSF": "",
        "affSF": "",
        "parSF": "",
        "dirSpendM1": "",
        "dirSpendM2": "",
        "dirSpendM3": "",
        "tvBeginDate": "",
        "tvEndDate": "",
        "tvImpressions": "",
        "tvSpend": "",
        "semSR": "",
        "semCSR": "",
        "semPSR": "",
        "semOSR": "",
        "semBSR": "",
        "disSR": "",
        "socSR": "",
        "affSR": "",
        "parSR": "",
        "totSR": "",
        "semPR": "",
        "semCPR": "",
        "semPPR": "",
        "semOPR": "",
        "semBPR": "",
        "disPR": "",
        "socPR": "",
        "affPR": "",
        "parPR": "",
        "totPR": "",
        "run1RevRange": "",
        "run1ProjROI": "",
        "run1ROIRange": "",
        "semSlideLeft": "",
        "semCSlideLeft": "",
        "semPSlideLeft": "",
        "semOSlideLeft": "",
        "semBSlideLeft": "",
        "disSlideLeft": "",
        "socSlideLeft": "",
        "affSlideLeft": "",
        "parSlideLeft": "",
        "semSlide": "",
        "semCSlide": "",
        "semPSlide": "",
        "semOSlide": "",
        "semBSlide": "",
        "disSlide": "",
        "socSlide": "",
        "affSlide": "",
        "parSlide": "",
        "semSlideRight": "",
        "semCSlideRight": "",
        "semPSlideRight": "",
        "semOSlideRight": "",
        "semBSlideRight": "",
        "disSlideRight": "",
        "socSlideRight": "",
        "affSlideRight": "",
        "parSlideRight": "",
        "semSlideDivMin": "",
        "semCSlideDivMin": "",
        "semPSlideDivMin": "",
        "semOSlideDivMin": "",
        "semBSlideDivMin": "",
        "disSlideDivMin": "",
        "socSlideDivMin": "",
        "affSlideDivMin": "",
        "parSlideDivMin": "",
        "semSlideDivMax": "",
        "semCSlideDivMax": "",
        "semPSlideDivMax": "",
        "semOSlideDivMax": "",
        "semBSlideDivMax": "",
        "disSlideDivMax": "",
        "socSlideDivMax": "",
        "affSlideDivMax": "",
        "parSlideDivMax": "",
        "semAS": "",
        "semCAS": "",
        "semPAS": "",
        "semOAS": "",
        "semBAS": "",
        "disAS": "",
        "socAS": "",
        "affAS": "",
        "parAS": "",
        "totAS": "",
        "semAR": "",
        "semCAR": "",
        "semPAR": "",
        "semOAR": "",
        "semBAR": "",
        "disAR": "",
        "socAR": "",
        "affAR": "",
        "parAR": "",
        "totAR": "",
        "run2ProjROI": ""
    };
    var Name = "";
    var url = "http://" + window.location.hostname + ":3001/analysis/";
    var get = function (cb) {
        $http({
            method: 'get',
            url: url + Name
        }).success(function (data) {
            cb(data);

        }).error(function (data) {
            console.log(data);
        });
    };
    var post = function (data, cb) {
        $http({
            method: 'post',
            url: url + 'planforward',
            data: {data: data, username: data.UserName}
        }).success(function (fileName) {
            Name = fileName;
            cb(true);
        });
    };
    return {
        getTempData: function (cb) {
            cb(tempData);
        },
        setTempData: function (data) {
            tempData = data;
        },
        getData: get,
        postData: post,
        getName: function (cb) {
            cb(Name);
        },
        setName: function (fileName) {
            Name = fileName;
        }
    }
});

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
    $scope.maxDate = new Date(2015, 4, 30);
    $scope.initDate = function () {
        var date = $scope.maxDate;
        $scope.lookBack.beginPeriod = new Date(date.getFullYear(), date.getMonth(), 1);
        $scope.lookBack.endPeriod = new Date(date.getFullYear(), date.getMonth() + 1, 0);
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
        var d = new Date($scope.lookBack.endPeriod);
        $scope.lookBack.endPeriod = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        $scope.modifyEndDate();
    };
    $scope.modifyEndDate = function () {
        var d = new Date($scope.lookBack.beginPeriod);
        if (d > $scope.maxDate) {
            d = $scope.maxDate
        }
        $scope.lookBack.beginPeriod = new Date(d.getFullYear(), d.getMonth(), 1);


        if (new Date($scope.lookBack.beginPeriod.getFullYear(), $scope.lookBack.beginPeriod.getMonth() + 6, 0) < new Date($scope.maxDate.getFullYear(), $scope.maxDate.getMonth() + 1, 0)) {
            $scope.eMaxDate = new Date($scope.lookBack.beginPeriod.getFullYear(), $scope.lookBack.beginPeriod.getMonth() + 6, 0);
        } else {
            $scope.eMaxDate = new Date($scope.maxDate.getFullYear(), $scope.maxDate.getMonth() + 1, 0)
        }
        if ($scope.eMaxDate < $scope.lookBack.endPeriod) {
            $scope.lookBack.endPeriod = $scope.eMaxDate;
        }
        if ($scope.lookBack.beginPeriod > $scope.lookBack.endPeriod) {
            d = new Date($scope.lookBack.beginPeriod);
            $scope.lookBack.endPeriod = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        }
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
        $scope.initDate();
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

back.controller('backAddCtrl', ['$scope', 'backManager', '$location', function ($scope, manager, location) {
    $scope.lookBack = {};
    $scope.lookBack.output = {};
    $scope.spendTooltips = 'spendTooltips';
    $scope.includeTooltips = 'includeTooltips';
    manager.getTempData(function (data) {
            $scope.lookBack.output = data;
            $scope.lookBack.output.Spend = 5000000;
            $scope.lookBack.output.included = "true";
            console.log($scope.lookBack.output);
        }
    );
    $scope.run = function () {
        if ($scope.lookBack.output.include) {
            $scope.lookBack.output.dataThrough = $scope.lookBack.output.EndingTime;
        }
        else {
            var d = new Date($scope.lookBack.output.StartingTime);
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
            location.path('lookback/output');
        });
    }
}]);

back.controller('backOutputCtrl', ['$scope', 'backManager', '$location', function ($scope, manager, location) {

    $scope.lookBack = {};
    $scope.lookBack.output = {};

    $scope.compareChart = {};
    $scope.lookBack.output.semSD = 0;
    $scope.lookBack.output.disSD = 0;
    $scope.lookBack.output.socSD = 0;
    $scope.lookBack.output.affSD = 0;
    $scope.lookBack.output.parSD = 0;
    $scope.lookBack.output.totSD = 0;

    $scope.compareChart.data = [
        {title: "SEM", value: $scope.lookBack.output.semSD},
        {title: "Display", value: $scope.lookBack.output.disSD},
        {title: "Social", value: $scope.lookBack.output.socSD},
        {title: "Affiliates", value: $scope.lookBack.output.affSD},
        {title: "Partners", value: $scope.lookBack.output.parSD},
        {title: "Portfolio Total", value: $scope.lookBack.output.totSD}
    ];
    $scope.compareChart.config = {
        width: 800,
        height: 313,
        margin: {left: 100, top: 0, right: 100, bottom: 30}
    };


    manager.getName(function (name) {
        if (!name) {
            location.path("/lookback/init");
        }
    });
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

    $scope.showme = false;
    $scope.lookbackContentSize = 'col-sm-12';
    $scope.showGraph = 'Show Graph';
    $scope.toggle = function () {

        if ($scope.showme == false) {
            $scope.lookbackContentSize = 'col-sm-6';
            $scope.showme = true;
            $scope.showGraph = 'Hide Graph';
        }
        else {
            $scope.lookbackContentSize = 'col-sm-12';
            $scope.showme = false;
            $scope.showGraph = 'Show Graph';
        }
    };


    $scope.$on('$destroy', function () {
        clearInterval(count);
    });
}]);




