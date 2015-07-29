/**
 * Created by Haizhou on 5/8/2015.
 */
'use strict';
var back = angular.module("ROIClientApp");

back.controller('backInitCtrl', ['$scope', 'forwardManager', 'user', 'history', function ($scope, manager, user, history) {
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
    $scope.logout = function () {
        window.sessionStorage.removeItem('username');
        window.location.href = ('http://' + window.location.hostname + ':3001/index.html');
    };
    $scope.initDate = function () {
        history.getHistoryDate(function (res) {
            console.log(res);
            $scope.historydate = res;
            var d = new Date($scope.historydate[1]);
            $scope.minDate = new Date($scope.historydate[0]);
            $scope.maxDate = new Date(d.getFullYear(), d.getMonth() + 2, 0);
            var date = $scope.maxDate;
            $scope.lookBack.beginPeriod = new Date(date.getFullYear(), date.getMonth(), 1);
            $scope.lookBack.endPeriod = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        });

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

    //main
    $scope.initForm();
    //get User Info
    user.getUser(function (user) {
        $scope.user = user;
        if(!user.name){$scope.logout()}
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
        $scope.lookBack.init.begin = $scope.lookBack.beginPeriod;
        $scope.lookBack.init.end = $scope.lookBack.endPeriod;
        manager.setTempData($scope.lookBack.init);
        console.log("data updated");
    };
}]);

back.controller('backAddCtrl', ['$scope', 'forwardManager', '$location', 'history', '$filter', function ($scope, manager, location, history, filter) {
    $scope.lookBack = {};
    $scope.lookBack.output = {};
    $scope.lookBack.history = {};
    $scope.spendTooltips = 'spendTooltips';
    $scope.includeTooltips = 'includeTooltips';

    //main
    manager.getTempData(function (data) {
        if (data.UserName) {

            $scope.lookBack.output = data;
            $scope.begin = filter('date')($scope.lookBack.output.begin, 'yyyy-MM');
            $scope.end = filter('date')($scope.lookBack.output.end, 'yyyy-MM');
            history.getHistoryData($scope.begin, $scope.end, function (data) {
                console.log('from history in lookback/add');
                console.log(data);
                $scope.lookBack.history = data;
                $scope.lookBack.output.Spend =
                    $scope.lookBack.history.SEM +
                    $scope.lookBack.history.Affiliate +
                    $scope.lookBack.history.Display +
                    $scope.lookBack.history.FB +
                    $scope.lookBack.history.Partners;

            });
            //$scope.lookBack.output.Spend = $scope.lookBack.history.Spend;
            $scope.lookBack.output.included = "false";
            console.log($scope.lookBack.output);
        } else {
            location.path('lookback/init')
        }
    });
    $scope.reRun = function () {
        $scope.lookBack.output1.Algorithm = 2;
        $scope.lookBack.output1.AlgStartingTime = "";
        $scope.lookBack.output1.AlgEndingTime = "";
        $scope.lookBack.output1.AlgDuration = "";
        //SCENARIOID
        var beginDay, endDay;
        beginDay = new Date($scope.lookBack.output1.StartingTime);
        beginDay = new Date(beginDay.getFullYear(), beginDay.getMonth() + 1, 1);
        endDay = new Date($scope.lookBack.output1.EndingTime);
        endDay = new Date(endDay.getFullYear(), endDay.getMonth() + 1, 1);
        $scope.lookBack.output1.scenarioId =
            "SLFY-" + filter('date')(beginDay, 'MMMyyyy') + "-" +
            filter('date')(endDay, 'MMMyyyy') + "-" +
            $scope.lookBack.output1.lmTouch.charAt(0) + "-" + "00X";
        //
        if ($scope.lookBack.output.included) {
            $scope.lookBack.output1.dataThrough = $scope.lookBack.output1.EndingTime;
        }
        else {
            var d = new Date($scope.lookBack.output1.StartingTime);
            $scope.lookBack.output1.dataThrough = new Date(d.getFullYear(), d.getMonth(), 1);
            $scope.lookBack.output1.dataThrough = filter('date')($scope.lookBack.output1.dataThrough, 'yyyy-MM');
        }
        console.log($scope.lookBack.output1.dataThrough);
        $scope.lookBack.output1.from = "back";
        //post data to R
        manager.postData($scope.lookBack.output1, function (res) {
            console.log(res);
            location.path('lookback/output');
        });
    };
    $scope.run = function () {
        //run1
        //// first step input init
        $scope.lookBack.output.StartingTime = $scope.begin;
        $scope.lookBack.output.EndingTime = $scope.end;
        $scope.lookBack.output.Algorithm = 1;
        manager.postData($scope.lookBack.output, function (res) {
            console.log('from run1 in run back/add');
            console.log(res);
            var count;
            $scope.getJson = false;
            count = setInterval(doGet, 1000 * 1); //set frequency
            function doGet() {
                if ($scope.getJson === false) {
                    manager.getData(function (data) {
                        if (data) {
                            console.log("from doGet in rerun in forward/output");
                            console.log(data);
                            $scope.getJson = true;
                            $scope.lookBack.output1 = data;
                            $scope.reRun();
                        }
                    });
                }
                else {
                    clearInterval(count);
                }
            }
        });
    }
}]);

back.controller('backOutputCtrl', ['$scope', 'forwardManager', '$location', 'history','scenarioManager', function ($scope, manager, location, history,scenarioManager) {

    $scope.lookBack = {};
    $scope.lookBack.output = {};
    $scope.lookBack.history = {}

    $scope.compareChart = {};
    $scope.lookBack.output.semSD = 10000;
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
    }; //finished
    $scope.export = function () {

        location.path('myscenarios/export');
    }; //pause
    $scope.share = function () {

        location.path('myscenarios/share');
    };  // pause
    //main
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
                    manager.getName(function (id) {
                        scenarioManager.editScenario(data.UserName, id, {exist: true}, function (res) {
                            console.log(res)
                        });
                    });
                    history.getHistoryData($scope.lookBack.output.StartingTime, $scope.lookBack.output.EndingTime, function (history) {
                        console.log(history);
                        $scope.lookBack.history.semSR = history.SEM;
                        $scope.lookBack.history.semBSR = history.SEMBrand;
                        $scope.lookBack.history.semCSR = history.SEMCard;
                        $scope.lookBack.history.semOSR = history.SEMOther;
                        $scope.lookBack.history.semPSR = history.SEMPBook;
                        $scope.lookBack.history.disSR = history.Display;
                        $scope.lookBack.history.affSR = history.Affiliate;
                        $scope.lookBack.history.socSR = history.FB;
                        $scope.lookBack.history.parSR = history.Partners;
                        $scope.lookBack.history.totSR =
                            history.Partners + history.FB + history.Affiliate + history.Display + history.SEM;
                        $scope.lookBack.history.totPR = history.Revenue;
                        $scope.lookBack.history.ROI = ($scope.lookBack.history.totPR / $scope.lookBack.history.totSR - 1)*100;
                        if ($scope.lookBack.output.lmTouch === "Multi-Touch") {
                            $scope.lookBack.history.semPR = history.SEM_MTA;
                            $scope.lookBack.history.disPR = history.Display_MTA;
                            $scope.lookBack.history.affPR = history.Affiliates_MTA;
                            $scope.lookBack.history.socPR = history.FB_MTA;
                            $scope.lookBack.history.parPR = history.Partners_MTA;
                        } else {
                            $scope.lookBack.history.semPR = history.SEM_LTA;
                            $scope.lookBack.history.disPR = history.Display_LTA;
                            $scope.lookBack.history.affPR = history.Affiliates_LTA;
                            $scope.lookBack.history.socPR = history.FB_LTA;
                            $scope.lookBack.history.parPR = history.Partners_LTA;
                        }
                        $scope.lookBack.output.semSD = $scope.lookBack.output.semSR - $scope.lookBack.history.semSR;
                        $scope.lookBack.output.semBSD = $scope.lookBack.output.semBSR - $scope.lookBack.history.semBSR;
                        $scope.lookBack.output.semCSD = $scope.lookBack.output.semCSR - $scope.lookBack.history.semCSR;
                        $scope.lookBack.output.semOSD = $scope.lookBack.output.semOSR - $scope.lookBack.history.semOSR;
                        $scope.lookBack.output.semPSD = $scope.lookBack.output.semPSR - $scope.lookBack.history.semPSR;
                        $scope.lookBack.output.disSD = $scope.lookBack.output.disSR - $scope.lookBack.history.disSR;
                        $scope.lookBack.output.affSD = $scope.lookBack.output.affSR - $scope.lookBack.history.affSR;
                        $scope.lookBack.output.socSD = $scope.lookBack.output.socSR - $scope.lookBack.history.socSR;
                        $scope.lookBack.output.parSD = $scope.lookBack.output.parSR - $scope.lookBack.history.parSR;
                        $scope.lookBack.output.totSD = $scope.lookBack.output.totSR - $scope.lookBack.history.totSR;

                        $scope.lookBack.output.semRD = $scope.lookBack.output.semPR - $scope.lookBack.history.semPR;
                        $scope.lookBack.output.disRD = $scope.lookBack.output.disPR - $scope.lookBack.history.disPR;
                        $scope.lookBack.output.affRD = $scope.lookBack.output.affPR - $scope.lookBack.history.affPR;
                        $scope.lookBack.output.socRD = $scope.lookBack.output.socPR - $scope.lookBack.history.socPR;
                        $scope.lookBack.output.parRD = $scope.lookBack.output.parPR - $scope.lookBack.history.parPR;
                        $scope.lookBack.output.totRD = $scope.lookBack.output.totPR - $scope.lookBack.history.totPR;

                        $scope.lookBack.output.ROID=$scope.lookBack.output.run1ProjROI.slice(0,-1)-$scope.lookBack.history.ROI;
                        $scope.lookBack.output.changeR=$scope.lookBack.output.ROID/$scope.lookBack.history.ROI*100;
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
            $scope.lookbackContentSize = 'col-sm-5';
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




