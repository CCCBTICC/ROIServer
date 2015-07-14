/**
 * Created by ypling on 5/11/15.
 */
angular.module("ROIClientApp")
    .controller("scenariosCtrl", function ($scope, $location,$http) {
        //vars
        var viewNames = ['list', 'export', 'retrieve', 'share'];

        //functions
        function activeCount(arr) {
            var result = 0;
            arr.forEach(function (obj) {
                if (obj.isActive) {
                    result++;
                }
            });
            return result;
        }

        //scope vars
        $scope.operations = {
            compare: {disable: true},
            delete: {disable: true},
            export: {disable: true},
            retrieve: {disable: true},
            share: {disable: true}
        };

        $scope.scenarios = [];
        
        $http.get('api/scenariosList').success(function (data){
            
            //console.log(data[0]._id);
            /*
            for (var key in data) {
             
              var tempObj = {};
              tempObj[key] = data[key];
              $scope.scenarios.push(tempObj);
            }
            */
            /*
            angular.forEach(data, function(value, key){
                this.push(key + ':' + value);
            }, $scope.scenarios);
            */
            
            $scope.scenarios = data;
            console.log(JSON.stringify(data));
            console.log($scope.scenarios);
            console.log ($scope.scenarios [0]._id);
        });
        
        /*
        $scope.scenarios.push({
            isActive: false,
            id: "May2015-06-PF-LTA-001",
            name: "",
            note: "",
            createDate: "2015-05-15",
            beginMonth: "2015-06",
            endMonth: "2015-06",
            brand: "",
            plannedSpend: 3000000,
            AM: "LTA",
            revenue: 13745510,
            ROI: 358,
            historyIncluded: "",
            DataThrough: "",
            shared: ""
        }, {
            isActive: false,
            id: "May2015-06-PF-LTA-002",
            name: "",
            note: "",
            createDate: "2015-05-15",
            beginMonth: "2015-06",
            endMonth: "2015-06",
            brand: "",
            plannedSpend: 3000000,
            AM: "LTA",
            revenue: 13745510,
            ROI: 416,
            historyIncluded: "",
            DataThrough: "",
            shared: ""
        }, {
            isActive: false,
            id: "May2015-06-PF-LTA-003",
            name: "",
            note: "",
            createDate: "2015-05-15",
            beginMonth: "2015-06",
            endMonth: "2015-06",
            brand: "",
            plannedSpend: 5000000,
            AM: "LTA",
            revenue: 26185980,
            ROI: 424,
            historyIncluded: "",
            DataThrough: "",
            shared: ""
        }, {
            isActive: false,
            id: "May2015-06-PF-LTA-004",
            name: "",
            note: "",
            createDate: "2015-05-15",
            beginMonth: "2015-06",
            endMonth: "2015-07",
            brand: "",
            plannedSpend: 5000000,
            AM: "LTA",
            revenue: 27589330,
            ROI: 452,
            historyIncluded: "",
            DataThrough: "",
            shared: ""
        }, {
            isActive: false,
            id: "May2015-06-PF-LTA-005",
            name: "",
            note: "",
            createDate: "2015-05-15",
            beginMonth: "2015-06",
            endMonth: "2015-08",
            brand: "",
            plannedSpend: 5000000,
            AM: "LTA",
            revenue: 30138290,
            ROI: 503,
            historyIncluded: "",
            DataThrough: "",
            shared: ""
        }, {
            isActive: false,
            id: "May2015-06-PF-MTA-006",
            name: "",
            note: "",
            createDate: "2015-05-15",
            beginMonth: "2015-06",
            endMonth: "2015-08",
            brand: "",
            plannedSpend: 5420305,
            AM: "MTA",
            revenue: 40763387,
            ROI: 652,
            historyIncluded: "",
            DataThrough: "",
            shared: ""
        }, {
            isActive: false,
            id: "May2014-06-PF-LTA-006",
            name: "",
            note: "",
            createDate: "2015-05-15",
            beginMonth: "2014-06",
            endMonth: "2014-06",
            brand: "",
            plannedSpend: 3000000,
            AM: "LTA",
            revenue: 11610000,
            ROI: 287,
            historyIncluded: "",
            DataThrough: "",
            shared: ""
        }, {
            isActive: false,
            id: "May2014-06-LB-LTA-007",
            name: "",
            note: "",
            createDate: "2015-05-15",
            beginMonth: "2014-06",
            endMonth: "2015-07",
            brand: "",
            plannedSpend: 4000000,
            AM: "LTA",
            revenue: 15379970,
            ROI: 284,
            historyIncluded: "",
            DataThrough: "",
            shared: ""
        }, {
            isActive: false,
            id: "May2014-06-LB-LTA-008",
            name: "",
            note: "",
            createDate: "2015-05-15",
            beginMonth: "2014-06",
            endMonth: "2014-07",
            brand: "",
            plannedSpend: 5000000,
            AM: "LTA",
            revenue: 19989280,
            ROI: 300,
            historyIncluded: "",
            DataThrough: "",
            shared: ""
        }, {
            isActive: false,
            id: "May2014-06-LB-MTA-009",
            name: "",
            note: "",
            createDate: "2015-05-15",
            beginMonth: "2014-06",
            endMonth: "2014-06",
            brand: "",
            plannedSpend: 5000000,
            AM: "MTA",
            revenue: 22889210,
            ROI: 357,
            historyIncluded: "",
            DataThrough: "",
            shared: ""
        });
        console.log($scope.scenarios);
        */
        //scope functions

        $scope.switchToView = function (viewName) {
            $location.path("myscenarios/" + viewName);
        };

        $scope.selectRow = function (obj) {
            obj.isActive = !obj.isActive;
            switch (activeCount($scope.scenarios)) {
                case 0:
                    Object.keys($scope.operations).forEach(function (key) {
                        $scope.operations[key].disable = true;
                    });
                    break;
                case 1:
                    Object.keys($scope.operations).forEach(function (key) {
                        $scope.operations[key].disable = (key === 'compare');
                    });
                    break;
                case 2:
                    Object.keys($scope.operations).forEach(function (key) {
                        $scope.operations[key].disable = (key !== 'delete' && key !== 'compare');
                    });
                    break;
                default:
                    Object.keys($scope.operations).forEach(function (key) {
                        $scope.operations[key].disable = (key !== 'delete');
                    });
                    break;
            }
        };
        //main
    })
    .controller("scenariosExportCtrl", function ($scope) {
        //vars

        //functions

        //scope vars

        //scope functions
    })
    .controller("scenariosShareCtrl", function ($scope) {
        //vars

        //functions

        //scope vars

        //scope functions
    })
    .controller("saveCtrl", function ($scope) {
        //vars

        //functions

        //scope vars

        //scope functions
    })
    .controller("scenariosCompareCtrl", function ($scope) {
        //vars
        $scope.compareChart = {};
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
            width: 800,
            height: 313,
            margin: {left: 100, top: 0, right: 100, bottom: 30}
        };
        //functions

        //scope vars

        //scope functions
    });
