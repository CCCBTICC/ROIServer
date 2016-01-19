/**
 * Created by Haizhou on 5/11/2015.
 * modified by Chenghui on 7/17/2015
 */
'use strict';
var forward = angular.module("forwardModule", []);
forward.factory('analysis', function ($http) {
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
        "semCLB": "",
        "semPLB": "",
        "semOLB": "",
        "semBLB": "",
        "SpendLB": "",
        "disLB": "",
        "socLB": "",
        "affLB": "",
        "parLB": "",
        "semCMin": "",
        "semPMin": "",
        "semOMin": "",
        "semBMin": "",
        "disMin": "",
        "socMin": "",
        "affMin": "",
        "parMin": "",
        "semCMax": "",
        "semPMax": "",
        "semOMax": "",
        "semBMax": "",
        "disMax": "",
        "socMax": "",
        "affMax": "",
        "parMax": "",
        "semCUB": "",
        "semPUB": "",
        "semOUB": "",
        "semBUB": "",
        "disUB": "",
        "socUB": "",
        "affUB": "",
        "parUB": "",
        "SpendUB": "",
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
        "dirSpendM4": "",
        "dirSpendM5": "",
        "dirSpendM6": "",
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
        "semCSlideLeft": "",
        "semPSlideLeft": "",
        "semOSlideLeft": "",
        "semBSlideLeft": "",
        "disSlideLeft": "",
        "socSlideLeft": "",
        "affSlideLeft": "",
        "parSlideLeft": "",
        "semCSlide": "",
        "semPSlide": "",
        "semOSlide": "",
        "semBSlide": "",
        "disSlide": "",
        "socSlide": "",
        "affSlide": "",
        "parSlide": "",
        "semCSlideRight": "",
        "semPSlideRight": "",
        "semOSlideRight": "",
        "semBSlideRight": "",
        "disSlideRight": "",
        "socSlideRight": "",
        "affSlideRight": "",
        "parSlideRight": "",
        "semCSlideDivMin": "",
        "semPSlideDivMin": "",
        "semOSlideDivMin": "",
        "semBSlideDivMin": "",
        "disSlideDivMin": "",
        "socSlideDivMin": "",
        "affSlideDivMin": "",
        "parSlideDivMin": "",
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
        "disAR": "",
        "socAR": "",
        "affAR": "",
        "parAR": "",
        "totAR": "",
        "run2ProjROI": "",
        "IncludeDataForThePeriod":""
    };
    var objIds = {current: ''};
    var url = "http://" + window.location.hostname + ":3001/analysis/";
    //var url = "http://54.166.49.92:3001/analysis/";
    var get = function (id, cb) {
        $http({
            method: 'get',
            url: url + id
        }).success(function (data) {
            cb(data);
        });
    };
    var post = function (data, cb) {
        $http({
            method: 'post',
            url: url + 'R',
            data: data
        }).success(function (id) {
            objIds.current = id;
            objIds[id] = id;
            cb(objIds.current);
        });
    };
    return {
        tempData: tempData,
        objIds: objIds,
        getData: function (cb, id) {
            if (!id) {
                get(objIds.current, cb);
            }
            else {
                get(id, cb);
            }
        },
        postData: function (data, info, cb) {
            var body = {data: data, username: data.UserName, info: info};
            post(body, cb);
        }
    }
});

