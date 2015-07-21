/**
 * Created by ypling on 5/11/15.
 */
var scenariosApp = angular.module("ROIClientApp")
    .factory('scenarioManager', function ($http) {
        var scenariosUrl = "http://localhost:3001/scenarios";
        var scenarios = [];
        var get = function (callback) {
            $http.get(scenariosUrl + '/list').success(callback);
        };
        var post = function (id, callback) {
            $http({
                method: 'post',
                url: scenariosUrl,
                data: {id: id, action: 'remove'}
            }).success(callback);
        };

        return {
            getScenarios: get,
            getUsers: function () {
            },
            deleteScenario: post
        }
    }
)
    .controller("scenariosCtrl", function ($scope, $location, $http, actionObjInfo, forwardManager, scenarioManager) {
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

        function getSelectedId(arr) {
            var id = 0;
            arr.forEach(function (obj) {
                if (obj.isActive) {
                    id = obj._id
                }
            });
            return id;
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

        scenarioManager.getScenarios(function (data) {
            $scope.scenarios = data;
        });


        $scope.switchToView = function (viewName) {
            $location.path("myscenarios/" + viewName);
        };

        $scope.retrive = function () {
            var objectId = getSelectedId($scope.scenarios);
            forwardManager.setName(objectId);
            $location.path('planforward/output');
        };

        //var actionObjInfo = [];

        $scope.selectRow = function (obj) {
            obj.isActive = !obj.isActive;

            if (obj.isActive) {
                actionObjInfo.push(obj._id);
            } else {
                for (var i = actionObjInfo.length - 1; i >= 0; i--) {
                    if (actionObjInfo[i] === obj._id) {
                        delete actionObjInfo[i];
                    }
                }
                ;
            }
            console.log(actionObjInfo);

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

        $scope.delete = function () {
            var objectId = getSelectedId($scope.scenarios);
            scenarioManager.deleteScenario(objectId, function (todo) {
                console.log('deleted');
                var deleteIndex = -1;
                $scope.scenarios.forEach(function (obj, index) {
                    if (obj._id === objectId) {
                        deleteIndex = index;
                    }
                });
                if(deleteIndex !==-1){
                    console.log(deleteIndex);
                    $scope.scenarios.splice(deleteIndex, 1);
                }
            });
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
    .controller("scenariosCompareCtrl", function ($scope, $http, actionObjInfo) {
        //vars
        $scope.compareChart = {};
        console.log(actionObjInfo);
        var compareObj = [];
        $http.get('/scenarios/' + actionObjInfo[0]).success(function (data) {
            compareObj[0] = data;
            console.log(compareObj);
        });
        $http.get('/scenarios/' + actionObjInfo[1]).success(function (data) {
            compareObj[1] = data;
            console.log(compareObj);
        });
        $scope.compareChart.first = compareObj[0];
        $scope.compareChart.second = compareObj[1];
        $scope.compareChart.actionObjInfo = actionObjInfo;

        //console.log(compareObj);

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

scenariosApp.factory('actionObjInfo', function () {
    var actionObjInfo = [];
    return actionObjInfo;
});
