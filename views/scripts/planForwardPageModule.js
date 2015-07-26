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
            console.log('Use fake data instead');
            cb({
                "AlgDuration": "6.876079 mins",
                "AlgEndingTime": "2015-07-14 21:56:12",
                "AlgStartingTime": "2015-07-14 21:49:19",
                "Algorithm": "2",
                "Brand": "Shutterfly",
                "EndingTime": "2013-11",
                "PlanMonths": "1",
                "Spend": "6420305",
                "SpendLB": "NULL",
                "SpendUB": "NULL",
                "StartingTime": "2013-11",
                "UserName": "",
                "__v": 0,
                "_id": {"$oid": "55a7872121610f5810fc8244"},
                "affAR": "3803679",
                "affAS": "335661",
                "affLB": "43930",
                "affMax": "1000000",
                "affMin": "197934",
                "affPR": "3803679",
                "affSF": "1.0",
                "affSR": "335661",
                "affSlide": "335661",
                "affSlideDivMax": "1087494",
                "affSlideDivMin": "43930",
                "affSlideLeft": "43930",
                "affSlideRight": "1087494",
                "affUB": "1087494",
                "dirSpendM1": "10125936",
                "dirSpendM2": "",
                "dirSpendM3": "",
                "disAR": "8243110",
                "disAS": "1343700",
                "disLB": "320915",
                "disMax": "3000000",
                "disMin": "1343700",
                "disPR": "8243110",
                "disSF": "1.0",
                "disSR": "1343700",
                "disSlide": "1343700",
                "disSlideDivMax": "4068865",
                "disSlideDivMin": "320915",
                "disSlideLeft": "320915",
                "disSlideRight": "4068865",
                "disUB": "4068865",
                "lmTouch": "Last Touch",
                "parAR": "5603701",
                "parAS": "986866",
                "parLB": "286440",
                "parMax": "986866",
                "parMin": "986866",
                "parPR": "5603701",
                "parSF": "1.0",
                "parSR": "986866",
                "parSlide": "986866",
                "parSlideDivMax": "4818540",
                "parSlideDivMin": "286440",
                "parSlideLeft": "286440",
                "parSlideRight": "4818540",
                "parUB": "4818540",
                "run1ProjROI": "559%",
                "run1ROIRange": "520%/599%",
                "run1RevRange": "+/- 6%",
                "run2ProjROI": "559%",
                "semAR": "22133272",
                "semAS": "3315269",
                "semBLB": "0",
                "semBAS": "279865",
                "semBMax": "379865",
                "semBMin": "279865",
                "semBSF": "1.0",
                "semBSR": "279865",
                "semBSlide": "279865",
                "semBSlideDivMax": "2221996",
                "semBSlideDivMin": "59780",
                "semBSlideLeft": "59780",
                "semBSlideRight": "2221996",
                "semBUB": "2221996",
                "semCAS": "2519794",
                "semCLB": "343858",
                "semCMax": "10000000",
                "semCMin": "1661220",
                "semCSF": "1.0",
                "semCSR": "2519794",
                "semCSlide": "2519794",
                "semCSlideDivMax": "10762858",
                "semCSlideDivMin": "343858",
                "semCSlideLeft": "343858",
                "semCSlideRight": "10762858",
                "semCUB": "10762858",
                "semOAS": "270270",
                "semOLB": "59297",
                "semOMax": "1000000",
                "semOMin": "268576",
                "semOSF": "1.0",
                "semOSR": "270270",
                "semOSlide": "270270",
                "semOSlideDivMax": "1495743",
                "semOSlideDivMin": "59297",
                "semOSlideLeft": "59297",
                "semOSlideRight": "1495743",
                "semOUB": "1495743",
                "semPAS": "245340",
                "semPLB": "72782",
                "semPMax": "700000",
                "semPMin": "244669",
                "semPR": "22133272",
                "semPSF": "1.0",
                "semPSR": "245340",
                "semPSlide": "245340",
                "semPSlideDivMax": "774325",
                "semPSlideDivMin": "72782",
                "semPSlideLeft": "72782",
                "semPSlideRight": "774325",
                "semPUB": "774325",
                "semSR": "3315269",
                "socAR": "2539846",
                "socAS": "438809",
                "socLB": "59474",
                "socMax": "1000000",
                "socMin": "437474",
                "socPR": "2539846",
                "socSF": "1.0",
                "socSR": "438809",
                "socSlide": "438809",
                "socSlideDivMax": "1167684",
                "socSlideDivMin": "59474",
                "socSlideLeft": "59474",
                "socSlideRight": "1167684",
                "socUB": "1167684",
                "totAR": "42323608",
                "totAS": "6420305",
                "totPR": "42323608",
                "totSR": "6420305",
                "tvBeginDate": "2013-11-04",
                "tvEndDate": "2013-11-30",
                "tvImpressions": "193668000",
                "tvSpend": "1826417"
            });
        });
    };
    var post = function (data, cb) {
        $http({
            method: 'post',
            url: url + 'planforward',
            data:{data:data,username:'user1'}
        }).success(function (name) {
            Name=name;
            cb(Name);
        });
    };
    //var post = function(){console.log('111');};
    return {
        getTempData: function (cb) {
            cb(tempData);
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

forward.controller('forwardInitCtrl', ['$scope', 'forwardManager', 'user', '$location', function ($scope, manager, user, location) {
    // Calendar settings
    $scope.opened = {};
    $scope.format = 'MMMM-dd-yyyy';
    $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1,
        minMode: 'month'
    };
    $scope.minDate = new Date(2015, 4+1, 30);
    $scope.maxDate = new Date($scope.minDate.getFullYear(), $scope.minDate.getMonth() + 6, 0);

    //adjust the date for the R Algorithm version 1.0
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
        var d = new Date($scope.planForward.endPeriod);
        $scope.planForward.endPeriod = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        $scope.modifyEndDate();
    };
    $scope.modifyEndDate = function () {
        var  d = new Date($scope.planForward.beginPeriod);
        if( d>$scope.maxDate){d=$scope.maxDate}
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
        $scope.initDate();
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
        $scope.planForward.init.Algorithm = 3;

        //$scope.planForward.init={1:1};
        manager.postData($scope.planForward.init,function (res) {
            console.log(res);
            location.path('planforward/constrict');

        });
    };
}]);

