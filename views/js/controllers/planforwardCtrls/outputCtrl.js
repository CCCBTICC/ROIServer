/**
 * Created by Chenghuijin on 2015/7/22.
 */
define(['../module'],function(module){
    module.controller('forwardOutputCtrl', ['$scope', 'forwardManager', '$location', function ($scope, manager, location) {
        //init controller scope
        $scope.planForward = {};
        $scope.planForward.output = {};
        $scope.planForward.input = {};

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
                                $scope.planForward.output.totAS = $scope.planForward.output.semAS + Number($scope.planForward.output.disAS) + Number($scope.planForward.output.affAS) + Number($scope.planForward.output.socAS) + Number($scope.planForward.output.parAS);

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

        $scope.$on('$destroy', function () {
            clearInterval(count);
        });
    }]);

});


