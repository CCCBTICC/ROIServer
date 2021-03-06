/**
 * Created by ypling on 5/11/15.
 */
var scenariosApp = angular.module("ROIClientApp");
scenariosApp.factory('scenarioManager', function ($http) {
    var scenariosUrl = "http://" + window.location.hostname + ":3001/scenarios";
    var scenarios = [];
    var selectedScenario = {};
    var post = function (data, callback) {
        $http({
            method: 'post',
            url: scenariosUrl,
            data: data
        }).success(callback);
    };
    return {
        getScenarios: function (username, cb) {
            var data = {
                action: 'list',
                data: {username: username}
            };
            post(data, cb);
        },
        deleteScenario: function (id, user, cb) {
            var data = {
                action: 'remove',
                data: {scenarioId: id, username: user}
            };
            post(data, cb);
        },
        shareScenario: function (username, id, cb) {
            var data = {
                action: 'share',
                data: {targetUsername: username, scenarioId: id}
            };
            post(data, cb);
        },
        setSelectedScenario: function (scenario) {
            selectedScenario = scenario;
        },
        getSelectedScenario: function (cb) {
            cb(selectedScenario);
        }
    }
});
scenariosApp.controller("scenariosCtrl", function ($scope, $location, $http, actionObjInfo, forwardManager, scenarioManager, user) {
    //vars

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
        share: {disable: true},
        edit: {disable: true}
    };
    $scope.scenarios = [];

    //scope functions
    $scope.selectRow = function (obj) {
        obj.isActive = !obj.isActive;

        if (obj.isActive) {
            actionObjInfo.push(obj._id);
        } else {
            for (var i = actionObjInfo.length - 1; i >= 0; i--) {
                if (actionObjInfo[i] === obj._id) {
                     actionObjInfo.splice(i,1);
                }
            }
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
                    $scope.operations[key].disable = (key !== 'compare');
                });
                break;
            default:
                Object.keys($scope.operations).forEach(function (key) {
                    $scope.operations[key].disable = true;
                });
                break;
        }
    };
    $scope.export = function () {
        var objectId = getSelectedId($scope.scenarios);
        forwardManager.setName(objectId);
        var exportIndex = -1;
        $scope.scenarios.forEach(function (obj, index) {
            if (obj._id === objectId) {
                exportIndex = index;
            }
        });
        scenarioManager.setSelectedScenario($scope.scenarios[exportIndex]);
        $location.path("myscenarios/export");

    };
    $scope.retrive = function () {
        var objectId = getSelectedId($scope.scenarios);
        forwardManager.setName(objectId);
        $location.path('planforward/output');
    };
    $scope.delete = function () {
        var objectId = getSelectedId($scope.scenarios);
        user.getUser(function (user) {
            $scope.user = user;
        });
        scenarioManager.deleteScenario(objectId, $scope.user.name, function (data) {
            console.log('from delete in scenarios');
            console.log(data);
            if (data) {
                var deleteIndex = -1;
                $scope.scenarios.forEach(function (obj, index) {
                    if (obj._id === objectId) {
                        deleteIndex = index;
                    }
                });
                if (deleteIndex !== -1) {
                    console.log(deleteIndex);
                    $scope.scenarios.splice(deleteIndex, 1);
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

                }
            }else{alert("You are not the original owner, data can not be deleted!");}
        });
    };
    $scope.share = function () {
        var objectId = getSelectedId($scope.scenarios);
        forwardManager.setName(objectId);
        var exportIndex = -1;
        $scope.scenarios.forEach(function (obj, index) {
            if (obj._id === objectId) {
                exportIndex = index;
            }
        });
        scenarioManager.setSelectedScenario($scope.scenarios[exportIndex]);
        $location.path('myscenarios/share');
    };
    $scope.compare = function () {
        $location.path('myscenarios/compare');
    };
    $scope.edit = function () {
        $location.path('myscenarios/edit');
    };

    //main
    // get users scenarioList
    user.getUser(function (user) {
        $scope.user = user;
        scenarioManager.getScenarios($scope.user.name, function (data) {
            console.log(data);
            $scope.scenarios = data;
        });
    });
});
scenariosApp.controller("scenariosExportCtrl", function ($scope, forwardManager, scenarioManager, $location) {
    //vars
    var format = {
        Excel: 'csv'
    };

    //functions
    function convertPlan(info, data) {
        return "Scenario ID," + info.ScenarioID + ",,,,,,,,,,\n" +
            "Owner," + data.UserName + ",,,,,,,,,,\n" +
            "Create Date," + info.CreateDate + ",,,,,,,,,,\n" +
            "Brand," + data.Brand + ",,,,,,,,,,\n" +
            "Planned Spend," + data.Spend + ",,,,,,,,,,,\n" +
            "Begin Period," + data.StartingTime + ",,,,,,,,,,\n" +
            "End Period," + data.EndingTime + ",,,,,,,,,,\n" +
            "Data Through Month," + info.DataThrough + ",,,,,,,,,,\n" +
            "History Included?," + info.HistoryIncluded + ",,,,,,,,,,\n" +
            ",,,,,,,,,,,\n" +
            "Channels in Portfolio,input,,,,,Optimized,,What-if,,Difference,\n" +
            ",Lower Bound,Min,Max,Upper Bound,Scaling,Spend,Revenue,Spend,Revenue,Spend,Revenue\n" +
            "SEM Total," + data.semLB + "," + data.semMin + "," + data.semMax + "," + data.semUB + "," + "" + "," + data.semSR + "," + data.semPR + "," + data.semAS + "," + data.semAR + "," + data.semSD + "," + data.semRD + "\n" +
            "SEM-Brand," + data.semBLB + "," + data.semBMin + "," + data.semBMax + "," + data.semBUB + "," + data.semBSF + "," + data.semBSR + ",," + data.semBAS + ",," + data.semBSD + ",\n" +
            "SEM-Cards," + data.semCLB + "," + data.semCMin + "," + data.semCMax + "," + data.semCUB + "," + data.semCSF + "," + data.semCSR + ",," + data.semCAS + ",," + data.semCSD + ",\n" +
            "SEM-Pbook," + data.semPLB + "," + data.semPMin + "," + data.semPMax + "," + data.semPUB + "," + data.semPSF + "," + data.semPSR + ",," + data.semPAS + ",," + data.semPSD + ",\n" +
            "SEM-Others," + data.semOLB + "," + data.semOMin + "," + data.semOMax + "," + data.semOUB + "," + data.semOSF + "," + data.semOSR + ",," + data.semOAS + ",," + data.semOSD + ",\n" +
            "Display," + data.disLB + "," + data.disMin + "," + data.disMax + "," + data.disUB + "," + data.disSF + "," + data.disSR + "," + data.disPR + "," + data.disAS + "," + data.disAR + "," + data.disSD + "," + data.disRD + "\n" +
            "Social (FB)," + data.socLB + "," + data.socMin + "," + data.socMax + "," + data.socUB + "," + data.socSF + "," + data.socSR + "," + data.socPR + "," + data.socAS + "," + data.socAR + "," + data.socSD + "," + data.socRD + "\n" +
            "Affiliates," + data.affLB + "," + data.affMin + "," + data.affMax + "," + data.affUB + "," + data.affSF + "," + data.affSR + "," + data.affPR + "," + data.affAS + "," + data.affAR + "," + data.affSD + "," + data.affRD + "\n" +
            "Partners," + data.parLB + "," + data.parMin + "," + data.parMax + "," + data.parUB + "," + data.parSF + "," + data.parSR + "," + data.parPR + "," + data.parAS + "," + data.parAR + "," + data.parSD + "," + data.parRD + "\n" +
            "Portfolio Total," + data.totLB + "," + data.totMin + "," + data.totMax + "," + data.totUB + "," + "" + "," + data.totSR + "," + data.totPR + "," + data.totAS + "," + data.totAR + "," + data.totSD + "," + data.totRD + "\n" +
            "Portfolio ROI,,,,,,," + data.run1ProjROI + ",," + data.run2ProjROI + "\n" +
            "Note:," + info.Note + ",,,,,,,,,,\n";

    }

    function convertLook(info, data) {
        return "Scenario ID," + info.ScenarioID + ",,,,,,,,,,\n" +
            "Owner," + data.UserName + ",,,,,,,,,,\n" +
            "Create Date," + info.CreateDate + ",,,,,,,,,,\n" +
            "Brand," + data.Brand + ",,,,,,,,,,\n" +
            "Planned Spend," + data.Spend + ",,,,,,,,,,,\n" +
            "Begin Period," + data.StartingTime + ",,,,,,,,,,\n" +
            "End Period," + data.EndingTime + ",,,,,,,,,,\n" +
            "Data Through Month," + info.DataThroughMonth + ",,,,,,,,,,\n" +
            "History Included?," + info.HistoryIncluded + ",,,,,,,,,,\n" +
            ",,,,,,,,,,,\n" +
            "Portfolio Channels,Actuals,,Optimized,,,,Difference,\n" +
            ",Spend,Revenue,Lower,Spend,Upper,Revenue,Spend,Revenue\n" +
            "SEM Total," + data.semSR + "," + data.semPR + "," + data.semTLB + "," + data.semTSB + "," + data.semTUB + "," + data.semAR + "," + data.semTSD + "," + data.semAR + "\n" +
            "SEM-Brand," + data.semBSR + ",," + data.semBLB + ",," + data.semBUB + ",," + data.semBSD + ",\n" +
            "SEM-Cards," + data.semCSR + ",," + data.semCLB + ",," + data.semCUB + ",," + data.semCSD + ",\n" +
            "SEM-Pbook," + data.semPSR + ",," + data.semPLB + ",," + data.semPUB + ",," + data.semPSD + ",\n" +
            "SEM-Others," + data.semOSR + ",," + data.semOLB + ",," + data.semOUB + ",," + data.semOSD + ",\n" +
            "Display," + data.disSR + "," + data.disPR + "," + data.disTLB + "," + data.disSB + "," + data.disUB + "," + data.disAR + "," + data.disTSD + "," + data.disAR + "\n" +
            "Social (FB)," + data.socSR + "," + data.socPR + "," + data.socLB + "," + data.socSB + "," + data.socUB + "," + data.socAR + "," + data.socSD + "," + data.socAR + "\n" +
            "Affiliates," + data.affSR + "," + data.affPR + "," + data.affLB + "," + data.affSB + "," + data.affUB + "," + data.affAR + "," + data.affSD + "," + data.affAR + "\n" +
            "Partners," + data.parSR + "," + data.parPR + "," + data.parLB + "," + data.parSB + "," + data.parUB + "," + data.parAR + "," + data.parSD + "," + data.parAR + "\n" +
            "Total Portfolio," + data.totSR + "," + data.totPR + "," + data.totLB + "," + data.totSB + "," + data.totUB + "," + data.totAR + "," + data.totSD + "," + Number(data.totAR - data.totPR) + "\n" +
            "Portfolio ROI,,,,,,,,,,,\n" +
            "Note:," + info.Note + ",,,,,,,,,,";
    }

    //scope vars
    $scope.fileName = "my";
    $scope.format = 'Excel';
    $scope.dataGot = false;
    $scope.scenarioGot = false;

    //scope functions
    $scope.dataExport = function () {
        console.log('from dataExport,clicked');
        var link = document.createElement('a');
        link.href = $scope.csvContent;
        link.download = $scope.fileName + '.' + format[$scope.format];
        link.click();
    };

    //main
    scenarioManager.getSelectedScenario(function (scenario) {
        if (scenario._id) {
            $scope.scenario = scenario;
            $scope.scenarioGot = true;
            if ($scope.dataGot && $scope.scenarioGot) {
                $scope.output = convertPlan($scope.scenario, $scope.data);
                $scope.csvContent = encodeURI("data:text/" + format[$scope.format] + ";charset=utf-8," + $scope.output);
            }
        }
        else {
            $location.path('myscenarios');
        }

    });
    forwardManager.getData(function (data) {
        $scope.data = data;
        var modify = function () {
            $scope.data.semLB = Number($scope.data.semBLB) + Number($scope.data.semCLB) + Number($scope.data.semPLB) + Number($scope.data.semOLB);
            $scope.data.semMin = Number($scope.data.semBMin) + Number($scope.data.semCMin) + Number($scope.data.semPMin) + Number($scope.data.semOMin);
            $scope.data.semMax = Number($scope.data.semBMax) + Number($scope.data.semCMax) + Number($scope.data.semPMax) + Number($scope.data.semOMax);
            $scope.data.semUB = Number($scope.data.semBUB) + Number($scope.data.semCUB) + Number($scope.data.semPUB) + Number($scope.data.semOUB);

            $scope.data.totLB = Number($scope.data.semLB) + Number($scope.data.disLB) + Number($scope.data.socLB) + Number($scope.data.affLB) + Number($scope.data.parLB);
            $scope.data.totMin = Number($scope.data.semMin) + Number($scope.data.disMin) + Number($scope.data.socMin) + Number($scope.data.affMin) + Number($scope.data.parMin);
            $scope.data.totMax = Number($scope.data.semMax) + Number($scope.data.disMax) + Number($scope.data.socMax) + Number($scope.data.affMax) + Number($scope.data.parMax);
            $scope.data.totUB = Number($scope.data.semUB) + Number($scope.data.disUB) + Number($scope.data.socUB) + Number($scope.data.affUB) + Number($scope.data.parUB);

            $scope.data.semSD = Number($scope.data.semAS) - Number($scope.data.semSR);
            $scope.data.semCSD = Number($scope.data.semCAS) - Number($scope.data.semCSR);
            $scope.data.semBSD = Number($scope.data.semBAS) - Number($scope.data.semBSR);
            $scope.data.semPSD = Number($scope.data.semPAS) - Number($scope.data.semPSR);
            $scope.data.semOSD = Number($scope.data.semOAS) - Number($scope.data.semOSR);

            $scope.data.disSD = Number($scope.data.disAS) - Number($scope.data.disSR);
            $scope.data.socSD = Number($scope.data.socAS) - Number($scope.data.socSR);
            $scope.data.affSD = Number($scope.data.affAS) - Number($scope.data.affSR);
            $scope.data.parSD = Number($scope.data.parAS) - Number($scope.data.parSR);
            $scope.data.totSD = Number($scope.data.totAS) - Number($scope.data.totSR);
            $scope.data.semRD = Number($scope.data.semAR) - Number($scope.data.semPR);
            $scope.data.disRD = Number($scope.data.disAR) - Number($scope.data.disPR);
            $scope.data.socRD = Number($scope.data.socAR) - Number($scope.data.socPR);
            $scope.data.affRD = Number($scope.data.affAR) - Number($scope.data.affPR);
            $scope.data.parRD = Number($scope.data.parAR) - Number($scope.data.parPR);
            $scope.data.totRD = Number($scope.data.totAR) - Number($scope.data.totPR);
        };
        modify();
        $scope.dataGot = true;
        if ($scope.dataGot && $scope.scenarioGot) {
            $scope.output = convertPlan($scope.scenario, $scope.data);
            $scope.csvContent = encodeURI("data:text/" + format[$scope.format] + ";charset=utf-8," + $scope.output);
        }

    });
});
scenariosApp.controller("scenariosShareCtrl", function ($scope, user, scenarioManager, $location) {
     //vars

    //functions

    //scope vars
    $scope.userList = [];
    $scope.targetUsername;
    //scope functions
    $scope.share = function () {
        console.log($scope.scenario._id);
        console.log($scope.targetUsername);
        scenarioManager.shareScenario($scope.targetUsername, $scope.scenario._id, function (res) {
            console.log(res);
            alert("Data is shared!");
        });
    };
    //main
    scenarioManager.getSelectedScenario(function (scenario) {
        if (scenario._id) {
            $scope.scenario = scenario;
        }
        else {
            $location.path('myscenarios');
        }
        //console.log($scope.scenario);
    });
    user.getUser(function (res) {
        $scope.user = res;
        user.getUserList($scope.user.name, function (list) {
            $scope.userList = list;
            $scope.targetUsername = $scope.userList[0];

        })
    });
});
scenariosApp.controller("scenariosEditCtrl", function ($scope,forwardManager,scenarioManager) {
    //vars

    //functions
    $scope.update=function(){
        console.log($scope.scenario.Final);
    };
    //scope vars
    $scope.scenario={};
    //scope functions

    //forwardManager.getName(function(id){
    //    $scope.id=id;
    //    scenarioManager.updateScenario(data,function(result){
    //        console.log(result);
    //    });
    //})


});
scenariosApp.controller("scenariosCompareCtrl", function ($scope, $http, actionObjInfo, forwardManager,$location) {
    if(!actionObjInfo[1]){
        $location.path('myscenarios');
    }
    //vars

    //functions

    //scope vars
    $scope.compareChart = {};
    $scope.compareObj = {};
    $scope.compareObj.difference = {};
    $scope.firstGot = false;
    $scope.secondGot = false;
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
    //scope functions

    //main
    $scope.compareChart.actionObjInfo = actionObjInfo;
    //forwardManager.getData(function (data) {
    //    $scope.compareObj.first = data;
    //
    //    $scope.firstGot = true;
    //    if ($scope.firstGot && $scope.secondGot) {
    //        Object.keys($scope.compareObj.first).forEach(function (key) {
    //            $scope.compareObj.difference[key] = $scope.compareObj.first[key] - $scope.compareObj.second[key];
    //        });
    //        $scope.compareChart.data = [
    //            {title: "SEM", value: -$scope.compareObj.difference.semAS},
    //            {title: "SEM-Bord", value: -$scope.compareObj.difference.semBAS},
    //            {title: "SEM-Card", value: -$scope.compareObj.difference.semCAS},
    //            {title: "SEM-Photobook", value: -$scope.compareObj.difference.semPAS},
    //            {title: "SEM-Others", value: -$scope.compareObj.difference.semOAS},
    //            {title: "Display", value: -$scope.compareObj.difference.disAS},
    //            {title: "Social", value: -$scope.compareObj.difference.socAS},
    //            {title: "Affiliates", value: -$scope.compareObj.difference.affAS},
    //            {title: "Partners", value: -$scope.compareObj.difference.parAS},
    //            {title: "Portfolio Total", value: -$scope.compareObj.difference.totAS}
    //        ];
    //    }
    //}, 'run2');
    forwardManager.getData(function (data) {
        $scope.compareObj.first = data;

        $scope.firstGot = true;
        if ($scope.firstGot && $scope.secondGot) {
            Object.keys($scope.compareObj.first).forEach(function (key) {
                $scope.compareObj.difference[key] = $scope.compareObj.first[key] - $scope.compareObj.second[key];
            });
            $scope.compareObj.difference.run2ProjROI=Number($scope.compareObj.first.run2ProjROI.substr(0,3))-Number($scope.compareObj.first.run2ProjROI.substr(0,3));
            console.log(Number($scope.compareObj.first.run2ProjROI.substr(0,3)));
            $scope.compareChart.data = [
                {title: "SEM", value: -$scope.compareObj.difference.semAS},
                {title: "SEM-Brand", value: -$scope.compareObj.difference.semBAS},
                {title: "SEM-Card", value: -$scope.compareObj.difference.semCAS},
                {title: "SEM-Photobook", value: -$scope.compareObj.difference.semPAS},
                {title: "SEM-Others", value: -$scope.compareObj.difference.semOAS},
                {title: "Display", value: -$scope.compareObj.difference.disAS},
                {title: "Social", value: -$scope.compareObj.difference.socAS},
                {title: "Affiliates", value: -$scope.compareObj.difference.affAS},
                {title: "Partners", value: -$scope.compareObj.difference.parAS},
                {title: "Portfolio Total", value: -$scope.compareObj.difference.totAS}
            ];
        }
    }, actionObjInfo[0]);
    //forwardManager.getData(function (data) {
    //    $scope.compareObj.second = data;
    //
    //    $scope.secondGot = true;
    //    if ($scope.firstGot && $scope.secondGot) {
    //        Object.keys($scope.compareObj.first).forEach(function (key) {
    //            $scope.compareObj.difference[key] = $scope.compareObj.first[key] - $scope.compareObj.second[key];
    //        });
    //        $scope.compareChart.data = [
    //            {title: "SEM", value: -$scope.compareObj.difference.semAS},
    //            {title: "SEM-Bord", value: -$scope.compareObj.difference.semBAS},
    //            {title: "SEM-Card", value: -$scope.compareObj.difference.semCAS},
    //            {title: "SEM-Photobook", value: -$scope.compareObj.difference.semPAS},
    //            {title: "SEM-Others", value: -$scope.compareObj.difference.semOAS},
    //            {title: "Display", value: -$scope.compareObj.difference.disAS},
    //            {title: "Social", value: -$scope.compareObj.difference.socAS},
    //            {title: "Affiliates", value: -$scope.compareObj.difference.affAS},
    //            {title: "Partners", value: -$scope.compareObj.difference.parAS},
    //            {title: "Portfolio Total", value: -$scope.compareObj.difference.totAS}
    //        ];
    //    }
    //}, 'run3');
    forwardManager.getData(function (data) {
        $scope.compareObj.second = data;

        $scope.secondGot = true;
        if ($scope.firstGot && $scope.secondGot) {
            Object.keys($scope.compareObj.first).forEach(function (key) {
                $scope.compareObj.difference[key] = $scope.compareObj.first[key] - $scope.compareObj.second[key];
            });
            $scope.compareObj.difference.run2ProjROI=Number($scope.compareObj.first.run2ProjROI.substr(0,3))-Number($scope.compareObj.first.run2ProjROI.substr(0,3));
            $scope.compareChart.data = [
                {title: "SEM", value: -$scope.compareObj.difference.semAS},
                {title: "SEM-Brand", value: -$scope.compareObj.difference.semBAS},
                {title: "SEM-Card", value: -$scope.compareObj.difference.semCAS},
                {title: "SEM-Photobook", value: -$scope.compareObj.difference.semPAS},
                {title: "SEM-Others", value: -$scope.compareObj.difference.semOAS},
                {title: "Display", value: -$scope.compareObj.difference.disAS},
                {title: "Social", value: -$scope.compareObj.difference.socAS},
                {title: "Affiliates", value: -$scope.compareObj.difference.affAS},
                {title: "Partners", value: -$scope.compareObj.difference.parAS},
                {title: "Portfolio Total", value: -$scope.compareObj.difference.totAS}
            ];
        }
    }, actionObjInfo[1]);

});

scenariosApp.factory('actionObjInfo', function () {
    var actionObjInfo = [];
    return actionObjInfo;
});