forward.controller('forwardConstrictCtrl', ['$scope', 'forwardManager', '$location', function ($scope, manager, location) {
    //initial controller scope
    $scope.planForward = {};
    $scope.planForward.output = {};
    $scope.planForward.ControlChannelsDM = [];
    $scope.planForward.ControlChannels = [];
    $scope.slideError = false;
    manager.getName(function (name) {
        if (!name) {
            location.path("/planforward/init");
        }
    });
    // select plan settings
    $scope.planForward.selectPlan = {};
    $scope.planForward.semTotal = false;
    $scope.planForward.selectPlan.semBrand = false;
    $scope.planForward.selectPlan.semCard = false;
    $scope.planForward.selectPlan.semPhotobook = false;
    $scope.planForward.selectPlan.semOthers = false;
    $scope.planForward.selectPlan.display = false;
    $scope.planForward.selectPlan.social = false;
    $scope.planForward.selectPlan.affiliates = false;
    $scope.planForward.selectPlan.partners = false;
    $scope.semTotal = false;
    $scope.semBrand = false;
    $scope.semCard = false;
    $scope.semPhotobook = false;
    $scope.semOthers = false;
    $scope.display = false;
    $scope.social = false;
    $scope.affiliates = false;
    $scope.partners = false;


    $scope.Count = function () {
        var count = 0;
        Object.keys($scope.planForward.selectPlan).forEach(function (key) {
            if ($scope.planForward.selectPlan[key]) {
                count++;
            }
        });
        if (count > 2) {
            if (!$scope.planForward.semTotal) {
                $scope.semTotal = true;
            }
        }
        if (count > 5) {
            Object.keys($scope.planForward.selectPlan).forEach(function (key) {
                if (!$scope.planForward.selectPlan[key]) {
                    $scope[key] = true;
                }
            });
        } else {
            $scope.semTotal = false;
            $scope.semBrand = false;
            $scope.semCard = false;
            $scope.semPhotobook = false;
            $scope.semOthers = false;
            $scope.display = false;
            $scope.social = false;
            $scope.affiliates = false;
            $scope.partners = false;
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
    // select plan settings -END-

    //get the initial Data from the server side
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

                    $scope.planForward.output.semPR = "";
                    $scope.planForward.output.disPR = "";
                    $scope.planForward.output.socPR = "";
                    $scope.planForward.output.affPR = "";
                    $scope.planForward.output.parPR = "";
                    $scope.planForward.output.semAR = "";
                    $scope.planForward.output.disAR = "";
                    $scope.planForward.output.socAR = "";
                    $scope.planForward.output.affAR = "";
                    $scope.planForward.output.parAR = "";

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
                    console.log($scope.planForward.ControlChannels);
                    if ($scope.planForward.output.dirSpendM1) {
                        $scope.planForward.ControlChannelsDM.push($scope.planForward.output.dirSpendM1);
                    }
                    if ($scope.planForward.output.dirSpendM2) {
                        $scope.planForward.ControlChannelsDM.push($scope.planForward.output.dirSpendM2);
                    }
                    if ($scope.planForward.output.dirSpendM3) {
                        $scope.planForward.ControlChannelsDM.push($scope.planForward.output.dirSpendM3);
                    }
                    //if($scope.planForward.output.dirSpendM4) {
                    //    $scope.planForward.ControlChannelsDM.push($scope.planForward.output.dirSpendM4);
                    //}
                    //if($scope.planForward.output.dirSpendM5) {
                    //    $scope.planForward.ControlChannelsDM.push($scope.planForward.output.dirSpendM5);
                    //}
                    //if($scope.planForward.output.dirSpendM6) {
                    //    $scope.planForward.ControlChannelsDM.push($scope.planForward.output.dirSpendM6);
                    //}

                }
            });
        }
        else {
            clearInterval(count);
        }
    }

    //post data to R and get fileName from serverSide
    $scope.fix = function () {
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
        console.log(min);
        console.log(max);

        if (Number($scope.planForward.output.Spend) < min) {
            $scope.slideError = true;
            $scope.slideErrorValue = Number($scope.planForward.output.Spend) - min;
            return;
        }
        if (Number($scope.planForward.output.Spend) > max) {
            console.log("infix")
            $scope.slideError = true;
            $scope.slideErrorValue = Number($scope.planForward.output.Spend) - max;
            return;
        }
        $scope.slideError = false;
    };
    $scope.calculate = function () {
        $scope.planForward.output.Algorithm = 2;
        $scope.planForward.output.AlgStartingTime = "";
        $scope.planForward.output.AlgEndingTime = "";
        $scope.planForward.output.AlgDuration = "";

        manager.postData($scope.planForward.output, function (res) {
            console.log(res);
            location.path("planforward/output");
        });
    };

    $scope.$on('$destroy', function () {
        clearInterval(count);
    });
}]);

