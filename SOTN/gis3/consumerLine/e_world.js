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
        $.fn.WorldModule.methods.chartDBClickEventTrigger();
        $.fn.WorldModule.methods.exportMethod();
    }
    $.fn.WorldModule.methods = {
        init: function () {
            $.fn.WorldModule.defaults.chart = echarts.init(document.getElementById("g_map"));
            $.get('../../geodata/world.json', function (mapJson) {
                var data = [];
                $.each(mapJson.features, function (index, item) {
                    var row = {};
                    data.push("1");
                });
                echarts.registerMap('world', mapJson);
                $.fn.WorldModule.defaults.chart.setOption({
                    backgroundColor: '#BEDBF9',
                    geo: $("body").GeoUtils('getWorldMapInstance'),
                    series: []
                });
                $.fn.WorldModule.methods.renderData($.fn.WorldModule.defaults.chart);
            });
            // echarts自适应
            window.onresize = function () {
                var height = $("body").GeoUtils('getHeight');
                $('#g_map').css('height', height);
                $("body").GeoUtils('getResize', $.fn.WorldModule.defaults.chart);
                var newOption = $.fn.WorldModule.defaults.chart.getOption();
                $.fn.WorldModule.defaults.chart.clear();
                $.fn.WorldModule.defaults.chart.setOption(newOption);
            };
            // 点击事件
            $("#customer").click(function(){
                $.fn.WorldModule.defaults.count += 1;
                if($.fn.WorldModule.defaults.count == 1){
                    gis.renderLine({ id: 144 });
                }
            });

        },
        renderData: function (chart) {
            var lines = $("body").GeoUtils('getLine');
            var scatterPoint = $("body").GeoUtils('getScatter', {
                symbol: 'circle'
            });

            $.get('world_service.json', function (datas) {
                if (datas && datas.nodes) {
                    var ps = [];
                    datas.nodes.map(function (nodeItem, nodeIndex) {
                        var point = {
                            name: nodeItem.oname,
                            value: [nodeItem.longitude, nodeItem.lantitude].concat(20),
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
                    console.error('线的数据', ls);
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
                            if (serieItem.type == 'lines' && serieItem.name != 'chinaLine') {
                                serieItem.data.map(function (serieItemData, sindex) {
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
                $.fn.WorldModule.defaults.oldOption = chart.getOption();
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
        /**
         * 外部调用接口：
         * 1、专线高亮、有亮点流动、显示专线名称、显示AZ两端的设备名称
         * @param：lineType 线的类型：是国际专线还是国内专线  1：国内专线  2：国际专线
         * @param  {id:'',zh_label:''} 实际专线数据，线的int_id,线的中文名称
         */
        renderLightLine: function (lineData) {

            var lineRecord;
            $.fn.WorldModule.defaults.chart.getOption().series.map(function (seri, key) {
                if (seri.type == 'lines') {
                    var flag = false;
                    seri.data.map(function (line, key) {
                        var aggrs = line.data.aggr;
                        aggrs.map(function (aggr, aggrKey) {
                            if (aggr.oid == lineData.id) {
                                flag = true;
                                lineRecord = line;
                            }
                        });
                    });
                }
            });
            // console.error('lineRecord',lineRecord);
            /*
             *   @author: 小皮
             *   显示两端网元名称
             * */
            var a_nename = lineRecord.data.aggr[0].a_nename;
            var z_nename = lineRecord.data.aggr[0].z_nename;
            var coords = lineRecord.coords;
            var scatterSeri = $("body").GeoUtils('getScatter', { symbol: 'circle' });
            var params = {
                scatterSeri: scatterSeri,
                param: {
                    a_nename: a_nename,
                    z_nename: z_nename,
                    coords: coords
                }
            };
            var scatterSerie = $("body").GeoUtils('renderScatter', params);

            var lightLineSeri = $("body").GeoUtils('getLightsLine');
            lightLineSeri.data.push(lineRecord);
            var chartOption = $.fn.WorldModule.defaults.chart.getOption();
            chartOption.series.push(lightLineSeri, scatterSerie);
            $.fn.WorldModule.defaults.chart.setOption(chartOption);
            // chartOption.series.push(lightLineSeri);
            // $.fn.WorldModule.defaults.chart.setOption(chartOption);
        },
        // 对外暴露的方法
        exportMethod: function(){
            gis.renderLine = $.fn.WorldModule.methods.renderLightLine;
        },
        /**
         * 清除chart上现有的特效
         */
        chartDBClickEventTrigger: function () {
            $("#g_map").click(function(){
                var op = $.fn.WorldModule.defaults.chart.getOption();
                op.series = [];

                $.fn.WorldModule.defaults.chart.setOption(op);
                $.fn.WorldModule.defaults.chart.setOption($.fn.WorldModule.defaults.oldOption,true,false,false);
                $.fn.WorldModule.defaults.count = 0;
            });
            /*$.fn.WorldModule.defaults.chart.on('click', function () {
                var op = $.fn.WorldModule.defaults.chart.getOption();
                op.series = [];

                $.fn.WorldModule.defaults.chart.setOption(op);
                $.fn.WorldModule.defaults.chart.setOption($.fn.WorldModule.defaults.oldOption,true,false,false);
                $.fn.WorldModule.defaults.count = 0;
            });*/
        }
    },
    $.fn.WorldModule.defaults = {
        chart: null,
        oldOption: null,
        count: 0
    }
})(jQuery);