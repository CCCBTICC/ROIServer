/**
 * Created by Haizhou on 5/8/2015.
 */
'use strict';
var back = angular.module("ROIClientApp");

back.controller('backInitCtrl', ['$scope', 'analysis', 'scenarios', 'user', 'history', 'actionObjInfo', '$location', '$filter', function ($scope, analysis, scenarios, user, history, actionObjInfo, location, filter) {
    //scope vars
    $scope.tooltips = {
        brand: "Please choose one of the brands from the list.",
        attr: "Please choose either Last Touch Attribution or Multi Touch Attribution for your calculation.",
        beginPeriod: "Please choose the begin time.",
        endPeriod: "Please choose the end time.",
        spend: "Portfolio Spend",
        included: "Do you need to include the data through the end time?"
    };
    $scope.calender = {
        minDate: null,
        maxDate: null,
        eMaxDate: null,
        opened: {beginPeriod: false, endPeriod: false},
        format: 'MMMM-dd-yyyy',
        dateOptions: {
            formatYear: 'yyyy',
            startingDay: 1,
            minMode: 'month'
        },
        initDate: function () {
            history.getHistoryDate(function (res) {
                console.log(res);
                if (res[0]) {
                    var d = new Date(res[1]);
                    $scope.calender.minDate = new Date(res[0]);
                    $scope.calender.maxDate = new Date(d.getFullYear(), d.getMonth() + 2, 0);
                    var date = $scope.calender.maxDate;
                    $scope.dataInfo.beginDate = new Date(date.getFullYear(), date.getMonth(), 1);
                    $scope.dataInfo.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                    $scope.calender.modifyDate();
                } else {
                    alert("HistoryDate is not exist")
                }
            });
        },
        open: function (event, model) {
            event.preventDefault();
            event.stopPropagation();

            if (model === 'lookBackBeginPeriod') {
                $scope.calender.opened.beginPeriod = !$scope.calender.opened.beginPeriod;
                $scope.calender.opened.endPeriod = false;
            } else {
                $scope.calender.opened.endPeriod = !$scope.calender.opened.endPeriod;
                $scope.calender.opened.beginPeriod = false;
            }
        },
        modifyDate: function () {
            var d;
            if (!$scope.dataInfo.beginDate || $scope.dataInfo.beginDate > $scope.calender.maxDate) {
                $scope.dataInfo.beginDate = $scope.calender.maxDate;
            }
            d = new Date($scope.dataInfo.beginDate);
            $scope.dataInfo.beginDate = new Date(d.getFullYear(), d.getMonth(), 1);
            if (new Date(d.getFullYear(), d.getMonth() + 6, 0) < $scope.calender.maxDate) {
                $scope.calender.eMaxDate = new Date(d.getFullYear(), d.getMonth() + 6, 0)
            } else {
                $scope.calender.eMaxDate = $scope.calender.maxDate;
            }
            if (!$scope.dataInfo.endDate || $scope.dataInfo.endDate < $scope.dataInfo.beginDate) {
                $scope.dataInfo.endDate = $scope.dataInfo.beginDate;
            }
            if ($scope.calender.eMaxDate < $scope.dataInfo.endDate) {
                $scope.dataInfo.endDate = $scope.eMaxDate;
            }
            d = new Date($scope.dataInfo.endDate);
            $scope.dataInfo.endDate = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        }
    };
    $scope.dataInfo = {};
    $scope.lookBack = {init: {}};

    //scope functions
    $scope.logout = function () {
        window.sessionStorage.removeItem('username');
        window.location.href = ('http://' + window.location.hostname + ':3001/index.html');
    };
    $scope.nextPage = function () {
        passInfoToTempData();
        analysis.postData($scope.lookBack.init, $scope.dataInfo, function (res) {
            console.log(res);
            location.path('lookback/add');
        });
    };

    //functions
    function passInfoToTempData() {
        var length = $scope.dataInfo.endDate.getMonth() - $scope.dataInfo.beginDate.getMonth() + 1;
        if (length <= 0) {
            length += 12;
        }
        // first step input init
        $scope.lookBack.init.UserName = $scope.user.name;
        $scope.lookBack.init.Brand = $scope.dataInfo.brand;
        $scope.lookBack.init.lmTouch = $scope.dataInfo.lmTouch === 'LTA' ? 'Last Touch' : 'Multi-Touch';
        $scope.lookBack.init.StartingTime = filter('date')($scope.dataInfo.beginDate, 'yyyy-MM');
        $scope.lookBack.init.EndingTime = filter('date')($scope.dataInfo.endDate, 'yyyy-MM');
        //$scope.lookBack.init.Spend = $scope.dataInfo.spend;
        $scope.lookBack.init.PlanMonths = length;
        $scope.lookBack.init.Algorithm = 1;
    }

    //----------main-------------------
    //check user
    user.getUser(function (user) {
        $scope.user = user;
        if (!user.name) {
            $scope.logout()
        }
    });
    //init actionObjInfo
    while (actionObjInfo[0]) {
        actionObjInfo.shift();
    }
    //init analysis.tempData
    Object.keys(analysis.tempData).forEach(function (key) {
        analysis.tempData[key] = "";
    });
    // get data template and dataInfo
    $scope.lookBack.init = analysis.tempData;
    $scope.dataInfo = scenarios.dataInfo;
    //init calender
    $scope.calender.initDate();

}]);

