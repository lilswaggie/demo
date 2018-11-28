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

            $.fn.ChinaModule.methods.chartEventsTrigger(chart);
            // 自适应调整
            window.onresize = function () {
                var height = $("body").GeoUtils('getHeight');
                $('#g_map').css('height', height);
                $("body").GeoUtils('getResize', chart);

            };
            // 点击事件：线条高亮，两端闪烁
            $(".port").click(function () {
                $.fn.ChinaModule.methods.linesEventTrigger({ id: "123", chart: chart })
            })
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

                }
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
                    chart.setOption(old_opt);
                }
            });
        },
        linesEventTrigger: function (param) {
            var oid = param.id;
            var chart = param.chart;
            var option = chart.getOption();
            var series = option.series;
            // map  effectScatter  lines

            series.forEach((element,index) => {
                if (element.type == 'lines') {
                    // 在线条里寻找 需要高亮的那条线，拿到端点数据
                    var linesData = element.data;
                    linesData.forEach((ele, i) => {
                        var linesAggr = ele.data.aggr;
                        linesAggr.forEach(ele => {
                            if(oid == ele.oid) {
                                var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
                                series.push({
                                    type: 'lines',
                                    name: 'lines专线',
                                    effect: {
                                        show: true,
                                        period: 4,
                                        // 迁移
                                        symbol: planePath,
                                        symbolSize: 15
                                    },
                                    data: [{
                                        name: linesData[i].oname,
                                        coords: linesData[i].coords,
                                        lineStyle: {color: "blue",width:2,curveness: 0.2}
                                    }]
                                },{
                                    type: 'effectScatter',
                                    name: 'effectScatter',
                                    // itemStyle: 
                                    data: linesData[i].coords
                                });
                                chart.setOption(option)
                            }
                        });
                    });
                }
            });
        }
    }
})(jQuery);