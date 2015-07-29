/**
 * Created by Haizhou on 5/11/2015.
 * modified by Chenghui on 7/17/2015
 */
'use strict';
var forward = angular.module("forwardModule", []);
forward.factory('forwardManager', function ($http) {
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
    var objID = "";
    var url = "http://" + window.location.hostname + ":3001/analysis/";
    var get = function (cb, id) {
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
            url: url + 'planforward',
            data: {data: data, username: data.UserName}
        }).success(function (id) {
            objID = id;
            cb(objID);
        });
    };

    return {
        getTempData: function (cb) {
            cb(tempData);
        },
        setTempData: function (data) {
            tempData = data;
        },
        getData: function (cb, id) {
            if (!id) {
                get(cb, objID);
            }
            else {
                get(cb, id);
            }
        },
        postData: post,
        getName: function (cb) {
            cb(objID);
        },
        setName: function (id) {
            objID = id;
        }
    }
});

forward.controller('forwardInitCtrl', ['$scope', 'forwardManager', 'user', '$location', '$filter','history', function ($scope, manager, user, location, filter,history) {

    // Calendar settings
    ////scope vars for calender settings
    $scope.opened = {};
    $scope.minDate=new Date(2017,1,1);
    $scope.format = 'MMMM-dd-yyyy';
    $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1,
        minMode: 'month'
    };
    $scope.initDate = function () {
        var date = $scope.minDate;
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
        if (!$scope.planForward.endPeriod) {
            $scope.planForward.endPeriod = $scope.planForward.beginPeriod;
        }
        var d = new Date($scope.planForward.endPeriod);
        $scope.planForward.endPeriod = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        $scope.modifyEndDate();
    };
    $scope.modifyEndDate = function () {
        if (!$scope.planForward.beginPeriod) {
            $scope.planForward.beginPeriod = $scope.minDate;
        }
        var d = new Date($scope.planForward.beginPeriod);
        if (d > $scope.maxDate) {
            d = $scope.maxDate
        }
        $scope.planForward.beginPeriod = new Date(d.getFullYear(), d.getMonth(), 1);
        if (new Date($scope.planForward.beginPeriod.getFullYear(), $scope.planForward.beginPeriod.getMonth() + 6, 0) < new Date($scope.minDate.getFullYear(), $scope.minDate.getMonth() + 8, 0)) {
            $scope.eMaxDate = new Date($scope.planForward.beginPeriod.getFullYear(), $scope.planForward.beginPeriod.getMonth() + 6, 0);
        } else {
            $scope.eMaxDate = new Date($scope.minDate.getFullYear(), $scope.minDate.getMonth() + 8, 0)
        }
        if ($scope.eMaxDate < $scope.planForward.endPeriod) {
            $scope.planForward.endPeriod = $scope.eMaxDate;
        }
        if ($scope.planForward.beginPeriod > $scope.planForward.endPeriod) {
            d = new Date($scope.planForward.beginPeriod);
            $scope.planForward.endPeriod = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        }
    };
    // calender settings END

    //scope functions
    $scope.initForm = function () {
        $scope.planForward = {};
        $scope.planForward.init = {};
        $scope.brands = ['Shutterfly'];
        $scope.planForward.brand = $scope.brands[0];
        $scope.planForward.attribution = 'LTA';
        history.getHistoryDate(function(res){
            console.log("from planforward");
            $scope.historydate=res;
            var d = new Date($scope.historydate[1]);
            $scope.minDate = new Date(d.getFullYear(), d.getMonth() + 2, 1);
            $scope.maxDate = new Date($scope.minDate.getFullYear(), $scope.minDate.getMonth() + 6, 0);
            console.log($scope.minDate);
            $scope.initDate();
        });

        $scope.planForward.spend = "5000000";
        // tooltips
        $scope.brandTooltips = 'brandTooltips';
        $scope.attrTooltips = 'attrTooltips';
        $scope.beginPeriodTooltips = 'beginPeriodTooltips';
        $scope.endPeriodTooltips = 'endPeriodTooltips';
        $scope.spendTooltips = 'spendTooltips';
    };
    $scope.Next = function () {
        var length = $scope.planForward.endPeriod.getMonth() - $scope.planForward.beginPeriod.getMonth() + 1;
        if (length <= 0) {
            length += 12;
        }
        // first step input init
        $scope.planForward.init.UserName = $scope.user.name;
        $scope.planForward.init.Brand = $scope.planForward.brand;
        $scope.planForward.init.lmTouch = $scope.planForward.attribution === 'LTA' ? 'Last Touch' : 'Multi-Touch';
        $scope.planForward.init.StartingTime = filter('date')($scope.planForward.beginPeriod, 'yyyy-MM');
        $scope.planForward.init.EndingTime = filter('date')($scope.planForward.endPeriod, 'yyyy-MM');
        $scope.planForward.init.Spend = $scope.planForward.spend;
        $scope.planForward.init.PlanMonths = length;
        $scope.planForward.init.Algorithm = 1;
        //post input info to R
        manager.postData($scope.planForward.init, function (res) {
            console.log('from next() in forward/init');
            console.log(res);
            location.path('planforward/constrict');

        });
    };
    // main
    user.getUser(function (user) {
        $scope.user = user;
    });
    $scope.initForm();

    manager.getTempData(function (data) {
        $scope.planForward.init = data;
    });

}]);