back.controller('backAddCtrl', ['$scope', 'analysis', 'scenarios', '$location', 'history', '$filter', function ($scope, analysis, scenarios, location, history, filter) {
    //scope vars
    $scope.tooltips = {
        brand: "Please choose one of the brands from the list.",
        attr: "Please choose either Last Touch Attribution or Multi Touch Attribution for your calculation.",
        beginPeriod: "Please choose the begin time.",
        endPeriod: "Please choose the end time.",
        spend: "Portfolio Spend",
        included: "Do you need to include the data through the end time?"
    };
    $scope.dataInfo = {};
    $scope.lookBack = {output: {}, history: {}};
    $scope.error = false;
    //$scope.errorMessage = "";
    $scope.getJson = false;

    //scope functions

    $scope.nextPage = function () {
        $scope.error = (Number($scope.dataInfo.spend) < Number($scope.lookBack.output.SpendLB) || Number($scope.dataInfo.spend) > Number($scope.lookBack.output.SpendUB))
        if (!$scope.error) {
            completeDataInfo();
            passInfoToData();
            //post data to R
            analysis.postData($scope.lookBack.output, $scope.dataInfo, function (res) {
                console.log(res);
                location.path('lookback/output');
            });
        }
    };

    var count;

    function doGet() {
        if ($scope.getJson === false) {
            analysis.getData(function (data) {
                if (data) {
                    console.log("from doGet in lookback/add");
                    console.log(data);
                    $scope.getJson = true;
                    $scope.lookBack.output = data;
                    history.getHistoryData($scope.lookBack.output.StartingTime, $scope.lookBack.output.EndingTime, function (data) {
                        console.log('from history in lookback/add');
                        console.log(data);
                        $scope.lookBack.history = data;
                        //$scope.lookBack.history.SEMBrand
                        //$scope.lookBack.history.SEMCard
                        //$scope.lookBack.history.Other
                        //$scope.lookBack.history.PBook
                        $scope.dataInfo.spend =
                            $scope.lookBack.history.SEM +
                            $scope.lookBack.history.Affiliate +
                            $scope.lookBack.history.Display +
                            $scope.lookBack.history.FB +
                            $scope.lookBack.history.Partners;
                    });
                }
            });
        }
        else {
            clearInterval(count);
        }
    }

    function prepareForShow() {

    }

    function passInfoToData() {
        $scope.lookBack.output.Algorithm = 2;
        $scope.lookBack.output.AlgStartingTime = "";
        $scope.lookBack.output.AlgEndingTime = "";
        $scope.lookBack.output.AlgDuration = "";
        $scope.lookBack.output.Spend = $scope.dataInfo.spend;
    }

    function completeDataInfo() {
        $scope.dataInfo.scenarioId = "SLFY-" +
            filter('date')($scope.dataInfo.beginDate, 'MMMyyyy') + "-" +
            filter('date')($scope.dataInfo.endDate, 'MMMyyyy') + "-" +
            $scope.dataInfo.lmTouch.charAt(0) + "-000";
        $scope.dataInfo.dataThrough = $scope.dataInfo.included ? $scope.lookBack.output.EndingTime : filter('date')(new Date($scope.lookBack.output.StartingTime), 'yyyy-MM');
        $scope.dataInfo.from = "back";
    }

    //main
    //check objId
    if (!analysis.objIds.current) {
        location.path('lookback/init')
    }
    //get output Data
    doGet();
    count = setInterval(doGet, 1000 * 0.3);
    $scope.dataInfo = scenarios.dataInfo;
    console.log($scope.dataInfo);
    $scope.$on('$destroy', function () {
        clearInterval(count);
    });//stop get request

}]);

