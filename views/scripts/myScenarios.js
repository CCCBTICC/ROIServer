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
            idArray.forEach(function (idArraySingle) {
                var tempObj = {
                    "id": idArraySingle,
                    "runningTime": ""
                };
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
        checkFinal: function (name, cb) {
            var data = {action: 'checkFinal', data: name};
            post(data, cb);

        },
        dataInfo: dataInfo
    }

});
scenariosApp.controller("scenariosCtrl", function ($scope, $location, $http, actionObjInfo, analysis, scenarios, user, $filter) {
    //vars
    var tempIdArray = [];
    var checkStatusLoop;

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

    function getStatus() {
        //console.log($scope.scenarios);
        tempIdArray = [];
        $scope.scenarios.forEach(function (scenario) {
            if (!scenario.exist) {
                tempIdArray.push(scenario._id);
            } else {
                scenario.runningTime = "0";
            }
        });
        //console.log("in doget");
        //console.log(tempIdArray);
        if (tempIdArray.length) {
            scenarios.checkScenariosStatus(tempIdArray, function (data) {
                $scope.scenarios.forEach(function (singleScenario) {
                    data.forEach(function (singleData) {
                        if (singleScenario._id === singleData.id) {
                            console.log(singleData.runningTime);
                            switch (singleData.runningTime) {
                                case "0":
                                    singleScenario.runningTime = singleData.runningTime;
                                    singleScenario.exist = true;
                                    break;
                                case "-1":
                                    $scope.scenarios.splice($scope.scenarios.indexOf(singleScenario), 1);
                                    break;
                                default :
                                    singleScenario.runningTime = singleData.runningTime;
                                    break;
                            }
                        }
                    });
                });
            });
        } else {
            clearInterval(checkStatusLoop);
        }
    }

    function resetButton() {
        $scope.scenarios.forEach(function (obj) {
            if (obj.isActive) {
                obj.isActive = false;
            }
        });
        while (actionObjInfo.length) {
            actionObjInfo.pop();
        }
        Object.keys($scope.operations).forEach(function (key) {
            $scope.operations[key].disable = true;
        });
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
    $scope.filteredScenarios = [];
    $scope.currentPage = 1;
    $scope.numPerPage = 10;
    $scope.maxSize = 5;
    $scope.itemsPerPage = 1;
    $scope.predicate = 'createDate';
    $scope.reverse = true;
    $scope.searchText = "";
    $scope.listBtnTooltip = {
        comparePlacement: "top",
        retrievePlacement: "top",
        editPlacement: "top",
        deletePlacement: "top",
        exportPlacement: "top",
        sharePlacement: "top",
        compareText: "'Compare' should be 2 items",
        retrieveText: "'Retrieve' should be more than 1 items",
        editText: "'Edit' should be 1 item",
        deleteText: "'Delete' should be more than 1 items",
        exportText: "'Export' should be 1 item",
        shareText: "'Share' should be 1 item"
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
                    $scope.operations[key].disable = (key !== 'compare' && key !== 'delete');
                });
                break;
            default:
                Object.keys($scope.operations).forEach(function (key) {
                    $scope.operations[key].disable = (key !== 'delete');
                });
                break;
        }
    };

    $scope.export = function () {
        var exist = 0;
        $scope.scenarios.forEach(function (obj) {
            if (obj._id === actionObjInfo[0] && obj.exist) {
                exist++;
            }
        });
        if (exist) {
            analysis.objIds.current = actionObjInfo[0];
            $location.path("myscenarios/export");
        } else {
           resetButton();
        }

    };
    $scope.retrive = function () {
        var retriveIndex = -1;
        $scope.scenarios.forEach(function (obj, index) {
            if (obj._id === actionObjInfo[0]) {
                retriveIndex = index;
            }
        });
        if ($scope.scenarios[retriveIndex].exist) {
            analysis.objIds.current = actionObjInfo[0];
            if ($scope.scenarios[retriveIndex].from === "forward") {
                $location.path('planforward/output');
            }
            else {
                $location.path('lookback/output')
            }
        } else {
            analysis.objIds.current = actionObjInfo[0];
            if ($scope.scenarios[retriveIndex].from === "forward") {
                $location.path('planforward/output');
            }
            else {
                $location.path('lookback/output')
            }
        }
    };
    $scope.deleteList = function () {
        actionObjInfo.forEach(function (scenarioId) {
            $scope.delete(scenarioId);
        });
        resetButton();
    };
    $scope.delete = function (id) {
        user.getUser(function (user) {
            $scope.user = user;
        });
        var share = false;
        var deleteIndex = -1;
        $scope.scenarios.forEach(function (obj, index) {
            if (obj._id === id) {
                share = obj.share;
                deleteIndex=index;
            }
        });
        if(deleteIndex!==-1){
        if (share) {
            if (confirm("The scenario is shared. Do you still want to delete it?") == true) {
                scenarios.deleteScenario(id, $scope.user.name, function (data) {
                    if (data) {
                        $scope.scenarios.splice(deleteIndex, 1);
                        $scope.pageChanged($scope.currentPage, $scope.numPerPage);
                        tempIdArray.forEach(function (singleTempIdArray, index) {
                            if (singleTempIdArray === id) {
                                tempIdArray.splice(index, 1);
                            }
                        });
                    } else {
                        alert("You are not the original owner, data can not be deleted!");
                    }
                });
            }
        }
        else {
            scenarios.deleteScenario(id, $scope.user.name, function (data) {
                if (data) {
                        $scope.scenarios.splice(deleteIndex, 1);
                        $scope.pageChanged($scope.currentPage, $scope.numPerPage);
                        tempIdArray.forEach(function (singleTempIdArray, index) {
                            if (singleTempIdArray === id) {
                                tempIdArray.splice(index, 1);
                            }
                        });
                }
                else {
                    alert("You are not the original owner, data can not be deleted!");
                }
            });
        }}
    };
    $scope.share = function () {
        analysis.objIds.current = actionObjInfo[0];
        $location.path('myscenarios/share');
    };
    $scope.compare = function () {
        var compareIndex;
        var exist = 0;
        actionObjInfo.forEach(function (id) {
            compareIndex = -1;
            $scope.scenarios.forEach(function (obj, index) {
                if (obj._id === id && obj.exist) {
                    exist++;
                }
            });
        });
        if (exist === 2) {
            $location.path('myscenarios/compare');
        }
        else {
            resetButton();
        }
    };
    $scope.edit = function () {
        var owner = "";
        $scope.scenarios.forEach(function (obj, index) {
            if (obj._id === actionObjInfo[0]) {
                owner = obj.owner;
            }
        });
        if (owner === $scope.user.name) {
            analysis.objIds.current = actionObjInfo[0];
            $location.path('myscenarios/edit');
        } else {

            alert("You are not the original owner");
            resetButton();
        }

    };

    $scope.pageChanged = function (current, numPerPage) {
        var begin = (current - 1) * numPerPage;
        var end = begin + numPerPage;
        $scope.orderedScenarios = $filter('orderBy')($scope.scenarios, $scope.predicate, $scope.reverse);
        $scope.filteredScenarios = $filter('filter')($scope.orderedScenarios, $scope.searchText);
        $scope.filteredScenarioss = $scope.filteredScenarios.slice(begin, end);
    };
    $scope.order = function (predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
        $scope.pageChanged($scope.currentPage, $scope.numPerPage);
    };

    $scope.yesOrNo = function (s) {
        return (s === "Yes");
    };
    $scope.runCheck = function (s) {
        return (s !== "0");
    };
    $scope.convertRunningTime = function (t) {
        var s = Number(Math.floor(t / 1000));
        return Number(Math.floor(s / 60) + 1000).toString().slice(-2) + ":" + Number(s % 60 + 1000).toString().slice(-2);
    };

    //-------------main-----------------------

    // get users scenarioList
    user.getUser(function (user) {
        if (!user.name) {
            $scope.logout();
        } else {
            $scope.user = user;
            scenarios.getScenarios($scope.user.name, function (data) {
                //console.log(data);
                $scope.scenarios = data;
                $scope.pageChanged($scope.currentPage, $scope.numPerPage);
                getStatus();
            });
            while (actionObjInfo.length) {
                actionObjInfo.pop();
            }
        }
    });
    // check status
    checkStatusLoop = setInterval(getStatus, 5 * 1000);

    $scope.$on('$destroy', function () {
        clearInterval(checkStatusLoop);
    });
});
scenariosApp.controller("scenariosExportCtrl", function ($scope, analysis, scenarios, $location, actionObjInfo, history, $filter) {
    //vars
    var format = {
        Excel: 'csv'
    };

    //functions
    function convertPlan(info, data) {
        return "Scenario ID," + info.scenarioId + ",,,,,,,,,,\n" +
            "Owner," + $filter('name')(info.owner) + ",,,,,,,,,,\n" +
            "Create Date," + info.createDate + ",,,,,,,,,,\n" +
            "Brand," + info.brand + ",,,,,,,,,,\n" +
            "Planned Spend," + info.spend + ",,,,,,,,,,,\n" +
            "Begin Period," + $filter('date')(info.beginDate, "MMM-yyyy") + ",,,,,,,,,,\n" +
            "End Period," + $filter('date')(info.endDate, "MMM-yyyy") + ",,,,,,,,,,\n" +
            "Data Through Month," + $filter('date')(info.dataThrough, "MMM-yyyy") + ",,,,,,,,,,\n" +
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
            "Portfolio ROI,,,,,,," + data.run1ProjROI + ",," + data.run2ProjROI + ",," + data.ROID + "%\n" +
            "Change in Brand Total Revenue,,,,,,,,,,," + data.changeR + "%\n" +
            "Note:," + info.note + ",,,,,,,,,,\n";

    }

    function convertLook(info, data) {
        return "Scenario ID," + info.scenarioId + ",,,,,,,,,,\n" +
            "Owner," + info.owner + ",,,,,,,,,,\n" +
            "Create Date," + info.createDate + ",,,,,,,,,,\n" +
            "Brand," + info.brand + ",,,,,,,,,,\n" +
            "Planned Spend," + info.spend + ",,,,,,,,,,,\n" +
            "Begin Period," + $filter('date')(info.beginDate, 'MMM-yyyy') + ",,,,,,,,,,\n" +
            "End Period," + $filter('date')(info.endDate, 'MMM-yyyy') + ",,,,,,,,,,\n" +
            "Data Through Month," + $filter('date')(info.dataThrough, 'MMM-yyyy') + ",,,,,,,,,,\n" +
            "History Included?," + info.included + ",,,,,,,,,,\n" +
            ",,,,,,,,,,,\n" +
            "Portfolio Channels,Actuals,,Optimized,,Difference,\n" +
            ",Spend,Revenue,Spend,Revenue,Spend,Revenue\n" +
            "SEM Total," + data.history.semSR + ",," + data.history.semPR + "," + data.output.semAS + "," + data.output.semAR + "," + data.output.semSD + "," + data.output.semRD + "\n" +
            "SEM-Brand," + data.history.semBSR + ",," + data.output.semBAS + ",," + data.output.semBSD + ",\n" +
            "SEM-Cards," + data.history.semCSR + ",," + data.output.semCAS + ",," + data.output.semCSD + ",\n" +
            "SEM-Pbook," + data.history.semPSR + ",," + data.output.semPAS + ",," + data.output.semPSD + ",\n" +
            "SEM-Others," + data.history.semOSR + ",," + data.output.semOAS + ",," + data.output.semOSD + ",\n" +
            "Display," + data.history.disSR + "," + data.history.disPR + "," + data.output.disAS + "," + data.output.disAR + "," + data.output.disSD + "," + data.output.disRD + "\n" +
            "Social (FB)," + data.history.socSR + "," + data.history.socPR + "," + data.output.socAS + "," + data.output.socAR + "," + data.output.socSD + "," + data.output.socRD + "\n" +
            "Affiliates," + data.history.affSR + "," + data.history.affPR + "," + data.output.affAS + "," + data.output.affAR + "," + data.output.affSD + "," + data.output.affRD + "\n" +
            "Partners," + data.history.parSR + "," + data.history.parPR + "," + data.output.parAS + "," + data.output.parAR + "," + data.output.parSD + "," + data.output.parRD + "\n" +
            "Total Portfolio," + data.history.totSR + "," + data.history.totPR + "," + data.output.totAS + "," + data.output.totAR + "," + data.output.totSD + "," + data.output.totRD + "\n" +
            "Portfolio ROI,," + data.history.ROI + "%,," + data.output.run2ProjROI + ",," + data.output.ROID + "%\n" +
            "Change in Brand Total Revenue,,,,,," + data.output.changeR + "%\n" +
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
    if (actionObjInfo.length !== 2) {
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
                            $scope.data.ROID = Number($scope.data.run2ProjROI.substr(0, 3)) - Number($scope.data.run1ProjROI.substr(0, 3));
                            $scope.data.changeR = Math.round($scope.data.ROID / Number($scope.data.run1ProjROI.substr(0, 3)) * 100);
                        };
                        modify();
                        $scope.output = convertPlan($scope.scenario, $scope.data);
                        $scope.csvContent = encodeURI("data:text/" + format[$scope.format] + ";charset=utf-8," + $scope.output);
                    });
                }
                else {
                    var back = {history: {}};
                    analysis.getData(function (data) {
                        back.output = data;
                        console.log(back.output);
                        history.getHistoryData(back.output.StartingTime, back.output.EndingTime, function (history) {
                            back.history.semSR = Math.round(history.SEM);
                            back.history.semBSR = Math.round(history.SEMBrand);
                            back.history.semCSR = Math.round(history.SEMCard);
                            back.history.semOSR = Math.round(history.SEMOther);
                            back.history.semPSR = Math.round(history.SEMPBook);
                            back.history.disSR = Math.round(history.Display);
                            back.history.affSR = Math.round(history.Affiliate);
                            back.history.socSR = Math.round(history.FB);
                            back.history.parSR = Math.round(history.Partners);
                            back.history.totSR = back.history.semSR + back.history.disSR + back.history.affSR + back.history.socSR + back.history.parSR;
                            if (back.output.lmTouch === "Multi-Touch") {
                                back.history.semPR = Math.round(history.SEM_MTA);
                                back.history.disPR = Math.round(history.Display_MTA);
                                back.history.affPR = Math.round(history.Affiliates_MTA);
                                back.history.socPR = Math.round(history.FB_MTA);
                                back.history.parPR = Math.round(history.Partners_MTA);
                                back.history.totPR = back.history.semPR + back.history.disPR + back.history.affPR + back.history.socPR + back.history.parPR;
                            } else {
                                back.history.semPR = Math.round(history.SEM_LTA);
                                back.history.disPR = Math.round(history.Display_LTA);
                                back.history.affPR = Math.round(history.Affiliates_LTA);
                                back.history.socPR = Math.round(history.FB_LTA);
                                back.history.parPR = Math.round(history.Partners_LTA);
                                back.history.totPR = back.history.semPR + back.history.disPR + back.history.affPR + back.history.socPR + back.history.parPR;
                            }
                            back.history.ROI = Math.round((back.history.totPR / back.history.totSR - 1) * 100);

                            back.output.semSD = back.output.semAS - back.history.semSR;
                            back.output.semBSD = back.output.semBAS - back.history.semBSR;
                            back.output.semCSD = back.output.semCAS - back.history.semCSR;
                            back.output.semOSD = back.output.semOAS - back.history.semOSR;
                            back.output.semPSD = back.output.semPAS - back.history.semPSR;
                            back.output.disSD = back.output.disAS - back.history.disSR;
                            back.output.affSD = back.output.affAS - back.history.affSR;
                            back.output.socSD = back.output.socAS - back.history.socSR;
                            back.output.parSD = back.output.parAS - back.history.parSR;
                            back.output.totSD = back.output.totAS - back.history.totSR;
                            back.output.semRD = back.output.semAR - back.history.semPR;
                            back.output.disRD = back.output.disAR - back.history.disPR;
                            back.output.affRD = back.output.affAR - back.history.affPR;
                            back.output.socRD = back.output.socAR - back.history.socPR;
                            back.output.parRD = back.output.parAR - back.history.parPR;
                            back.output.totRD = back.output.totAR - back.history.totPR;
                            back.output.ROID = back.output.run2ProjROI.slice(0, -1) - back.history.ROI;
                            back.output.changeR = Math.round(back.output.ROID / back.history.ROI * 100);
                            $scope.output = convertLook($scope.scenario, back);
                            $scope.csvContent = encodeURI("data:text/" + format[$scope.format] + ";charset=utf-8," + $scope.output);
                        });
                    });
                }
            })
        } else {
            $location.path('myscenarios');
        }
    }
    else {
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
    $scope.targetUsername = "";
    //scope functions
    $scope.share = function () {
        //console.log($scope.scenario._id);
        //console.log($scope.targetUsername);
        scenarios.shareScenario($scope.targetUsername, $scope.scenario._id, function (res) {
            console.log(res);
            scenarios.editScenario($scope.scenario.owner, $scope.scenario._id, {share: true}, function (res2) {
                console.log(res2);
                alert("Data is shared!");
            });

        });
    };
    //main
    if (analysis.objIds.current) {
        scenarios.getScenarioById(analysis.objIds.current, function (scenario) {
            $scope.scenario = scenario;
        });
        user.getUser(function (res) {
            $scope.user = res;
            user.getUserList($scope.user.name, function (list) {
                $scope.userList = list;
                $scope.targetUsername = $scope.userList[0];

            })
        });

    } else {
        $location.path('myscenarios');
    }
});
scenariosApp.controller("scenariosEditCtrl", function ($scope, analysis, scenarios, user, $location, $filter) {
    //vars

    //functions

    //scope vars

    //scope functions
    $scope.update = function () {
        //console.log($scope.scenario.final);
        $scope.updateData = {
            name: $scope.scenario.name,
            note: $scope.scenario.note,
            final: $scope.scenario.final
        };
        user.getUser(function (user) {
            scenarios.editScenario(user.name, $scope.scenario._id, $scope.updateData, function (res) {
                //console.log(res);
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
                console.log(res);
                $scope.scenario = res;
                var name = {
                    beginDate: $scope.scenario.beginDate,
                    endDate: $scope.scenario.endDate,
                    final: "Yes"
                };
                console.log(name);
                scenarios.checkFinal(name, function (res1) {
                    console.log(res1);
                    $scope.finalDisable = (res1[0] && res._id != res1[0]._id);
                    user.getUser(function (user) {
                        if (user.name === res1[0].owner) {
                            $scope.message = "You already  have the final scenario";
                        }
                        else {
                            $scope.message = $filter('name')(res1[0].owner) + " has the final scenario";
                        }
                    });
                });
            }
        });
    }
    else {
        $location.path("myscenarios");
    }
});
scenariosApp.controller("scenariosCompareCtrl", function ($scope, $http, actionObjInfo, analysis, $location, scenarios, $filter) {
    //vars

    //functions

    //scope vars
    $scope.compareChart = {
        data: [
            {title: "SEM", value: 0, string: ""},
            {title: "SEM-Brand", value: 0, string: ""},
            {title: "SEM-Card", value: 0, string: ""},
            {title: "SEM-Photobook", value: 0, string: ""},
            {title: "SEM-Others", value: 0, string: ""},
            {title: "Display", value: 0, string: ""},
            {title: "Social", value: 0, string: ""},
            {title: "Affiliates", value: 0, string: ""},
            {title: "Partners", value: 0, string: ""},
            {title: "Portfolio Total", value: 0, string: ""}
        ],
        config: {
            width: 800,
            height: 313,
            margin: {left: 130, top: 30, right: 100, bottom: 30}
        }
    };
    $scope.compareObj = {};
    $scope.compareObj.difference = {};
    $scope.firstGot = false;
    $scope.secondGot = false;

    //scope functions

    //main
    if (actionObjInfo.length === 2) {
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
                    $scope.compareObj.difference[key] = $scope.compareObj.second[key] - $scope.compareObj.first[key];
                });
                $scope.compareObj.difference.run2ProjROI = Number($scope.compareObj.second.run2ProjROI.substr(0, 3)) - Number($scope.compareObj.first.run2ProjROI.substr(0, 3));
                $scope.compareObj.difference.changeR = $scope.compareObj.difference.run2ProjROI / Number($scope.compareObj.second.run2ProjROI.substr(0, 3));
                $scope.compareChart.data = [
                    {
                        title: "SEM",
                        value: $scope.compareObj.difference.semAS / $scope.compareObj.first.semAS,
                        string: $filter('number')(Math.abs($scope.compareObj.difference.semAS), 0)
                    },
                    {
                        title: "SEM-Brand",
                        value: $scope.compareObj.difference.semBAS / $scope.compareObj.first.semBAS,
                        string: $filter('number')(Math.abs($scope.compareObj.difference.semBAS), 0)
                    },
                    {
                        title: "SEM-Card",
                        value: $scope.compareObj.difference.semCAS / $scope.compareObj.first.semCAS,
                        string: $filter('number')(Math.abs($scope.compareObj.difference.semCAS), 0)
                    },
                    {
                        title: "SEM-Photobook",
                        value: $scope.compareObj.difference.semPAS / $scope.compareObj.first.semPAS,
                        string: $filter('number')(Math.abs($scope.compareObj.difference.semPAS), 0)
                    },
                    {
                        title: "SEM-Others",
                        value: $scope.compareObj.difference.semOAS / $scope.compareObj.first.semOAS,
                        string: $filter('number')(Math.abs($scope.compareObj.difference.semOAS), 0)
                    },
                    {
                        title: "Display",
                        value: $scope.compareObj.difference.disAS / $scope.compareObj.first.disAS,
                        string: $filter('number')(Math.abs($scope.compareObj.difference.disAS), 0)
                    },
                    {
                        title: "Social",
                        value: $scope.compareObj.difference.socAS / $scope.compareObj.first.socAS,
                        string: $filter('number')(Math.abs($scope.compareObj.difference.socAS), 0)
                    },
                    {
                        title: "Affiliates",
                        value: $scope.compareObj.difference.affAS / $scope.compareObj.first.affAS,
                        string: $filter('number')(Math.abs($scope.compareObj.difference.affAS), 0)
                    },
                    {
                        title: "Partners",
                        value: $scope.compareObj.difference.parAS / $scope.compareObj.first.parAS,
                        string: $filter('number')(Math.abs($scope.compareObj.difference.parAS), 0)
                    },
                    {
                        title: "Portfolio Total",
                        value: $scope.compareObj.difference.totAS / $scope.compareObj.first.totAS,
                        string: filter('number')(Math.abs($scope.compareObj.difference.totAS), 0)
                    }
                ];
            }
        }, actionObjInfo[0]);

        analysis.getData(function (data) {
            $scope.compareObj.second = data;

            $scope.secondGot = true;
            if ($scope.firstGot && $scope.secondGot) {
                Object.keys($scope.compareObj.first).forEach(function (key) {
                    $scope.compareObj.difference[key] = $scope.compareObj.second[key] - $scope.compareObj.first[key];
                });
                $scope.compareObj.difference.run2ProjROI = Number($scope.compareObj.first.run2ProjROI.substr(0, 3)) - Number($scope.compareObj.first.run2ProjROI.substr(0, 3));
                $scope.compareObj.difference.changeR = $scope.compareObj.difference.run2ProjROI / Number($scope.compareObj.second.run2ProjROI.substr(0, 3));
                $scope.compareChart.data = [
                    {
                        title: "SEM",
                        value: $scope.compareObj.difference.semAS / $scope.compareObj.first.semAS,
                        string: $filter('number')(Math.abs($scope.compareObj.difference.semAS), 0)
                    },
                    {
                        title: "SEM-Brand",
                        value: $scope.compareObj.difference.semBAS / $scope.compareObj.first.semBAS,
                        string: $filter('number')(Math.abs($scope.compareObj.difference.semBAS), 0)
                    },
                    {
                        title: "SEM-Card",
                        value: $scope.compareObj.difference.semCAS / $scope.compareObj.first.semCAS,
                        string: $filter('number')(Math.abs($scope.compareObj.difference.semCAS), 0)
                    },
                    {
                        title: "SEM-Photobook",
                        value: $scope.compareObj.difference.semPAS / $scope.compareObj.first.semPAS,
                        string: $filter('number')(Math.abs($scope.compareObj.difference.semPAS), 0)
                    },
                    {
                        title: "SEM-Others",
                        value: $scope.compareObj.difference.semOAS / $scope.compareObj.first.semOAS,
                        string: $filter('number')(Math.abs($scope.compareObj.difference.semOAS), 0)
                    },
                    {
                        title: "Display",
                        value: $scope.compareObj.difference.disAS / $scope.compareObj.first.disAS,
                        string: $filter('number')(Math.abs($scope.compareObj.difference.disAS), 0)
                    },
                    {
                        title: "Social",
                        value: $scope.compareObj.difference.socAS / $scope.compareObj.first.socAS,
                        string: $filter('number')(Math.abs($scope.compareObj.difference.socAS), 0)
                    },
                    {
                        title: "Affiliates",
                        value: $scope.compareObj.difference.affAS / $scope.compareObj.first.affAS,
                        string: $filter('number')(Math.abs($scope.compareObj.difference.affAS), 0)
                    },
                    {
                        title: "Partners",
                        value: $scope.compareObj.difference.parAS / $scope.compareObj.first.parAS,
                        string: $filter('number')(Math.abs($scope.compareObj.difference.parAS), 0)
                    },
                    {
                        title: "Portfolio Total",
                        value: $scope.compareObj.difference.totAS / $scope.compareObj.first.totAS,
                        string: $filter('number')(Math.abs($scope.compareObj.difference.totAS), 0)
                    }
                ];
            }
        }, actionObjInfo[1]);
    } else {
        $location.path('myscenarios');
    }
});
scenariosApp.factory('actionObjInfo', function () {
    var actionObjInfo = [];
    return actionObjInfo;
});

