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
            //adjust the date for the R Algorithm version 1.0
            $scope.minDate = new Date('2010','01','01');

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
            
            //get the temp var the api to init Algorithm obj
            $http.get('/api/PlanInitOutput').success(function (data) {
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
            


            $http.post('/api/sendR', $scope.planForward.output).success(function(data){
                if(data.post) console.log('R running');
            });
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
                
                $http.get('/api/PlanRunOutput').success(function(data){
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
        }

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

    }]);