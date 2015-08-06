/**
 * Created by ypling on 5/11/15.
 */
var scenariosApp = angular.module("ROIClientApp");
scenariosApp.factory('scenarios', function ($http) {
    //var scenariosUrl = "http://54.166.49.92:3001/scenarios";
    var scenariosUrl = "http://" + window.location.hostname + ":3001/scenarios";
    var dataInfo = {};
    var scenarios = [];
    var post = function (data, callback) {
        $http({
            method: 'post',
            url: scenariosUrl,
            data: data
        }).success(callback);
    };
    return {
        checkScenariosStatus: function (idArray, cb) {
            var actionData = [];
            idArray.forEach(function(idArraySingle){
                var tempObj = {
                    "id": idArraySingle,
                    "final": "",
                    "runningTime":""};
                actionData.push(tempObj);
            });
            var data = {
                action: 'status',
                data: actionData
            };
            post(data, cb);
        },
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
        editScenario: function (username, id, update, cb) {
            var data = {
                action: 'edit',
                data: {scenarioId: id, username: username, update: update}
            };
            post(data, cb);
        },
        getScenarioById: function (id, cb) {
            $http.get(scenariosUrl + "/" + id).success(cb);
        },
        dataInfo: dataInfo
    }

});
scenariosApp.controller("scenariosCtrl", function ($scope, $location, $http, actionObjInfo, analysis, scenarios, user) {
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
    $scope.pagination={
        currentPage:0,
        maxSize:5,
        total:0,
        pageSize:3
    };

    //scope functions
    $scope.logout = function () {
        window.sessionStorage.removeItem('username');
        window.location.href = ('http://' + window.location.hostname + ':3001/index.html');
    };
    $scope.selectRow = function (obj) {
        obj.isActive = !obj.isActive;

        if (obj.isActive) {
            actionObjInfo.push(obj._id);
        } else {
            for (var i = actionObjInfo.length - 1; i >= 0; i--) {
                if (actionObjInfo[i] === obj._id) {
                    actionObjInfo.splice(i, 1);
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
        analysis.objIds.current = getSelectedId($scope.scenarios);
        $location.path("myscenarios/export");

    };
    $scope.retrive = function () {
        analysis.objIds.current = getSelectedId($scope.scenarios);
        var retriveIndex = -1;
        $scope.scenarios.forEach(function (obj, index) {
            if (obj._id === analysis.objIds.current) {
                retriveIndex = index;
            }
        });
        if ($scope.scenarios[retriveIndex].from === "forward") {
            $location.path('planforward/output');
        }
        else {
            $location.path('lookback/output')
        }
    };
    $scope.delete = function () {
        var objectId = getSelectedId($scope.scenarios);
        user.getUser(function (user) {
            $scope.user = user;
        });
        scenarios.deleteScenario(objectId, $scope.user.name, function (data) {
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
                    //$scope.pagination.total=$scope.scenarios.length;
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
            } else {
                alert("You are not the original owner, data can not be deleted!");
            }
        });
    };
    $scope.share = function () {
        analysis.objIds.current = getSelectedId($scope.scenarios);
        $location.path('myscenarios/share');
    };
    $scope.compare = function () {
        $location.path('myscenarios/compare');
    };
    $scope.edit = function () {
        analysis.objIds.current = getSelectedId($scope.scenarios);
        //analysis.setName(objectId);
        $location.path('myscenarios/edit');
    };
    $scope.myStyle=function(from){
        if(from==='back'){
            return {backgroundColor:'yellow'};
        }else{
            return {backgroundColor:'pink'};
        }
    };

    //main
    // get users scenarioList
    while (actionObjInfo[0]) {
        actionObjInfo.shift();
    }

    var tempIdArray = [];
    user.getUser(function (user) {
        if (!user.name) {
            $scope.logout();
        }
        $scope.user = user;
        scenarios.getScenarios($scope.user.name, function (data) {
            console.log(data);
            $scope.scenarios = data;
            $scope.$watchCollection('scenarios',function(newValue, oldValue){
                $scope.pagination.total=$scope.scenarios.length;
            });

            data.forEach(function(singleScenario){
                tempIdArray.push(singleScenario._id);
            });
        });
    });
    // check status

    setTimeout(function(){getStatus();},500);
    setTimeout(function(){getStatus();},1000);
    var checkStatusLoop = setInterval(getStatus,5*1000);

    $scope.$on('$destroy', function () {
        clearInterval(checkStatusLoop);
    });

    $scope.yesOrNo = function(s){
        if(s === "No"){
            return false;
        }else{return true;}
    };

    $scope.runCheck = function(s){
        if(s === "0"){
            return false;
        }else{return true;}
    };

    $scope.convertRunningTime = function(t){
        var s = Number(Math.floor(t/1000));
        return Number(Math.floor(s/60)+1000).toString().slice(-2) + ":"+Number(s%60+1000).toString().slice(-2);
    };

    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };

    $scope.predicate = 'createDate';
    $scope.reverse = true;

    function getStatus() {
        scenarios.checkScenariosStatus(tempIdArray, function(data){
            console.log(tempIdArray);
            //$scope.tempIdArray = tempIdArray;
            //console.log(data);
            $scope.scenarios.forEach(function(singleScenario){
                data.forEach(function(singleData){
                    if(singleScenario._id === singleData.id){
                        singleScenario.final          =   singleData.final;
                        singleScenario.runningTime    =   singleData.runningTime;
                    }
                });
            });
            console.log($scope.scenarios);
        });
    }
});
scenariosApp.controller("scenariosExportCtrl", function ($scope, analysis, scenarios, $location, actionObjInfo, history) {
    //vars
    var format = {
        Excel: 'csv'
    };

    //functions
    function convertPlan(info, data) {
        return "Scenario ID," + info.scenarioId + ",,,,,,,,,,\n" +
            "Owner," + info.owner + ",,,,,,,,,,\n" +
            "Create Date," + info.createDate + ",,,,,,,,,,\n" +
            "Brand," + info.brand + ",,,,,,,,,,\n" +
            "Planned Spend," + info.spend + ",,,,,,,,,,,\n" +
            "Begin Period," + info.begin + ",,,,,,,,,,\n" +
            "End Period," + info.end + ",,,,,,,,,,\n" +
            "Data Through Month," + info.dataThrough + ",,,,,,,,,,\n" +
            "History Included?," + info.included + ",,,,,,,,,,\n" +
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
            "Note:," + info.note + ",,,,,,,,,,\n";

    }

    function convertLook(info, data) {
        return "Scenario ID," + info.scenarioId + ",,,,,,,,,,\n" +
            "Owner," + info.owner + ",,,,,,,,,,\n" +
            "Create Date," + info.createDate + ",,,,,,,,,,\n" +
            "Brand," + info.brand + ",,,,,,,,,,\n" +
            "Planned Spend," + info.spend + ",,,,,,,,,,,\n" +
            "Begin Period," + info.begin + ",,,,,,,,,,\n" +
            "End Period," + info.end + ",,,,,,,,,,\n" +
            "Data Through Month," + info.dataThrough + ",,,,,,,,,,\n" +
            "History Included?," + info.included + ",,,,,,,,,,\n" +
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
            "Note:," + info.note + ",,,,,,,,,,";
    }

    //scope vars
    $scope.fileName = "my";
    $scope.format = 'Excel';

    //scope functions
    $scope.dataExport = function () {
        {
            if (msieversion()) {
                var IEwindow = window.open();
                IEwindow.document.write('sep=,\r\n' + $scope.csvContent);
                IEwindow.document.close();
                IEwindow.document.execCommand('SaveAs', true, $scope.fileName + '.' + format[$scope.format]);
                IEwindow.close();
            } else {
                var link = document.createElement('a');
                link.href = $scope.csvContent;
                link.download = $scope.fileName + '.' + format[$scope.format];
                link.click();
            }

            function msieversion() {
                var ua = window.navigator.userAgent;
                var msie = ua.indexOf("MSIE ");
                return (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)); // If Internet Explorer, return version number

            }
        }


    };

    //main
    if (!actionObjInfo[1]) {

        if (analysis.objIds.current) {
            scenarios.getScenarioById(analysis.objIds.current, function (scenario) {
                $scope.scenario = scenario;
                if ($scope.scenario.from === "forward") {
                    analysis.getData(function (data) {
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
                        $scope.output = convertPlan($scope.scenario, $scope.data);
                        $scope.csvContent = encodeURI("data:text/" + format[$scope.format] + ";charset=utf-8," + $scope.output);
                    });
                } else {
                    var back = {history: {}};
                    analysis.getData(function (data) {
                        back.output = data;
                        history.getHistoryData(back.output.StartingTime, back.output.EndingTime, function (history) {
                            back.history.semSR = history.SEM;
                            back.history.semBSR = history.SEMBrand;
                            back.history.semCSR = history.SEMCard;
                            back.history.semOSR = history.SEMOther;
                            back.history.semPSR = history.SEMPBook;
                            back.history.disSR = history.Display;
                            back.history.affSR = history.Affiliate;
                            back.history.socSR = history.FB;
                            back.history.parSR = history.Partners;
                            back.history.totSR = history.Partners + history.FB + history.Affiliate + history.Display + history.SEM;
                            back.history.totPR = history.Revenue;
                            back.history.ROI = (back.history.totPR / back.history.totSR - 1) * 100;
                            if (back.output.lmTouch === "Multi-Touch") {
                                back.history.semPR = history.SEM_MTA;
                                back.history.disPR = history.Display_MTA;
                                back.history.affPR = history.Affiliates_MTA;
                                back.history.socPR = history.FB_MTA;
                                back.history.parPR = history.Partners_MTA;
                            } else {
                                back.history.semPR = history.SEM_LTA;
                                back.history.disPR = history.Display_LTA;
                                back.history.affPR = history.Affiliates_LTA;
                                back.history.socPR = history.FB_LTA;
                                back.history.parPR = history.Partners_LTA;
                            }
                            back.output.semSD = back.output.semSR - back.history.semSR;
                            back.output.semBSD = back.output.semBSR - back.history.semBSR;
                            back.output.semCSD = back.output.semCSR - back.history.semCSR;
                            back.output.semOSD = back.output.semOSR - back.history.semOSR;
                            back.output.semPSD = back.output.semPSR - back.history.semPSR;
                            back.output.disSD = back.output.disSR - back.history.disSR;
                            back.output.affSD = back.output.affSR - back.history.affSR;
                            back.output.socSD = back.output.socSR - back.history.socSR;
                            back.output.parSD = back.output.parSR - back.history.parSR;
                            back.output.totSD = back.output.totSR - back.history.totSR;
                            back.output.semRD = back.output.semPR - back.history.semPR;
                            back.output.disRD = back.output.disPR - back.history.disPR;
                            back.output.affRD = back.output.affPR - back.history.affPR;
                            back.output.socRD = back.output.socPR - back.history.socPR;
                            back.output.parRD = back.output.parPR - back.history.parPR;
                            back.output.totRD = back.output.totPR - back.history.totPR;
                            back.output.ROID = back.output.run1ProjROI.slice(0, -1) - back.history.ROI;
                            back.output.changeR = back.output.ROID / back.history.ROI * 100;
                        });

                    });
                    $scope.output = convertLook($scope.scenario, back);
                    $scope.csvContent = encodeURI("data:text/" + format[$scope.format] + ";charset=utf-8," + $scope.output);
                }
            })

        } else {
            $location.path('myscenarios');
        }


    } else {
        $scope.compareObj = {};
        $scope.compareObj.difference = {};
        $scope.firstGot = false;
        $scope.secondGot = false;
        analysis.getData(function (data) {
            $scope.compareObj.first = data;

            $scope.firstGot = true;
            if ($scope.firstGot && $scope.secondGot) {
                Object.keys($scope.compareObj.first).forEach(function (key) {
                    $scope.compareObj.difference[key] = $scope.compareObj.first[key] - $scope.compareObj.second[key];
                });
                $scope.compareObj.difference.run2ProjROI = Number($scope.compareObj.first.run2ProjROI.substr(0, 3)) - Number($scope.compareObj.first.run2ProjROI.substr(0, 3));
            }
        }, actionObjInfo[0]);
        analysis.getData(function (data) {
            $scope.compareObj.second = data;

            $scope.secondGot = true;
            if ($scope.firstGot && $scope.secondGot) {
                Object.keys($scope.compareObj.first).forEach(function (key) {
                    $scope.compareObj.difference[key] = $scope.compareObj.first[key] - $scope.compareObj.second[key];
                });
                $scope.compareObj.difference.run2ProjROI = Number($scope.compareObj.first.run2ProjROI.substr(0, 3)) - Number($scope.compareObj.first.run2ProjROI.substr(0, 3));
            }
        }, actionObjInfo[1]);
    }

});
scenariosApp.controller("scenariosShareCtrl", function ($scope, user, scenarios, $location, analysis) {
    //vars

    //functions

    //scope vars
    $scope.userList = [];
    $scope.targetUsername;
    //scope functions
    $scope.share = function () {
        console.log($scope.scenario._id);
        console.log($scope.targetUsername);
        scenarios.shareScenario($scope.targetUsername, $scope.scenario._id, function (res) {
            console.log(res);
            alert("Data is shared!");
        });
    };
    //main
    if (analysis.objIds.current) {
        scenarios.getScenarioById(analysis.objIds.current, function (scenario) {
            $scope.scenario = scenario;
        })
    } else {
        $location.path('myscenarios');
    }
    user.getUser(function (res) {
        $scope.user = res;
        user.getUserList($scope.user.name, function (list) {
            $scope.userList = list;
            $scope.targetUsername = $scope.userList[0];

        })
    });
});
scenariosApp.controller("scenariosEditCtrl", function ($scope, analysis, scenarios, user, $location) {
    //vars

    //functions

    //scope vars

    //scope functions
    $scope.update = function () {
        console.log($scope.scenario.final);
        $scope.updateData = {
            name: $scope.scenario.name,
            note: $scope.scenario.note,
            final: $scope.scenario.final
        };
        user.getUser(function (user) {
            scenarios.editScenario(user.name, $scope.scenario._id, $scope.updateData, function (res) {
                console.log(res);
                if (res) {
                    alert("ScenarioInfo is  updated.")
                } else {
                    alert(res)
                }
            });
        });
    };
    //main
    if (analysis.objIds.current) {
        scenarios.getScenarioById(analysis.objIds.current, function (res) {
            if (res) {
                $scope.scenario = res;
            }
        });
    }
    else {
        $location.path("myscenarios");
    }
});
scenariosApp.controller("scenariosCompareCtrl", function ($scope, $http, actionObjInfo, analysis, $location, scenarios) {
    if (!actionObjInfo[1]) {
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
        {title: "SEM-Brand", value: -8002},
        {title: "SEM-Cards", value: -24321},
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
        margin: {left: 130, top: 30, right: 100, bottom: 30}
    };
    //scope functions

    //main
    $scope.compareChart.actionObjInfo = [];
    scenarios.getScenarioById(actionObjInfo[0], function (scenario) {
        $scope.compareChart.actionObjInfo[0] = scenario;
        scenarios.getScenarioById(actionObjInfo[1], function (scenario2) {
            $scope.compareChart.actionObjInfo[1] = scenario2;
        })
    });

    analysis.getData(function (data) {
        $scope.compareObj.first = data;

        $scope.firstGot = true;
        if ($scope.firstGot && $scope.secondGot) {
            Object.keys($scope.compareObj.first).forEach(function (key) {
                $scope.compareObj.difference[key] = $scope.compareObj.first[key] - $scope.compareObj.second[key];
            });
            $scope.compareObj.difference.run2ProjROI = Number($scope.compareObj.first.run2ProjROI.substr(0, 3)) - Number($scope.compareObj.first.run2ProjROI.substr(0, 3));
            console.log(Number($scope.compareObj.first.run2ProjROI.substr(0, 3)));
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

    analysis.getData(function (data) {
        $scope.compareObj.second = data;

        $scope.secondGot = true;
        if ($scope.firstGot && $scope.secondGot) {
            Object.keys($scope.compareObj.first).forEach(function (key) {
                $scope.compareObj.difference[key] = $scope.compareObj.first[key] - $scope.compareObj.second[key];
            });
            $scope.compareObj.difference.run2ProjROI = Number($scope.compareObj.first.run2ProjROI.substr(0, 3)) - Number($scope.compareObj.first.run2ProjROI.substr(0, 3));
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

