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
                backgroundColor:'#131348',
                geo: $("body").GeoUtils('getChinaMapInstance'),
                series: [{
                    zoom:1.5,
                    type: 'map',
                    map: 'china',
                    silent: true,
                    itemStyle: {
                        borderColor: '#050513',
                        borderWidth: 1,
                        areaColor: '#131348'
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
            // $("#g_map").click(function () {
            //     $.fn.ChinaModule.methods.clearEventTrigger();
            //
            //     //回调超超接口
            //     top.gis.clearSelectedLine();
            // })
            // 线条高亮，两端闪烁
            // $(".port").click(function () {
            //
            //     gis.renderLine({ id: "123" });
            // });

        },
        renderData: function (chart) {
            var points = $("body").GeoUtils('getEffectScatters');
            var lines = $("body").GeoUtils('getLine');
            //请求后台接口
            $.ajax({
                url:'http://10.154.8.22:8088/sotn/api/resource/topolinks?scene=indoor',
                dataType:'json',
                type:'get',
                headers:{
                    Accept:'application/json;charset=utf-8',
                    Authorization:Global.Authorization
                },
                success:function(data){
                    console.log('国内拓扑数据',data)
                    var datas = data.data;
                    if (datas && datas.nodes) {
                        var ps = [];
                        //数据分类:
                        var p_oa = [];
                        var p_otm = [];
                        var p_otn = [];
                        datas.nodes.map(function (nodeItem, nodeIndex) {
                            var point = {
                                name: nodeItem.oname,
                                value: [nodeItem.longitude, nodeItem.lantitude].concat(30),
                                data: nodeItem
                            }

                            if(nodeItem.type == 'OA'){
                                p_oa.push(point);
                            }else if(nodeItem.type == 'OTM'){
                                p_otm.push(point);
                            }else if(nodeItem.type == 'OTN'){
                                p_otn.push(point);
                            }
                            //ps.push(point);
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
                        var p_oa_sery = {
                            type:'scatter',
                            coordinateSystem:'geo',
                            //symbol:'circle',
                            symbol:'image://'+Global.mapGlobal.symbolConfig.OA_SYMBOL,
                            symbolSize:10,
                            cursor:'pointer',
                            itemStyle:{
                                color:'#fff',
                            },
                            data: p_oa
                        };
                        var p_otm_sery = {
                            type:'scatter',
                            coordinateSystem:'geo',
                            //symbol:'circle',
                            symbol:'image://'+Global.mapGlobal.symbolConfig.OTM_SYMBOL,
                            symbolSize:20,
                            cursor:'pointer',
                            itemStyle:{
                                color:'#fff',
                            },
                            data: p_otm
                        };
                        var p_otn_sery = {
                            type:'scatter',
                            coordinateSystem:'geo',
                            //symbol:'circle',
                            symbol:'image://'+Global.mapGlobal.symbolConfig.OTN_DEFAULT_SYMBOL,
                            symbolSize:20,
                            cursor:'pointer',
                            itemStyle:{
                                color:'#fff',
                            },
                            data: p_otn
                        };

                        //创建线的样式:
                        var l_sery = {
                            type:'lines',
                            coordinateSystem:'geo',
                            lineStyle:{
                                color:'#4C88E4',
                                width:1,
                                type:'solid',
                            },
                            data:ls
                        }
                        var options = chart.getOption();
                        //options.series.push(points);
                        //options.series.push(lines);
                        options.series.push(p_oa_sery);
                        options.series.push(p_otm_sery);
                        options.series.push(p_otn_sery);
                        options.series.push(l_sery);
                        chart.setOption(options);

                        //渲染告警数据
                        //$.fn.ChinaModule.methods.renderWarningData(chart);

                        //实时渲染开启
                        //$.fn.ChinaModule.methods.realRenderWarningData(chart);

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
                    console.error('points',points.data)
                    var options = chart.getOption();
                    var p_test = {
                        type:'scatter',
                        coordinateSystem:'geo',
                        symbol:'circle',
                        symbolSize:10,
                        cursor:'pointer',
                        itemStyle:{
                            color:'#fff',
                        },
                        data:points.data
                    }
                    options.series.push(p_test);
                    //options.series.push(points);
                    //options.series.push(lines);
                    console.error('options',options)
                    chart.setOption(options);

                    //渲染告警数据
                    //$.fn.ChinaModule.methods.renderWarningData(chart);

                    //实时渲染开启
                    //$.fn.ChinaModule.methods.realRenderWarningData(chart);


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
                        var options = chart.getOption();
                        datas.serviceline.map(function (warningItem, warningIndex) {
                            options.series.map(function (serieItem, nodeIndex) {
                                if (serieItem.type == 'lines') {
                                    serieItem.data.map(function (serieItemData, s_index) {
                                        var flag = false; //标识 是否告警
                                     /*   serieItemData.data.aggr.map(function (aggrItem, aggrIndex) {
                                            if (aggrItem.oid == warningItem) {
                                                flag = true;
                                            }
                                        });*/
                                        for(var i = 0; i < serieItemData.data.aggr.length - 1; i++ ){
                                            if(serieItemData.data.aggr[i].oid == warningItem){
                                                flag = true;
                                                break;
                                            }
                                        }
                                        if (flag) {
                                            serieItemData.lineStyle = {
                                                color: Global.mapGlobal.echartsConfig.lineColor.fault
                                            };
                                        }
                                    });
                                }
                            });
                        });
                        chart.setOption(options);

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
         * 渲染高亮线条
         * @author 小皮
         * @lineData: { id: 'String' }
         */
        renderLightLine: function (lineData) {
            // 清除高亮效果
            $.fn.ChinaModule.methods.clearEventTrigger();
            // lineRecords: 高亮线条的集合
            var lineRecords = [];
            var effectColor = '#0A64FF';
            console.log('你点击的线数据：',lineData);
            $.fn.ChinaModule.defaults.chart.getOption().series.map(function (seri, key) {
                if (seri.type == 'lines') {
                    var lineStyleColor = seri.data[0];
                    if(lineStyleColor && lineStyleColor.lineStyle && lineStyleColor.lineStyle.color != Global.mapGlobal.echartsConfig.lineColor.normal)
                        effectColor = '#FF7E8B';
                    seri.data.map(function (line, key) {
                        var aggrs = line.data.aggr;
                        // console.log('地图上聚合线',aggrs);
                        aggrs.map(function (aggr, aggrKey) {
                            if (aggr.oid == lineData.id) {
                                lineRecords.push(line)
                            }
                        });
                    });
                }
            });

            if(lineRecords.length == 0){
                console.error('暂未找到对应数据');
            }
            var dataLines = [];
            var dataPorts = [];
            console.log('高亮线数据',lineRecords)
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
                dataPorts: dataPorts,
                color: effectColor
            }
            var lightLineSeri = $.fn.ChinaModule.methods.renderScatterEffect(param);
            var chartOption = $.fn.ChinaModule.defaults.chart.getOption();

            chartOption.series = chartOption.series.concat(lightLineSeri)
            $.fn.ChinaModule.defaults.chart.setOption(chartOption);
        },
        /**
         * @author: 小皮
         * @param {color:'String',dataLines:[],dataPorts:[]}
         * 处理线条和端点数据
         */
        renderScatterEffect: function (param) {
            var series = [];
            series.push({
                    type: 'lines',
                    name: 'lights_line',
                    lineStyle: {
                        color: param.color,
                        width: 3,
                        curveness: 0.2
                    },
                    zlevel: 1,
                    effect: {
                        show: true,
                        period: 5,
                        trailLength: 0.4,
                        color: '#fff',
                        symbol: 'circle',
                        symbolSize: 3
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
                    symbolSize: 3,
                    itemStyle: {
                        normal: {
                            color: '#FDC400',
                            opacity: 1
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