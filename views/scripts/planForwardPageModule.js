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
    var url = "http://localhost:3001/analysis/";
    var get = function (cb) {
        $http({
            method: 'get',
            url: url + Name
        }).success(function (data) {
            cb(data);
            console.log("from Get");
            console.log(data);

        }).error(function (data) {
            console.log("from factory");
            console.log(data);
        });
    };
    var post = function (data, cb) {
        console.log(data);
        $http({
            method: 'post',
            url: url + 'planforward',
            data: {data:data}
        }).success(function (fileName) {
            Name = fileName;
            console.log(fileName);
            cb(true);
        });
    };
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

forward.controller('forwardInitCtrl', ['$scope', 'forwardManager', 'user', function ($scope, manager, user) {
    // Calendar settings
    $scope.opened = {};
    $scope.format = 'MMMM-dd-yyyy';
    $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1,
        minMode: 'month'
    };
    $scope.minDate = new Date('2015', '6', '01');
    $scope.maxDate = new Date('2015', '11', '01');

     //adjust the date for the R Algorithm version 1.0
    $scope.today = function () {
        var date = new Date();
        $scope.planForward.beginPeriod = new Date(date.getFullYear(), date.getMonth(), 1);
        $scope.planForward.endPeriod = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        $scope.eMaxDate = new Date($scope.planForward.beginPeriod.getFullYear(),$scope.planForward.beginPeriod.getMonth()+3,0);
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
    };
    $scope.modifyEndDate = function () {
        $scope.eMaxDate = new Date($scope.planForward.beginPeriod.getFullYear(),$scope.planForward.beginPeriod.getMonth()+3,0);
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
        // init data output
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
        var length = Number($scope.planForward.endPeriod.getFullYear() - $scope.planForward.beginPeriod.getFullYear()) * 12 + ($scope.planForward.endPeriod.getMonth() - $scope.planForward.beginPeriod.getMonth()) + 1

        // first step input init
        $scope.planForward.init.UserName = $scope.user.name;
        $scope.planForward.init.Brand = $scope.planForward.brand;
        $scope.planForward.init.lmTouch = $scope.planForward.attribution === 'LTA' ? 'Last Touch' : 'Multi-Touch';
        $scope.planForward.init.StartingTime = $scope.planForward.beginPeriod.getFullYear() + '-' + Number(Number($scope.planForward.beginPeriod.getMonth()) + 1);
        $scope.planForward.init.EndingTime = $scope.planForward.endPeriod.getFullYear() + '-' + Number(Number($scope.planForward.endPeriod.getMonth()) + 1);
        $scope.planForward.init.Spend = $scope.planForward.spend;
        $scope.planForward.init.PlanMonths = length;

        $scope.planForward.init.Algorithm = 1;
        //console.log($scope.planForward.init);
        manager.postData($scope.planForward.init, function (res) {
            console.log(res);
        });
    };
}]);

forward.controller('forwardConstrictCtrl', ['$scope', 'forwardManager','$location', function ($scope, manager,location) {
    //initial controller scope
    $scope.planForward = {};
    $scope.planForward.output = {};

    manager.getName(function(name){
        if(!name){
            location.path("/planforward/init");
        }
    });
    // select plan settings
    $scope.planForward.selectPlan = {};
    $scope.planForward.selectPlan.semTotal = true;
    $scope.planForward.selectPlan.semBrand = true;
    $scope.planForward.selectPlan.semCard = true;
    $scope.planForward.selectPlan.semPhotobook = true;
    $scope.planForward.selectPlan.semOthers = true;
    $scope.planForward.selectPlan.display = true;
    $scope.planForward.selectPlan.social = true;
    $scope.planForward.selectPlan.affiliates = true;
    $scope.planForward.selectPlan.partners = true;
    $scope.totCheck = function () {
        if (!$scope.planForward.selectPlan.semTotal) {
            Object.keys($scope.planForward.selectPlan).forEach(function (key) {
                $scope.planForward.selectPlan[key] = key.toString().indexOf('sem') < 0 ? $scope.planForward.selectPlan[key] : false;
            });
        } else {
            Object.keys($scope.planForward.selectPlan).forEach(function (key) {
                $scope.planForward.selectPlan[key] = key.toString().indexOf('sem') < 0 ? $scope.planForward.selectPlan[key] : true;
            });
        }
        $scope.semTSP = !$scope.semTSP;
    };
    $scope.subCheck = function () {
        $scope.planForward.selectPlan.semTotal = !!($scope.planForward.selectPlan.semBrand && $scope.planForward.selectPlan.semCard && $scope.planForward.selectPlan.semPhotobook && $scope.planForward.selectPlan.semOthers);
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
                    $scope.planForward.output.semTLB = Number($scope.planForward.output.semBLB) + Number($scope.planForward.output.semCLB) + Number($scope.planForward.output.semPLB) + Number($scope.planForward.output.semOLB);
                    $scope.planForward.output.semTUB = Number($scope.planForward.output.semBUB) + Number($scope.planForward.output.semCUB) + Number($scope.planForward.output.semPUB) + Number($scope.planForward.output.semOUB);
                    $scope.planForward.output.semMin = $scope.planForward.output.semTLB;
                    $scope.planForward.output.semMax = $scope.planForward.output.semTUB;
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

                    delete  $scope.planForward.output.SpendLB;
                    delete  $scope.planForward.output.SpendUB;
                }
            });
        }
        else {
            clearInterval(count);
        }
    }

    //post data to R and get fileName from serverSide
    $scope.calculate = function () {
        $scope.planForward.output.Algorithm = 2;
        $scope.planForward.output.AlgStartingTime = "";
        $scope.planForward.output.AlgEndingTime = "";
        $scope.planForward.output.AlgDuration = "";

        manager.postData($scope.planForward.output, function (res) {
            console.log(res);
        });
    };
}]);