forward.controller('forwardOutputCtrl', ['$scope', 'forwardManager', '$location', function ($scope, manager, location) {
    //init controller scope
    $scope.planForward = {};
    $scope.planForward.output = {};
    $scope.planForward.input = {};
    $scope.compareChart = {};
    $scope.planForward.output.semSD =0;
    $scope.planForward.output.disSD =0;
    $scope.planForward.output.socSD =0;
    $scope.planForward.output.affSD =0;
    $scope.planForward.output.parSD =0;
    $scope.planForward.output.totSD =0;

    $scope.compareChart.data = [
        {title: "SEM", value: $scope.planForward.output.semSD},
        {title: "Display", value: $scope.planForward.output.disSD},
        {title: "Social", value: $scope.planForward.output.socSD},
        {title: "Affiliates", value: $scope.planForward.output.affSD},
        {title: "Partners", value: $scope.planForward.output.parSD},
        {title: "Portfolio Total", value: $scope.planForward.output.totSD}
    ];
    $scope.compareChart.config = {
        width: 800,
        height: 313,
        margin: {left: 100, top: 0, right: 100, bottom: 30}
    };


    $scope.slideError = false;
    manager.getName(function (name) {
        if (!name) {
            location.path("/planforward/init");
        }
    });
    //get the initial Data from the server side
    var count;
    $scope.getJson = false;
    count = setInterval(doGet, 1000 * 1); //set frequency
    function doGet() {
        if ($scope.getJson === false) {
            manager.getData(function (data) {
                if (data) {
                    $scope.getJson = true;
                    $scope.planForward.output = data;

                    manager.getName(function (name) {
                        $scope.planForward.output.ScenarioID = name;
                    });

                    $scope.planForward.output.semLB = Number($scope.planForward.output.semBLB) + Number($scope.planForward.output.semCLB) + Number($scope.planForward.output.semPLB) + Number($scope.planForward.output.semOLB);
                    $scope.planForward.output.semMin = Number($scope.planForward.output.semBMin) + Number($scope.planForward.output.semCMin) + Number($scope.planForward.output.semPMin) + Number($scope.planForward.output.semOMin);
                    $scope.planForward.output.semMax = Number($scope.planForward.output.semBMax) + Number($scope.planForward.output.semCMax) + Number($scope.planForward.output.semPMax) + Number($scope.planForward.output.semOMax);
                    $scope.planForward.output.semUB = Number($scope.planForward.output.semBUB) + Number($scope.planForward.output.semCUB) + Number($scope.planForward.output.semPUB) + Number($scope.planForward.output.semOUB);

                    $scope.planForward.output.totLB = Number($scope.planForward.output.semLB) + Number($scope.planForward.output.disLB) + Number($scope.planForward.output.socLB) + Number($scope.planForward.output.affLB) + Number($scope.planForward.output.parLB);
                    $scope.planForward.output.totMin = Number($scope.planForward.output.semMin) + Number($scope.planForward.output.disMin) + Number($scope.planForward.output.socMin) + Number($scope.planForward.output.affMin) + Number($scope.planForward.output.parMin);
                    $scope.planForward.output.totMax = Number($scope.planForward.output.semMax) + Number($scope.planForward.output.disMax) + Number($scope.planForward.output.socMax) + Number($scope.planForward.output.affMax) + Number($scope.planForward.output.parMax);
                    $scope.planForward.output.totUB = Number($scope.planForward.output.semUB) + Number($scope.planForward.output.disUB) + Number($scope.planForward.output.socUB) + Number($scope.planForward.output.affUB) + Number($scope.planForward.output.parUB);

                    $scope.planForward.output.semCSlide = $scope.planForward.output.semCAS;
                    $scope.planForward.output.semPSlide = $scope.planForward.output.semPAS;
                    $scope.planForward.output.semBSlide = $scope.planForward.output.semBAS;
                    $scope.planForward.output.semOSlide = $scope.planForward.output.semOAS;

                    $scope.planForward.output.semSlide = Number($scope.planForward.output.semCSlide) + Number($scope.planForward.output.semPSlide) + Number($scope.planForward.output.semBSlide) + Number($scope.planForward.output.semOSlide);
                    $scope.planForward.output.disSlide = $scope.planForward.output.disAS;
                    $scope.planForward.output.socSlide = $scope.planForward.output.socAS;
                    $scope.planForward.output.affSlide = $scope.planForward.output.affAS;
                    $scope.planForward.output.parSlide = $scope.planForward.output.parAS;
                    $scope.planForward.output.totSlide = $scope.planForward.output.semSlide + Number($scope.planForward.output.disSlide) + Number($scope.planForward.output.socSlide) + Number($scope.planForward.output.affSlide) + Number($scope.planForward.output.parSlide);


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

    $scope.ReRun = function () {
        $scope.planForward.output.Algorithm = 3;
        $scope.planForward.output.AlgStartingTime = "";
        $scope.planForward.output.AlgEndingTime = "";
        $scope.planForward.output.AlgDuration = "";
        manager.postData($scope.planForward.output, function (res) {
            console.log(res);
            var count;
            $scope.getJson = false;
            count = setInterval(doGet, 1000 * 1); //set frequency
            function doGet() {
                if ($scope.getJson === false) {
                    manager.getData(function (data) {
                        if (data) {
                            $scope.getJson = true;
                            $scope.planForward.output = data;

                            manager.getName(function (name) {
                                $scope.planForward.output.ScenarioID = name;
                            });
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
                            $scope.planForward.output.semBSlide = $scope.planForward.output.semBAS;
                            $scope.planForward.output.semCSlide = $scope.planForward.output.semCAS;
                            $scope.planForward.output.semPSlide = $scope.planForward.output.semPAS;
                            $scope.planForward.output.semOSlide = $scope.planForward.output.semOAS;
                            $scope.planForward.output.disSlide = $scope.planForward.output.disAS;
                            $scope.planForward.output.socSlide = $scope.planForward.output.socAS;
                            $scope.planForward.output.affSlide = $scope.planForward.output.affAS;
                            $scope.planForward.output.parSlide = $scope.planForward.output.parAS;

                            $scope.planForward.output.semSlide = Number($scope.planForward.output.semCSlide) + Number($scope.planForward.output.semPSlide) + Number($scope.planForward.output.semBSlide) + Number($scope.planForward.output.semOSlide);
                            $scope.planForward.output.totSlide = $scope.planForward.output.semSlide + Number($scope.planForward.output.disSlide) + Number($scope.planForward.output.socSlide) + Number($scope.planForward.output.affSlide) + Number($scope.planForward.output.parSlide);

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
    $scope.reSet = function () {
        //Slide=AS;
        $scope.slideError = false;
        $scope.planForward.output.semBSlide = $scope.planForward.output.semBAS;
        $scope.planForward.output.semCSlide = $scope.planForward.output.semCAS;
        $scope.planForward.output.semPSlide = $scope.planForward.output.semPAS;
        $scope.planForward.output.semOSlide = $scope.planForward.output.semOAS;
        $scope.planForward.output.semSlide = Number($scope.planForward.output.semCSlide) + Number($scope.planForward.output.semPSlide) + Number($scope.planForward.output.semBSlide) + Number($scope.planForward.output.semOSlide);

        $scope.planForward.output.disSlide = $scope.planForward.output.disAS;
        $scope.planForward.output.socSlide = $scope.planForward.output.socAS;
        $scope.planForward.output.affSlide = $scope.planForward.output.affAS;
        $scope.planForward.output.parSlide = $scope.planForward.output.parAS;
        $scope.planForward.output.totSlide = $scope.planForward.output.semSlide + Number($scope.planForward.output.disSlide) + Number($scope.planForward.output.socSlide) + Number($scope.planForward.output.affSlide) + Number($scope.planForward.output.parSlide);
    };

    $scope.fix = function () {
        $scope.planForward.output.semSlide = Number($scope.planForward.output.semCSlide) + Number($scope.planForward.output.semPSlide) + Number($scope.planForward.output.semBSlide) + Number($scope.planForward.output.semOSlide);
        $scope.planForward.output.totSlide = $scope.planForward.output.semSlide + Number($scope.planForward.output.disSlide) + Number($scope.planForward.output.socSlide) + Number($scope.planForward.output.affSlide) + Number($scope.planForward.output.parSlide);
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
        var sldChgFlg = {};
        sldChgFlg.semCSlide = $scope.planForward.output.semCAS - $scope.planForward.output.semCSlide;

        sldChgFlg.semPSlide = $scope.planForward.output.semPAS - $scope.planForward.output.semPSlide;
        sldChgFlg.semBSlide = $scope.planForward.output.semBAS - $scope.planForward.output.semBSlide;
        sldChgFlg.semOSlide = $scope.planForward.output.semOAS - $scope.planForward.output.semOSlide;
        sldChgFlg.disSlide = $scope.planForward.output.disAS - $scope.planForward.output.disSlide;
        sldChgFlg.socSlide = $scope.planForward.output.socAS - $scope.planForward.output.socSlide;
        sldChgFlg.affSlide = $scope.planForward.output.affAS - $scope.planForward.output.affSlide;
        sldChgFlg.parSlide = $scope.planForward.output.parAS - $scope.planForward.output.parSlide;
        var min = {};
        min.semCSlide = $scope.planForward.output.semCMin;
        min.semPSlide = $scope.planForward.output.semPMin;
        min.semBSlide = $scope.planForward.output.semBMin;
        min.semOSlide = $scope.planForward.output.semOMin;
        min.disSlide = $scope.planForward.output.disMin;
        min.socSlide = $scope.planForward.output.socMin;
        min.affSlide = $scope.planForward.output.affMin;
        min.parSlide = $scope.planForward.output.parMin;
        var max = {};
        max.semCSlide = $scope.planForward.output.semCMax;
        max.semPSlide = $scope.planForward.output.semPMax;
        max.semBSlide = $scope.planForward.output.semBMax;
        max.semOSlide = $scope.planForward.output.semOMax;
        max.disSlide = $scope.planForward.output.disMax;
        max.socSlide = $scope.planForward.output.socMax;
        max.affSlide = $scope.planForward.output.affMax;
        max.parSlide = $scope.planForward.output.parMax;

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

    //pause getrequest
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