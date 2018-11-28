/**
 * @author wang.ning
 */
(function ($) {
    $.fn.ChinaModule = function (options, params) {
        var height = $("body").GeoUtils('getHeight');
        $('#g_map').css('height', height);
        if (typeof options == 'string') return $.fn.ChinaModule.methods[options](params);
        $.fn.ChinaModule.methods.init();
    }
    $.fn.ChinaModule.methods = {
        init: function () {
            var chart = echarts.init(document.getElementById('g_map'));
            chart.setOption({
                geo: $("body").GeoUtils('getChinaMapInstance'),
                series: [{
                    type: 'map',
                    map: 'china',
                    silent: true,
                    itemStyle: {
                        borderColor: '#A1BBEC',
                        borderWidth: 1,
                        areaColor: '#F9FBFF'
                    },
                    emphasis: {
                        itemStyle: {
                            areaColor: '#F9FBFF'
                        }
                    },
                    data: $("body").GeoUtils('getChinaRegions')
                }]
            });
            // 数据渲染
            $.fn.ChinaModule.methods.renderData(chart);


            //$.fn.ChinaModule.methods.chartEventsTrigger(chart);
            // 自适应调整
            window.onresize = function () {
                var height = $("body").GeoUtils('getHeight');
                $('#g_map').css('height', height);
                $("body").GeoUtils('getResize', chart);

            };
            // 点击事件
            $("#g_map").click(function () {
                $.fn.ChinaModule.methods.mapEventTrigger(chart);
            })
            // 线条高亮，两端闪烁
            $(".port").click(function () {
                $.fn.ChinaModule.methods.linesEventTrigger({ id: "123", chart })
            });

        },
        renderData: function (chart) {
            var points = $("body").GeoUtils('getEffectScatters');
            var lines = $("body").GeoUtils('getLines');
            //$.get(Global.mapGlobal.queryPOI.queryServiceLines, function (datas) {
            $.get('../../geodata/servicelines.json', function (datas) {
                if (datas && datas.nodes) {
                    var ps = [];
                    datas.nodes.map(function (nodeItem, nodeIndex) {
                        var point = {
                            name: nodeItem.oname,
                            value: [nodeItem.longitude, nodeItem.lantitude].concat(30),
                            data: nodeItem
                        }
                        ps.push(point);
                    });

                    var ls = [];
                    datas.edges.map(function (edgeItem, edgeIndex) {
                        var line = {
                            oname: edgeItem.oname,
                            coords: [[edgeItem.a_longitude, edgeItem.a_lantitude], [edgeItem.z_longitude, edgeItem.z_lantitude]],
                            data: edgeItem
                        }
                        ls.push(line);
                    });
                    points.data = ps;
                    lines.data = ls;

                    var options = chart.getOption();
                    options.series.push(points);
                    options.series.push(lines);

                    chart.setOption(options);

                    //渲染告警数据
                    $.fn.ChinaModule.methods.renderWarningData(chart);

                    //实时渲染开启
                    $.fn.ChinaModule.methods.realRenderWarningData(chart);


                }
            });


        },
        //渲染告警数据
        renderWarningData: function (chart) {
            //$.get(Global.mapGlobal.queryPOI.queryWarningOTN, function (datas) {
            $.get('../../geodata/queryWarnings.json', function (datas) {
                if (datas && datas.serviceline) {
                    datas.serviceline.map(function (warningItem, warningIndex) {
                        var options = chart.getOption();
                        options.series.map(function (serieItem, nodeIndex) {
                            if (serieItem.type == 'lines') {
                                serieItem.data.map(function (serieItemData, s_index) {
                                    var flag = false; //标识 是否告警
                                    serieItemData.data.aggr.map(function (aggrItem, aggrIndex) {
                                        if (aggrItem.oid == warningItem) {
                                            flag = true;
                                        }
                                    });
                                    if (flag) {
                                        serieItemData.lineStyle = {
                                            color: Global.mapGlobal.echartsConfig.lineColor.fault
                                        };
                                    }
                                });
                            }
                        });
                        console.error('warnningoptions', options);
                        chart.setOption(options);
                    });

                };
                $.fn.ChinaModule.globalOption = chart.getOption();
            });
        },
        //实时渲染功能
        realRenderWarningData: function (chart) {
            if (Global.mapGlobal.queryPOI.realQueryFlag) {
                setInterval(function () {
                    $.fn.ChinaModule.methods.renderWarningData(chart);
                }, Global.mapGlobal.queryPOI.realQueryTimer);
            }
        },
        chartEventsTrigger: function (chart) {
            chart.on('click', function (params) {
                var old_opt = chart.getOption();
                var lightdatas = [];
                lightdatas.push(params.data);
                if (params.seriesType && params.seriesType == 'lines') {
                    var opt = chart.getOption();
                    opt.series.push({
                        name: 'lights_line',
                        type: 'lines',
                        zlevel: 1,
                        lineStyle: {
                            normal: {
                                color: Global.mapGlobal.echartsConfig.lineColor.light,
                                width: Global.mapGlobal.echartsConfig.lineWidth,
                                curveness: Global.mapGlobal.echartsConfig.lineCurveness
                            }
                        },
                        effect: {
                            show: true,
                            period: 6,
                            trailLength: 0.7,
                            color: 'red',
                            symbolSize: 3
                        },
                        data: lightdatas
                    });
                    chart.setOption(opt);
                } else {
                    chart.clear()
                    chart.setOption(old_opt);
                }
            });
        },
        /**
         * @author pimingzhao
         * @param {id,chart} param 
         * 点击事件
         */
        linesEventTrigger: function (param) {
            var oid = param.id;
            var chart = param.chart;
            var option = chart.getOption();
            var series = option.series;
            // 线条数据
            var dataLines = [];
            // 端点数据
            var dataPorts = [];
            if (series.length == 3) {
                series.forEach((element, index) => {
                    if (element.type == 'lines') {
                        // 在线条里寻找 需要高亮的那条线，拿到端点数据
                        var linesData = element.data;
                        linesData.forEach((ele, i) => {
                            var linesAggr = ele.data.aggr;
                            linesAggr.forEach(ele => {
                                if (oid == ele.oid) {
                                    dataLines.push({
                                        name: linesData[i].oname,
                                        coords: linesData[i].coords,
                                        lineStyle: { color: "#674BFF", width: 1, curveness: 0.2 }
                                    });
                                    linesData[i].coords.forEach(ele => {
                                        dataPorts.push(ele)
                                    });
                                }
                            });
                        });
                    }
                });
                $.fn.ChinaModule.methods.renderLinesEffect({
                    series,
                    dataLines,
                    dataPorts
                })
                chart.setOption(option)
            }

            console.error('新', chart.getOption());
        },
        /**
         * @author: pimingzhao
         * @param {series,dataLines,dataPorts} param 
         * 处理线条和端点数据
         */
        renderLinesEffect: function (param) {
            param.series.push({
                type: 'lines',
                name: 'lines专线',
                zlevel: 1,
                effect: {
                    show: true,
                    period: 5,
                    trailLength: 0.5,
                    color: '#fff',
                    symbolSize: 4
                },
                data: param.dataLines
            }, {
                    name: 'effectScatter',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    zlevel: 2,
                    // 涟漪的设置
                    rippleEffect: {
                        // 波纹的绘制方式 strike fill
                        brushType: 'stroke'
                    },
                    // 图形文字标签
                    // label: {
                    //     normal: {
                    //         show: true,
                    //         position: 'right',
                    //         formatter: '{b}'
                    //     }
                    // },
                    symbolSize: 7,
                    itemStyle: {
                        normal: {
                            color: 'blue',
                            opacity: 0.8
                        }
                    },
                    data: param.dataPorts
                });
        },
        // 地图点击事件
        mapEventTrigger: function (chart) {
            if (chart.getOption().series.length != 3) {
                console.error('老数据:', $.fn.ChinaModule.globalOption);
                chart.setOption($.fn.ChinaModule.globalOption)
                chart.clear()
                chart.setOption($.fn.ChinaModule.globalOption)
            }
        }
    }
})(jQuery);