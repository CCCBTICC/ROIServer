/**
 * Created by Haizhou on 6/1/2015.
 */
angular.module("ROIClientApp")
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
    .directive('total', function () {
        return {
            template: "{{totalCost | formatCurrency}}",
            scope: {
                total: '='
            },
            link: function (scope, element, attrs) {
                element.bind('click',function(){
                    console.log(attrs.ngModel);
                    console.log(scope.totalCost);
                    scope.$watch(function(scope){return scope.lookBack;}, function(){
                        scope.totalCost = 0;
                        scope.total.forEach(function(e){
                            scope.totalCost += Number(e);
                        });
                    }, true);
                    scope.$apply();
                });
            }
        }
    })
    .directive('rangeInput', function () {
        return {
            restrict: 'EA',
            template: "" +
            "<div class='form-group-sm'>" +
            "   <input type='text' ng-model='ngModel' class='form-control' format-input ng-blur='checkRange()'>" +
            "   <input type='range' ng-model='ngModel' ng-change='ngChange()' min='{{min}}' max='{{max}}'>" +
            "</div>",
            scope: {
                min: '=',
                max: '=',
                ngModel: '=',
                ngChange:'&'
            },
            link: function (scope, element, attrs) {
                scope.checkRange = function () {
                    if (Number(scope.ngModel) < Number(scope.min)) {
                        scope.ngModel = scope.min;
                    }
                    else if (Number(scope.ngModel) > Number(scope.max)) {
                        scope.ngModel = scope.max;
                    }
                };
            }
        }
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
    });