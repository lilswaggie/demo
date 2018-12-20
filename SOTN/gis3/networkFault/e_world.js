/**
 * Created by wang.ning on 2018/11/23.
 */
(function ($) {
    $.fn.WorldModule = function (options, param) {
        // 更改可视窗口的高度
        var height = $("body").GeoUtils('getHeight');
        $('#g_map').css('height', height);

        if (typeof options == 'string') return $.fn.WorldModule.methods[options](param);
        $.fn.WorldModule.methods.init();
    }
    $.fn.WorldModule.methods = {
        init: function () {
            var chart = echarts.init(document.getElementById("g_map"));
            $.get('../../geodata/world.json', function (mapJson) {
                var data = [];
                $.each(mapJson.features, function (index, item) {
                    var row = {};
                    data.push("1");
                });
                echarts.registerMap('world', mapJson);
                chart.setOption({
                    backgroundColor: '#BEDBF9',
                    geo: $("body").GeoUtils('getWorldMapInstance'),
                    series: []
                });
                $.fn.WorldModule.methods.renderData(chart);
                chart.on('click', function (params) {
                    console.log('params', params);
                    if(params.componentSubType == 'scatter'){
                        var $menu = $("<div/>").menu({});
                        $menu.menu('appendItem',{
                            text: params.name,
                            data:params.data,
                            //iconCls: 'icon-ok',
                        });
                         $menu.menu('show',{
                            left: params.event.event.pageX,
                            top: params.event.event.pageY
                        });
                    }
                });
            });
            // echarts自适应
            window.onresize = function () {
                var height = $("body").GeoUtils('getHeight');
                $('#g_map').css('height', height);
                $("body").GeoUtils('getResize',chart);
            }

        },
        renderData: function (chart) {
            var lines = $("body").GeoUtils('getLine');
            var scatterPoint = $("body").GeoUtils('getScatter', {
                symbol: 'image://'+Global.mapGlobal.symbolConfig.OTN_SYMBOL,
                symbolSize:[26,22]
                //symbol:'path://M3.62318841,0 L21.3768116,0 C23.3695652,0 25,1.62765957 25,3.61702128 L25,13.3829787 C25,15.3723404 23.3695652,17 21.3768116,17 L3.62318841,17 C1.63043478,17 0,15.3723404 0,13.3829787 L0,3.61702128 C0,1.62765957 1.63043478,0 3.62318841,0 Z M5.97826087,5.78723404 C5.07246377,5.78723404 4.34782609,6.14893617 3.80434783,6.87234043 C3.26086957,7.41489362 3.07971014,8.13829787 3.07971014,9.04255319 C3.07971014,9.94680851 3.26086957,10.6702128 3.80434783,11.212766 C4.34782609,11.7553191 5.07246377,12.1170213 5.97826087,12.1170213 C7.06521739,12.1170213 7.78985507,11.7553191 8.33333333,11.212766 C8.87681159,10.6702128 9.05797101,9.94680851 9.05797101,9.04255319 C9.05797101,7.95744681 8.87681159,7.23404255 8.15217391,6.69148936 C7.60869565,6.14893617 6.88405797,5.78723404 5.97826087,5.78723404 Z M5.97826087,6.69148936 C6.70289855,6.69148936 7.24637681,6.87234043 7.60869565,7.41489362 C7.97101449,7.77659574 8.15217391,8.31914894 8.15217391,9.04255319 C8.15217391,9.76595745 7.97101449,10.3085106 7.60869565,10.6702128 C7.24637681,11.0319149 6.52173913,11.212766 5.97826087,11.212766 C5.43478261,11.212766 4.89130435,11.0319149 4.52898551,10.6702128 C4.16666667,10.3085106 3.98550725,9.76595745 3.98550725,9.04255319 C3.98550725,8.31914894 4.16666667,7.77659574 4.52898551,7.23404255 C4.89130435,6.87234043 5.43478261,6.69148936 5.97826087,6.69148936 Z M9.60144928,5.96808511 L9.60144928,6.69148936 L11.5942029,6.69148936 L11.5942029,11.9361702 L12.6811594,11.9361702 L12.6811594,6.69148936 L14.673913,6.69148936 L14.673913,5.96808511 L9.60144928,5.96808511 Z M15.3985507,5.96808511 L15.3985507,11.9361702 L16.4855072,11.9361702 L16.4855072,7.41489362 L19.5652174,11.9361702 L20.4710145,11.9361702 L20.4710145,5.96808511 L19.5652174,5.96808511 L19.5652174,10.4893617 L16.3043478,5.96808511 L15.3985507,5.96808511 Z',
                // symbolSize:[25,17]
            });

            $.get('../../geodata/world_service.json', function (datas) {
                if (datas && datas.nodes) {
                    var ps = [];
                    datas.nodes.map(function (nodeItem, nodeIndex) {
                        var point = {
                            name: nodeItem.oname,
                            value: [nodeItem.longitude, nodeItem.lantitude].concat(120),
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
                    lines.data = ls;
                    scatterPoint.data = ps;

                    var options = chart.getOption();
                    options.series.push(lines);
                    options.series.push(scatterPoint);

                    chart.setOption(options);

                    //渲染告警数据开启
                    $.fn.WorldModule.methods.renderWarningData(chart);

                    //实时渲染开启
                    $.fn.WorldModule.methods.realRenderWarningData(chart);
                }
            });
        },
        //渲染告警数据
        renderWarningData: function (chart) {
            $.get(Global.mapGlobal.queryPOI.queryWarningOTN, function (datas) {
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
                console.error('params',params);
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
        }
    }
})(jQuery);