forward.controller('forwardInitCtrl', ['$scope', 'analysis', 'scenarios', 'user', '$location', '$filter', 'history', 'actionObjInfo', function ($scope, analysis, scenarios, user, location, filter, history, actionObjInfo) {
    //scope vars
    $scope.tooltips = {
        brand: "Select the Brand. The default value is Shutterfly.",
        attr: "Select the revenue attribution method for the channel revenue forecast. The options are LTA (Last Touch Attribution) or MTA (Multi-Touch Attribution).",
        beginPeriod: "Select the first month of the planning cycle. By default, it is the next month of historical data available with the ability to skip 6 months ahead.",
        endPeriod: "Select the last month of the planning cycle. You can choose up to 6 months ahead with the ability to skip months if needed.",
        spend: "The amount you want to plan. For look back analysis, the actual spend for the period is pre-filled. You can override this number.",
        included: "Select 'Yes' if you want all data optimization thru the End Period for post-mortem analysis or 'No' if you want data optimization thru the month before the Begin Period for planning scenario analysis.",
        Constraints: "If you want to apply constraints on individual channel spend boundaries, select Yes. Default is No. Unconstrained, system fixes the spend level for SEM-Brand and Partnership to the actual spend for these two channels and then optimizes the rest of the portfolio spend among the rest of the channels and SEM sub-channels."
    };
    $scope.calender = {
        minDate: null,
        maxDate: null,
        eMaxDate: null,
        opened: {beginPeriod: false, endPeriod: false},
        format: 'MMM-dd-yyyy',
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
                    $scope.dataInfo.dataThrough = new Date(d.getFullYear(), d.getMonth() + 2, 0);
                    $scope.calender.minDate = new Date(d.getFullYear(), d.getMonth() + 2, 1);
                    $scope.calender.maxDate = new Date($scope.calender.minDate.getFullYear(), $scope.calender.minDate.getMonth() + 6, 0);
                    var date = $scope.calender.minDate;
                    $scope.dataInfo.beginDate = new Date(date.getFullYear(), date.getMonth(), 1);
                    $scope.dataInfo.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                    $scope.calender.modifyDate();
                }
            });
        },
        open: function (event, model) {
            event.preventDefault();
            event.stopPropagation();

            if (model === 'planForwardBeginPeriod') {
                $scope.calender.opened.beginPeriod = !$scope.calender.opened.beginPeriod;
                $scope.calender.opened.endPeriod = false;
            } else {
                $scope.calender.opened.endPeriod = !$scope.calender.opened.endPeriod;
                $scope.calender.opened.beginPeriod = false;
            }
        },
        modifyDate: function () {
            var d;
            if (!$scope.dataInfo.beginDate || $scope.dataInfo.beginDate < $scope.calender.minDate || $scope.dataInfo.beginDate > $scope.calender.maxDate) {
                $scope.dataInfo.beginDate = $scope.calender.minDate;
            }
            d = new Date($scope.dataInfo.beginDate);
            $scope.dataInfo.beginDate = new Date(d.getFullYear(), d.getMonth(), 1);
            if (new Date(d.getFullYear(), d.getMonth() + 6, 0) < new Date($scope.calender.minDate.getFullYear(), $scope.calender.minDate.getMonth() + 8, 0)) {
                $scope.calender.eMaxDate = new Date(d.getFullYear(), d.getMonth() + 6, 0)
            } else {
                $scope.calender.eMaxDate = new Date($scope.calender.minDate.getFullYear(), $scope.calender.minDate.getMonth() + 8, 0);
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
    $scope.dataInfo = {
        scenarioId: "",
        brands: ['Shutterfly'],
        brand: 'Shutterfly',
        lmTouch: 'MTA',
        beginDate: null,
        endDate: null,
        spend: null,
        included: 'Yes',
        dataThrough: null,
        from: "",
        owner: ""
    };
    $scope.planForward = {init: {}};

    //scope functions
    $scope.logout = function () {
        window.sessionStorage.removeItem('username');
        window.location.href = ('http://' + window.location.hostname + ':3001/index.html');
    };
    $scope.nextPage = function () {
        completeDataInfo();
        passInfoToData();
        //post input info to R
        analysis.postData($scope.planForward.init, $scope.dataInfo, function (res) {
            console.log(res);
            location.path('planforward/constrict');
        });
    };

    //functions
    function passInfoToData() {
        var length = $scope.dataInfo.endDate.getMonth() - $scope.dataInfo.beginDate.getMonth() + 1;
        if (length <= 0) {
            length += 12;
        }
        // first step input init
        $scope.planForward.init.UserName = $scope.user.name;
        $scope.planForward.init.Brand = $scope.dataInfo.brand;
        $scope.planForward.init.lmTouch = $scope.dataInfo.lmTouch === 'LTA' ? 'Last Touch' : 'Multi-Touch';
        $scope.planForward.init.StartingTime = filter('date')($scope.dataInfo.beginDate, 'yyyy-MM');
        $scope.planForward.init.EndingTime = filter('date')($scope.dataInfo.endDate, 'yyyy-MM');
        $scope.planForward.init.Spend = $scope.dataInfo.spend;
        $scope.planForward.init.PlanMonths = length;
        $scope.planForward.init.Algorithm = 1;
    }

    function completeDataInfo() {
        $scope.dataInfo.scenarioId = "SFLY-" +
            filter('date')($scope.dataInfo.beginDate, 'MMMyyyy') + "-" +
            filter('date')($scope.dataInfo.endDate, 'MMMyyyy') + "-" +
            $scope.dataInfo.lmTouch.charAt(0) + "-000";
        //$scope.dataInfo.dataThrough = filter('date')(new Date($scope.calender.minDate.getFullYear(),$scope.calender.minDate.getMonth(),0), 'yyyy-MM');
        $scope.dataInfo.from = "forward";
        $scope.dataInfo.included = 'N/A';
    }

    // main
    user.getUser(function (user) {
        $scope.user = user;
        if (!user.name) {
            $scope.logout()
        } else {
            //init actionObjInfo
            while (actionObjInfo.length) {
                actionObjInfo.shift();
            }
            //init analysis.tempData
            Object.keys(analysis.tempData).forEach(function (key) {
                analysis.tempData[key] = "";
            });
            // get data template and dataInfo
            $scope.planForward.init = analysis.tempData;
            scenarios.dataInfo = $scope.dataInfo;
            //init calender
            $scope.calender.initDate();
        }
    });
}]);

