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

back.controller('backInitCtrl', ['$scope', 'backManager', 'user', 'history', function ($scope, manager, user, history) {
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
    history.getHistoryDate(function (d) {
        $scope.historydate = d;
    });
    var d = new Date($scope.historydate);
    $scope.maxDate = new Date(d.getFullYear(), d.getMonth() + 2, 0);
    //scope functions for calender settings
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
        if (!$scope.lookBack.endPeriod) {
            $scope.lookBack.endPeriod = $scope.lookBack.beginPeriod;
        }
        var d = new Date($scope.lookBack.endPeriod);
        $scope.lookBack.endPeriod = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        $scope.modifyEndDate();
    };
    $scope.modifyEndDate = function () {
        if (!$scope.lookBack.beginPeriod) {
            $scope.lookBack.beginPeriod = $scope.maxDate;
        }
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
        // first step input init
        $scope.lookBack.init.UserName = $scope.user.name;
        $scope.lookBack.init.Brand = $scope.lookBack.brand;
        $scope.lookBack.init.lmTouch = $scope.lookBack.attribution === 'LTA' ? 'Last Touch' : 'Multi-Touch';
        $scope.lookBack.init.StartingTime = $scope.lookBack.beginPeriod;
        $scope.lookBack.init.EndingTime = $scope.lookBack.endPeriod;
        manager.setTempData($scope.lookBack.init);
        console.log("data updated");
    };
}]);

back.controller('backAddCtrl', ['$scope', 'backManager', '$location', 'history', '$filter', function ($scope, manager, location, history, filter) {
    $scope.lookBack = {};
    $scope.lookBack.output = {};
    $scope.lookBack.history = {};
    $scope.spendTooltips = 'spendTooltips';
    $scope.includeTooltips = 'includeTooltips';

    //main
    manager.getTempData(function (data) {
            $scope.lookBack.output = data;
            history.getHistoryData($scope.lookBack.output.StartingTime, $scope.lookBack.output.EndingTime, function (dataArray) {
                console.log('from history in lookback/add');
                console.log(dataArray);
                Object.keys(dataArray[0]).forEach(function (key) {
                    var value = 0;
                    dataArray.forEach(function (data) {
                        value += data[key];
                    });
                    $scope.lookBack.history[key] = value;
                });
            });
            $scope.lookBack.output.Spend = 5000000;
            //$scope.lookBack.output.Spend = $scope.lookBack.history.Spend;
            $scope.lookBack.output.included = "false";
            console.log($scope.lookBack.output);
    });

    $scope.run = function () {

        if ($scope.lookBack.output.include) {
            $scope.lookBack.output.dataThrough = filter('date')($scope.lookBack.output.EndingTime, 'yyyy-MM');
        }
        else {
            var d = new Date($scope.lookBack.output.StartingTime);
            $scope.lookBack.output.dataThrough = new Date(d.getFullYear(), d.getMonth(), 0);
            $scope.lookBack.output.dataThrough = filter('date')($scope.lookBack.output.dataThrough, 'yyyy-MM');
        }
        //run1
        //// first step input init
        $scope.lookBack.output.StartingTime = filter('date')($scope.lookBack.output.StartingTime, 'yyyy-MM');
        $scope.lookBack.output.EndingTime = filter('date')($scope.lookBack.output.endPeriod, 'yyyy-MM');
        $scope.lookBack.output.Algorithm = 1;
        manager.postData($scope.lookBack.output, function (res) {
            var count,getJson;
            function doGet() {
                if ($scope.getJson === false) {
                    manager.getData(function (data) {
                        if (data) {
                            console.log("from doGet in forward/constrict after got Data");
                            console.log(data);
                            getJson = true;
                            $scope.lookBack.output1 = data;

                            //run2
                            $scope.lookBack.output1.Algorithm = 2;
                            $scope.lookBack.output1.AlgStartingTime = "";
                            $scope.lookBack.output1.AlgEndingTime = "";
                            $scope.lookBack.output1.AlgDuration = "";

                            var beginDay = new Date($scope.lookBack.output1.StartingTime);
                            beginDay = new Date(beginDay.getFullYear(), beginDay.getMonth() + 1, 1);
                            var endDay = new Date($scope.lookBack.output1.EndingTime);
                            endDay = new Date(endDay.getFullYear(), endDay.getMonth() + 1, 1);

                            $scope.lookBack.output1.scenarioId =
                                "SLFY-" + filter('date')(beginDay, 'MMMyyyy') +
                                "-" + filter('date')(endDay, 'MMMyyyy') + "-" +
                                $scope.lookBack.output1.lmTouch.charAt(0) + "-" + "000";
                            $scope.lookBack.output1.dataThrough = $scope.lookBack.output.dataThrough;
                            $scope.lookBack.output1.from = "back";

                            manager.postData($scope.lookBack.output1,function(res){
                                console.log(res);
                                location.path('lookback/output');
                            })
                        }
                    });
                }
                else {
                    clearInterval(count);
                }
            }
            console.log('from run1 in run back/add');
            console.log(res);
            if (res) {
                getJson = false;
                count = setInterval(doGet, 1000 * 1); //set frequency
            }
        });
    }
}]);

back.controller('backOutputCtrl', ['$scope', 'backManager', '$location','history',function ($scope, manager, location,history) {

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

    $scope.edit = function () {

        location.path('lookback/edit');
    };
    $scope.export = function () {

        location.path('myscenarios/export');
    };
    $scope.share = function () {

        location.path('myscenarios/share');
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
                    history.getHistoryData(function(data){
                        $scope.lookBack.history=data;
                    });

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