back.controller('backOutputCtrl', ['$scope', 'analysis', '$location', 'history', 'scenarios', 'user', '$filter', function ($scope, analysis, location, history, scenarios, user, filter) {
    //scope vars
    $scope.lookBack = {output: {}, history: {}, difference: {}};
    $scope.compareChart = {
        data: [
            {title: "SEM", value: 0, string: ""},
            {title: "SEM-Brand", value: 0, string: ""},
            {title: "SEM-Card", value: 0, string: ""},
            {title: "SEM-Photobook", value: 0, string: ""},
            {title: "SEM-Others", value: 0, string: ""},
            {title: "Display", value: 0, string: ""},
            {title: "Social", value: 0, string: ""},
            {title: "Affiliates", value: 0, string: ""},
            {title: "Partners", value: 0, string: ""},
            {title: "Portfolio Total", value: 0, string: ""}
        ],
        config: {
            width: 800,
            barHeight: 28,
            margin: {left: 130, top: 30, right: 200, bottom: 30}
        }
    };
    $scope.showme = false;
    $scope.lookbackContentSize = 'col-sm-12';
    $scope.showGraph = 'Show Graph';

    //scope functions
    $scope.edit = function () {
        location.path('lookback/edit');
    }; //finished
    $scope.export = function () {
        location.path('myscenarios/export');
    }; //pause
    $scope.share = function () {
        location.path('myscenarios/share');
    };  // pause
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
    };  // show&hide graph

    //functions
    function calculateDifference() {
        $scope.lookBack.difference = {
            semSD: $scope.lookBack.output.semSR - $scope.lookBack.history.semSR,
            semBSD: $scope.lookBack.output.semBSR - $scope.lookBack.history.semBSR,
            semCSD: $scope.lookBack.output.semCSR - $scope.lookBack.history.semCSR,
            semOSD: $scope.lookBack.output.semOSR - $scope.lookBack.history.semOSR,
            semPSD: $scope.lookBack.output.semPSR - $scope.lookBack.history.semPSR,
            disSD: $scope.lookBack.output.disSR - $scope.lookBack.history.disSR,
            affSD: $scope.lookBack.output.affSR - $scope.lookBack.history.affSR,
            socSD: $scope.lookBack.output.socSR - $scope.lookBack.history.socSR,
            parSD: $scope.lookBack.output.parSR - $scope.lookBack.history.parSR,
            totSD: $scope.lookBack.output.totSR - $scope.lookBack.history.totSR,
            semRD: $scope.lookBack.output.semPR - $scope.lookBack.history.semPR,
            disRD: $scope.lookBack.output.disPR - $scope.lookBack.history.disPR,
            affRD: $scope.lookBack.output.affPR - $scope.lookBack.history.affPR,
            socRD: $scope.lookBack.output.socPR - $scope.lookBack.history.socPR,
            parRD: $scope.lookBack.output.parPR - $scope.lookBack.history.parPR,
            totRD: $scope.lookBack.output.totPR - $scope.lookBack.history.totPR,
            ROID: $scope.lookBack.output.run1ProjROI.slice(0, -1) - $scope.lookBack.history.ROI,
            changeR: ( $scope.lookBack.output.run1ProjROI.slice(0, -1) / $scope.lookBack.history.ROI - 1) * 100
        };

        $scope.compareChart.data = [
            {
                title: "SEM",
                value: $scope.lookBack.difference.semSD / $scope.lookBack.history.semSR,
                string: filter('number')(Math.abs($scope.lookBack.difference.semSD), 0)
            },
            {
                title: "SEM-Brand",
                value: $scope.lookBack.difference.semBSD / $scope.lookBack.history.semBSR,
                string: filter('number')(Math.abs($scope.lookBack.difference.semBSD), 0)
            },
            {
                title: "SEM-Card",
                value: $scope.lookBack.difference.semCSD / $scope.lookBack.history.semCSR,
                string: filter('number')(Math.abs($scope.lookBack.difference.semCSD), 0)
            },
            {
                title: "SEM-Photobook",
                value: $scope.lookBack.difference.semPSD / $scope.lookBack.history.semPSR,
                string: filter('number')(Math.abs($scope.lookBack.difference.semPSD), 0)
            },
            {
                title: "SEM-Others",
                value: $scope.lookBack.difference.semOSD / $scope.lookBack.history.semOSR,
                string: filter('number')(Math.abs($scope.lookBack.difference.semOSD), 0)
            },
            {
                title: "Display",
                value: $scope.lookBack.difference.disSD / $scope.lookBack.history.disSR,
                string: filter('number')(Math.abs($scope.lookBack.difference.disSD), 0)
            },
            {
                title: "Social",
                value: $scope.lookBack.difference.socSD / $scope.lookBack.history.socSR,
                string: filter('number')(Math.abs($scope.lookBack.difference.socSD), 0)
            },
            {
                title: "Affiliates",
                value: $scope.lookBack.difference.affSD / $scope.lookBack.history.affSR,
                string: filter('number')(Math.abs($scope.lookBack.difference.affSD), 0)
            },
            {
                title: "Partners",
                value: $scope.lookBack.difference.parSD / $scope.lookBack.history.parSR,
                string: filter('number')(Math.abs($scope.lookBack.difference.parSD), 0)
            },
            {
                title: "Portfolio Total",
                value: $scope.lookBack.difference.totSD / $scope.lookBack.history.totSR,
                string: filter('number')(Math.abs($scope.lookBack.difference.totSD), 0)
            }
        ];

    }

    //main
    //check objId
    if (!analysis.objIds.current) {
        location.path("/lookback/init");
    }
    scenarios.getScenarioById(analysis.objIds.current, function (scenario) {
        console.log(scenario);
        $scope.scenario = scenario;
    });

    var count;
    $scope.getJson = false;
    doGet();
    count = setInterval(doGet, 1000 * 0.3); //set frequency
    function doGet() {
        if ($scope.getJson === false) {
            analysis.getData(function (data) {
                if (data) {
                    console.log("from doGet in back/output");
                    console.log(data);
                    $scope.getJson = true;
                    $scope.lookBack.output = data;
                    scenarios.editScenario(data.UserName, analysis.objId, {exist: true}, function (res) {
                        console.log(res);
                    });
                    history.getHistoryData($scope.lookBack.output.StartingTime, $scope.lookBack.output.EndingTime, function (history) {
                        $scope.lookBack.history = {
                            semSR: history.SEM,
                            semBSR: history.SEMBrand,
                            semCSR: history.SEMCard,
                            semOSR: history.SEMOther,
                            semPSR: history.SEMPBook,
                            disSR: history.Display,
                            affSR: history.Affiliate,
                            socSR: history.FB,
                            parSR: history.Partners,
                            totSR: history.Partners + history.FB + history.Affiliate + history.Display + history.SEM,
                            semPR: history.SEM_MTA,
                            disPR: history.Display_MTA,
                            affPR: history.Affiliates_MTA,
                            socPR: history.FB_MTA,
                            parPR: history.Partners_MTA,
                            totPR: history.SEM_MTA + history.Display_MTA + history.Affiliates_MTA + history.FB_MTA + history.Partners_MTA
                        };
                        if ($scope.lookBack.output.lmTouch === "Last Touch") {
                            $scope.lookBack.history.semPR = history.SEM_LTA;
                            $scope.lookBack.history.disPR = history.Display_LTA;
                            $scope.lookBack.history.affPR = history.Affiliates_LTA;
                            $scope.lookBack.history.socPR = history.FB_LTA;
                            $scope.lookBack.history.parPR = history.Partners_LTA;
                            $scope.lookBack.history.totPR = history.SEM_LTA + history.Display_LTA + history.Affiliates_LTA + history.FB_LTA + history.Partners_LTA;
                        }
                        $scope.lookBack.history.ROI = ($scope.lookBack.history.totPR / $scope.lookBack.history.totSR - 1) * 100;
                        console.log($scope.lookBack.history);
                        console.log($scope.lookBack.difference);

                        calculateDifference();
                    });
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
//stop get request

}])
;