forward.controller('forwardConstrictCtrl', ['$scope', 'forwardManager', '$location', '$filter','history', function ($scope, manager, location, filter,history) {
    //check if data id exist in factory
    manager.getName(function (name) {
        if (!name) {
            location.path("/planforward/init");
        }
    });

    var count;
    function doGet() {
        if ($scope.getJson === false) {
            manager.getData(function (data) {
                if (data) {
                    console.log("from doGet in forward/constrict after got Data");
                    console.log(data);
                    $scope.getJson = true;
                    $scope.planForward.output = data;

                    //change type for calculating
                    $scope.planForward.output.semLB = Number($scope.planForward.output.semBLB) + Number($scope.planForward.output.semCLB) + Number($scope.planForward.output.semPLB) + Number($scope.planForward.output.semOLB);
                    $scope.planForward.output.semUB = Number($scope.planForward.output.semBUB) + Number($scope.planForward.output.semCUB) + Number($scope.planForward.output.semPUB) + Number($scope.planForward.output.semOUB);
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

                    //$scope.planForward.output.semPR = "";
                    //$scope.planForward.output.disPR = "";
                    //$scope.planForward.output.socPR = "";
                    //$scope.planForward.output.affPR = "";
                    //$scope.planForward.output.parPR = "";
                    //$scope.planForward.output.semAR = "";
                    //$scope.planForward.output.disAR = "";
                    //$scope.planForward.output.socAR = "";
                    //$scope.planForward.output.affAR = "";
                    //$scope.planForward.output.parAR = "";

                    var b = new Date($scope.planForward.output.StartingTime);
                    b = new Date(b.getFullYear(), b.getMonth() + 1);
                    console.log(b);
                    var e = new Date($scope.planForward.output.EndingTime);
                    e = new Date(e.getFullYear(), e.getMonth() + 1);
                    console.log(e);
                    while (b <= e) {
                        $scope.planForward.ControlChannels.push(b);
                        b = new Date(b.getFullYear(), b.getMonth() + 1, 1);
                    }
                    var month = ['dirSpendM1', 'dirSpendM2', 'dirSpendM3', 'dirSpendM4', 'dirSpendM5', 'dirSpendM6'];
                    month.forEach(function (key) {
                        if ($scope.planForward.output[key]) {
                            $scope.planForward.ControlChannelsDM.push($scope.planForward.output[key]);
                        }
                    });

                    //get historyData
                    //history.getHistoryData($scope.planForward.StartingTime,$scope.planForward.EndingTime,function(dataArray){
                    //    console.log('from history in doGet in forward/constrict');
                    //    console.log(dataArray);
                    //    Object.keys(dataArray[0]).forEach(function(key){
                    //        var value=0;
                    //        dataArray.forEach(function(data){
                    //            value+=data[key];
                    //        });
                    //        $scope.planForward.history[key]=value;
                    //    });
                    //});

                }
            });
        }
        else {
            clearInterval(count);
        }
    }

    //initial controller scope
    $scope.planForward = {
        output: {},
        history:{},
        ControlChannelsDM: [],
        ControlChannels: [],
        selectPlan: {
            semBrand: false,
            semCard: false,
            semPhotobook: false,
            semOthers: false,
            display: false,
            social: false,
            affiliates: false,
            partners: false
        },
        semTotal: false
    };
    $scope.slideError = false;
    $scope.getJson = false;

    //checkbox validation
    $scope.Count = function () {
        var count = 0;
        $scope.disable = {
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
        Object.keys($scope.planForward.selectPlan).forEach(function (key) {
            if ($scope.planForward.selectPlan[key]) {
                count++;
                // min=max=$scope.planForward.history[key];
            }
        });
        if (count > 2) {
            if (!$scope.planForward.semTotal) {
                $scope.disable.semTotal = true;
            }
        }
        if (count > 5) {
            Object.keys($scope.planForward.selectPlan).forEach(function (key) {
                if (!$scope.planForward.selectPlan[key]) {
                    $scope.disable[key] = true;
                }
            });
        }
    };
    $scope.totCheck = function () {
        if (!$scope.planForward.semTotal) {
            Object.keys($scope.planForward.selectPlan).forEach(function (key) {
                $scope.planForward.selectPlan[key] = key.toString().indexOf('sem') < 0 ? $scope.planForward.selectPlan[key] : false;
            });
        } else {
            Object.keys($scope.planForward.selectPlan).forEach(function (key) {
                $scope.planForward.selectPlan[key] = key.toString().indexOf('sem') < 0 ? $scope.planForward.selectPlan[key] : true;
            });
        }
        $scope.Count();
    };
    $scope.subCheck = function () {
        $scope.planForward.semTotal = !!($scope.planForward.selectPlan.semBrand && $scope.planForward.selectPlan.semCard && $scope.planForward.selectPlan.semPhotobook && $scope.planForward.selectPlan.semOthers);
        $scope.Count();
    };
    //min max validation
    $scope.fix = function () {
        $scope.slideError = false;
        $scope.planForward.output.semMin =
            Number($scope.planForward.output.semBMin) +
            Number($scope.planForward.output.semCMin) +
            Number($scope.planForward.output.semPMin) +
            Number($scope.planForward.output.semOMin);
        var min =
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
        var max =
            Number($scope.planForward.output.semMax) +
            Number($scope.planForward.output.disMax) +
            Number($scope.planForward.output.socMax) +
            Number($scope.planForward.output.affMax) +
            Number($scope.planForward.output.parMax);

        if (Number($scope.planForward.output.Spend) < min) {
            $scope.slideError = true;
            $scope.slideErrorValue = Number($scope.planForward.output.Spend) - min;
            return;
        }
        if (Number($scope.planForward.output.Spend) > max) {
            $scope.slideError = true;
            $scope.slideErrorValue = Number($scope.planForward.output.Spend) - max;
        }
    };
    //post data to R
    $scope.run = function () {
        $scope.planForward.output.Algorithm = 2;
        $scope.planForward.output.AlgStartingTime = "";
        $scope.planForward.output.AlgEndingTime = "";
        $scope.planForward.output.AlgDuration = "";

        var beginDay = new Date($scope.planForward.output.StartingTime);
        beginDay = new Date(beginDay.getFullYear(), beginDay.getMonth() + 1, 1);
        var endDay = new Date($scope.planForward.output.EndingTime);
        endDay = new Date(endDay.getFullYear(), endDay.getMonth() + 1, 1);

        $scope.planForward.output.scenarioId =
            "SLFY-" + filter('date')(beginDay, 'MMMyyyy') +
            "-" + filter('date')(endDay, 'MMMyyyy') + "-" +
            $scope.planForward.output.lmTouch.charAt(0) + "-" + "000";
        $scope.planForward.output.from = "forward";
        //post data to R
        manager.postData($scope.planForward.output, function (res) {
            console.log(res);
            location.path("planforward/output");
        });
    };

    count = setInterval(doGet, 1000 * 1); //set frequency
    history.getHistoryDate(function(d){
        $scope.planForward.output.dataThrough = d[1];
    });
    history.getHistoryData("2015-01","2015-01",function(res){
        console.log("from history in planforward/constrict");
        console.log(res);
    });
    $scope.$on('$destroy', function () {
        clearInterval(count);
    });
}]);

forward.controller('forwardOutputCtrl', ['$scope', 'forwardManager', '$location', '$filter','history', function ($scope, manager, location, filter,history) {
    manager.getName(function (name) {
        if (!name) {
            location.path("/planforward/init");
        }
    });
    //init controller scope
    $scope.planForward = {
        output: {
            semSD: 1000,
            disSD: 0,
            socSD: 0,
            affSD: 0,
            parSD: 0,
            totSD: 0
        }
    };
    $scope.compareChart = {
        data: [
            {title: "SEM", value: $scope.planForward.output.semSD},
            {title: "Display", value: $scope.planForward.output.disSD},
            {title: "Social", value: $scope.planForward.output.socSD},
            {title: "Affiliates", value: $scope.planForward.output.affSD},
            {title: "Partners", value: $scope.planForward.output.parSD},
            {title: "Portfolio Total", value: $scope.planForward.output.totSD}
        ],
        config: {
            width: 800,
            height: 313,
            margin: {left: 100, top: 0, right: 100, bottom: 30}
        }
    };
    $scope.slideError = false;
    history.getHistoryDate(function(d){
        $scope.historydate=d;
    });

    //reset slideValue
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
    //reRun
    $scope.ReRun = function () {
        $scope.planForward.output.Algorithm = 3;
        $scope.planForward.output.AlgStartingTime = "";
        $scope.planForward.output.AlgEndingTime = "";
        $scope.planForward.output.AlgDuration = "";
        //SCENARIOID
        var beginDay, endDay;
        beginDay = new Date($scope.planForward.output.StartingTime);
        beginDay = new Date(beginDay.getFullYear(), beginDay.getMonth() + 1, 1);
        endDay = new Date($scope.planForward.output.EndingTime);
        endDay = new Date(endDay.getFullYear(), endDay.getMonth() + 1, 1);
        $scope.planForward.output.scenarioId =
            "SLFY-" + filter('date')(beginDay, 'MMMyyyy') + "-" +
            filter('date')(endDay, 'MMMyyyy') + "-" +
            $scope.planForward.output.lmTouch.charAt(0) + "-" + "00X";
        //
        $scope.planForward.output.dataThrough = $scope.historydate;
        $scope.planForward.output.from = "forward";
        //post data to R
        manager.postData($scope.planForward.output, function (res) {
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
                            $scope.planForward.output = data;

                            var beginDay, endDay;
                            beginDay = new Date($scope.planForward.output.StartingTime);
                            beginDay = new Date(beginDay.getFullYear(), beginDay.getMonth() + 1, 1);
                            endDay = new Date($scope.planForward.output.EndingTime);
                            endDay = new Date(endDay.getFullYear(), endDay.getMonth() + 1, 1);
                            $scope.planForward.output.scenarioId =
                                "SLFY-" + filter('date')(beginDay, 'MMMyyyy') + "-" +
                                filter('date')(endDay, 'MMMyyyy') + "-" +
                                $scope.planForward.output.lmTouch.charAt(0) + "-" + "00X";

                            //get sum for semTotal's elements
                            $scope.planForward.output.semLB = Number($scope.planForward.output.semBLB) + Number($scope.planForward.output.semCLB) + Number($scope.planForward.output.semPLB) + Number($scope.planForward.output.semOLB);
                            $scope.planForward.output.semMin = Number($scope.planForward.output.semBMin) + Number($scope.planForward.output.semCMin) + Number($scope.planForward.output.semPMin) + Number($scope.planForward.output.semOMin);
                            $scope.planForward.output.semMax = Number($scope.planForward.output.semBMax) + Number($scope.planForward.output.semCMax) + Number($scope.planForward.output.semPMax) + Number($scope.planForward.output.semOMax);
                            $scope.planForward.output.semUB = Number($scope.planForward.output.semBUB) + Number($scope.planForward.output.semCUB) + Number($scope.planForward.output.semPUB) + Number($scope.planForward.output.semOUB);

                            //get portfolio total
                            $scope.planForward.output.totLB = Number($scope.planForward.output.semLB) + Number($scope.planForward.output.disLB) + Number($scope.planForward.output.socLB) + Number($scope.planForward.output.affLB) + Number($scope.planForward.output.parLB);
                            $scope.planForward.output.totMin = Number($scope.planForward.output.semMin) + Number($scope.planForward.output.disMin) + Number($scope.planForward.output.socMin) + Number($scope.planForward.output.affMin) + Number($scope.planForward.output.parMin);
                            $scope.planForward.output.totMax = Number($scope.planForward.output.semMax) + Number($scope.planForward.output.disMax) + Number($scope.planForward.output.socMax) + Number($scope.planForward.output.affMax) + Number($scope.planForward.output.parMax);
                            $scope.planForward.output.totUB = Number($scope.planForward.output.semUB) + Number($scope.planForward.output.disUB) + Number($scope.planForward.output.socUB) + Number($scope.planForward.output.affUB) + Number($scope.planForward.output.parUB);
                            //reset adjusted spend input
                            //$scope.planForward.output.semBSlide = $scope.planForward.output.semBAS;
                            //$scope.planForward.output.semCSlide = $scope.planForward.output.semCAS;
                            //$scope.planForward.output.semPSlide = $scope.planForward.output.semPAS;
                            //$scope.planForward.output.semOSlide = $scope.planForward.output.semOAS;
                            //$scope.planForward.output.disSlide = $scope.planForward.output.disAS;
                            //$scope.planForward.output.socSlide = $scope.planForward.output.socAS;
                            //$scope.planForward.output.affSlide = $scope.planForward.output.affAS;
                            //$scope.planForward.output.parSlide = $scope.planForward.output.parAS;

                            $scope.planForward.output.semSlide = Number($scope.planForward.output.semAS);
                            $scope.planForward.output.totSlide = Number($scope.planForward.output.totAS);

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
                            $scope.compareChart.data = [
                                {title: "SEM", value: $scope.planForward.output.semSD},
                                {title: "Display", value: $scope.planForward.output.disSD},
                                {title: "Social", value: $scope.planForward.output.socSD},
                                {title: "Affiliates", value: $scope.planForward.output.affSD},
                                {title: "Partners", value: $scope.planForward.output.parSD},
                                {title: "Portfolio Total", value: $scope.planForward.output.totSD}
                            ];
                        }
                    });
                }
                else {
                    clearInterval(count);
                }
            }
        });
    };
    $scope.share=function(){

        location.path('myscenarios/share');
    };
    $scope.export=function(){
        //main
        location.path('/myscenarios/export');
    };
    $scope.edit=function(){

        location.path('/planforward/edit');
    };
    //slide validation
    $scope.fix = function () {
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
        //$scope.planForward.output.semSD = Number($scope.planForward.output.semAS) - Number($scope.planForward.output.semSR);
        //$scope.planForward.output.disSD = Number($scope.planForward.output.disAS) - Number($scope.planForward.output.disSR);
        //$scope.planForward.output.socSD = Number($scope.planForward.output.socAS) - Number($scope.planForward.output.socSR);
        //$scope.planForward.output.affSD = Number($scope.planForward.output.affAS) - Number($scope.planForward.output.affSR);
        //$scope.planForward.output.parSD = Number($scope.planForward.output.parAS) - Number($scope.planForward.output.parSR);
        //$scope.planForward.output.totSD = Number($scope.planForward.output.totAS) - Number($scope.planForward.output.totSR);
        //
        //$scope.compareChart.data = [
        //    {title: "SEM", value: $scope.planForward.output.semSD},
        //    {title: "Display", value: $scope.planForward.output.disSD},
        //    {title: "Social", value: $scope.planForward.output.socSD},
        //    {title: "Affiliates", value: $scope.planForward.output.affSD},
        //    {title: "Partners", value: $scope.planForward.output.parSD},
        //    {title: "Portfolio Total", value: $scope.planForward.output.totSD}
        //];
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
                $scope.slideErrorValue = $scope.planForward.output.totSR - sum;
                return;
            }
            if (Number($scope.planForward.output.totSR) > sumMax) {
                $scope.slideError = true;
                $scope.slideErrorValue = $scope.planForward.output.totSR - sum;
                return;
            }
            $scope.slideError = false;
        }

        sumValidate();
    };

    //get the initial Data from the server side
    var count;

    function doGet() {
        if ($scope.getJson === false) {
            manager.getData(function (data) {
                if (data) {
                    console.log("from doGet in forward/output");
                    console.log(data);
                    $scope.getJson = true;
                    $scope.planForward.output = data;

                    var beginDay, endDay;
                    beginDay = new Date($scope.planForward.output.StartingTime);
                    beginDay = new Date(beginDay.getFullYear(), beginDay.getMonth() + 1, 1);
                    endDay = new Date($scope.planForward.output.EndingTime);
                    endDay = new Date(endDay.getFullYear(), endDay.getMonth() + 1, 1);
                    $scope.planForward.output.scenarioId =
                        "SLFY-" + filter('date')(beginDay, 'MMMyyyy') + "-" +
                        filter('date')(endDay, 'MMMyyyy') + "-" +
                        $scope.planForward.output.lmTouch.charAt(0) + "-" + "000";

                    $scope.planForward.output.semLB = Number($scope.planForward.output.semBLB) + Number($scope.planForward.output.semCLB) + Number($scope.planForward.output.semPLB) + Number($scope.planForward.output.semOLB);
                    $scope.planForward.output.semMin = Number($scope.planForward.output.semBMin) + Number($scope.planForward.output.semCMin) + Number($scope.planForward.output.semPMin) + Number($scope.planForward.output.semOMin);
                    $scope.planForward.output.semMax = Number($scope.planForward.output.semBMax) + Number($scope.planForward.output.semCMax) + Number($scope.planForward.output.semPMax) + Number($scope.planForward.output.semOMax);
                    $scope.planForward.output.semUB = Number($scope.planForward.output.semBUB) + Number($scope.planForward.output.semCUB) + Number($scope.planForward.output.semPUB) + Number($scope.planForward.output.semOUB);

                    $scope.planForward.output.totLB = Number($scope.planForward.output.semLB) + Number($scope.planForward.output.disLB) + Number($scope.planForward.output.socLB) + Number($scope.planForward.output.affLB) + Number($scope.planForward.output.parLB);
                    $scope.planForward.output.totMin = Number($scope.planForward.output.semMin) + Number($scope.planForward.output.disMin) + Number($scope.planForward.output.socMin) + Number($scope.planForward.output.affMin) + Number($scope.planForward.output.parMin);
                    $scope.planForward.output.totMax = Number($scope.planForward.output.semMax) + Number($scope.planForward.output.disMax) + Number($scope.planForward.output.socMax) + Number($scope.planForward.output.affMax) + Number($scope.planForward.output.parMax);
                    $scope.planForward.output.totUB = Number($scope.planForward.output.semUB) + Number($scope.planForward.output.disUB) + Number($scope.planForward.output.socUB) + Number($scope.planForward.output.affUB) + Number($scope.planForward.output.parUB);

                    //$scope.planForward.output.semCSlide = $scope.planForward.output.semCAS;
                    //$scope.planForward.output.semPSlide = $scope.planForward.output.semPAS;
                    //$scope.planForward.output.semBSlide = $scope.planForward.output.semBAS;
                    //$scope.planForward.output.semOSlide = $scope.planForward.output.semOAS;
                    $scope.planForward.output.semSlide = Number($scope.planForward.output.semAS);
                    //$scope.planForward.output.disSlide = $scope.planForward.output.disAS;
                    //$scope.planForward.output.socSlide = $scope.planForward.output.socAS;
                    //$scope.planForward.output.affSlide = $scope.planForward.output.affAS;
                    //$scope.planForward.output.parSlide = $scope.planForward.output.parAS;
                    $scope.planForward.output.totSlide = Number($scope.planForward.output.totAS);

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

                    $scope.planForward.output.ROID=Number($scope.planForward.output.run2ProjROI.substr(0,3))-Number($scope.planForward.output.run1ProjROI.substr(0,3));
                    $scope.planForward.output.changeR=$scope.planForward.output.ROID/Number($scope.planForward.output.run1ProjROI.substr(0,3))*100;
                    $scope.compareChart.data = [
                        {title: "SEM", value: $scope.planForward.output.semSD},
                        {title: "Display", value: $scope.planForward.output.disSD},
                        {title: "Social", value: $scope.planForward.output.socSD},
                        {title: "Affiliates", value: $scope.planForward.output.affSD},
                        {title: "Partners", value: $scope.planForward.output.parSD},
                        {title: "Portfolio Total", value: $scope.planForward.output.totSD}
                    ];
                }
            });
        }
        else {
            clearInterval(count);
        }
    }

    $scope.getJson = false;
    count = setInterval(doGet, 1000 * 1); //set frequency

    //graph Settings
    $scope.showme = false;
    $scope.planforwardContentSize = 'col-sm-12';
    $scope.showGraph = 'Show Graph';
    $scope.toggle = function () {

        if ($scope.showme == false) {
            $scope.planforwardContentSize = 'col-sm-6';
            $scope.showme = true;
            $scope.showGraph = 'Hide Graph';
        }
        else {
            $scope.planforwardContentSize = 'col-sm-12';
            $scope.showme = false;
            $scope.showGraph = 'Show Graph';
        }
    };

    $scope.$on('$destroy', function () {
        clearInterval(count);
    });
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
                var plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
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
    .filter('formatDate', function () {
        function format(element, input) {
            switch (element) {
                case 'Month':
                    return input.toDateString().split(' ')[1];
                case 'MM':
                    return input.getMonth() + 1;
                case 'yyyy':
                    return input.getFullYear();
                case 'yy':
                    return input.getYear();
                default :
                    return input.toDateString().split(' ')[1] + "-" + input.getFullYear();
            }
        }

        return function (input, formatStr) {
            input = input || new Date();
            var formatDetail = formatStr ? formatStr.split('-') : ['default'];
            var output = "";
            formatDetail.forEach(function (element) {
                output = output + " " + format(element, input);
            });
            return output;
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