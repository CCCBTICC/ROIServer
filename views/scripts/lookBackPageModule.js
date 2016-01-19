/**
 * Created by Haizhou on 5/8/2015.
 */
//'use strict';

var back = angular.module("ROIClientApp");

back.controller('backInitCtrl', ['$scope', 'analysis', 'scenarios', 'user', 'history', 'actionObjInfo', '$location', '$filter', function ($scope, analysis, scenarios, user, history, actionObjInfo, location, filter) {
    //scope vars
    $scope.tooltips = {
        brand: "Select the Brand. The default value is Shutterfly.",
        attr: "Select the revenue attribution method for the channel revenue forecast. The options are LTA (Last Touch Attribution) or MTA (Multi-Touch Attribution).",
        beginPeriod: "Select the first month of the planning cycle. By default, it is the last month of historical data available with planning duration up to 6 months.",
        endPeriod: "Select the last month of the planning cycle. By default, it is the last month of historical data available with planning duration up to 6 months.",
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
                    var d = new Date(res[0]);
                    $scope.calender.minDate = new Date(d.getFullYear(), d.getMonth() + 1, 1);
                    d = new Date(res[1]);
                    $scope.calender.maxDate = new Date(d.getFullYear(), d.getMonth() + 2, 0);
                    var date = $scope.calender.maxDate;
                    $scope.dataInfo.beginDate = new Date(date.getFullYear(), date.getMonth(), 1);
                    $scope.dataInfo.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                    $scope.calender.modifyDate();
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
            console.log($scope.calender.opened.endPeriod);
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
            console.log($scope.calender.eMaxDate);
            if (!$scope.dataInfo.endDate || $scope.dataInfo.endDate < $scope.dataInfo.beginDate) {
                $scope.dataInfo.endDate = $scope.dataInfo.beginDate;
            }
            console.log($scope.calender.eMaxDate);

            if ($scope.calender.eMaxDate < $scope.dataInfo.endDate) {
                $scope.dataInfo.endDate = $scope.calender.eMaxDate;
                console.log($scope.calender.eMaxDate);

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
        owner: "",
        IncludeDataForThePeriod:""
    };
    $scope.lookBack = {init: {}};
    //scope functions
    $scope.logout = function () {
        window.sessionStorage.removeItem('username');
        window.location.href = ('http://' + window.location.hostname + ':3001/index.html');
    };
    $scope.nextPage = function () {
        completeDataInfo();
        passInfoToTempData();
        analysis.postData($scope.lookBack.init, $scope.dataInfo, function (res) {
            console.log(res);
            location.path('lookback/add');
            console.log($scope.lookBack.init);
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
        console.log($scope.lookBack.init.lmTouch);
        $scope.lookBack.init.lmTouch = $scope.dataInfo.lmTouch === 'LTA' ? 'Last Touch' : 'Multi-Touch';
        $scope.lookBack.init.StartingTime = filter('date')($scope.dataInfo.beginDate, 'yyyy-MM');
        $scope.lookBack.init.EndingTime = filter('date')($scope.dataInfo.endDate, 'yyyy-MM');
        //$scope.lookBack.init.Spend = $scope.dataInfo.spend;
        $scope.lookBack.init.PlanMonths = length;
        $scope.lookBack.init.Algorithm = 1;
        $scope.lookBack.init.IncludeDataForThePeriod = $scope.dataInfo.included;
    }

    function completeDataInfo() {
        $scope.dataInfo.scenarioId = "SFLY-" +
            filter('date')($scope.dataInfo.beginDate, 'MMMyyyy') + "-" +
            filter('date')($scope.dataInfo.endDate, 'MMMyyyy') + "-" +
            $scope.dataInfo.lmTouch.charAt(0) + "-000";
        $scope.dataInfo.dataThrough = $scope.dataInfo.included === 'Yes' ?
            $scope.dataInfo.endDate :
            new Date($scope.dataInfo.beginDate.getFullYear(), $scope.dataInfo.beginDate.getMonth(), 0);
        $scope.dataInfo.from = "back";
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
    while (actionObjInfo.length) {
        actionObjInfo.shift();
    }
    //init analysis.tempData
    Object.keys(analysis.tempData).forEach(function (key) {
        analysis.tempData[key] = "";
    });
    // get data template and dataInfo
    $scope.lookBack.init = analysis.tempData;
    scenarios.dataInfo = $scope.dataInfo;
    //init calender
    $scope.calender.initDate();

}]);

back.controller('backAddCtrl', ['$scope', 'analysis', 'scenarios', '$location', 'history', '$filter', function ($scope, analysis, scenarios, location, history, filter) {
    //scope vars
    $scope.tooltips = {
        brand: "This is the drop down for selecting the Brand for which you are planning your marketing spend. The default value is Shutterfly.",
        attr: "This is where you select the Revenue attribution method you want the tool to use for Channel Revenue forecast. The options are: LTA -- Last Touch Attribution and MTA -- Multi-Touch Attribution.",
        beginPeriod: "The first month of the planning period. \n For Look Back, it is the first month of the period that you want to review. By default, it is the last month of historical data in the tool database.",
        endPeriod: "The last month of the planning period. \n It is set based on the Begin Period selection. It is equal to the earliest of last month of historical data or Begin Period value + 5",
        spend: "Input total spend for portfolio (SEM, Display, Social, Affiliates and Partners) for the planning cycle.  By default, the pre-filled value represents the prior year's actual spend for the planning cycle with the ability to override value.",
        included: "If you want to run a post-mortem, select Yes. Then data through the end period will be used for optimization. Select No if you want to simulate a planning scenario going back to past. Then data used for optimization will be through the month prior to begin period.",
        Constraints: "Select 'Yes' if you want to apply channel spend constraints or 'No' if you want to keep SEM Brand and Partners fixed to actual spend for the planning cycle.",
        applyConstraints:"Select 'Yes' if you want to apply channel spend constraints or 'No' if you want to keep SEM Brand and Partners fixed to actual spend for the planning cycle.",
        scalingFactor: 'A method to adjust for situations when ad buying efficiency has changed from historical cost structure (CPC/CPM). Default value of 1.0 assumes no change in buying efficiency. It is inverse to cost efficiency. If cost goes up, lower it and vice versa. See User Guide for illustration.',
        maintainSpend: "Click box if you want the prior year's actual spend to be fixed for the spend recommendations.  Unclick box allows the tool to optimize a given channel spend within the upper and lower limits."
    };
    $scope.dataInfo = {};
    $scope.lookBack = {
        output: {},
        history: {},
        ControlChannelsDM: [],
        ControlChannels: [],
        ChontrolChannelsData: [],
        ControlChannelsShow: "Yes"
    };
    $scope.error = false;
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
                    console.log(!$scope.semTotalCheckBox);
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
    $scope.getJson = false;
    $scope.channelShow = false;

    //calender
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
            if (!$scope.lookBack.output.tvBeginDate || $scope.lookBack.output.tvBeginDate < $scope.calender.minDate || $scope.lookBack.output.tvBeginDate > $scope.calender.maxDate) {
                $scope.lookBack.output.tvBeginDate = $scope.calender.minDate;
            }

            if (!$scope.lookBack.output.tvEndDate || $scope.lookBack.output.tvEndDate < $scope.dataInfo.beginDate || $scope.lookBack.output.tvEndDate > $scope.calender.maxDate) {
                $scope.lookBack.output.tvEndDate = $scope.lookBack.output.tvBeginDate;
            }
        }
    };

    //scope functions
    $scope.nextPage = function () {
        $scope.spendValidate();
        if (!$scope.error) {
            if ($scope.lookBack.ControlChannelsShow === "No") {
                passInfoToData();
                //post data to R
                console.log($scope.dataInfo);
                analysis.postData($scope.lookBack.output, $scope.dataInfo, function (res) {
                    console.log(res);
                    location.path('myscenarios');
                });
            }
            else {
                $scope.channelShow = !$scope.channelShow;
                $scope.lookBack.ControlChannelsShow = "No";
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
        $scope.error = false;
    };
    $scope.spendValidate = function () {
        console.log('validating');
        $scope.error = false;
        $scope.lookBack.output.semMin =
            Number($scope.lookBack.output.semBMin) +
            Number($scope.lookBack.output.semCMin) +
            Number($scope.lookBack.output.semPMin) +
            Number($scope.lookBack.output.semOMin);
        $scope.min =
            Number($scope.lookBack.output.semMin) +
            Number($scope.lookBack.output.disMin) +
            Number($scope.lookBack.output.socMin) +
            Number($scope.lookBack.output.affMin) +
            Number($scope.lookBack.output.parMin);

        $scope.lookBack.output.semMax =
            Number($scope.lookBack.output.semBMax) +
            Number($scope.lookBack.output.semCMax) +
            Number($scope.lookBack.output.semPMax) +
            Number($scope.lookBack.output.semOMax);
        $scope.max =
            Number($scope.lookBack.output.semMax) +
            Number($scope.lookBack.output.disMax) +
            Number($scope.lookBack.output.socMax) +
            Number($scope.lookBack.output.affMax) +
            Number($scope.lookBack.output.parMax);

        if (Number($scope.dataInfo.spend) < $scope.min) {
            $scope.error = true;
            $scope.errorMessage = "Your Minimum constraint is over your Portfolio Spend by " +
                filter('formatCurrency')($scope.min - $scope.dataInfo.spend) +
                ". Please reduce to continue.";
        }
        if (Number($scope.dataInfo.spend) > $scope.max) {
            $scope.error = true;
            $scope.errorMessage = "Your Maximum constraint is under your Portfolio Spend by " +
                filter('formatCurrency')($scope.dataInfo.spend - $scope.max) +
                ". Please increase to continue.";
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
                    $scope.calender.initDate();
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
                            totPR: history.SEM_MTA + history.Display_MTA + history.Affiliates_MTA + history.FB_MTA + history.Partners_MTA,
                            DMS: history.DMS,
                            TV: history.TV,
                            TVImpression: history.TVImpression
                        };
                        console.log($scope.lookBack.history.DMS);
                        if ($scope.lookBack.output.lmTouch === "Last Touch") {
                            $scope.lookBack.history.semPR = history.SEM_LTA;
                            $scope.lookBack.history.disPR = history.Display_LTA;
                            $scope.lookBack.history.affPR = history.Affiliates_LTA;
                            $scope.lookBack.history.socPR = history.FB_LTA;
                            $scope.lookBack.history.parPR = history.Partners_LTA;
                            $scope.lookBack.history.totPR = history.SEM_LTA + history.Display_LTA + history.Affiliates_LTA + history.FB_LTA + history.Partners_LTA;
                        }
                        $scope.lookBack.history.ROI = ($scope.lookBack.history.totPR / $scope.lookBack.history.totSR - 1) * 100;
                        $scope.dataInfo.spend = $scope.lookBack.history.totSR;
                        fix();
                    });

                    $scope.lookBack.output.semLB = Number($scope.lookBack.output.semBLB) + Number($scope.lookBack.output.semCLB) + Number($scope.lookBack.output.semPLB) + Number($scope.lookBack.output.semOLB);
                    $scope.lookBack.output.semUB = Number($scope.lookBack.output.semBUB) + Number($scope.lookBack.output.semCUB) + Number($scope.lookBack.output.semPUB) + Number($scope.lookBack.output.semOUB);

                    var b = new Date($scope.lookBack.output.StartingTime);
                    b = new Date(b.getFullYear(), b.getMonth() + 1);
                    //console.log(b);
                    var e = new Date($scope.lookBack.output.EndingTime);
                    e = new Date(e.getFullYear(), e.getMonth() + 1);
                    //console.log(e);
                    $scope.size = [1, 2, 3, 4, 5, 6];
                    while (b <= e) {
                        $scope.lookBack.ControlChannels.push(b);
                        b = new Date(b.getFullYear(), b.getMonth() + 1, 1);
                        $scope.size.shift();
                    }
                    var month = ['dirSpendM1', 'dirSpendM2', 'dirSpendM3', 'dirSpendM4', 'dirSpendM5', 'dirSpendM6'];
                    month.forEach(function (key) {
                        if ($scope.lookBack.output[key]) {
                            $scope.lookBack.ControlChannelsDM.push($scope.lookBack.output[key]);
                        }
                    });
                    //
                    //console.log($scope.lookBack.history.DMS);
                    //$scope.lookBack.history.DMS.forEach(function(key, index){
                    //    $scope.lookBack.ChontrolChannelsData[index] = {
                    //        "month":$scope.lookBack.ControlChannels[index],
                    //        "spend":key
                    //    }
                    //});
                }
            });
        }
        else {
            clearInterval(count);
        }
    }

    function passInfoToData() {
        $scope.lookBack.output.Algorithm = 2;
        $scope.lookBack.output.AlgStartingTime = "";
        $scope.lookBack.output.AlgEndingTime = "";
        $scope.lookBack.output.AlgDuration = "";
        $scope.lookBack.output.Spend = $scope.dataInfo.spend;
    }

    function fix() {
        $scope.lookBack.output.semMin = $scope.lookBack.output.semLB;
        $scope.lookBack.output.semMax = $scope.lookBack.output.semUB;
        $scope.lookBack.output.semBMin = $scope.lookBack.output.semBLB;
        $scope.lookBack.output.semBMax = $scope.lookBack.output.semBUB;
        $scope.lookBack.output.semCMin = $scope.lookBack.output.semCLB;
        $scope.lookBack.output.semCMax = $scope.lookBack.output.semCUB;
        $scope.lookBack.output.semPMin = $scope.lookBack.output.semPLB;
        $scope.lookBack.output.semPMax = $scope.lookBack.output.semPUB;
        $scope.lookBack.output.semOMin = $scope.lookBack.output.semOLB;
        $scope.lookBack.output.semOMax = $scope.lookBack.output.semOUB;
        $scope.lookBack.output.disMin = $scope.lookBack.output.disLB;
        $scope.lookBack.output.disMax = $scope.lookBack.output.disUB;
        $scope.lookBack.output.socMin = $scope.lookBack.output.socLB;
        $scope.lookBack.output.socMax = $scope.lookBack.output.socUB;
        $scope.lookBack.output.affMin = $scope.lookBack.output.affLB;
        $scope.lookBack.output.affMax = $scope.lookBack.output.affUB;
        $scope.lookBack.output.parMin = $scope.lookBack.output.parLB;
        $scope.lookBack.output.parMax = $scope.lookBack.output.parUB;

        if ($scope.selectPlan.checkBox.semBrand) {
            $scope.lookBack.output.semBMin = $scope.lookBack.output.semBMax = $scope.lookBack.history.semBSR;
        }
        if ($scope.selectPlan.checkBox.semCard) {
            $scope.lookBack.output.semCMin = $scope.lookBack.output.semCMax = $scope.lookBack.history.semCSR;
        }
        if ($scope.selectPlan.checkBox.semPhotobook) {
            $scope.lookBack.output.semPMin = $scope.lookBack.output.semPMax = $scope.lookBack.history.semPSR;
        }
        if ($scope.selectPlan.checkBox.semOthers) {
            $scope.lookBack.output.semOMin = $scope.lookBack.output.semOMax = $scope.lookBack.history.semOSR;
        }
        if ($scope.selectPlan.checkBox.display) {
            $scope.lookBack.output.disMin = $scope.lookBack.output.disMax = $scope.lookBack.history.disSR;
        }
        if ($scope.selectPlan.checkBox.social) {
            $scope.lookBack.output.socMin = $scope.lookBack.output.socMax = $scope.lookBack.history.socSR;
        }
        if ($scope.selectPlan.checkBox.affiliates) {
            $scope.lookBack.output.affMin = $scope.lookBack.output.affMax = $scope.lookBack.history.affSR;
        }
        if ($scope.selectPlan.checkBox.partners) {
            $scope.lookBack.output.parMin = $scope.lookBack.output.parMax = $scope.lookBack.history.parSR;
        }
        $scope.spendValidate();
    }

    //---------------main------------------------

    //check objId
    if (!analysis.objIds.current) {
        location.path('lookback/init')
    } else {
        //get output Data
        doGet();
        count = setInterval(doGet, 1000 * 0.3);
        $scope.dataInfo = scenarios.dataInfo;
        //stop get request
        $scope.$on('$destroy', function () {
            clearInterval(count);
        });
    }
}])
;

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
            width: 500,
            barHeight: 28,
            margin: {left: 10, top: 10, right: 0, bottom: 0}
        }
    };
    $scope.showme = false;
    $scope.lookbackContentSize = 'col-sm-12';
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
    //scope functions
    $scope.slideValidate = function () {
        $scope.slideError = false;
        var sldChgFlg = {
            semCSlide: $scope.lookBack.output.semCAS - $scope.lookBack.output.semCSlide,
            semPSlide: $scope.lookBack.output.semPAS - $scope.lookBack.output.semPSlide,
            semBSlide: $scope.lookBack.output.semBAS - $scope.lookBack.output.semBSlide,
            semOSlide: $scope.lookBack.output.semOAS - $scope.lookBack.output.semOSlide,
            disSlide: $scope.lookBack.output.disAS - $scope.lookBack.output.disSlide,
            socSlide: $scope.lookBack.output.socAS - $scope.lookBack.output.socSlide,
            affSlide: $scope.lookBack.output.affAS - $scope.lookBack.output.affSlide,
            parSlide: $scope.lookBack.output.parAS - $scope.lookBack.output.parSlide
        };
        var min = {
            semCSlide: $scope.lookBack.output.semCMin,
            semPSlide: $scope.lookBack.output.semPMin,
            semBSlide: $scope.lookBack.output.semBMin,
            semOSlide: $scope.lookBack.output.semOMin,
            disSlide: $scope.lookBack.output.disMin,
            socSlide: $scope.lookBack.output.socMin,
            affSlide: $scope.lookBack.output.affMin,
            parSlide: $scope.lookBack.output.parMin
        };
        var max = {
            semCSlide: $scope.lookBack.output.semCMax,
            semPSlide: $scope.lookBack.output.semPMax,
            semBSlide: $scope.lookBack.output.semBMax,
            semOSlide: $scope.lookBack.output.semOMax,
            disSlide: $scope.lookBack.output.disMax,
            socSlide: $scope.lookBack.output.socMax,
            affSlide: $scope.lookBack.output.affMax,
            parSlide: $scope.lookBack.output.parMax
        };
        var sum = 0;
        var tmp = 0;
        var sumMax = 0;
        var tmpMax = 0;
        Object.keys(sldChgFlg).forEach(function (key) {
            if (sldChgFlg[key] == 0) {
                tmp = min[key];
                tmpMax = max[key];
            } else {
                tmp = $scope.lookBack.output[key];
                tmpMax = tmp;
            }
            sum += Number(tmp);
            sumMax += Number(tmpMax);
        });
        if (Number($scope.lookBack.output.totSR) < sum) {
            console.log(sum);
            $scope.slideError = true;
            $scope.slideErrorValue = "Lower  \n your spend constraints by\n" + filter('formatCurrency')(sum - $scope.lookBack.output.totSR);
        }
        if (Number($scope.lookBack.output.totSR) > sumMax) {
            $scope.slideError = true;
            $scope.slideErrorValue = "Increase  \n your spend constraints by\n" + filter('formatCurrency')($scope.lookBack.output.totSR - sumMax);
        }
        //console.log($scope.slideError);
    };
    $scope.reRun = function () {
        passInfoToData();
        $scope.scenario.scenarioId = $scope.scenario.scenarioId.slice(0, -1) + "X";
        analysis.postData($scope.lookBack.output, $scope.scenario, function (res) {
            console.log(res);
            //var count;
            //$scope.getJson = false;
            //doGet();
            //count = setInterval(doGet, 1000 * 0.3); //set frequency
            //function doGet() {
            //    if ($scope.getJson === false) {
            //        analysis.getData(function (data) {
            //            if (data) {
            //                console.log("from doGet in back/output");
            //                console.log(data);
            //                $scope.getJson = true;
            //                $scope.lookBack.output = data;
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
    $scope.reset = function () {
        $scope.slideError = false;
        $scope.lookBack.output.semBSlide = $scope.lookBack.output.semBAS;
        $scope.lookBack.output.semCSlide = $scope.lookBack.output.semCAS;
        $scope.lookBack.output.semPSlide = $scope.lookBack.output.semPAS;
        $scope.lookBack.output.semOSlide = $scope.lookBack.output.semOAS;

        $scope.lookBack.output.disSlide = $scope.lookBack.output.disAS;
        $scope.lookBack.output.socSlide = $scope.lookBack.output.socAS;
        $scope.lookBack.output.affSlide = $scope.lookBack.output.affAS;
        $scope.lookBack.output.parSlide = $scope.lookBack.output.parAS;
    };
    $scope.edit = function () {
        location.path('myscenarios/edit');
    }; //finished
    $scope.export = function () {
        location.path('myscenarios/export');
    }; //pause
    $scope.share = function () {
        location.path('myscenarios/share');
    };  // pause
    $scope.toggle = function () {
        if ($scope.showme == false) {
            $scope.lookbackContentSize = 'col-sm-8';
            $scope.showme = true;
            $scope.showGraph = 'Hide Graph';
            //adjustScroll();
            if($scope.hideSemItems){
                insertChartData('part');
            }else{
                insertChartData('full');
            }
        }
        else {
            $scope.lookbackContentSize = 'col-sm-12';
            $scope.showme = false;
            $scope.showGraph = 'Show Graph';
            //adjustScroll();
        }
    };  // show&hide graph


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
                     chart.renderer.text('<span>Scenario ID: '+$scope.scenario.scenarioId+'<br>From '+filter('date')($scope.scenario.beginDate,'MMM-yyyy')+' To '+filter('date')($scope.scenario.endDate,'MMM-yyyy')+'  '+$scope.lookBack.output.lmTouch+'</span><br/><span>Portfolio Spend: '+ filter('formatCurrency')($scope.scenario.spend) +'</span><br/><span>Data through: '+ filter('date')($scope.scenario.dataThrough,'MMM-yyyy')+'</span>', 90, 40)
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
                        console.log($scope.scenario);
                     //chart.renderer.text('<span>'+$scope.scenario.scenarioId+'</span><br/><span>Portfolio Spend: '+ filter('formatCurrency')($scope.scenario.spend) +'</span><br/><span>Data through: '+ filter('date')($scope.scenario.dataThrough,'MMM-yyyy')+'</span>', 110, 50)
                     chart.renderer.text('<span>Scenario ID: '+$scope.scenario.scenarioId+'<br>From '+filter('date')($scope.scenario.beginDate,'MMM-yyyy')+' To '+filter('date')($scope.scenario.endDate,'MMM-yyyy')+'  '+$scope.lookBack.output.lmTouch+'</span><br/><span>Portfolio Spend: '+ filter('formatCurrency')($scope.scenario.spend) +'</span><br/><span>Data through: '+ filter('date')($scope.scenario.dataThrough,'MMM-yyyy')+'</span>', 90, 40)
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


    //functions
    var count;

    function range() {
        $scope.lookBack.output.semBSlide++;
        $scope.lookBack.output.semCSlide++;
        $scope.lookBack.output.semPSlide++;
        $scope.lookBack.output.semOSlide++;

        $scope.lookBack.output.disSlide++;
        $scope.lookBack.output.socSlide++;
        $scope.lookBack.output.affSlide++;
        $scope.lookBack.output.parSlide++;
    }

    function calculateDifference() {
        $scope.lookBack.difference = {
            semSD: $scope.lookBack.output.semAS - $scope.lookBack.history.semSR,
            semBSD: $scope.lookBack.output.semBAS - $scope.lookBack.history.semBSR,
            semCSD: $scope.lookBack.output.semCAS - $scope.lookBack.history.semCSR,
            semOSD: $scope.lookBack.output.semOAS - $scope.lookBack.history.semOSR,
            semPSD: $scope.lookBack.output.semPAS - $scope.lookBack.history.semPSR,
            disSD: $scope.lookBack.output.disAS - $scope.lookBack.history.disSR,
            affSD: $scope.lookBack.output.affAS - $scope.lookBack.history.affSR,
            socSD: $scope.lookBack.output.socAS - $scope.lookBack.history.socSR,
            parSD: $scope.lookBack.output.parAS - $scope.lookBack.history.parSR,
            totSD: $scope.lookBack.output.totAS - $scope.lookBack.history.totSR,
            semRD: $scope.lookBack.output.semAR - $scope.lookBack.history.semPR,
            disRD: $scope.lookBack.output.disAR - $scope.lookBack.history.disPR,
            affRD: $scope.lookBack.output.affAR - $scope.lookBack.history.affPR,
            socRD: $scope.lookBack.output.socAR - $scope.lookBack.history.socPR,
            parRD: $scope.lookBack.output.parAR - $scope.lookBack.history.parPR,
            totRD: $scope.lookBack.output.totAR - $scope.lookBack.history.totPR,
            ROID: $scope.lookBack.output.run2ProjROI.slice(0, -1) - $scope.lookBack.history.ROI,
            changeR: ( $scope.lookBack.output.OptTotalRevenue / $scope.lookBack.history.Revenue - 1) * 100
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

    function passInfoToData() {
        $scope.lookBack.output.UserName = $scope.user.name;
        $scope.lookBack.output.Algorithm = 3;
        $scope.lookBack.output.AlgStartingTime = "";
        $scope.lookBack.output.AlgEndingTime = "";
        $scope.lookBack.output.AlgDuration = "";
    }

    function doGet() {
        if ($scope.getJson === false) {
            analysis.getData(function (data) {
                if (data) {
                    console.log("from doGet in back/output", data);
                    $scope.getJson = true;
                    $scope.lookBack.output = data;
                    range();
                    scenarios.editScenario(data.UserName, analysis.objIds.current, {exist: true}, function (res) {
                        console.log(res);
                        $scope.reset();
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
                            totPR: history.SEM_MTA + history.Display_MTA + history.Affiliates_MTA + history.FB_MTA + history.Partners_MTA,
                            Revenue:history.Revenue
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
                        //console.log($scope.lookBack.history);
                        //console.log($scope.lookBack.difference);

                        calculateDifference();
                        $scope.$watchCollection('lookBack.output', function () {
                            $scope.slideValidate();
                        });
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
        location.path("/lookback/init");
    } else {
        user.getUser(function (user) {
            $scope.user = user;
        });
        scenarios.getScenarioById(analysis.objIds.current, function (scenario) {
            console.log(scenario);
            scenarios.dataInfo = scenario;
            $scope.scenario = scenario;
        });
        $scope.getJson = false;
        doGet();
        count = setInterval(doGet, 1000 * 0.3); //set frequency
    }
    $scope.$on('$destroy', function () {
        clearInterval(count);
    });//stop get request

    $scope.value = 0;
    $scope.test1 = function () {
        $scope.test.value = $scope.test.value - 0 + 10000;
    };
    $scope.test2 = function () {
        $scope.lookBack.output.semBSlide = $scope.lookBack.output.semBSlide - 0 + 1000;
    }
}]);