forward.controller('forwardOutputCtrl', ['$scope', 'forwardManager','$location', function ($scope, manager,location) {
    //init controller scope
    $scope.planForward = {};
    $scope.planForward.output = {};
    $scope.planForward.input = {};

    manager.getName(function(name){
        if(!name){
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
                    //get sum for semTotal's elements
                    $scope.planForward.output.semAS = Number($scope.planForward.output.semBAS) + Number($scope.planForward.output.semCAS) + Number($scope.planForward.output.semPAS) + Number($scope.planForward.output.semOAS);
                    $scope.planForward.output.totAS = $scope.planForward.output.semAS + Number($scope.planForward.output.disAS) + Number($scope.planForward.output.affAS) + Number($scope.planForward.output.socAS) + Number($scope.planForward.output.parAS)

                    $scope.planForward.output.semLB = Number($scope.planForward.output.semBLB) + Number($scope.planForward.output.semCLB) + Number($scope.planForward.output.semPLB) + Number($scope.planForward.output.semOLB);
                    $scope.planForward.output.semMin = Number($scope.planForward.output.semBMin) + Number($scope.planForward.output.semCMin) + Number($scope.planForward.output.semPMin) + Number($scope.planForward.output.semOMin);
                    $scope.planForward.output.semMax = Number($scope.planForward.output.semBMax) + Number($scope.planForward.output.semCMax) + Number($scope.planForward.output.semPMax) + Number($scope.planForward.output.semOMax);
                    $scope.planForward.output.semUB = Number($scope.planForward.output.semBUB) + Number($scope.planForward.output.semCUB) + Number($scope.planForward.output.semPUB) + Number($scope.planForward.output.semOUB);

                    //get portfolio total
                    $scope.planForward.output.totLB = Number($scope.planForward.output.semLB) + Number($scope.planForward.output.disLB) + Number($scope.planForward.output.socLB) + Number($scope.planForward.output.affLB) + Number($scope.planForward.output.parLB);
                    $scope.planForward.output.totMin = Number($scope.planForward.output.semMin) + Number($scope.planForward.output.disMin) + Number($scope.planForward.output.socMin) + Number($scope.planForward.output.affMin) + Number($scope.planForward.output.parMin);
                    $scope.planForward.output.totMax = Number($scope.planForward.output.semMax) + Number($scope.planForward.output.disMax) + Number($scope.planForward.output.socMax) + Number($scope.planForward.output.affMax) + Number($scope.planForward.output.parMax);
                    $scope.planForward.output.totUB = Number($scope.planForward.output.semUB) + Number($scope.planForward.output.disUB) + Number($scope.planForward.output.socUB) + Number($scope.planForward.output.affUB) + Number($scope.planForward.output.parUB);

                    $scope.planForward.output.semSD = Number($scope.planForward.output.semAS) - Number($scope.planForward.output.semSR);
                    $scope.planForward.output.disSD = Number($scope.planForward.output.disAS) - Number($scope.planForward.output.disSR);
                    $scope.planForward.output.socSD = Number($scope.planForward.output.socAS) - Number($scope.planForward.output.socSR);
                    $scope.planForward.output.affSD = Number($scope.planForward.output.affAS) - Number($scope.planForward.output.affSR);
                    $scope.planForward.output.parSD = Number($scope.planForward.output.parAS) - Number($scope.planForward.output.parSR);
                    $scope.planForward.output.totSD = Number($scope.planForward.output.totAS) - Number($scope.planForward.output.totSR);

                    // Maybe Useful in the future
                    //$scope.planForward.output.semRD = Number($scope.planForward.output.semAR) - Number($scope.planForward.output.semPR);
                    //$scope.planForward.output.disRD = Number($scope.planForward.output.disAR) - Number($scope.planForward.output.disPR);
                    //$scope.planForward.output.socRD = Number($scope.planForward.output.socAR) - Number($scope.planForward.output.socPR);
                    //$scope.planForward.output.affRD = Number($scope.planForward.output.affAR) - Number($scope.planForward.output.affPR);
                    //$scope.planForward.output.parRD = Number($scope.planForward.output.parAR) - Number($scope.planForward.output.parPR);
                    //$scope.planForward.output.totRD = Number($scope.planForward.output.totAR) - Number($scope.planForward.output.totPR);
                    //$scope.compareChart = {};
                    $scope.compareChart.data = [
                        {title: "SEM", value: Number($scope.planForward.output.semSD)},
                        {title: "Display", value: Number($scope.planForward.output.disSD)},
                        {title: "Social", value: Number($scope.planForward.output.socSD)},
                        {title: "Affiliates", value: Number($scope.planForward.output.affSD)},
                        {title: "Partners", value: Number($scope.planForward.output.parSD)},
                        {title: "Portfolio Total", value: Number($scope.planForward.output.totSD)}
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
                            $scope.planForward.output.semAS = Number($scope.planForward.output.semBAS) + Number($scope.planForward.output.semCAS) + Number($scope.planForward.output.semPAS) + Number($scope.planForward.output.semOAS);
                            $scope.planForward.output.totAS = $scope.planForward.output.semAS + Number($scope.planForward.output.disAS) + Number($scope.planForward.output.affAS) + Number($scope.planForward.output.socAS) + Number($scope.planForward.output.parAS)

                            $scope.planForward.output.semLB = Number($scope.planForward.output.semBLB) + Number($scope.planForward.output.semCLB) + Number($scope.planForward.output.semPLB) + Number($scope.planForward.output.semOLB);
                            $scope.planForward.output.semMin = Number($scope.planForward.output.semBMin) + Number($scope.planForward.output.semCMin) + Number($scope.planForward.output.semPMin) + Number($scope.planForward.output.semOMin);
                            $scope.planForward.output.semMax = Number($scope.planForward.output.semBMax) + Number($scope.planForward.output.semCMax) + Number($scope.planForward.output.semPMax) + Number($scope.planForward.output.semOMax);
                            $scope.planForward.output.semUB = Number($scope.planForward.output.semBUB) + Number($scope.planForward.output.semCUB) + Number($scope.planForward.output.semPUB) + Number($scope.planForward.output.semOUB);

                            //get portfolio total
                            $scope.planForward.output.totLB = Number($scope.planForward.output.semLB) + Number($scope.planForward.output.disLB) + Number($scope.planForward.output.socLB) + Number($scope.planForward.output.affLB) + Number($scope.planForward.output.parLB);
                            $scope.planForward.output.totMin = Number($scope.planForward.output.semMin) + Number($scope.planForward.output.disMin) + Number($scope.planForward.output.socMin) + Number($scope.planForward.output.affMin) + Number($scope.planForward.output.parMin);
                            $scope.planForward.output.totMax = Number($scope.planForward.output.semMax) + Number($scope.planForward.output.disMax) + Number($scope.planForward.output.socMax) + Number($scope.planForward.output.affMax) + Number($scope.planForward.output.parMax);
                            $scope.planForward.output.totUB = Number($scope.planForward.output.semUB) + Number($scope.planForward.output.disUB) + Number($scope.planForward.output.socUB) + Number($scope.planForward.output.affUB) + Number($scope.planForward.output.parUB);

                            $scope.planForward.output.semSD = Number($scope.planForward.output.semAS) - Number($scope.planForward.output.semSR);
                            $scope.planForward.output.disSD = Number($scope.planForward.output.disAS) - Number($scope.planForward.output.disSR);
                            $scope.planForward.output.socSD = Number($scope.planForward.output.socAS) - Number($scope.planForward.output.socSR);
                            $scope.planForward.output.affSD = Number($scope.planForward.output.affAS) - Number($scope.planForward.output.affSR);
                            $scope.planForward.output.parSD = Number($scope.planForward.output.parAS) - Number($scope.planForward.output.parSR);
                            $scope.planForward.output.totSD = Number($scope.planForward.output.totAS) - Number($scope.planForward.output.totSR);
                            // Maybe Useful in the future
                            //$scope.planForward.output.semRD = Number($scope.planForward.output.semAR) - Number($scope.planForward.output.semPR);
                            //$scope.planForward.output.disRD = Number($scope.planForward.output.disAR) - Number($scope.planForward.output.disPR);
                            //$scope.planForward.output.socRD = Number($scope.planForward.output.socAR) - Number($scope.planForward.output.socPR);
                            //$scope.planForward.output.affRD = Number($scope.planForward.output.affAR) - Number($scope.planForward.output.affPR);
                            //$scope.planForward.output.parRD = Number($scope.planForward.output.parAR) - Number($scope.planForward.output.parPR);
                            //$scope.planForward.output.totRD = Number($scope.planForward.output.totAR) - Number($scope.planForward.output.totPR);

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
        //AS=SR;
        $scope.planForward.output.semBAS = $scope.planForward.output.semBSR;
        $scope.planForward.output.semCAS = $scope.planForward.output.semCSR;
        $scope.planForward.output.semPAS = $scope.planForward.output.semPSR;
        $scope.planForward.output.semOAS = $scope.planForward.output.semOSR;
        $scope.planForward.output.disAS = $scope.planForward.output.disSR;
        $scope.planForward.output.socAS = $scope.planForward.output.socSR;
        $scope.planForward.output.affAS = $scope.planForward.output.affSR;
        $scope.planForward.output.parAS = $scope.planForward.output.parSR;
    };

    $scope.showme = false;
    $scope.planforwardContentSize = 'col-sm-12';
    $scope.showGraph = 'Show Graph';
    $scope.toggle = function () {

        if ($scope.showme == false) {
            $scope.planforwardContentSize = 'col-sm-5';
            $scope.showme = true;
            $scope.showGraph = 'Hide Graph';
        }
        else {
            $scope.planforwardContentSize = 'col-sm-12';
            $scope.showme = false;
            $scope.showGraph = 'Show Graph';
        }
    };

    $scope.compareChart = {};
    $scope.compareChart.data = [
        {title: "SEM", value: $scope.planForward.output.semSD},
        {title: "Display", value: $scope.planForward.output.disSD},
        {title: "Social", value: $scope.planForward.output.socSD},
        {title: "Affiliates", value: $scope.planForward.output.affSD},
        {title: "Partners", value: $scope.planForward.output.parSD},
        {title: "Portfolio Total", value: $scope.planForward.output.totSD}
    ];
    $scope.fix = function () {

        $scope.planForward.output.semSD = Number($scope.planForward.output.semAS) - Number($scope.planForward.output.semSR);
        $scope.planForward.output.disSD = Number($scope.planForward.output.disAS) - Number($scope.planForward.output.disSR);
        $scope.planForward.output.socSD = Number($scope.planForward.output.socAS) - Number($scope.planForward.output.socSR);
        $scope.planForward.output.affSD = Number($scope.planForward.output.affAS) - Number($scope.planForward.output.affSR);
        $scope.planForward.output.parSD = Number($scope.planForward.output.parAS) - Number($scope.planForward.output.parSR);
        $scope.planForward.output.totSD = Number($scope.planForward.output.totAS) - Number($scope.planForward.output.totSR);

        $scope.compareChart.data = [
            {title: "SEM", value: $scope.planForward.output.semSD},
            {title: "Display", value: $scope.planForward.output.disSD},
            {title: "Social", value: $scope.planForward.output.socSD},
            {title: "Affiliates", value: $scope.planForward.output.affSD},
            {title: "Partners", value: $scope.planForward.output.parSD},
            {title: "Portfolio Total", value: $scope.planForward.output.totSD}
        ];
    };
    //$scope.fix();
    $scope.compareChart.config = {
        width: 800,
        height: 313,
        margin: {left: 100, top: 0, right: 100, bottom: 30}
    };


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