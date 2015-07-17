/**
 * Created by Haizhou on 5/11/2015.
 */
'use strict';
angular.module("ROIClientApp")
    .controller('forwardCtrl', ['$scope', '$filter', '$http', '$location', function ($scope, $filter, $http, $location) {

        // tooltips
        $scope.brandTooltips = 'brandTooltips';
        $scope.attrTooltips = 'attrTooltips';
        $scope.beginPeriodTooltips = 'beginPeriodTooltips';
        $scope.endPeriodTooltips = 'endPeriodTooltips';
        $scope.spendTooltips = 'spendTooltips';
        $scope.includeTooltips = 'includeTooltips';

        //init get json checked
        $scope.getJson = false;

        // Calendar settings
        $scope.opened = {};
        $scope.format = 'MMMM-dd-yyyy';
        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1,
            minMode: 'month'
        };
        $scope.today = function () {
            var date = new Date();
            $scope.planForward.beginPeriod = new Date(date.getFullYear(), date.getMonth(), 1);
            $scope.planForward.endPeriod = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            $scope.minDate = new Date("2010","01","01");
        };
        $scope.open = function ($event, model) {
            $event.preventDefault();
            $event.stopPropagation();

            if (model === 'planForwardBeginPeriod') {
                $scope.opened.planForwardBeginPeriod = !$scope.opened.planForwardBeginPeriod;
                $scope.opened.planForwardEndPeriod = false;
            } else {
                $scope.minDate = new Date($scope.planForward.beginPeriod);
                $scope.opened.planForwardEndPeriod = !$scope.opened.planForwardEndPeriod;
                $scope.opened.planForwardBeginPeriod = false;
            }
        };
        $scope.getLastDate = function () {
            $scope.planForward.endPeriod = new Date($scope.planForward.endPeriod);
            $scope.planForward.endPeriod = new Date($scope.planForward.endPeriod.getFullYear(), $scope.planForward.endPeriod.getMonth() + 1, 0);
        };

        $scope.getMonthDiff = function (d1, d2) {
            var months;
            months = (d2.getFullYear() - d1.getFullYear()) * 12;
            //months -= d1.getMonth() + 1;
            //months += d2.getMonth();
            months -= d1.getMonth();
            months += d2.getMonth() + 1;
            return months <= 0 ? 0 : months;
        };

        $scope.getYearMonth = function(d) {
            var year = d.getFullYear();
            var month = d.getMonth() + 1;
            var fullMonth = month < 10 ? ('0' + month) : month;
            var yearMonth = year + '-' +fullMonth; // 2015-06
            return yearMonth;
        };


        // init data default
        $scope.resetForm = function () {
            // Nav bar
            $scope.nav = {};
            $scope.nav.current = 'Initial Input';

            // Data
            $scope.planForward = {};

            // Brand
            $scope.brands = ['Shutterfly'];
            $scope.planForward.brand = $scope.brands[0];

            // Attribution
            $scope.planForward.attribution = 'LTA';

            //
            $scope.formatInput = function () {
                $scope.planForward.spend = ($filter('formatCurrency')($scope.planForward.spend)).substr(1);
            };

            // Calendar
            $scope.today();

            // init data output
            $scope.planForward.input = {};
            $scope.planForward.output = {};

            $scope.planForward.initialInput = {};
            $scope.planForward.initialOutput = {};

            $scope.planForward.runInput = {};
            $scope.planForward.runOutput = {};
            $scope.compareChart = {};
        };
        $scope.resetForm();

        $scope.CInput = function () {
            var length = Number($scope.planForward.endPeriod.getFullYear() - $scope.planForward.beginPeriod.getFullYear()) * 12 + ($scope.planForward.endPeriod.getMonth() - $scope.planForward.beginPeriod.getMonth()) + 1;
            $scope.planForward.ControlChannels = [];
            for (var i = 0; i < length; i++) {
                var d = new Date($scope.planForward.beginPeriod);
                d.setMonth(($scope.planForward.beginPeriod.getMonth() + i) % 12);
                d.setFullYear($scope.planForward.beginPeriod.getFullYear() + Math.floor(($scope.planForward.beginPeriod.getMonth() + i) / 12));
                $scope.planForward.ControlChannels.push(d);
            }

            // init plan forward select plan all checked
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

            
            //get the input and send input data to the server via post method
            $scope.planForward.initialInput.UserName = "";
            $scope.planForward.initialInput.Brand = $scope.planForward.brand;
            $scope.planForward.initialInput.Spend = $scope.planForward.spend;
            $scope.planForward.initialInput.StartingTime = $scope.getYearMonth($scope.planForward.beginPeriod);
            $scope.planForward.initialInput.PlanMonths = $scope.getMonthDiff($scope.planForward.beginPeriod, $scope.planForward.endPeriod);
            $scope.planForward.initialInput.EndingTime = $scope.getYearMonth($scope.planForward.endPeriod);
            $scope.planForward.initialInput.lmTouch = $scope.planForward.attribution == "LTA"? "Last Touch" : "Multi-Touch";
            $scope.planForward.initialInput.Algorithm = 1;
            $scope.planForward.initialInput.AlgStartingTime = "";
            $scope.planForward.initialInput.AlgEndingTime = "";
            $scope.planForward.initialInput.AlgDuration = "";
            $scope.planForward.initialInput.semLB = "";
            $scope.planForward.initialInput.semCLB = "";
            $scope.planForward.initialInput.semPLB = "";
            $scope.planForward.initialInput.semOLB = "";
            $scope.planForward.initialInput.semBLB = "";
            $scope.planForward.initialInput.disLB = "";
            $scope.planForward.initialInput.socLB = "";
            $scope.planForward.initialInput.affLB = "";
            $scope.planForward.initialInput.parLB = "";

            $scope.planForward.initialInput.semMin = "";
            $scope.planForward.initialInput.semCMin = "";
            $scope.planForward.initialInput.semPMin = "";
            $scope.planForward.initialInput.semOMin = "";
            $scope.planForward.initialInput.semBMin = "";
            $scope.planForward.initialInput.disMin = "";
            $scope.planForward.initialInput.socMin = "";
            $scope.planForward.initialInput.affMin = "";
            $scope.planForward.initialInput.parMin = "";

            $scope.planForward.initialInput.semMax = "";
            $scope.planForward.initialInput.semCMax = "";
            $scope.planForward.initialInput.semPMax = "";
            $scope.planForward.initialInput.semOMax = "";
            $scope.planForward.initialInput.semBMax = "";
            $scope.planForward.initialInput.disMax = "";
            $scope.planForward.initialInput.socMax = "";
            $scope.planForward.initialInput.affMax = "";
            $scope.planForward.initialInput.parMax = "";

            $scope.planForward.initialInput.semUB = "";
            $scope.planForward.initialInput.semCUB = "";
            $scope.planForward.initialInput.semPUB = "";
            $scope.planForward.initialInput.semOUB = "";
            $scope.planForward.initialInput.semBUB = "";
            $scope.planForward.initialInput.disUB = "";
            $scope.planForward.initialInput.socUB = "";
            $scope.planForward.initialInput.affUB = "";
            $scope.planForward.initialInput.parUB = "";

            $scope.planForward.initialInput.semSF = "";
            $scope.planForward.initialInput.semCSF = "";
            $scope.planForward.initialInput.semPSF = "";
            $scope.planForward.initialInput.semOSF = "";
            $scope.planForward.initialInput.semBSF = "";
            $scope.planForward.initialInput.disSF = "";
            $scope.planForward.initialInput.socSF = "";
            $scope.planForward.initialInput.affSF = "";
            $scope.planForward.initialInput.parSF = "";

            $scope.planForward.initialInput.dirSpendM1 = "";
            $scope.planForward.initialInput.dirSpendM2 = "";
            $scope.planForward.initialInput.dirSpendM3 = "";

            $scope.planForward.initialInput.tvBeginDate = "";
            $scope.planForward.initialInput.tvEndDate = "";
            $scope.planForward.initialInput.tvImpressions = "";
            $scope.planForward.initialInput.tvSpend = "";

            $scope.planForward.initialInput.semSR = "";
            $scope.planForward.initialInput.semCSR = "";
            $scope.planForward.initialInput.semPSR = "";
            $scope.planForward.initialInput.semOSR = "";
            $scope.planForward.initialInput.semBSR = "";
            $scope.planForward.initialInput.disSR = "";
            $scope.planForward.initialInput.socSR = "";
            $scope.planForward.initialInput.affSR = "";
            $scope.planForward.initialInput.parSR = "";
            $scope.planForward.initialInput.totSR = "";

            $scope.planForward.initialInput.semPR = "";
            $scope.planForward.initialInput.semCPR = "";
            $scope.planForward.initialInput.semPPR = "";
            $scope.planForward.initialInput.semOPR = "";
            $scope.planForward.initialInput.semBPR = "";
            $scope.planForward.initialInput.disPR = "";
            $scope.planForward.initialInput.socPR = "";
            $scope.planForward.initialInput.affPR = "";
            $scope.planForward.initialInput.parPR = "";
            $scope.planForward.initialInput.totPR = "";

            $scope.planForward.initialInput.run1RevRange = "";
            $scope.planForward.initialInput.run1ProjROI = "";
            $scope.planForward.initialInput.run1ROIRange = "";

            $scope.planForward.initialInput.semSlideLeft = "";
            $scope.planForward.initialInput.semCSlideLeft = "";
            $scope.planForward.initialInput.semPSlideLeft = "";
            $scope.planForward.initialInput.semOSlideLeft = "";
            $scope.planForward.initialInput.semBSlideLeft = "";
            $scope.planForward.initialInput.disSlideLeft = "";
            $scope.planForward.initialInput.socSlideLeft = "";
            $scope.planForward.initialInput.affSlideLeft = "";
            $scope.planForward.initialInput.parSlideLeft = "";

            $scope.planForward.initialInput.semSlide = "";
            $scope.planForward.initialInput.semCSlide = "";
            $scope.planForward.initialInput.semPSlide = "";
            $scope.planForward.initialInput.semOSlide = "";
            $scope.planForward.initialInput.semBSlide = "";
            $scope.planForward.initialInput.disSlide = "";
            $scope.planForward.initialInput.socSlide = "";
            $scope.planForward.initialInput.affSlide = "";
            $scope.planForward.initialInput.parSlide = "";

            $scope.planForward.initialInput.semSlideRight = "";
            $scope.planForward.initialInput.semCSlideRight = "";
            $scope.planForward.initialInput.semPSlideRight = "";
            $scope.planForward.initialInput.semOSlideRight = "";
            $scope.planForward.initialInput.semBSlideRight = "";
            $scope.planForward.initialInput.disSlideRight = "";
            $scope.planForward.initialInput.socSlideRight = "";
            $scope.planForward.initialInput.affSlideRight = "";
            $scope.planForward.initialInput.parSlideRight = "";

            $scope.planForward.initialInput.semSlideDivMin = "";
            $scope.planForward.initialInput.semCSlideDivMin = "";
            $scope.planForward.initialInput.semPSlideDivMin = "";
            $scope.planForward.initialInput.semOSlideDivMin = "";
            $scope.planForward.initialInput.semBSlideDivMin = "";
            $scope.planForward.initialInput.disSlideDivMin = "";
            $scope.planForward.initialInput.socSlideDivMin = "";
            $scope.planForward.initialInput.affSlideDivMin = "";
            $scope.planForward.initialInput.parSlideDivMin = "";

            $scope.planForward.initialInput.semSlideDivMax = "";
            $scope.planForward.initialInput.semCSlideDivMax = "";
            $scope.planForward.initialInput.semPSlideDivMax = "";
            $scope.planForward.initialInput.semOSlideDivMax = "";
            $scope.planForward.initialInput.semBSlideDivMax = "";
            $scope.planForward.initialInput.disSlideDivMax = "";
            $scope.planForward.initialInput.socSlideDivMax = "";
            $scope.planForward.initialInput.affSlideDivMax = "";
            $scope.planForward.initialInput.parSlideDivMax = "";

            $scope.planForward.initialInput.semAS = "";
            $scope.planForward.initialInput.semCAS = "";
            $scope.planForward.initialInput.semPAS = "";
            $scope.planForward.initialInput.semOAS = "";
            $scope.planForward.initialInput.semBAS = "";
            $scope.planForward.initialInput.disAS = "";
            $scope.planForward.initialInput.socAS = "";
            $scope.planForward.initialInput.affAS = "";
            $scope.planForward.initialInput.parAS = "";
            $scope.planForward.initialInput.totAS = "";

            $scope.planForward.initialInput.semAR = "";
            $scope.planForward.initialInput.semCAR = "";
            $scope.planForward.initialInput.semPAR = "";
            $scope.planForward.initialInput.semOAR = "";
            $scope.planForward.initialInput.semBAR = "";
            $scope.planForward.initialInput.disAR = "";
            $scope.planForward.initialInput.socAR = "";
            $scope.planForward.initialInput.affAR = "";
            $scope.planForward.initialInput.parAR = "";
            $scope.planForward.initialInput.totAR = "";

            $scope.planForward.initialInput.run2ProjROI = "";

            console.log( $scope.planForward.initialInput);

            $http.post("/api/planforwardInitial", $scope.planForward.initialInput).success(function(data, status) {
                console.log(data);
                console.log("post success");

                $scope.planForward.initialOutput        = data;
                $scope.planForward.dataThrough   = new Date($scope.planForward.endPeriod);
                $scope.planForward.dataThrough.setMonth($scope.planForward.include ? $scope.planForward.endPeriod.getMonth() : $scope.planForward.endPeriod.getMonth() - 1);

                $scope.planForward.output.semBLB = $scope.planForward.initialOutput.semBLB;
                $scope.planForward.output.semCLB = $scope.planForward.initialOutput.semCLB;
                $scope.planForward.output.semPLB = $scope.planForward.initialOutput.semPLB;
                $scope.planForward.output.semOLB = $scope.planForward.initialOutput.semOLB;

                $scope.planForward.output.semBUB = $scope.planForward.initialOutput.semBUB;
                $scope.planForward.output.semCUB = $scope.planForward.initialOutput.semCUB;
                $scope.planForward.output.semPUB = $scope.planForward.initialOutput.semPUB;
                $scope.planForward.output.semOUB = $scope.planForward.initialOutput.semOUB;

                // $scope.planForward.output.semTLB = Number($scope.planForward.initialOutput.semBLB) + Number($scope.planForward.initialOutput.semCLB) + Number($scope.planForward.initialOutput.semPLB) + Number($scope.planForward.initialOutput.semOLB);
                // $scope.planForward.output.semTUB = Number($scope.planForward.initialOutput.semBUB) + Number($scope.planForward.initialOutput.semCUB) + Number($scope.planForward.initialOutput.semPUB) + Number($scope.planForward.initialOutput.semOUB);
                $scope.planForward.output.semTLB = Number($scope.planForward.output.semBLB) + Number($scope.planForward.output.semCLB) + Number($scope.planForward.output.semPLB) + Number($scope.planForward.output.semOLB);
                $scope.planForward.output.semTUB = Number($scope.planForward.output.semBUB) + Number($scope.planForward.output.semCUB) + Number($scope.planForward.output.semPUB) + Number($scope.planForward.output.semOUB);

                $scope.planForward.output.disLB = $scope.planForward.initialOutput.disLB;
                $scope.planForward.output.socLB = $scope.planForward.initialOutput.socLB;
                $scope.planForward.output.affLB = $scope.planForward.initialOutput.affLB;
                $scope.planForward.output.parLB = $scope.planForward.initialOutput.parLB;

                $scope.planForward.output.disUB = $scope.planForward.initialOutput.disUB;
                $scope.planForward.output.socUB = $scope.planForward.initialOutput.socUB;
                $scope.planForward.output.affUB = $scope.planForward.initialOutput.affUB;
                $scope.planForward.output.parUB = $scope.planForward.initialOutput.parUB;


                // set default value of input
                $scope.planForward.input.semMin = $scope.planForward.initialOutput.semTLB;
                $scope.planForward.input.semMax = $scope.planForward.initialOutput.semTUB;
                $scope.planForward.input.semBMin = $scope.planForward.initialOutput.semBLB;
                $scope.planForward.input.semBMax = $scope.planForward.initialOutput.semBUB;
                $scope.planForward.input.semCMin = $scope.planForward.initialOutput.semCLB;
                $scope.planForward.input.semCMax = $scope.planForward.initialOutput.semCUB;
                $scope.planForward.input.semPMin = $scope.planForward.initialOutput.semPLB;
                $scope.planForward.input.semPMax = $scope.planForward.initialOutput.semPUB;
                $scope.planForward.input.semOMin = $scope.planForward.initialOutput.semOLB;
                $scope.planForward.input.semOMax = $scope.planForward.initialOutput.semOUB;
                // $scope.planForward.input.disMin = Number($scope.planForward.initialOutput.disLB);
                // $scope.planForward.input.disMax = Number($scope.planForward.initialOutput.disUB);
                // $scope.planForward.input.socMin = Number($scope.planForward.initialOutput.socLB);
                // $scope.planForward.input.socMax = Number($scope.planForward.initialOutput.socUB);
                // $scope.planForward.input.affMin = Number($scope.planForward.initialOutput.affLB);
                // $scope.planForward.input.affMax = Number($scope.planForward.initialOutput.affUB);
                // $scope.planForward.input.parMin = Number($scope.planForward.initialOutput.parLB);
                // $scope.planForward.input.parMax = Number($scope.planForward.initialOutput.parUB);
                $scope.planForward.input.disMin = $scope.planForward.initialOutput.disLB;
                $scope.planForward.input.disMax = $scope.planForward.initialOutput.disUB;
                $scope.planForward.input.socMin = $scope.planForward.initialOutput.socLB;
                $scope.planForward.input.socMax = $scope.planForward.initialOutput.socUB;
                $scope.planForward.input.affMin = $scope.planForward.initialOutput.affLB;
                $scope.planForward.input.affMax = $scope.planForward.initialOutput.affUB;
                $scope.planForward.input.parMin = $scope.planForward.initialOutput.parLB;
                $scope.planForward.input.parMax = $scope.planForward.initialOutput.parUB;

                // should remove the default value of scale factor, and add here the returned value. (updated)
                // it is better to change name of ng-model of scale factor to input, because SF can be input to change
                $scope.planForward.output.semBSF = $scope.planForward.initialOutput.semBSF;
                $scope.planForward.output.semCSF = $scope.planForward.initialOutput.semCSF;
                $scope.planForward.output.semPSF = $scope.planForward.initialOutput.semPSF;
                $scope.planForward.output.semOSF = $scope.planForward.initialOutput.semOSF;
                $scope.planForward.output.disSF = $scope.planForward.initialOutput.disSF;
                $scope.planForward.output.socSF = $scope.planForward.initialOutput.socSF;
                $scope.planForward.output.affSF = $scope.planForward.initialOutput.affSF;
                $scope.planForward.output.parSF = $scope.planForward.initialOutput.parSF;

/*   
            //get the temp var the api to init Algorithm obj
            // $http.get('/api/PlanInitOutput').success(function (data) {
            $http.get('/api/planforwardConstraints').success(function (data) {
            //pass the value to  the output object
                $scope.planForward.output               = data;

                $scope.planForward.output.brand         = $scope.planForward.brand;
                $scope.planForward.output.lmTouch       = $scope.planForward.attribution === 'LTA' ? 'Last Touch' : 'Multi-Touch'; 
                $scope.planForward.output.StartingTime  = $scope.planForward.beginPeriod.getFullYear() + '-' + Number(Number($scope.planForward.beginPeriod.getMonth())+1);
                $scope.planForward.output.EndingTime    = $scope.planForward.endPeriod.getFullYear() + '-' + Number(Number($scope.planForward.endPeriod.getMonth())+1);
                $scope.planForward.output.Spend         = $scope.planForward.spend; 
                $scope.planForward.output.PlanMonths    = length;
                //  update within the input data and init , ready to send to server
                // send the post request to server with input init
            
                $http.post('/api/PlanInitOutput', $scope.planForward.output).success(function(data){
                    console.log(data);
                //get the response from the server side
                $scope.planForward.output        = data;
                $scope.planForward.dataThrough   = new Date($scope.planForward.endPeriod);
                $scope.planForward.dataThrough.setMonth($scope.planForward.include ? $scope.planForward.endPeriod.getMonth() : $scope.planForward.endPeriod.getMonth() - 1);
                $scope.planForward.output.semTLB = Number($scope.planForward.output.semBLB) + Number($scope.planForward.output.semCLB) + Number($scope.planForward.output.semPLB) + Number($scope.planForward.output.semOLB);
                $scope.planForward.output.semTUB = Number($scope.planForward.output.semBUB) + Number($scope.planForward.output.semCUB) + Number($scope.planForward.output.semPUB) + Number($scope.planForward.output.semOUB);
                // set default value of input
                $scope.planForward.input.semMin = $scope.planForward.output.semTLB;
                $scope.planForward.input.semMax = $scope.planForward.output.semTUB;
                $scope.planForward.input.semBMin = $scope.planForward.output.semBLB;
                $scope.planForward.input.semBMax = $scope.planForward.output.semBUB;
                $scope.planForward.input.semCMin = $scope.planForward.output.semCLB;
                $scope.planForward.input.semCMax = $scope.planForward.output.semCUB;
                $scope.planForward.input.semPMin = $scope.planForward.output.semPLB;
                $scope.planForward.input.semPMax = $scope.planForward.output.semPUB;
                $scope.planForward.input.semOMin = $scope.planForward.output.semOLB;
                $scope.planForward.input.semOMax = $scope.planForward.output.semOUB;
                $scope.planForward.input.disMin = Number($scope.planForward.output.disLB);
                $scope.planForward.input.disMax = Number($scope.planForward.output.disUB);
                $scope.planForward.input.socMin = Number($scope.planForward.output.socLB);
                $scope.planForward.input.socMax = Number($scope.planForward.output.socUB);
                $scope.planForward.input.affMin = Number($scope.planForward.output.affLB);
                $scope.planForward.input.affMax = Number($scope.planForward.output.affUB);
                $scope.planForward.input.parMin = Number($scope.planForward.output.parLB);
                $scope.planForward.input.parMax = Number($scope.planForward.output.parUB);

                });
*/
            });

            $scope.nav.current = 'Constraints Input';
        };

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

        var count;

        $scope.calculate = function() {
            // init data
            $scope.planForward.runInput.UserName = "";
            $scope.planForward.runInput.Brand = $scope.planForward.brand;
            $scope.planForward.runInput.Spend = $scope.planForward.spend;
            $scope.planForward.runInput.StartingTime = $scope.getYearMonth($scope.planForward.beginPeriod);
            $scope.planForward.runInput.PlanMonths = $scope.getMonthDiff($scope.planForward.beginPeriod, $scope.planForward.endPeriod);
            $scope.planForward.runInput.EndingTime = $scope.getYearMonth($scope.planForward.endPeriod);
            $scope.planForward.runInput.lmTouch = $scope.planForward.attribution == "LTA"? "Last Touch" : "Multi-Touch";

            $scope.planForward.runInput.Algorithm = 2;
            $scope.planForward.runInput.AlgStartingTime = "";
            $scope.planForward.runInput.AlgEndingTime = "";
            $scope.planForward.runInput.AlgDuration = "";

            $scope.planForward.runInput.semCLB = $scope.planForward.output.semCLB;
            $scope.planForward.runInput.semPLB = $scope.planForward.output.semPLB;
            $scope.planForward.runInput.semOLB = $scope.planForward.output.semOLB;
            $scope.planForward.runInput.semBLB = $scope.planForward.output.semBLB;
            $scope.planForward.runInput.disLB = $scope.planForward.output.disLB;
            $scope.planForward.runInput.socLB = $scope.planForward.output.socLB;
            $scope.planForward.runInput.affLB = $scope.planForward.output.affLB;
            $scope.planForward.runInput.parLB = $scope.planForward.output.parLB;

            $scope.planForward.runInput.semCMin = $scope.planForward.input.semCMin;
            $scope.planForward.runInput.semPMin = $scope.planForward.input.semPMin;
            $scope.planForward.runInput.semOMin = $scope.planForward.input.semOMin;
            $scope.planForward.runInput.semBMin = $scope.planForward.input.semBMin;
            $scope.planForward.runInput.disMin = $scope.planForward.input.disMin;
            $scope.planForward.runInput.socMin = $scope.planForward.input.socMin;
            $scope.planForward.runInput.affMin = $scope.planForward.input.affMin;
            $scope.planForward.runInput.parMin = $scope.planForward.input.parMin;

            $scope.planForward.runInput.semCMax = $scope.planForward.input.semCMax;
            $scope.planForward.runInput.semPMax = $scope.planForward.input.semPMax;
            $scope.planForward.runInput.semOMax = $scope.planForward.input.semOMax;
            $scope.planForward.runInput.semBMax = $scope.planForward.input.semBMax;
            $scope.planForward.runInput.disMax = $scope.planForward.input.disMax;
            $scope.planForward.runInput.socMax = $scope.planForward.input.socMax;
            $scope.planForward.runInput.affMax = $scope.planForward.input.affMax;
            $scope.planForward.runInput.parMax = $scope.planForward.input.parMax;

            $scope.planForward.runInput.semCUB = $scope.planForward.output.semCUB;
            $scope.planForward.runInput.semPUB = $scope.planForward.output.semPUB;
            $scope.planForward.runInput.semOUB = $scope.planForward.output.semOUB;
            $scope.planForward.runInput.semBUB = $scope.planForward.output.semBUB;
            $scope.planForward.runInput.disUB = $scope.planForward.output.disUB;
            $scope.planForward.runInput.socUB = $scope.planForward.output.socUB;
            $scope.planForward.runInput.affUB = $scope.planForward.output.affUB;
            $scope.planForward.runInput.parUB = $scope.planForward.output.parUB;

            $scope.planForward.runInput.semCSF = $scope.planForward.output.semCSF;
            $scope.planForward.runInput.semPSF = $scope.planForward.output.semPSF;
            $scope.planForward.runInput.semOSF = $scope.planForward.output.semOSF;
            $scope.planForward.runInput.semBSF = $scope.planForward.output.semBSF;
            $scope.planForward.runInput.disSF = $scope.planForward.output.disSF;
            $scope.planForward.runInput.socSF = $scope.planForward.output.socSF;
            $scope.planForward.runInput.affSF = $scope.planForward.output.affSF;
            $scope.planForward.runInput.parSF = $scope.planForward.output.parSF;

            // should add ng-model for direct mail and TV
            // here use the data returned by R initialized json file, and cannot change
            $scope.planForward.runInput.dirSpendM1 = $scope.planForward.initialOutput.dirSpendM1;
            $scope.planForward.runInput.dirSpendM2 = $scope.planForward.initialOutput.dirSpendM2;
            $scope.planForward.runInput.dirSpendM3 = $scope.planForward.initialOutput.dirSpendM3;

            $scope.planForward.runInput.tvBeginDate = $scope.planForward.initialOutput.tvBeginDate;
            $scope.planForward.runInput.tvEndDate = $scope.planForward.initialOutput.tvEndDate;
            $scope.planForward.runInput.tvImpressions = $scope.planForward.initialOutput.tvImpressions;
            $scope.planForward.runInput.tvSpend = $scope.planForward.initialOutput.tvSpend;

            $scope.planForward.runInput.semSR = "";
            $scope.planForward.runInput.semCSR = "";
            $scope.planForward.runInput.semPSR = "";
            $scope.planForward.runInput.semOSR = "";
            $scope.planForward.runInput.semBSR = "";
            $scope.planForward.runInput.disSR = "";
            $scope.planForward.runInput.socSR = "";
            $scope.planForward.runInput.affSR = "";
            $scope.planForward.runInput.parSR = "";
            $scope.planForward.runInput.totSR = "";

            $scope.planForward.runInput.semPR = "";
            $scope.planForward.runInput.semCPR = "";
            $scope.planForward.runInput.semPPR = "";
            $scope.planForward.runInput.semOPR = "";
            $scope.planForward.runInput.semBPR = "";
            $scope.planForward.runInput.disPR = "";
            $scope.planForward.runInput.socPR = "";
            $scope.planForward.runInput.affPR = "";
            $scope.planForward.runInput.parPR = "";
            $scope.planForward.runInput.totPR = "";

            $scope.planForward.runInput.run1RevRange = "";
            $scope.planForward.runInput.run1ProjROI = "";
            $scope.planForward.runInput.run1ROIRange = "";

            $scope.planForward.runInput.semSlideLeft = "";
            $scope.planForward.runInput.semCSlideLeft = "";
            $scope.planForward.runInput.semPSlideLeft = "";
            $scope.planForward.runInput.semOSlideLeft = "";
            $scope.planForward.runInput.semBSlideLeft = "";
            $scope.planForward.runInput.disSlideLeft = "";
            $scope.planForward.runInput.socSlideLeft = "";
            $scope.planForward.runInput.affSlideLeft = "";
            $scope.planForward.runInput.parSlideLeft = "";

            $scope.planForward.runInput.semSlide = "";
            $scope.planForward.runInput.semCSlide = "";
            $scope.planForward.runInput.semPSlide = "";
            $scope.planForward.runInput.semOSlide = "";
            $scope.planForward.runInput.semBSlide = "";
            $scope.planForward.runInput.disSlide = "";
            $scope.planForward.runInput.socSlide = "";
            $scope.planForward.runInput.affSlide = "";
            $scope.planForward.runInput.parSlide = "";

            $scope.planForward.runInput.semSlideRight = "";
            $scope.planForward.runInput.semCSlideRight = "";
            $scope.planForward.runInput.semPSlideRight = "";
            $scope.planForward.runInput.semOSlideRight = "";
            $scope.planForward.runInput.semBSlideRight = "";
            $scope.planForward.runInput.disSlideRight = "";
            $scope.planForward.runInput.socSlideRight = "";
            $scope.planForward.runInput.affSlideRight = "";
            $scope.planForward.runInput.parSlideRight = "";

            $scope.planForward.runInput.semSlideDivMin = "";
            $scope.planForward.runInput.semCSlideDivMin = "";
            $scope.planForward.runInput.semPSlideDivMin = "";
            $scope.planForward.runInput.semOSlideDivMin = "";
            $scope.planForward.runInput.semBSlideDivMin = "";
            $scope.planForward.runInput.disSlideDivMin = "";
            $scope.planForward.runInput.socSlideDivMin = "";
            $scope.planForward.runInput.affSlideDivMin = "";
            $scope.planForward.runInput.parSlideDivMin = "";

            $scope.planForward.runInput.semSlideDivMax = "";
            $scope.planForward.runInput.semCSlideDivMax = "";
            $scope.planForward.runInput.semPSlideDivMax = "";
            $scope.planForward.runInput.semOSlideDivMax = "";
            $scope.planForward.runInput.semBSlideDivMax = "";
            $scope.planForward.runInput.disSlideDivMax = "";
            $scope.planForward.runInput.socSlideDivMax = "";
            $scope.planForward.runInput.affSlideDivMax = "";
            $scope.planForward.runInput.parSlideDivMax = "";

            $scope.planForward.runInput.semAS = "";
            $scope.planForward.runInput.semCAS = "";
            $scope.planForward.runInput.semPAS = "";
            $scope.planForward.runInput.semOAS = "";
            $scope.planForward.runInput.semBAS = "";
            $scope.planForward.runInput.disAS = "";
            $scope.planForward.runInput.socAS = "";
            $scope.planForward.runInput.affAS = "";
            $scope.planForward.runInput.parAS = "";
            $scope.planForward.runInput.totAS = "";

            $scope.planForward.runInput.semAR = "";
            $scope.planForward.runInput.semCAR = "";
            $scope.planForward.runInput.semPAR = "";
            $scope.planForward.runInput.semOAR = "";
            $scope.planForward.runInput.semBAR = "";
            $scope.planForward.runInput.disAR = "";
            $scope.planForward.runInput.socAR = "";
            $scope.planForward.runInput.affAR = "";
            $scope.planForward.runInput.parAR = "";
            $scope.planForward.runInput.totAR = "";

            $scope.planForward.runInput.run2ProjROI = "";



            console.log($scope.planForward.runInput);

            // add the scenario id
                var scenarioId = {};
                   scenarioId.brandShort    =  "SLFY";
                   scenarioId.StartingTime  =  myformat($scope.planForward.beginPeriod);
                   scenarioId.EndingTime    =  myformat($scope.planForward.endPeriod);
                   scenarioId.lmTouch       =  shortLmTouch($scope.planForward.runInput.lmTouch);
                   scenarioId.CreateTime    =  new Date().getTime();

                $scope.planForward.runInput.scenarioId = scenarioId.brandShort+"-"+scenarioId.StartingTime+"-"+scenarioId.EndingTime+"-"+scenarioId.lmTouch+"-"+"N"+"-"+scenarioId.CreateTime ;
                //planforwardSaveInfo.id = $scope.planForward.runInput.scenarioId;
                console.log($scope.planForward.runInput.scenarioId);
                function myformat(t){
                    return t.toDateString().slice(4,7)+t.toDateString().slice(11,15);;
                }
                function shortLmTouch(l){
                    return l.charAt(0)==="L" ? "LTA" : "MTA";
                }
                //end of add the scenario id

            //add strategies on this post request within more than 5 mins waiting 
            $http.post("/api/sendR", $scope.planForward.runInput).success(function(data, status) {
               if(data.post) console.log("R running");
            });

            count = setInterval(doGet,4000);

            function doGet(){
                //console.log("inner");
            if($scope.getJson === false){
                   $http.get('/api/testGet').success(function (data) {
                        console.log(JSON.stringify(data));
                        console.log(data.test);
                        if(data.test === true){
                            $scope.getJson = true;
                        }
                    });
            }else{
                clearInterval(count);
                
                $http.get('/api/PlanRunOutput').success(function(data){
                     console.log(data);
                console.log("post success for run");
                //$scope.planForward.output           = data;
                $scope.planForward.runOutput        = data;

                $scope.planForward.input.semBAS = Number($scope.planForward.runOutput.semBAS);
                $scope.planForward.input.semCAS = Number($scope.planForward.runOutput.semCAS);
                $scope.planForward.input.semPAS = Number($scope.planForward.runOutput.semPAS);
                $scope.planForward.input.semOAS = Number($scope.planForward.runOutput.semOAS);
                $scope.planForward.input.disAS = Number($scope.planForward.runOutput.disAS);
                $scope.planForward.input.socAS = Number($scope.planForward.runOutput.socAS);
                $scope.planForward.input.affAS = Number($scope.planForward.runOutput.affAS);
                $scope.planForward.input.parAS = Number($scope.planForward.runOutput.parAS);
                

                //get sum for semToal's elements
                $scope.planForward.output.semTLB = Number($scope.planForward.runOutput.semBLB) + Number($scope.planForward.runOutput.semCLB) + Number($scope.planForward.runOutput.semPLB) + Number($scope.planForward.runOutput.semOLB);
                $scope.planForward.input.semTMin = Number($scope.planForward.runOutput.semBMin) + Number($scope.planForward.runOutput.semCMin) + Number($scope.planForward.runOutput.semPMin) + Number($scope.planForward.runOutput.semOMin);
                $scope.planForward.input.semTMax = Number($scope.planForward.runOutput.semBMax) + Number($scope.planForward.runOutput.semCMax) + Number($scope.planForward.runOutput.semPMax) + Number($scope.planForward.runOutput.semOMax);
                $scope.planForward.output.semTUB = Number($scope.planForward.runOutput.semBUB) + Number($scope.planForward.runOutput.semCUB) + Number($scope.planForward.runOutput.semPUB) + Number($scope.planForward.runOutput.semOUB);
                $scope.planForward.output.semTSR = Number($scope.planForward.runOutput.semBSR) + Number($scope.planForward.runOutput.semCSR) + Number($scope.planForward.runOutput.semPSR) + Number($scope.planForward.runOutput.semOSR);

                //get different for the  different channels
                $scope.planForward.output.semTSD = $scope.planForward.output.semSR - $scope.planForward.input.semTSR;
                $scope.planForward.output.semBSD = $scope.planForward.output.semBSR - $scope.planForward.input.semBSB;
                $scope.planForward.output.semCSD = $scope.planForward.output.semCSR - $scope.planForward.input.semCSB;
                $scope.planForward.output.semPSD = $scope.planForward.output.semPSR - $scope.planForward.input.semPSB;
                $scope.planForward.output.semOSD = $scope.planForward.output.semOSR - $scope.planForward.input.semOSB;
                $scope.planForward.output.disSD = $scope.planForward.output.disSR - $scope.planForward.input.disSB;
                $scope.planForward.output.socSD = $scope.planForward.output.socSR - $scope.planForward.input.socSB;
                $scope.planForward.output.affSD = $scope.planForward.output.affSR - $scope.planForward.input.affSB;
                $scope.planForward.output.parSD = $scope.planForward.output.parSR - $scope.planForward.input.parSB;

                //get portfolio total 
                $scope.planForward.output.PTLB = Number($scope.planForward.output.semTLB) + Number($scope.planForward.output.disLB) + Number($scope.planForward.output.socLB) + Number($scope.planForward.output.affLB) + Number($scope.planForward.output.parLB);
                $scope.planForward.input.PTMin = Number($scope.planForward.input.semTMin) + Number($scope.planForward.input.disMin) + Number($scope.planForward.input.socMin) + Number($scope.planForward.input.affMin) + Number($scope.planForward.input.parMin);
                $scope.planForward.input.PTMax = Number($scope.planForward.input.semTMax) + Number($scope.planForward.input.disMax) + Number($scope.planForward.input.socMax) + Number($scope.planForward.input.affMax) + Number($scope.planForward.input.parMax);
                $scope.planForward.output.PTUB = Number($scope.planForward.output.semTUB) + Number($scope.planForward.output.disUB) + Number($scope.planForward.output.socUB) + Number($scope.planForward.output.affUB) + Number($scope.planForward.output.parUB);
                $scope.planForward.output.PTSR = Number($scope.planForward.output.semTSR) + Number($scope.planForward.output.disSR) + Number($scope.planForward.output.socSR) + Number($scope.planForward.output.affSR) + Number($scope.planForward.output.parSR);
                $scope.planForward.output.PTPR = Number($scope.planForward.output.disPR) + Number($scope.planForward.output.socPR) + Number($scope.planForward.output.affPR) + Number($scope.planForward.output.parPR);

                $scope.planForward.output.semBSR = $scope.planForward.runOutput.semBSR;
                $scope.planForward.output.semCSR = $scope.planForward.runOutput.semCSR;
                $scope.planForward.output.semPSR = $scope.planForward.runOutput.semPSR;
                $scope.planForward.output.semOSR = $scope.planForward.runOutput.semOSR;
                $scope.planForward.output.disSR = $scope.planForward.runOutput.disSR;
                $scope.planForward.output.socSR = $scope.planForward.runOutput.socSR;
                $scope.planForward.output.affSR = $scope.planForward.runOutput.affSR;
                $scope.planForward.output.parSR = $scope.planForward.runOutput.parSR;
                $scope.planForward.output.parSR = $scope.planForward.runOutput.parSR;

                $scope.planForward.output.semPR = $scope.planForward.runOutput.semPR;
                $scope.planForward.output.disPR = $scope.planForward.runOutput.disPR;
                $scope.planForward.output.socPR = $scope.planForward.runOutput.socPR;
                $scope.planForward.output.affPR = $scope.planForward.runOutput.affPR;
                $scope.planForward.output.parPR = $scope.planForward.runOutput.parPR;


                $scope.nav.current = 'Output';
                });
            }
            
            }
        };

/*
        $scope.calculate = function () {
            // init data
            $scope.planForward.input.semAS = Number($scope.planForward.output.semTLB);
            $scope.planForward.input.disAS = Number($scope.planForward.output.disLB);
            $scope.planForward.input.socAS = Number($scope.planForward.output.socLB);
            $scope.planForward.input.affAS = Number($scope.planForward.output.affLB);
            $scope.planForward.input.parAS = Number($scope.planForward.output.parLB);

            
            //update the data with max min and send the file to server to get res 
            //change the data  with min max scroll value
            
                $scope.planForward.output.semBMin    =   $scope.planForward.input.semBMin;
                $scope.planForward.output.semBMax    =   $scope.planForward.input.semBMax; 
                $scope.planForward.output.semCMin    =   $scope.planForward.input.semCMin;
                $scope.planForward.output.semCMax    =   $scope.planForward.input.semCMax;
                $scope.planForward.output.semPMin    =   $scope.planForward.input.semPMin; 
                $scope.planForward.output.semPMax    =   $scope.planForward.input.semPMax;
                $scope.planForward.output.semOMin    =   $scope.planForward.input.semOMin;
                $scope.planForward.output.semOMax    =   $scope.planForward.input.semOMax;
                $scope.planForward.output.disMin     =   $scope.planForward.input.disMin +   "";
                $scope.planForward.output.disMax     =   $scope.planForward.input.disMax +   "";
                $scope.planForward.output.socMin     =   $scope.planForward.input.socMin +   "";
                $scope.planForward.output.socMax     =   $scope.planForward.input.socMax +   "";
                $scope.planForward.output.affMin     =   $scope.planForward.input.affMin +   "";
                $scope.planForward.output.affMax     =   $scope.planForward.input.affMax +   "";
                $scope.planForward.output.parMin     =   $scope.planForward.input.parMin +   "";
                $scope.planForward.output.parMax     =   $scope.planForward.input.parMax +   "";
            
            //add strategies on this post request within more than 5 mins waiting 
            count = setInterval(doGet,4000);

            function doGet(){
                //console.log("inner");
            if($scope.getJson === false){
                   $http.get('/api/testGet').success(function (data) {
                        console.log(JSON.stringify(data));
                        console.log(data.test);
                        if(data.test === true){
                            $scope.getJson = true;
                        }
                    });
            }
            else{
                clearInterval(count);
                
                $http.post('/api/PlanInitOutput', $scope.planForward.output).success(function(data){
                console.log(data);

                $scope.planForward.output = data;
                $scope.planForward.input.semBAS = Number($scope.planForward.output.semBAS);
                $scope.planForward.input.semCAS = Number($scope.planForward.output.semCAS);
                $scope.planForward.input.semPAS = Number($scope.planForward.output.semPAS);
                $scope.planForward.input.semOAS = Number($scope.planForward.output.semOAS);
                $scope.planForward.input.disAS = Number($scope.planForward.output.disAS);
                $scope.planForward.input.socAS = Number($scope.planForward.output.socAS);
                $scope.planForward.input.affAS = Number($scope.planForward.output.affAS);
                $scope.planForward.input.parAS = Number($scope.planForward.output.parAS);

                $scope.nav.current = 'Output';

                //get sum for semToal's elements
                $scope.planForward.output.semTLB = Number($scope.planForward.output.semBLB) + Number($scope.planForward.output.semCLB) + Number($scope.planForward.output.semPLB) + Number($scope.planForward.output.semOLB);
                $scope.planForward.input.semTMin = Number($scope.planForward.input.semBMin) + Number($scope.planForward.input.semCMin) + Number($scope.planForward.input.semPMin) + Number($scope.planForward.input.semOMin);
                $scope.planForward.input.semTMax = Number($scope.planForward.input.semBMax) + Number($scope.planForward.input.semCMax) + Number($scope.planForward.input.semPMax) + Number($scope.planForward.input.semOMax);
                $scope.planForward.output.semTUB = Number($scope.planForward.output.semBUB) + Number($scope.planForward.output.semCUB) + Number($scope.planForward.output.semPUB) + Number($scope.planForward.output.semOUB);
                $scope.planForward.output.semTSR = Number($scope.planForward.output.semBSR) + Number($scope.planForward.output.semCSR) + Number($scope.planForward.output.semPSR) + Number($scope.planForward.output.semOSR);

                //get different for the  different channels
                $scope.planForward.output.semTSD = $scope.planForward.output.semSR - $scope.planForward.input.semTSR;
                $scope.planForward.output.semBSD = $scope.planForward.output.semBSR - $scope.planForward.input.semBSB;
                $scope.planForward.output.semCSD = $scope.planForward.output.semCSR - $scope.planForward.input.semCSB;
                $scope.planForward.output.semPSD = $scope.planForward.output.semPSR - $scope.planForward.input.semPSB;
                $scope.planForward.output.semOSD = $scope.planForward.output.semOSR - $scope.planForward.input.semOSB;
                $scope.planForward.output.disSD = $scope.planForward.output.disSR - $scope.planForward.input.disSB;
                $scope.planForward.output.socSD = $scope.planForward.output.socSR - $scope.planForward.input.socSB;
                $scope.planForward.output.affSD = $scope.planForward.output.affSR - $scope.planForward.input.affSB;
                $scope.planForward.output.parSD = $scope.planForward.output.parSR - $scope.planForward.input.parSB;

                //get portfolio total 
                $scope.planForward.output.PTLB = Number($scope.planForward.output.semTLB) + Number($scope.planForward.output.disLB) + Number($scope.planForward.output.socLB) + Number($scope.planForward.output.affLB) + Number($scope.planForward.output.parLB);
                $scope.planForward.input.PTMin = Number($scope.planForward.input.semTMin) + Number($scope.planForward.input.disMin) + Number($scope.planForward.input.socMin) + Number($scope.planForward.input.affMin) + Number($scope.planForward.input.parMin);
                $scope.planForward.input.PTMax = Number($scope.planForward.input.semTMax) + Number($scope.planForward.input.disMax) + Number($scope.planForward.input.socMax) + Number($scope.planForward.input.affMax) + Number($scope.planForward.input.parMax);
                $scope.planForward.output.PTUB = Number($scope.planForward.output.semTUB) + Number($scope.planForward.output.disUB) + Number($scope.planForward.output.socUB) + Number($scope.planForward.output.affUB) + Number($scope.planForward.output.parUB);
                $scope.planForward.output.PTSR = Number($scope.planForward.output.semTSR) + Number($scope.planForward.output.disSR) + Number($scope.planForward.output.socSR) + Number($scope.planForward.output.affSR) + Number($scope.planForward.output.parSR);
                $scope.planForward.output.PTPR = Number($scope.planForward.output.disPR) + Number($scope.planForward.output.socPR) + Number($scope.planForward.output.affPR) + Number($scope.planForward.output.parPR);

                });   

                //init the check for later use
                $scope.getJson = false;                   
                }
               // console.log($scope.getJson);
            }
        };
*/

        $scope.$watch('planForward', function () {
            if ($scope.nav.current === 'Constraints Input') {
                $scope.planForward.input.semMin = Number($scope.planForward.input.semBMin) + Number($scope.planForward.input.semCMin) + Number($scope.planForward.input.semPMin) + Number($scope.planForward.input.semOMin);
                $scope.planForward.input.semMax = Number($scope.planForward.input.semBMax) + Number($scope.planForward.input.semCMax) + Number($scope.planForward.input.semPMax) + Number($scope.planForward.input.semOMax);
            } else if ($scope.nav.current === 'Output') {
                $scope.planForward.input.semTSR = Number($scope.planForward.input.semBAS) + Number($scope.planForward.input.semCAS) + Number($scope.planForward.input.semPAS) + Number($scope.planForward.input.semOAS);
                $scope.planForward.input.PTSR = Number($scope.planForward.input.semTSR) + Number($scope.planForward.input.disAS) + Number($scope.planForward.input.socAS) + Number($scope.planForward.input.affAS) + Number($scope.planForward.input.parAS);
                $scope.planForward.output.semTSD = $scope.planForward.output.semSR - $scope.planForward.input.semTSR;
                $scope.planForward.output.semBSD = $scope.planForward.output.semBSR - $scope.planForward.input.semBAS;
                $scope.planForward.output.semCSD = $scope.planForward.output.semCSR - $scope.planForward.input.semCAS;
                $scope.planForward.output.semPSD = $scope.planForward.output.semPSR - $scope.planForward.input.semPAS;
                $scope.planForward.output.semOSD = $scope.planForward.output.semOSR - $scope.planForward.input.semOAS;
                $scope.planForward.output.disSD = $scope.planForward.output.disSR - $scope.planForward.input.disAS;
                $scope.planForward.output.socSD = $scope.planForward.output.socSR - $scope.planForward.input.socAS;
                $scope.planForward.output.affSD = $scope.planForward.output.affSR - $scope.planForward.input.affAS;
                $scope.planForward.output.parSD = $scope.planForward.output.parSR - $scope.planForward.input.parAS;
                $scope.planForward.output.PTSD = $scope.planForward.output.PTSR - $scope.planForward.input.PTSR;
            }
        }, true);

        $scope.save = function () {
            $location.path('planforward/save');
        };


        $scope.showme = false;
        $scope.planforwardContentSize = 'col-sm-12';
        $scope.showGraph = 'Show Graph';

        $scope.toggle = function() {
            if ($scope.showme == false) {
                $scope.planforwardContentSize = 'col-sm-8';
                $scope.showme = true;
                $scope.showGraph = 'Hide Graph';
            }
            else {
                $scope.planforwardContentSize = 'col-sm-12';
                $scope.showme = false;
                $scope.showGraph = 'Show Graph';
            }
        };

        // added by david
        $scope.reRun = function() {

            $scope.reRunSem();
            $scope.reRunDis();
            $scope.reRunSoc();
            $scope.reRunAff();
            $scope.reRunPar();

            $scope.planForward.input.totAS = Number($scope.planForward.input.semAS)+ Number($scope.planForward.input.disAS) +
                Number($scope.planForward.input.socAS) + Number($scope.planForward.input.affAS) + Number($scope.planForward.input.parAS);

            $scope.planForward.output.totAR = $scope.planForward.output.semAR + $scope.planForward.output.disAR +
                $scope.planForward.output.socAR + $scope.planForward.output.affAR + $scope.planForward.output.parAR;

            $scope.planForward.output.totSD = $scope.planForward.input.totAS - $scope.planForward.output.totSR;
            $scope.planForward.output.totRD = $scope.planForward.output.totAR - $scope.planForward.output.totPR;

            $scope.planForward.output.optimizedROI = parseInt((($scope.planForward.output.totAR - $scope.planForward.input.totAS) /
                $scope.planForward.input.totAS) * 100);

            $scope.planForward.output.differenceROI= $scope.planForward.output.optimizedROI - $scope.planForward.output.actualROI;

            $scope.planForward.spend = $scope.planForward.input.totAS;

            $scope.compareChartData = [
                {title: "SEM", value: $scope.planForward.output.semSD},
                {title: "Display", value: $scope.planForward.output.disSD},
                {title: "Social", value: $scope.planForward.output.socSD},
                {title: "Affiliates", value: $scope.planForward.output.affSD},
                {title: "Partners", value: $scope.planForward.output.parSD},
                {title: "Portfolio Total", value: $scope.planForward.output.totSD}
            ];
        };

        $scope.reRunSem = function() {

            var numSemSR = 0;
            var numSemPR = 0;
            var numSemAS = 0;
            var numSemAR = 0;
            var numSemSD = 0;
            var numSemRD = 0;

            numSemSR = Number($scope.planForward.output.semSR);
            numSemPR = Number($scope.planForward.output.semPR);
            numSemAS = Number($scope.planForward.input.semAS);

            numSemAR = parseInt(numSemPR + (numSemAS - numSemSR) * 4);
            numSemSD = numSemAS - numSemSR;
            numSemRD = numSemAR - numSemPR;

            $scope.planForward.output.semAR = numSemAR;
            $scope.planForward.output.semSD = numSemSD;
            $scope.planForward.output.semRD = numSemRD;
        };

        $scope.reRunDis = function() {

            var numDisSR = 0;
            var numDisPR = 0;
            var numDisAS = 0;
            var numDisAR = 0;
            var numDisSD = 0;
            var numDisRD = 0;

            numDisSR = Number($scope.planForward.output.disSR);
            numDisPR = Number($scope.planForward.output.disPR);
            numDisAS = Number($scope.planForward.input.disAS);

            numDisAR = parseInt(numDisPR + (numDisAS - numDisSR) * 4);
            numDisSD = numDisAS - numDisSR;
            numDisRD = numDisAR - numDisPR;

            $scope.planForward.output.disAR = numDisAR;
            $scope.planForward.output.disSD = numDisSD;
            $scope.planForward.output.disRD = numDisRD;
        };

        $scope.reRunSoc = function() {

            var numSocSR = 0;
            var numSocPR = 0;
            var numSocAS = 0;
            var numSocAR = 0;
            var numSocSD = 0;
            var numSocRD = 0;

            numSocSR = Number($scope.planForward.output.socSR);
            numSocPR = Number($scope.planForward.output.socPR);
            numSocAS = Number($scope.planForward.input.socAS);

            numSocAR = parseInt(numSocPR + (numSocAS - numSocSR) * 4);
            numSocSD = numSocAS - numSocSR;
            numSocRD = numSocAR - numSocPR;

            $scope.planForward.output.socAR = numSocAR;
            $scope.planForward.output.socSD = numSocSD;
            $scope.planForward.output.socRD = numSocRD;
        };

        $scope.reRunAff = function() {

            var numAffSR = 0;
            var numAffPR = 0;
            var numAffAS = 0;
            var numAffAR = 0;
            var numAffSD = 0;
            var numAffRD = 0;

            numAffSR = Number($scope.planForward.output.affSR);
            numAffPR = Number($scope.planForward.output.affPR);
            numAffAS = Number($scope.planForward.input.affAS);

            numAffAR = parseInt(numAffPR + (numAffAS - numAffSR) * 4);
            numAffSD = numAffAS - numAffSR;
            numAffRD = numAffAR - numAffPR;

            $scope.planForward.output.affAR = numAffAR;
            $scope.planForward.output.affSD = numAffSD;
            $scope.planForward.output.affRD = numAffRD;
        };

        $scope.reRunPar = function() {

            var numParSR = 0;
            var numParPR = 0;
            var numParAS = 0;
            var numParAR = 0;
            var numParSD = 0;
            var numParRD = 0;

            numParSR = Number($scope.planForward.output.parSR);
            numParPR = Number($scope.planForward.output.parPR);
            numParAS = Number($scope.planForward.input.parAS);

            numParAR = parseInt(numParPR + (numParAS - numParSR) * 4);
            numParSD = numParAS - numParSR;
            numParRD = numParAR - numParPR;

            $scope.planForward.output.parAR = numParAR;
            $scope.planForward.output.parSD = numParSD;
            $scope.planForward.output.parRD = numParRD;
        };

        $scope.reset = function() {

            $scope.planForward.spend = $scope.planForward.output.totSR;
            $scope.calculate();
        }

        $scope.saveScenario = function() {

        };

        $scope.backOutput = function() {
            alert('go back Output');
            $location.path('planforward');
        };

        //for the d3 chart setting
        /*
        $scope.compareChart.data = [
            {title: "SEM", value: $scope.planForward.output.semTSD},
            {title: "SEM-Bord", value: $scope.planForward.output.semBSD},
            {title: "SEM-Card", value: $scope.planForward.output.semCSD},
            {title: "SEM-Photobook", value: $scope.planForward.output.semPSD},
            {title: "SEM-Others", value: $scope.planForward.output.semOSD},
            {title: "Display", value: $scope.planForward.output.disSD},
            {title: "Social", value: $scope.planForward.output.socSD},
            {title: "Affiliates", value: $scope.planForward.output.affSD},
            {title: "Partners", value: $scope.planForward.output.parSD},
            {title: "Portfolio Total", value: $scope.planForward.output.PTSD}
        ];
        */
        $scope.compareChart.data = [
            {title: "SEM", value: -109009},
            {title: "SEM-Bord", value: -8002},
            {title: "SEM-Card", value: -24321},
            {title: "SEM-Photobook", value: -25422},
            {title: "SEM-Others", value: -45621},
            {title: "Display", value: -127765},
            {title: "Social", value: 462326},
            {title: "Affiliates", value: -26445},
            {title: "Partners", value: -199106},
            {title: "Portfolio Total", value: 0}
        ];
        $scope.compareChart.config = {
            width: 360,
            height: 313,
            margin: {left: 100, top: 0, right: 100, bottom: 30}
        };
    }])
    .directive('formatInput', ['$filter', function ($filter) {
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