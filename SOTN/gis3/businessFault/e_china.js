/**
 * @author wang.ning
 */
(function ($) {
    $.fn.ChinaModule = function (options, params) {
        var height = $("body").GeoUtils('getHeight');
        $('#g_map').css('height', height);

        if (typeof options == 'string') return $.fn.ChinaModule.methods[options](params);
        $.fn.ChinaModule.methods.init();
        $.fn.ChinaModule.methods.exportMethod();     //对外提供接口
    }
    $.fn.ChinaModule.methods = {
        init: function () {
            $.fn.ChinaModule.defaults.chart = echarts.init(document.getElementById('g_map'));
            $.fn.ChinaModule.defaults.chart.setOption({
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
            $.fn.ChinaModule.methods.renderData($.fn.ChinaModule.defaults.chart);


            // $.fn.ChinaModule.methods.chartEventsTrigger($.fn.ChinaModule.defaults.chart);
            // 自适应调整
            window.onresize = function () {
                var height = $("body").GeoUtils('getHeight');
                $('#g_map').css('height', height);
                $("body").GeoUtils('getResize', $.fn.ChinaModule.defaults.chart);
                var newOption = $.fn.ChinaModule.defaults.chart.getOption();
                $.fn.ChinaModule.defaults.chart.clear();
                $.fn.ChinaModule.defaults.chart.setOption(newOption);
            };

            // 点击事件
            $("#g_map").click(function () {
                $.fn.ChinaModule.methods.clearEventTrigger();

                //回调超超接口
                top.gis.clearSelectedLine();
            })
            // 线条高亮，两端闪烁
            $(".port").click(function () {

                gis.renderLine({ id: "123" });
            });

        },
        renderData: function (chart) {
            var points = $("body").GeoUtils('getEffectScatters');
            var lines = $("body").GeoUtils('getLine');
            $.ajax({
                url:Global.mapGlobal.queryPOI.queryServiceLines+'?scene=indoor&customer_name=',
                dataType:'json',
                type:'get',
                headers:{
                    Accept:'application/json;charset=utf-8',
                    Authorization:Global.Authorization
                },
                success:function(data){
                    console.log('国内专线数据',data)
                    var datas = data.data;
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

                }
            });
            //$.get(Global.mapGlobal.queryPOI.queryServiceLines, function (datas) {
            /*$.get('../../geodata/servicelines.json', function (datas) {
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
            });*/


        },
        //渲染告警数据
        renderWarningData: function (chart) {

            $.ajax({
                url:Global.mapGlobal.queryPOI.queryWarningOTN,
                dataType:'json',
                type:'get',
                headers:{
                    Accept:'application/json;charset=utf-8',
                    Authorization:Global.Authorization
                },
                success:function(data){
                    console.error('告警数据',data);
                    var datas = data.data;
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

                    };
                    $.fn.ChinaModule.defaults.oldOption = chart.getOption();
                }
            });
            //$.get(Global.mapGlobal.queryPOI.queryWarningOTN, function (datas) {
            /*$.get('../../geodata/queryWarnings.json', function (datas) {
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

                };
                $.fn.ChinaModule.defaults.oldOption = chart.getOption();
            });*/
        },
        //实时渲染功能
        realRenderWarningData: function (chart) {
            if (Global.mapGlobal.queryPOI.realQueryFlag) {
                setInterval(function () {
                    $.fn.ChinaModule.methods.renderWarningData(chart);
                }, Global.mapGlobal.queryPOI.realQueryTimer);
            }
        },
        /**
         * @author 小皮
         *
         */
        renderLightLine: function (lineData) {

            $.fn.ChinaModule.methods.clearEventTrigger();
            // lineRecords: 高亮线条的集合
            var lineRecords = [];
            console.log($.fn.ChinaModule.defaults.chart.getOption());
            $.fn.ChinaModule.defaults.chart.getOption().series.map(function (seri, key) {
                if (seri.type == 'lines') {
                    seri.data.map(function (line, key) {
                        var aggrs = line.data.aggr;
                        // console.log('你点击的线数据：',lineData.id);
                        // console.log('地图上聚合线',aggrs);
                        aggrs.map(function (aggr, aggrKey) {
                            if (aggr.oid == lineData.id) {
                                lineRecords.push(line)
                            }
                        });
                    });
                }
            });

            if(lineRecords.size == 0){
                console.error('暂未找到对应数据');
            }
            var dataLines = [];
            var dataPorts = [];
            lineRecords.forEach(function (e) {
                var linesTemp = {
                    coords: e.coords,
                    name: e.oname,
                    data: e.data
                };
                dataLines.push(linesTemp);
                var portsTemp = [
                    {
                        name: e.data.aggr[0].a_nename,
                        value: e.coords[0]
                    }, {
                        name: e.data.aggr[0].z_nename,
                        value: e.coords[1]
                    }
                ];
                dataPorts = dataPorts.concat(portsTemp);
            });
            var param = {
                dataLines: dataLines,
                dataPorts: dataPorts
            }
            var lightLineSeri = $.fn.ChinaModule.methods.renderScatterEffect(param);
            var chartOption = $.fn.ChinaModule.defaults.chart.getOption();

            chartOption.series = chartOption.series.concat(lightLineSeri)
            $.fn.ChinaModule.defaults.chart.setOption(chartOption);
        },
        /**
         * @author: 小皮
         * @param {dataLines,dataPorts} param
         * 处理线条和端点数据
         */
        renderScatterEffect: function (param) {
            var series = [];
            series.push({
                    type: 'lines',
                    name: 'lights_line',
                    lineStyle: {
                        color: 'blue',
                        width: 1,
                        curveness: 0.2
                    },
                    zlevel: 1,
                    effect: {
                        show: true,
                        period: 5,
                        trailLength: 0.5,
                        color: '#fff',
                        symbol: 'circle',
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
                    label: {
                        show: true,
                        position: 'right',
                        formatter: '{b}',
                        color: 'red',
                        fontsize: 12
                    },
                    symbolSize: 7,
                    itemStyle: {
                        normal: {
                            color: 'blue',
                            opacity: 0.8
                        }
                    },
                    data: param.dataPorts
                }
            );
            return series;
        },
        // 对外暴露的方法
        exportMethod: function () {
            gis.renderLine = $.fn.ChinaModule.methods.renderLightLine;
        },
        // 地图点击事件清除chart上的现有特效
        clearEventTrigger: function () {
            var op = $.fn.ChinaModule.defaults.chart.getOption();
            op.series = [];

            $.fn.ChinaModule.defaults.chart.setOption(op);
            $.fn.ChinaModule.defaults.chart.setOption($.fn.ChinaModule.defaults.oldOption,true,false,false);
            $.fn.ChinaModule.defaults.count = 0;


        }
    },
        $.fn.ChinaModule.defaults = {
            chart: null,
            oldOption: null,
            count: 0
        }
})(jQuery);