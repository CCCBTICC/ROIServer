/**
 * Created by Haizhou on 5/8/2015.
 */
'use strict';
define(['app'], function (app) {
    app.controller('backCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
            // tooltips
            $scope.brandTooltips = 'brandTooltips';
            $scope.attrTooltips = 'attrTooltips';
            $scope.beginPeriodTooltips = 'beginPeriodTooltips';
            $scope.endPeriodTooltips = 'endPeriodTooltips';
            $scope.spendTooltips = 'spendTooltips';
            $scope.includeTooltips = 'includeTooltips';

            // Calendar settings
            $scope.opened = {};
            $scope.format = 'MMMM-dd-yyyy';
            $scope.dateOptions = {
                formatYear: 'yyyy',
                startingDay: 1,
                minMode: 'month'
            };
            // get json init
            $scope.getJson = false;

            $scope.today = function () {
                var date = new Date();
                $scope.lookBack.beginPeriod = new Date(date.getFullYear(), date.getMonth() - 1, 1);
                $scope.lookBack.endPeriod = new Date(date.getFullYear(), date.getMonth(), 0);
                $scope.maxDate = new Date();
                $scope.maxDate.setMonth($scope.maxDate.getMonth() - 1);
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
                $scope.lookBack.endPeriod = new Date($scope.lookBack.endPeriod);
                $scope.lookBack.endPeriod = new Date($scope.lookBack.endPeriod.getFullYear(), $scope.lookBack.endPeriod.getMonth() + 1, 0);
            };

            // init data default
            $scope.resetForm = function () {
                // Nav bar
                $scope.nav = {};
                $scope.nav.current = 'Initial Input';

                // Data
                $scope.lookBack = {};

                // Brand
                $scope.brands = ['shutterfly'];
                $scope.lookBack.brand = $scope.brands[0];

                // Attribution
                $scope.lookBack.attribution = 'MTA';

                //
                $scope.formatInput = function () {
                    $scope.lookBack.spend = ($filter('formatCurrency')($scope.lookBack.spend)).substr(1);
                };

                // Include data
                $scope.lookBack.include = true;

                // Calendar
                $scope.today();

                // Table
                $scope.lookBack.input = {};
            };
            $scope.resetForm();

            // table

            $scope.calculate = function () {
                $http.get('dummy_data/output/1430764474_63.json').success(function (data) {
                    $scope.lookBack.output = data;
                    $scope.lookBack.dataThrough = new Date($scope.lookBack.endPeriod);
                    $scope.lookBack.dataThrough.setMonth($scope.lookBack.include ? $scope.lookBack.endPeriod.getMonth() : $scope.lookBack.endPeriod.getMonth() - 1);

                    // set default value of input
                    $scope.lookBack.input.semBSB = Number($scope.lookBack.output.semBLB);
                    $scope.lookBack.input.semCSB = Number($scope.lookBack.output.semCLB);
                    $scope.lookBack.input.semPSB = Number($scope.lookBack.output.semPLB);
                    $scope.lookBack.input.semOSB = Number($scope.lookBack.output.semOLB);
                    $scope.lookBack.input.disSB = Number($scope.lookBack.output.disLB);
                    $scope.lookBack.input.socSB = Number($scope.lookBack.output.socLB);
                    $scope.lookBack.input.affSB = Number($scope.lookBack.output.affLB);
                    $scope.lookBack.input.parSB = Number($scope.lookBack.output.parLB);

                    // jump to output page
                    $scope.nav.current = 'Output';

                    $scope.lookBack.input.semTSB = Number($scope.lookBack.input.semBSB) + Number($scope.lookBack.input.semCSB) + Number($scope.lookBack.input.semPSB) + Number($scope.lookBack.input.semOSB);
                    $scope.lookBack.output.semTUB = Number($scope.lookBack.output.semBUB) + Number($scope.lookBack.output.semCUB) + Number($scope.lookBack.output.semPUB) + Number($scope.lookBack.output.semOUB);
                    $scope.lookBack.output.semTLB = Number($scope.lookBack.output.semBLB) + Number($scope.lookBack.output.semCLB) + Number($scope.lookBack.output.semPLB) + Number($scope.lookBack.output.semOLB - 1);
                    $scope.lookBack.output.semTSD = $scope.lookBack.output.semSR - $scope.lookBack.input.semTSB;
                    $scope.lookBack.output.semBSD = $scope.lookBack.output.semBSR - $scope.lookBack.input.semBSB;
                    $scope.lookBack.output.semCSD = $scope.lookBack.output.semCSR - $scope.lookBack.input.semCSB;
                    $scope.lookBack.output.semPSD = $scope.lookBack.output.semPSR - $scope.lookBack.input.semPSB;
                    $scope.lookBack.output.semOSD = $scope.lookBack.output.semOSR - $scope.lookBack.input.semOSB;
                    $scope.lookBack.output.disSD = $scope.lookBack.output.disSR - $scope.lookBack.input.disSB;
                    $scope.lookBack.output.socSD = $scope.lookBack.output.socSR - $scope.lookBack.input.socSB;
                    $scope.lookBack.output.affSD = $scope.lookBack.output.affSR - $scope.lookBack.input.affSB;
                    $scope.lookBack.output.parSD = $scope.lookBack.output.parSR - $scope.lookBack.input.parSB;
                    $scope.lookBack.output.totLB = $scope.lookBack.output.semTLB + Number($scope.lookBack.output.disLB) + Number($scope.lookBack.output.socLB) + Number($scope.lookBack.output.affLB) + Number($scope.lookBack.output.parLB);
                    $scope.lookBack.input.totSB = $scope.lookBack.input.semTSB + Number($scope.lookBack.input.disSB) + Number($scope.lookBack.input.socSB) + Number($scope.lookBack.input.affSB) + Number($scope.lookBack.input.parSB);
                    $scope.lookBack.output.totUB = $scope.lookBack.output.semTUB + Number($scope.lookBack.output.disUB) + Number($scope.lookBack.output.socUB) + Number($scope.lookBack.output.affUB) + Number($scope.lookBack.output.parUB);
                    $scope.lookBack.output.totSD = $scope.lookBack.output.semTSD + $scope.lookBack.output.disSD + $scope.lookBack.output.socSD + $scope.lookBack.output.affSD + $scope.lookBack.output.parSD;
                });
            };
            $scope.save = function () {
                //$location.path('lookback/save');
                //console.log('save clicked');
                var a = {"a": "b"};
                $http.post('/api/test', a).success(function (data) {
                    var b = JSON.stringify(data);
                    console.log(b);
                });

            };

            /*the test url is /api/test with post method it does 3 steps
             * we use the saveGet bind on the save btn's ng-click to test
             * first is try to connect
             * second is happened when the json file changeed
             * third is post request with a updated data response
             */
            var count;
            $scope.saveGet = function () {
                //$location.path('lookback/save');
                console.log($scope.getJson);
                count = setInterval(doGet, 2000);
                /*
                 setTimeout(function(){
                 console.log("cao");
                 clearInterval(count);
                 }, 1000*60*10);
                 */
            }
            function doGet() {
                console.log("inner");
                if ($scope.getJson === false) {
                    $http.get('/api/testGet').success(function (data) {
                        console.log(JSON.stringify(data));
                        console.log(data.test);
                        if (data.test === true) {
                            $scope.getJson = true;
                        }
                    });
                }
                else {
                    clearInterval(count);
                    $http.get('/api/test').success(function (data) {
                        console.log(JSON.stringify(data));
                    });
                }
                console.log($scope.getJson);
            }


            $scope.$watch('lookBack', function () {
                if ($scope.nav.current === 'Output') {
                    $scope.lookBack.input.semTSB = Number($scope.lookBack.input.semBSB) + Number($scope.lookBack.input.semCSB) + Number($scope.lookBack.input.semPSB) + Number($scope.lookBack.input.semOSB);
                    $scope.lookBack.output.semTSD = $scope.lookBack.output.semSR - $scope.lookBack.input.semTSB;
                    $scope.lookBack.output.semBSD = $scope.lookBack.output.semBSR - $scope.lookBack.input.semBSB;
                    $scope.lookBack.output.semCSD = $scope.lookBack.output.semCSR - $scope.lookBack.input.semCSB;
                    $scope.lookBack.output.semPSD = $scope.lookBack.output.semPSR - $scope.lookBack.input.semPSB;
                    $scope.lookBack.output.semOSD = $scope.lookBack.output.semOSR - $scope.lookBack.input.semOSB;
                    $scope.lookBack.output.disSD = $scope.lookBack.output.disSR - $scope.lookBack.input.disSB;
                    $scope.lookBack.output.socSD = $scope.lookBack.output.socSR - $scope.lookBack.input.socSB;
                    $scope.lookBack.output.affSD = $scope.lookBack.output.affSR - $scope.lookBack.input.affSB;
                    $scope.lookBack.output.parSD = $scope.lookBack.output.parSR - $scope.lookBack.input.parSB;
                    $scope.lookBack.input.totSB = $scope.lookBack.input.semTSB + Number($scope.lookBack.input.disSB) + Number($scope.lookBack.input.socSB) + Number($scope.lookBack.input.affSB) + Number($scope.lookBack.input.parSB);
                    $scope.lookBack.output.totSD = $scope.lookBack.output.semTSD + $scope.lookBack.output.disSD + $scope.lookBack.output.socSD + $scope.lookBack.output.affSD + $scope.lookBack.output.parSD;
                }
            }, true);
        }]);
});



