/**
 * Created by ypling on 5/14/15.
 */
define(['angular'], function (angular) {
    angular.module('CompareChart', [])
        .directive('compareChart', function () {
            return {
                restrict: 'EA',
                scope: {
                    compareData: '=',
                    config: '=',
                    title: '@',
                    bottom: '@'
                },
                link: function (scope) {
                    var data = scope.compareData;
                    var barHeight = scope.config["barHeight"] ? scope.config["barHeight"] : 30;
                    var height = barHeight * data.length + scope.config.margin.top + scope.config.margin.bottom;
                    var textHeight = 20;
                    var textMargin = 2;
                    var midX = (scope.config.width + scope.config.margin.left - scope.config.margin.right) / 2;
                    var oldScaleFactor;

                    function renderChart(data, oldData) {
                        var scaleFactor;
                        var maxValue = 0;
                        data.forEach(function (item) {
                            maxValue = Math.max(maxValue, Math.abs(item.value));
                        });
                        scaleFactor = (scope.config.width - scope.config.margin.left - scope.config.margin.right) / 2 / maxValue;
                        d3.select('#chart').select('svg').remove();
                        var chartSvg = d3.select('#chart')
                            .append("svg");
                        chartSvg.attr("width", scope.config.width)
                            .attr("height", height);


                        data.forEach(function (item, index) {
                            //draw scale
                            var scale = chartSvg.append('line');
                            scale.attr('x1', midX - 10).attr('y1', barHeight * index + scope.config.margin.top)
                                .attr('x2', midX + 10).attr('y2', barHeight * index + scope.config.margin.top)
                                .attr("stroke-width", 1)
                                .attr("stroke", "black");
                            //end scale
                            //draw background rectangle
                            var bgRect = chartSvg
                                .append('rect')
                                .attr('x', scope.config.margin.left)
                                .attr('y', barHeight * index + scope.config.margin.top + 1)
                                .attr('width', scope.config.width - scope.config.margin.left - scope.config.margin.right)
                                .attr('height', barHeight - 1)
                                .style('fill', '#eee');
                            //end background
                            //draw rectangle
                            var rect = chartSvg
                                .append('rect')
                                .attr("y", barHeight * index + scope.config.margin.top + 10)
                                .attr("height", barHeight - 20)
                                .style('fill', '#F05323');
                            //render title text
                            var titleText = chartSvg.append('text');
                            titleText.text(item.title)
                                .attr('x', 0)
                                .attr('y', barHeight * index + scope.config.margin.top + barHeight - 7)
                                .attr('font-size', barHeight - 7)
                                //.attr('fill', 'rgba(255, 255, 255, .4)')
                                .attr('font-weight', 800)
                                .attr('text-anchor', "left");
                            //end text
                            //render value text
                            var valueText = chartSvg.append('text');
                            valueText.text(Math.abs(item.value))
                                .attr('font-size', 10)
                                .attr('fill', '#222')
                                .attr('x', Number(oldData[index].value) * oldScaleFactor + midX)
                                .attr('y', barHeight * index + scope.config.margin.top + textHeight + textMargin)
                                .transition()
                                .attr('x', Number(item.value) * scaleFactor + midX);
                            //end text
                            if (item.value > 0) {
                                rect.attr("x", midX)
                                    .attr("width", oldData[index].value * oldScaleFactor)
                                    .transition()
                                    .attr("width", item.value * scaleFactor);
                                valueText.attr('text-anchor', 'end')
                            } else {
                                rect.attr("width", Math.abs(oldData[index].value) * oldScaleFactor)
                                    .attr("x", midX + Number(oldData[index].value) * oldScaleFactor)
                                    .transition()
                                    .attr("width", Math.abs(item.value) * scaleFactor)
                                    .attr("x", midX + Number(item.value) * scaleFactor);
                            }
                            //end rectangle
                        });

                        var xAxis = chartSvg.append('line');
                        xAxis.attr('x1', scope.config.margin.left).attr('y1', height - scope.config.margin.bottom)
                            .attr('x2', scope.config.width - scope.config.margin.right).attr('y2', height - scope.config.margin.bottom)
                            .attr("stroke-width", 1)
                            .attr("stroke", "black");

                        var yAxis = chartSvg.append('line');
                        yAxis.attr('x1', midX).attr('y1', scope.config.margin.top)
                            .attr('x2', midX).attr('y2', height - scope.config.margin.bottom + 10)
                            .attr("stroke-width", 1)
                            .attr("stroke", "black");

                        oldScaleFactor = scaleFactor;
                    }

                    scope.$watch('compareData', function (newValue, oldValue) {
                        renderChart(newValue, oldValue)
                    }, true);
                },
                template: '' +
                '<h4>{{title}}</h4>' +
                '<div id="chart"></div>' +
                '<h4>{{bottom}}</h4>'
            }
        });
});