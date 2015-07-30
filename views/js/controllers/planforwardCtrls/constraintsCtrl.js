/**
 * Created by Chenghuijin on 2015/7/22.
 */
define(['../module'],function(module){
   module.controller('forwardConstrictCtrl', ['$scope', 'forwardManager', '$location', function ($scope, manager, location) {
       //initial controller scope
       $scope.planForward = {};
       $scope.planForward.output = {};
       $scope.planForward.ControlChannelsDM = [];
       $scope.planForward.ControlChannels=[];
       manager.getName(function (name) {
           if (!name) {
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
       $scope.planForward.selectPlan.affiliates = false;
       $scope.planForward.selectPlan.partners = false;
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
                       $scope.planForward.output.semLB = Number($scope.planForward.output.semBLB) + Number($scope.planForward.output.semCLB) + Number($scope.planForward.output.semPLB) + Number($scope.planForward.output.semOLB);
                       $scope.planForward.output.semUB = Number($scope.planForward.output.semBUB) + Number($scope.planForward.output.semCUB) + Number($scope.planForward.output.semPUB) + Number($scope.planForward.output.semOUB);
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

                       var b=new Date($scope.planForward.output.StartingTime);
                       b=new Date(b.getFullYear(), b.getMonth()+1);
                       console.log(b);
                       var e=new Date($scope.planForward.output.EndingTime);
                       e=new Date(e.getFullYear(), e.getMonth()+1);
                       console.log(e);
                       while(b<=e){
                           $scope.planForward.ControlChannels.push(b);
                           b=new Date(b.getFullYear(), b.getMonth()+1,1);
                       }
                       console.log($scope.planForward.ControlChannels);
                       if($scope.planForward.output.dirSpendM1) {
                           $scope.planForward.ControlChannelsDM.push($scope.planForward.output.dirSpendM1);
                       }
                       if($scope.planForward.output.dirSpendM2) {
                           $scope.planForward.ControlChannelsDM.push($scope.planForward.output.dirSpendM2);
                       }
                       if($scope.planForward.output.dirSpendM3) {
                           $scope.planForward.ControlChannelsDM.push($scope.planForward.output.dirSpendM3);
                       }
                       //if($scope.planForward.output.dirSpendM4) {
                       //    $scope.planForward.ControlChannelsDM.push($scope.planForward.output.dirSpendM4);
                       //}
                       //if($scope.planForward.output.dirSpendM5) {
                       //    $scope.planForward.ControlChannelsDM.push($scope.planForward.output.dirSpendM5);
                       //}
                       //if($scope.planForward.output.dirSpendM6) {
                       //    $scope.planForward.ControlChannelsDM.push($scope.planForward.output.dirSpendM6);
                       //}

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
       $scope.$on('$destroy', function () {
           clearInterval(count);
       });
   }]);

});