forward.controller('forwardConstrictCtrl', ['$scope', 'analysis', 'scenarios', '$location', '$filter', 'history', function ($scope, analysis, scenarios, location, filter, history) {
    //scope vars
    $scope.tooltips = {
        brand: "This is the drop down for selecting the Brand for which you are planning your marketing spend. The default value is Shutterfly.",
        attr: "This is where you select the Revenue attribution method you want the tool to use for Channel Revenue forecast. The options are: LTA -- Last Touch Attribution and MTA -- Multi-Touch Attribution.",
        beginPeriod: "The first month of the planning period. \n By default, it is first month after the last data refresh in the tool database. You can skip 6 months ahead and plan a future quarter. Click on the calendar icon to select.",
        endPeriod: "The last month of the planning period. \n It is set based on the Begin Period. Default equals to Begin Period. But you can choose up to Begin Period value + 5 or last month of historical data+8, whichever is earlier",
        spend: "Input total spend for portfolio (SEM, Display, Social, Affiliates and Partners) for the planning cycle.  By default, the pre-filled value represents the prior year's actual spend for the planning cycle with the ability to override value.",
        included: "This tells the tool whether you want to perform a post-mortem or simulate a planning scenario going back to past. It tells the tool how much of history to use. For post-mortem, data through the end period is used. For simulation, data till the month prior to begin period is used.",
        Constraints: "Select 'Yes' if you want to apply channel spend constraints or 'No' if you want to keep SEM Brand and Partners fixed to prior year's actual spend for the planning cycle.",
        applyConstraints:"Select 'Yes' if you want to apply channel spend constraints or 'No' if you want to keep SEM Brand and Partners fixed to prior year's actual spend for the planning cycle.",
        scalingFactor: 'A method to adjust for situations when ad buying efficiency has changed from historical cost structure (CPC/CPM). Default value of 1.0 assumes no change in buying efficiency. It is inverse to cost efficiency. If cost goes up, lower it and vice versa. See User Guide for illustration.',
        maintainSpend: "Click box if you want the prior year's actual spend to be fixed for the planning cycle.  Unclick box allows the tool to optimize a given channel spend within the upper and lower limits."
    };
    $scope.dataInfo = {};
    $scope.planForward = {
        output: {},
        history: {},
        ControlChannelsDM: [],
        ControlChannels: [],
        ChontrolChannelsData: [],
        ControlChannelsShow: "Yes"
    };
    $scope.getJson = false;
    $scope.channelShow = false;
    $scope.error = false;
    $scope.errormin = false;
    $scope.errormax = false;
    $scope.selectPlan = {
        disable: {
            semTotal: false,
            semBrand: false,
            semCard: false,
            semPhotobook: false,
            semOthers: false,
            display: false,
            social: false,
            affiliates: false,
            partners: false
        },
        checkBox: {
            semBrand: true,
            semCard: false,
            semPhotobook: false,
            semOthers: false,
            display: false,
            social: false,
            affiliates: false,
            partners: true
        },
        semTotalCheckBox: false,
        count: function () {
            var count = 0;
            $scope.selectPlan.disable = {
                semTotal: false,
                semBrand: false,
                semCard: false,
                semPhotobook: false,
                semOthers: false,
                display: false,
                social: false,
                affiliates: false,
                partners: false
            };
            Object.keys($scope.selectPlan.checkBox).forEach(function (key) {
                if ($scope.selectPlan.checkBox[key]) {
                    count++;
                }
            });
            if (count > 2) {
                if (!$scope.selectPlan.semTotalCheckBox) {
                    $scope.selectPlan.disable.semTotal = true;
                }
            }
            /*
            if (count > 5) {
                Object.keys($scope.selectPlan.checkBox).forEach(function (key) {
                    if (!$scope.selectPlan.checkBox[key]) {
                        $scope.selectPlan.disable[key] = true;
                    }
                });
            }
            */
            fix();
        },
        totCheck: function () {
            if (!$scope.selectPlan.semTotalCheckBox) {
                Object.keys($scope.selectPlan.checkBox).forEach(function (key) {
                    $scope.selectPlan.checkBox[key] = key.toString().indexOf('sem') < 0 ? $scope.selectPlan.checkBox[key] : false;
                });
            } else {
                Object.keys($scope.selectPlan.checkBox).forEach(function (key) {
                    $scope.selectPlan.checkBox[key] = key.toString().indexOf('sem') < 0 ? $scope.selectPlan.checkBox[key] : true;
                });
            }
            $scope.selectPlan.count();
        },
        subCheck: function () {
            $scope.selectPlan.semTotalCheckBox = !!($scope.selectPlan.checkBox.semBrand && $scope.selectPlan.checkBox.semCard && $scope.selectPlan.checkBox.semPhotobook && $scope.selectPlan.checkBox.semOthers);
            $scope.selectPlan.count();
        }
    };
    $scope.calender = {
        minDate: null,
        maxDate: null,
        eMaxDate: null,
        opened: {beginPeriod: false, endPeriod: false},
        format: 'MMM-dd-yyyy',
        dateOptions: {
            formatYear: 'yyyy',
            startingDay: 1
        },
        initDate: function () {
            $scope.calender.minDate = $scope.dataInfo.beginDate;
            $scope.calender.maxDate = $scope.dataInfo.endDate;
            $scope.calender.modifyDate();
        },
        open: function (event, model) {
            event.preventDefault();
            event.stopPropagation();

            if (model === 'tvBeginPeriod') {
                $scope.calender.opened.beginPeriod = !$scope.calender.opened.beginPeriod;
                $scope.calender.opened.endPeriod = false;
            } else {
                $scope.calender.opened.endPeriod = !$scope.calender.opened.endPeriod;
                $scope.calender.opened.beginPeriod = false;
            }
        },
        modifyDate: function () {
            if (!$scope.planForward.output.tvBeginDate || $scope.planForward.output.tvBeginDate < $scope.calender.minDate || $scope.planForward.output.tvBeginDate > $scope.calender.maxDate) {
                $scope.planForward.output.tvBeginDate = $scope.calender.minDate;
            }

            if (!$scope.planForward.output.tvEndDate || $scope.planForward.output.tvEndDate < $scope.dataInfo.beginDate || $scope.planForward.output.tvEndDate > $scope.calender.maxDate) {
                $scope.planForward.output.tvEndDate = $scope.calender.maxDate;
            }
            if($scope.planForward.output.tvBeginDate>$scope.planForward.output.tvEndDate){
            $scope.planForward.output.tvEndDate = $scope.planForward.output.tvBeginDate;
            }
            if($scope.planForward.output.tvBeginDate<$scope.planForward.output.tvEndDate){
                $scope.planForward.output.tvBeginDate = $scope.planForward.output.tvEndDate;
            }
        }
    };
    //scope functions
    $scope.nextPage = function () {
        $scope.spendValidate();
        if (!$scope.error) {
            if ($scope.planForward.ControlChannelsShow === "No") {
                passInfoToData();
                //post data to R
                analysis.postData($scope.planForward.output, $scope.dataInfo, function (res) {
                    console.log(res);
                    //location.path('planforward/output');
                    location.path('myscenarios');
                });
            } else {
                $scope.channelShow = !$scope.channelShow;
                $scope.planForward.ControlChannelsShow = "No";

            }
        }
    };
    $scope.reset = function () {
        $scope.selectPlan.checkBox = {
            semBrand: true,
            semCard: false,
            semPhotobook: false,
            semOthers: false,
            display: false,
            social: false,
            affiliates: false,
            partners: true
        };
        $scope.selectPlan.semTotalCheckBox = false;
        fix();
        $scope.errormin = false;
        $scope.errormax = false;
        $scope.error = false;
    };
    $scope.spendValidate = function () {
        console.log('validating', $scope.planForward.output.semCMin);
        $scope.error = false;
        $scope.planForward.output.semMin =
            Number($scope.planForward.output.semBMin) +
            Number($scope.planForward.output.semCMin) +
            Number($scope.planForward.output.semPMin) +
            Number($scope.planForward.output.semOMin);
        $scope.min =
            Number($scope.planForward.output.semMin) +
            Number($scope.planForward.output.disMin) +
            Number($scope.planForward.output.socMin) +
            Number($scope.planForward.output.affMin) +
            Number($scope.planForward.output.parMin);

        $scope.planForward.output.semMax =
            Number($scope.planForward.output.semBMax) +
            Number($scope.planForward.output.semCMax) +
            Number($scope.planForward.output.semPMax) +
            Number($scope.planForward.output.semOMax);
        $scope.max =
            Number($scope.planForward.output.semMax) +
            Number($scope.planForward.output.disMax) +
            Number($scope.planForward.output.socMax) +
            Number($scope.planForward.output.affMax) +
            Number($scope.planForward.output.parMax);
        if (Number($scope.dataInfo.spend) < $scope.min) {
            $scope.error = true;
            $scope.errorMessage = "Your Minimum constraint \n is over your Portfolio Spend by \n" +
                filter('formatCurrency')($scope.min - $scope.dataInfo.spend) +
                ". Please reduce to continue.";
        }
        if (Number($scope.dataInfo.spend) > $scope.max) {
            $scope.error = true;
            $scope.errorMessage = "Your Maximum constraint \n is under your Portfolio Spend by \n" +
                filter('formatCurrency')($scope.dataInfo.spend - $scope.max) +
                ". Please increase to continue.";
        }
    };

    var count;

    function doGet() {
        if ($scope.getJson === false) {
            analysis.getData(function (data) {
                if (data) {
                    $scope.getJson = true;
                    $scope.planForward.output = data;
                    console.log(data);
                    $scope.$watchCollection('planForward.output', function () {
                        $scope.spendValidate();
                    });
                    $scope.calender.initDate();
                    history.getHistoryDate(function (res) {
                        var start = $scope.planForward.output.StartingTime;
                        var end = $scope.planForward.output.EndingTime;
                        start = Number(start.substr(0,4)-1)+start.substr(4,start.length);
                        end = Number(end.substr(0,4)-1)+end.substr(4,end.length);
                        /*
                        var d = new Date(res[1]);
                        d = new Date(d.getFullYear(), d.getMonth() + 2 - $scope.planForward.output.PlanMonths, 1);
                        history.getHistoryData(filter('date')(d, 'yyyy-MM'), res[1], function (history) {
                        */
                        history.getHistoryData(start, end, function (history) {
                            $scope.planForward.history = {
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
                            if ($scope.planForward.output.lmTouch === "Last Touch") {
                                $scope.planForward.history.semPR = history.SEM_LTA;
                                $scope.planForward.history.disPR = history.Display_LTA;
                                $scope.planForward.history.affPR = history.Affiliates_LTA;
                                $scope.planForward.history.socPR = history.FB_LTA;
                                $scope.planForward.history.parPR = history.Partners_LTA;
                                $scope.planForward.history.totPR = history.SEM_LTA + history.Display_LTA + history.Affiliates_LTA + history.FB_LTA + history.Partners_LTA;
                            }
                            //$scope.planForward.history.ROI = ($scope.planForward.history.totPR / $scope.planForward.history.totSR - 1) * 100;
                            $scope.dataInfo.spend = $scope.planForward.history.totSR;
                            fix();
                        });
                    });
                    //prepare for show
                    $scope.planForward.output.semLB = Number($scope.planForward.output.semBLB) + Number($scope.planForward.output.semCLB) + Number($scope.planForward.output.semPLB) + Number($scope.planForward.output.semOLB);
                    $scope.planForward.output.semUB = Number($scope.planForward.output.semBUB) + Number($scope.planForward.output.semCUB) + Number($scope.planForward.output.semPUB) + Number($scope.planForward.output.semOUB);

                    var b = new Date($scope.planForward.output.StartingTime);
                    b = new Date(b.getFullYear(), b.getMonth() + 1);
                    console.log(b);
                    var e = new Date($scope.planForward.output.EndingTime);
                    e = new Date(e.getFullYear(), e.getMonth() + 1);
                    console.log(e);
                    $scope.size = [1, 2, 3, 4, 5, 6];
                    while (b <= e) {
                        $scope.planForward.ControlChannels.push(b);
                        b = new Date(b.getFullYear(), b.getMonth() + 1, 1);
                        $scope.size.shift();
                    }
                    var month = ['dirSpendM1', 'dirSpendM2', 'dirSpendM3', 'dirSpendM4', 'dirSpendM5', 'dirSpendM6'];
                    month.forEach(function (key) {
                        if ($scope.planForward.output[key]) {
                            $scope.planForward.ControlChannelsDM.push($scope.planForward.output[key]);
                        }
                    });
                    $scope.planForward.ControlChannelsDM.forEach(function (key, index) {
                        $scope.planForward.ChontrolChannelsData[index] = {
                            "month": $scope.planForward.ControlChannels[index],
                            "spend": key
                        }
                    });
                    $scope.planForward.ControlChannelsDM = [];
                }
            });
        }
        else {
            clearInterval(count);
        }
    }

    function passInfoToData() {
        var month = ['dirSpendM1', 'dirSpendM2', 'dirSpendM3', 'dirSpendM4', 'dirSpendM5', 'dirSpendM6'];
        $scope.planForward.output.Algorithm = 2;
        $scope.planForward.output.AlgStartingTime = "";
        $scope.planForward.output.AlgEndingTime = "";
        $scope.planForward.output.AlgDuration = "";
        $scope.planForward.output.Spend = $scope.dataInfo.spend;
        $scope.planForward.ChontrolChannelsData.forEach(function(singleData, index){
            $scope.planForward.output[month[index]] = singleData.spend;
        });
    }

    function fix() {
        $scope.planForward.output.semMin = $scope.planForward.output.semLB;
        $scope.planForward.output.semMax = $scope.planForward.output.semUB;
        $scope.planForward.output.semBMin = $scope.planForward.output.semBLB;
        $scope.planForward.output.semBMax = $scope.planForward.output.semBUB;
        $scope.planForward.output.semCMin = $scope.planForward.output.semCLB;
        $scope.planForward.output.semCMax = $scope.planForward.output.semCUB;
        $scope.planForward.output.semPMin = $scope.planForward.output.semPLB;
        $scope.planForward.output.semPMax = $scope.planForward.output.semPUB;
        $scope.planForward.output.semOMin = $scope.planForward.output.semOLB;
        $scope.planForward.output.semOMax = $scope.planForward.output.semOUB;
        $scope.planForward.output.disMin = $scope.planForward.output.disLB;
        $scope.planForward.output.disMax = $scope.planForward.output.disUB;
        $scope.planForward.output.socMin = $scope.planForward.output.socLB;
        $scope.planForward.output.socMax = $scope.planForward.output.socUB;
        $scope.planForward.output.affMin = $scope.planForward.output.affLB;
        $scope.planForward.output.affMax = $scope.planForward.output.affUB;
        $scope.planForward.output.parMin = $scope.planForward.output.parLB;
        $scope.planForward.output.parMax = $scope.planForward.output.parUB;

        if ($scope.selectPlan.checkBox.semBrand) {
            $scope.planForward.output.semBMin = $scope.planForward.output.semBMax = $scope.planForward.history.semBSR;
        }
        if ($scope.selectPlan.checkBox.semCard) {
            $scope.planForward.output.semCMin = $scope.planForward.output.semCMax = $scope.planForward.history.semCSR;
        }
        if ($scope.selectPlan.checkBox.semPhotobook) {
            $scope.planForward.output.semPMin = $scope.planForward.output.semPMax = $scope.planForward.history.semPSR;
        }
        if ($scope.selectPlan.checkBox.semOthers) {
            $scope.planForward.output.semOMin = $scope.planForward.output.semOMax = $scope.planForward.history.semOSR;
        }
        if ($scope.selectPlan.checkBox.display) {
            $scope.planForward.output.disMin = $scope.planForward.output.disMax = $scope.planForward.history.disSR;
        }
        if ($scope.selectPlan.checkBox.social) {
            $scope.planForward.output.socMin = $scope.planForward.output.socMax = $scope.planForward.history.socSR;
        }
        if ($scope.selectPlan.checkBox.affiliates) {
            $scope.planForward.output.affMin = $scope.planForward.output.affMax = $scope.planForward.history.affSR;
        }
        if ($scope.selectPlan.checkBox.partners) {
            $scope.planForward.output.parMin = $scope.planForward.output.parMax = $scope.planForward.history.parSR;
        }
        $scope.spendValidate();
    }


    //main
    //check objId
    if (!analysis.objIds.current) {
        location.path('planforward/init')
    }
    else {
        //get output Data
        doGet();
        count = setInterval(doGet, 1000 * 0.3);
        $scope.dataInfo = scenarios.dataInfo;
        console.log($scope.dataInfo);
        $scope.$on('$destroy', function () {
            clearInterval(count);
        });//stop get request
    }
}]);

forward.controller('forwardOutputCtrl', ['$scope', 'analysis', 'scenarios', '$location', '$filter', 'user', function ($scope, analysis, scenarios, location, filter, user) {
    //scope vars
    $scope.planForward = {output: {}};
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
    $scope.slideError = false;
    $scope.getJson = false;
    $scope.showme = false;
    $scope.planforwardContentSize = 'col-sm-12';
    $scope.showGraph = 'Show Graph';
    $scope.hideSemItems=false;
    $scope.showSem = {
        showSemBtn : function(){
            $scope.hideSemItems = !$scope.hideSemItems;
            if($scope.hideSemItems){
                insertChartData('part');
            }else{
                insertChartData('full');
            }
        }
    };



    //function for the toggles btns

    function insertChartData (option) {
        if(option === 'full'){
            console.log($scope.compareChart.data);
            var categories = [];
            var dataPositive =[];
            var dataNegative = [];
            $scope.compareChart.data.forEach(function(singleData,index){
                categories[index] = singleData.title;
                dataPositive[index] = chartDataSeparate((singleData.value*10000+'').split('.')[0]/100,true);
                dataNegative[index] = chartDataSeparate((singleData.value*10000+'').split('.')[0]/100,false);
            });
            console.log(categories);
            console.log(dataPositive);
            console.log(dataNegative);

            $('#container').highcharts({
                credits: {enabled: false},
                    navigation: {
                        buttonOptions: {
                            align: 'left'
                        }
                    },
                chart: { type: 'bar',backgroundColor:'#fafafa'},
                title: {text: 'Spend Difference (%)'},
                subtitle: {
                    useHTML: true,
                    text: '<span style="color: #ff6c3c;font-weight: bolder">Decrease</span><br/><span style="color: #5bd363;font-weight: bolder"> Increase</span>',
                    align: 'left',
                    x:0,
                    y:45
                },
                xAxis: [{categories: categories,opposite: true,reversed: true,
                    labels: { step: 1}
                }],
                yAxis: {
                    title: {text: null},
                    labels: {
                        formatter: function () {
                            return Math.abs(this.value) + '%';
                        }
                    }
                },
                plotOptions: {
                    series: {
                        stacking: 'normal'
                    }
                },
                tooltip: {
                    formatter: function () {
                        console.log(this.point);
                        return '<b>'  + this.point.stackTotal+ '%</b><br/>' ;
                    }
                },
                series: [{
                    showInLegend: false,
                    data: dataNegative,
                    color: '#a0f7a7',
                    negativeColor: '#f05323'
                }, {
                    showInLegend: false,
                    data:dataPositive,
                    color: '#a0f7a7',
                    negativeColor: '#f05323'
                }]
            }
                ,function(chart) { // on complete

                //chart.renderer.text('<span>'+$scope.scenario.scenarioId+'</span><br/><span>Portfolio Spend: '+ filter('formatCurrency')($scope.scenario.spend) +'</span><br/><span>Data through: '+ filter('date')($scope.scenario.dataThrough,'MMM-yyyy')+'</span>', 110, 50)
                    chart.renderer.text('<span>Scenario ID: '+$scope.scenario.scenarioId+'<br>From '+filter('date')($scope.scenario.beginDate,'MMM-yyyy')+' To '+filter('date')($scope.scenario.endDate,'MMM-yyyy')+'  '+$scope.planForward.output.lmTouch+'</span><br/><span>Portfolio Spend: '+ filter('formatCurrency')($scope.scenario.spend) +'</span><br/><span>Data through: '+ filter('date')($scope.scenario.dataThrough,'MMM-yyyy')+'</span>', 90, 40)
                    .css({
                        color: 'grey',
                        fontSize: '11px'
                    })
                    .add();

            });
        }else{
            console.log($scope.compareChart.data);
            var categories = [];
            var dataPositive =[];
            var dataNegative = [];
            $scope.compareChart.data.forEach(function(singleData,index){
                if( ["SEM-Brand", "SEM-Card", "SEM-Photobook", "SEM-Others"].indexOf(singleData.title)>=0){

                }else{
                    categories.push( singleData.title);
                    dataPositive.push(chartDataSeparate((singleData.value*10000+'').split('.')[0]/100,true));
                    dataNegative.push(chartDataSeparate((singleData.value*10000+'').split('.')[0]/100,false));
                } });
            console.log(categories);
            console.log(dataPositive);
            console.log(dataNegative);

            $('#container').highcharts({
                credits: {enabled: false},
                    navigation: {
                        buttonOptions: {
                            align: 'left'
                        }
                    },
                chart: { type: 'bar',backgroundColor:'#fafafa'},
                title: {text: 'Spend Difference (%)'},
                subtitle: {
                    useHTML: true,
                    text: '<span style="color: #ff6c3c;font-weight: bolder">Decrease</span><br/><span style="color: #5bd363;font-weight: bolder"> Increase</span>',
                    align: 'left',
                    x:0,
                    y:45
                },
                xAxis: [{categories: categories,opposite: true,reversed: true,
                    labels: { step: 1}
                }],
                yAxis: {
                    title: {text: null},
                    labels: {
                        formatter: function () {
                            return Math.abs(this.value) + '%';
                        }
                    }
                },
                plotOptions: {
                    series: {
                        stacking: 'normal'
                    }
                },
                tooltip: {
                    formatter: function () {
                        console.log(this.point);
                        return '<b>'  + this.point.stackTotal+ '%</b><br/>' ;
                    }
                },
                series: [{
                    showInLegend: false,
                    data: dataNegative,
                    color: '#a0f7a7',
                    negativeColor: '#f05323'
                }, {
                    showInLegend: false,
                    data:dataPositive,
                    color: '#a0f7a7',
                    negativeColor: '#f05323'
                }]
            }
            ,function(chart) { // on complete

                    //chart.renderer.text('<span>'+$scope.scenario.scenarioId+'</span><br/><span>Portfolio Spend: '+ filter('formatCurrency')($scope.scenario.spend) +'</span><br/><span>Data through: '+ filter('date')($scope.scenario.dataThrough,'MMM-yyyy')+'</span>', 110, 50)
                    chart.renderer.text('<span>Scenario ID: '+$scope.scenario.scenarioId+'<br>From '+filter('date')($scope.scenario.beginDate,'MMM-yyyy')+' To '+filter('date')($scope.scenario.endDate,'MMM-yyyy')+'  '+$scope.planForward.output.lmTouch+'</span><br/><span>Portfolio Spend: '+ filter('formatCurrency')($scope.scenario.spend) +'</span><br/><span>Data through: '+ filter('date')($scope.scenario.dataThrough,'MMM-yyyy')+'</span>', 90, 40)
                        .css({
                            color: 'grey',
                            fontSize: '11px'
                        })
                        .add();

                });
        }
        function chartDataSeparate(value,option){
            if(option){
                return value>0?value:0;
            }else{
                return value>0?0:value;
            }
        }

    }



    //scope functions
    $scope.edit = function () {
        location.path('myscenarios/edit');
    };
    $scope.export = function () {
        location.path('myscenarios/export');
    };
    $scope.share = function () {
        location.path('myscenarios/share');
    };
    $scope.toggle = function () {
        if ($scope.showme == false) {
            $scope.planforwardContentSize = 'col-sm-8';
            $scope.showme = true;
            $scope.showGraph = 'Hide Graph';
            if($scope.hideSemItems){
                insertChartData('part');
            }else{
                insertChartData('full');
            }
        }
        else {
            $scope.planforwardContentSize = 'col-sm-12';
            $scope.showme = false;
            $scope.showGraph = 'Show Graph';
        }
    };

    $scope.reSet = function () {
        //Slide=AS;
        $scope.slideError = false;
        $scope.planForward.output.semBSlide = $scope.planForward.output.semBAS;
        $scope.planForward.output.semCSlide = $scope.planForward.output.semCAS;
        $scope.planForward.output.semPSlide = $scope.planForward.output.semPAS;
        $scope.planForward.output.semOSlide = $scope.planForward.output.semOAS;
        $scope.planForward.output.semSlide =
            Number($scope.planForward.output.semCSlide) +
            Number($scope.planForward.output.semPSlide) +
            Number($scope.planForward.output.semBSlide) +
            Number($scope.planForward.output.semOSlide);
        $scope.planForward.output.disSlide = $scope.planForward.output.disAS;
        $scope.planForward.output.socSlide = $scope.planForward.output.socAS;
        $scope.planForward.output.affSlide = $scope.planForward.output.affAS;
        $scope.planForward.output.parSlide = $scope.planForward.output.parAS;
        $scope.planForward.output.totSlide =
            $scope.planForward.output.semSlide +
            Number($scope.planForward.output.disSlide) +
            Number($scope.planForward.output.socSlide) +
            Number($scope.planForward.output.affSlide) +
            Number($scope.planForward.output.parSlide);
    };
    $scope.reRun = function () {
        passInfoToData();
        $scope.scenario.scenarioId = $scope.scenario.scenarioId.slice(0, -1) + "X";
        //post data to R
        analysis.postData($scope.planForward.output, $scope.scenario, function (res) {
            console.log(res);
            //var count;
            //$scope.getJson = false;
            //doGet();
            //count = setInterval(doGet, 1000 * 10); //set frequency
            //function doGet() {
            //    if ($scope.getJson === false) {
            //        analysis.getData(function (data) {
            //            if (data) {
            //                console.log("from doGet in rerun in forward/output");
            //                console.log(data);
            //                $scope.getJson = true;
            //                $scope.planForward.output = data;
            //                scenarios.editScenario(data.UserName, analysis.objIds.current, {exist: true}, function (res) {
            //                    console.log(res);
            //                });
            //                calculateDifference();
            //            }
            //        });
            //    }
            //    else {
            //        clearInterval(count);
            //    }
            //}
            location.path('myscenarios');
        });
    };
    $scope.slideValidate = function () {
        $scope.slideError = false;
        $scope.planForward.output.semSlide =
            Number($scope.planForward.output.semCSlide) +
            Number($scope.planForward.output.semPSlide) +
            Number($scope.planForward.output.semBSlide) +
            Number($scope.planForward.output.semOSlide);
        $scope.planForward.output.totSlide =
            $scope.planForward.output.semSlide +
            Number($scope.planForward.output.disSlide) +
            Number($scope.planForward.output.socSlide) +
            Number($scope.planForward.output.affSlide) +
            Number($scope.planForward.output.parSlide);

        var sldChgFlg = {
            semCSlide: $scope.planForward.output.semCAS - $scope.planForward.output.semCSlide,
            semPSlide: $scope.planForward.output.semPAS - $scope.planForward.output.semPSlide,
            semBSlide: $scope.planForward.output.semBAS - $scope.planForward.output.semBSlide,
            semOSlide: $scope.planForward.output.semOAS - $scope.planForward.output.semOSlide,
            disSlide: $scope.planForward.output.disAS - $scope.planForward.output.disSlide,
            socSlide: $scope.planForward.output.socAS - $scope.planForward.output.socSlide,
            affSlide: $scope.planForward.output.affAS - $scope.planForward.output.affSlide,
            parSlide: $scope.planForward.output.parAS - $scope.planForward.output.parSlide
        };
        var min = {
            semCSlide: $scope.planForward.output.semCMin,
            semPSlide: $scope.planForward.output.semPMin,
            semBSlide: $scope.planForward.output.semBMin,
            semOSlide: $scope.planForward.output.semOMin,
            disSlide: $scope.planForward.output.disMin,
            socSlide: $scope.planForward.output.socMin,
            affSlide: $scope.planForward.output.affMin,
            parSlide: $scope.planForward.output.parMin
        };
        var max = {
            semCSlide: $scope.planForward.output.semCMax,
            semPSlide: $scope.planForward.output.semPMax,
            semBSlide: $scope.planForward.output.semBMax,
            semOSlide: $scope.planForward.output.semOMax,
            disSlide: $scope.planForward.output.disMax,
            socSlide: $scope.planForward.output.socMax,
            affSlide: $scope.planForward.output.affMax,
            parSlide: $scope.planForward.output.parMax
        };

        function sumValidate() {
            var sum = 0;
            var tmp = 0;
            var sumMax = 0;
            var tmpMax = 0;
            Object.keys(sldChgFlg).forEach(function (key) {
                if (sldChgFlg[key] == 0) {
                    tmp = min[key];
                    tmpMax = max[key];
                } else {
                    tmp = $scope.planForward.output[key];
                    tmpMax = tmp;
                }
                sum += Number(tmp);
                sumMax += Number(tmpMax);
            });
            if (Number($scope.planForward.output.totSR) < sum) {
                console.log(sum);
                $scope.slideError = true;
                $scope.slideErrorValue = "Lower  \n your spend constraints by\n" + filter('formatCurrency')(sum - $scope.planForward.output.totSR);
                return;
            }
            if (Number($scope.planForward.output.totSR) > sumMax) {
                $scope.slideError = true;
                $scope.slideErrorValue = "Increase \n your spend constraints by\n " + filter('formatCurrency')($scope.planForward.output.totSR - sumMax);
                return;
            }
            $scope.slideError = false;
        }

        sumValidate();
    };

    var count;

    //functions
    function range() {
        $scope.planForward.output.semBSlide++;
        $scope.planForward.output.semCSlide++;
        $scope.planForward.output.semPSlide++;
        $scope.planForward.output.semOSlide++;

        $scope.planForward.output.disSlide++;
        $scope.planForward.output.socSlide++;
        $scope.planForward.output.affSlide++;
        $scope.planForward.output.parSlide++;
    }

    function calculateDifference() {
        //compareChart
        $scope.planForward.output.semSD = Number($scope.planForward.output.semAS) - Number($scope.planForward.output.semSR);
        $scope.planForward.output.semCSD = Number($scope.planForward.output.semCAS) - Number($scope.planForward.output.semCSR);
        $scope.planForward.output.semBSD = Number($scope.planForward.output.semBAS) - Number($scope.planForward.output.semBSR);
        $scope.planForward.output.semPSD = Number($scope.planForward.output.semPAS) - Number($scope.planForward.output.semPSR);
        $scope.planForward.output.semOSD = Number($scope.planForward.output.semOAS) - Number($scope.planForward.output.semOSR);

        $scope.planForward.output.disSD = Number($scope.planForward.output.disAS) - Number($scope.planForward.output.disSR);
        $scope.planForward.output.socSD = Number($scope.planForward.output.socAS) - Number($scope.planForward.output.socSR);
        $scope.planForward.output.affSD = Number($scope.planForward.output.affAS) - Number($scope.planForward.output.affSR);
        $scope.planForward.output.parSD = Number($scope.planForward.output.parAS) - Number($scope.planForward.output.parSR);
        $scope.planForward.output.totSD = Number($scope.planForward.output.totAS) - Number($scope.planForward.output.totSR);

        $scope.planForward.output.semRD = Number($scope.planForward.output.semAR) - Number($scope.planForward.output.semPR);
        $scope.planForward.output.disRD = Number($scope.planForward.output.disAR) - Number($scope.planForward.output.disPR);
        $scope.planForward.output.socRD = Number($scope.planForward.output.socAR) - Number($scope.planForward.output.socPR);
        $scope.planForward.output.affRD = Number($scope.planForward.output.affAR) - Number($scope.planForward.output.affPR);
        $scope.planForward.output.parRD = Number($scope.planForward.output.parAR) - Number($scope.planForward.output.parPR);
        $scope.planForward.output.totRD = Number($scope.planForward.output.totAR) - Number($scope.planForward.output.totPR);

        $scope.planForward.output.ROID = Number($scope.planForward.output.run2ProjROI.substr(0, 3)) - Number($scope.planForward.output.run1ProjROI.substr(0, 3));
        $scope.planForward.output.changeR = $scope.planForward.output.ROID / Number($scope.planForward.output.run1ProjROI.substr(0, 3)) * 100;
        $scope.compareChart.data = [
            {
                title: "SEM",
                value: $scope.planForward.output.semSD / $scope.planForward.output.semSR,
                string: filter('number')(Math.abs($scope.planForward.output.semSD), 0)
            },
            {
                title: "SEM-Brand",
                value: $scope.planForward.output.semBSD / $scope.planForward.output.semBSR,
                string: filter('number')(Math.abs($scope.planForward.output.semBSD), 0)
            },
            {
                title: "SEM-Card",
                value: $scope.planForward.output.semCSD / $scope.planForward.output.semCSR,
                string: filter('number')(Math.abs($scope.planForward.output.semCSD), 0)
            },
            {
                title: "SEM-Photobook",
                value: $scope.planForward.output.semPSD / $scope.planForward.output.semPSR,
                string: filter('number')(Math.abs($scope.planForward.output.semPSD), 0)
            },
            {
                title: "SEM-Others",
                value: $scope.planForward.output.semOSD / $scope.planForward.output.semOSR,
                string: filter('number')(Math.abs($scope.planForward.output.semOSD), 0)
            },
            {
                title: "Display",
                value: $scope.planForward.output.disSD / $scope.planForward.output.disSR,
                string: filter('number')(Math.abs($scope.planForward.output.disSD), 0)
            },
            {
                title: "Social",
                value: $scope.planForward.output.socSD / $scope.planForward.output.socSR,
                string: filter('number')(Math.abs($scope.planForward.output.socSD), 0)
            },
            {
                title: "Affiliates",
                value: $scope.planForward.output.affSD / $scope.planForward.output.affSR,
                string: filter('number')(Math.abs($scope.planForward.output.affSD), 0)
            },
            {
                title: "Partners",
                value: $scope.planForward.output.parSD / $scope.planForward.output.parSR,
                string: filter('number')(Math.abs($scope.planForward.output.parSD), 0)
            },
            {
                title: "Portfolio Total",
                value: $scope.planForward.output.totSD / $scope.planForward.output.totSR,
                string: filter('number')(Math.abs($scope.planForward.output.totSD), 0)
            }
        ];
    }

    function passInfoToData() {
        $scope.planForward.output.UserName = $scope.user.name;
        $scope.planForward.output.Algorithm = 3;
        $scope.planForward.output.AlgStartingTime = "";
        $scope.planForward.output.AlgEndingTime = "";
        $scope.planForward.output.AlgDuration = "";
    }

    function doGet() {
        if ($scope.getJson === false) {
            analysis.getData(function (data) {
                if (data) {
                    console.log("from doGet in forward/output");
                    console.log(data);
                    $scope.getJson = true;

                    $scope.planForward.output = data;
                    range();
                    scenarios.editScenario(data.UserName, analysis.objIds.current, {exist: true}, function (res) {
                        console.log(res);
                        $scope.reSet();
                    });
                    $scope.planForward.output.semLB = Number($scope.planForward.output.semBLB) + Number($scope.planForward.output.semCLB) + Number($scope.planForward.output.semPLB) + Number($scope.planForward.output.semOLB);
                    $scope.planForward.output.semMin = Number($scope.planForward.output.semBMin) + Number($scope.planForward.output.semCMin) + Number($scope.planForward.output.semPMin) + Number($scope.planForward.output.semOMin);
                    $scope.planForward.output.semMax = Number($scope.planForward.output.semBMax) + Number($scope.planForward.output.semCMax) + Number($scope.planForward.output.semPMax) + Number($scope.planForward.output.semOMax);
                    $scope.planForward.output.semUB = Number($scope.planForward.output.semBUB) + Number($scope.planForward.output.semCUB) + Number($scope.planForward.output.semPUB) + Number($scope.planForward.output.semOUB);

                    $scope.planForward.output.totLB = Number($scope.planForward.output.semLB) + Number($scope.planForward.output.disLB) + Number($scope.planForward.output.socLB) + Number($scope.planForward.output.affLB) + Number($scope.planForward.output.parLB);
                    $scope.planForward.output.totMin = Number($scope.planForward.output.semMin) + Number($scope.planForward.output.disMin) + Number($scope.planForward.output.socMin) + Number($scope.planForward.output.affMin) + Number($scope.planForward.output.parMin);
                    $scope.planForward.output.totMax = Number($scope.planForward.output.semMax) + Number($scope.planForward.output.disMax) + Number($scope.planForward.output.socMax) + Number($scope.planForward.output.affMax) + Number($scope.planForward.output.parMax);
                    $scope.planForward.output.totUB = Number($scope.planForward.output.semUB) + Number($scope.planForward.output.disUB) + Number($scope.planForward.output.socUB) + Number($scope.planForward.output.affUB) + Number($scope.planForward.output.parUB);

                    calculateDifference();
                    $scope.planForward.output.semSlide = Number($scope.planForward.output.semAS);
                    $scope.planForward.output.totSlide = Number($scope.planForward.output.totAS);
                    $scope.$watchCollection('planForward.output', function () {
                        $scope.slideValidate();
                    });
                }
            });
        }
        else {
            clearInterval(count);
        }
    }

    //main
    //check objId
    if (!analysis.objIds.current) {
        location.path("/planforward/init");
    }
    else {
        user.getUser(function (user) {
            $scope.user = user;
        });
        scenarios.getScenarioById(analysis.objIds.current, function (scenario) {
            console.log(scenario);
            $scope.scenario = scenario;
            scenarios.dataInfo = scenario;
        });
        doGet();
        count = setInterval(doGet, 1000 * 0.3); //set frequency
        $scope.$on('$destroy', function () {
            clearInterval(count);
        });
    }

}]);

forward.directive('formatInput', ['$filter', function ($filter) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {
            if (!ngModel) return;

            ngModel.$formatters.unshift(function (a) {
                return $filter('formatCurrency')(ngModel.$modelValue)
            });

            ngModel.$parsers.unshift(function (viewValue) {
                var plainNumber = viewValue.replace(/[^\d]/g, '');
                elem.val($filter('formatCurrency')(plainNumber));
                return plainNumber;
            });
        }
    };
}])
    .directive('stringToNumber', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function (value) {
                    return '' + value;
                });
                ngModel.$formatters.push(function (value) {
                    return parseFloat(value, 10);
                });
            }
        };
    })
    .filter('formatCurrency', function () {
        return function (input) {
            input = input || 0;
            if (typeof input === 'string') {
                input = input.split(',').join('');
            }
            var output = Number(input).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').toString();
            return "$" + output.substr(0, output.length - 3);
        }
    })
    .value('compareChartConfig', {
        width: 360,
        height: 450,
        margin: {left: 0, top: 80, right: 0, bottom: 30}
    });
forward.directive('formatInput2', ['$filter', function ($filter) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {
            if (!ngModel) return;

            ngModel.$formatters.unshift(function (a) {
                return $filter('number')(ngModel.$modelValue, 0)
            });

            ngModel.$parsers.unshift(function (viewValue) {
                var plainNumber = viewValue.replace(/[^\d]/g, '');
                elem.val($filter('number')(plainNumber, 0));
                return plainNumber;
            });
        }
    };
}]);