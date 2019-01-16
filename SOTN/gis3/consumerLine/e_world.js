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
                //整改：不是页面加载完成就渲染数据，由苏研调用这边对外js接口再进行渲染数据
                $.fn.WorldModule.methods.renderCustomerLine({engName: "beijingsankuaiyunjisuanyouxiangongsi",
                faultLeasedLines: 0,
                id: "951210168951951000",
                industry: "IT",
                leasedLineRatio: 3,
                leasedLines: 3,
                level: "金牌",
                name: "北京三快云计算有限公司"});
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
        },
        //对外接口：渲染数据，跟下面的方法readerData无区别
        renderCustomerLine:function(customer){
            var lines = $("body").GeoUtils('getLine');
            var scatterPoint = $("body").GeoUtils('getScatter', {
                symbol: 'circle'
            });
            console.error('客户数据',customer);
            $.ajax({
                url:Global.mapGlobal.queryPOI.queryServiceLines+"?scene=outdoor&customer_name="+customer.name,
                type:'get',
                dataType:'json',
                headers:{
                    Accept:'application/json;charset=utf-8',
                    Authorization:Global.Authorization
                },
                success:function(data){
                    console.error('客户专线',data);
                    var datas = data.data;
                    if (datas && datas.nodes) {
                        var ps = [];
                        datas.nodes.map(function (nodeItem, nodeIndex) {
                            var point = {
                                name: nodeItem.oname,
                                value: [nodeItem.longitude_excursion, nodeItem.lantitude_excursion].concat(20),
                                data: nodeItem
                            }
                            ps.push(point);
                        });

                        var ls = [];
                        datas.edges.map(function (edgeItem, edgeIndex) {
                            var line = {
                                oname: edgeItem.oname,
                                coords: [[edgeItem.a_longitude_excursion, edgeItem.a_lantitude_excursion], [edgeItem.z_longitude_excursion, edgeItem.z_lantitude_excursion]],
                                data: edgeItem
                            }
                            ls.push(line);
                        });
                        lines.data = ls;
                        scatterPoint.data = ps;
                        var options = $.fn.WorldModule.defaults.chart.getOption();
                        options.series.push(lines);
                        options.series.push(scatterPoint);

                        $.fn.WorldModule.defaults.chart.setOption(options);

                        //渲染告警数据开启
                        $.fn.WorldModule.methods.renderWarningData($.fn.WorldModule.defaults.chart);

                        //实时渲染开启
                        $.fn.WorldModule.methods.realRenderWarningData($.fn.WorldModule.defaults.chart);
                    }
                }
            });

        },
        //渲染数据
        renderData: function (chart) {
            var lines = $("body").GeoUtils('getLine');
            var scatterPoint = $("body").GeoUtils('getScatter', {
                symbol: 'circle'
            });

            $.ajax({
                //url:Global.mapGlobal.queryPOI.queryServiceLines+"?scene=indoor&customer_name=apple",
                url:"http://10.154.8.22:8088/sotn/api/resource/servicelines?scene=indoor&ccustomer_name=抖音",
                type:'get',
                dataType:'json',
                headers:{
                    Accept:'application/json;charset=utf-8',
                    Authorization:Global.Authorization
                },
                success:function(data){
                    console.error('客户专线',data);
                }
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
            $.ajax({
                url:Global.mapGlobal.queryPOI.queryWarningOTN,
                type:'get',
                dataType:'json',
                headers:{
                    Accept:'application/json;charset=utf-8',
                    Authorization:Global.Authorization
                },
                success:function(data){
                    console.error('告警数据加载成功',data);
                    var datas = data.data;
                    if (datas && datas.serviceline) {
                        var options = chart.getOption();
                        datas.serviceline.map(function (warningItem, warningIndex) {
                            options.series.map(function (serieItem, nodeIndex) {
                                if (serieItem.type == 'lines' && serieItem.name != 'chinaLine') {
                                    serieItem.data.map(function (serieItemData, sindex) {
                                        var flag = false; //标识 是否告警
                                       /* serieItemData.data.aggr.map(function (aggrItem, aggrIndex) {
                                            if (aggrItem.oid == warningItem) {
                                                flag = true;
                                            }
                                        });*/
                                        for(var i = 0; i < serieItemData.data.aggr.length - 1; i++){
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
                    }
                    $.fn.WorldModule.defaults.oldOption = chart.getOption();
                }
            });
            /*$.get(Global.mapGlobal.queryPOI.queryWarningOTN, function (datas) {
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
            //清下chart高亮效果
            $.fn.WorldModule.methods.clearChart(true);
            console.error('lineData',lineData);

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
            if(lineRecord){
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
            }else{
                console.error('暂无关联到数据..');
            }

            // chartOption.series.push(lightLineSeri);
            // $.fn.WorldModule.defaults.chart.setOption(chartOption);
        },
        // 对外暴露的方法
        exportMethod: function(){
            gis.renderLine = $.fn.WorldModule.methods.renderLightLine;
            gis.renderCustomerLine = $.fn.WorldModule.methods.renderCustomerLine;
        },
        /**
         * 清除chart上现有的特效
         */
        chartDBClickEventTrigger: function () {
            $("#g_map").click(function(){

                $.fn.WorldModule.methods.clearChart();

                top.gis.clearSelectedLine();
            });
            /*$.fn.WorldModule.defaults.chart.on('click', function () {
                var op = $.fn.WorldModule.defaults.chart.getOption();
                op.series = [];

                $.fn.WorldModule.defaults.chart.setOption(op);
                $.fn.WorldModule.defaults.chart.setOption($.fn.WorldModule.defaults.oldOption,true,false,false);
            });*/
        },
        clearChart:function(flag){
            var op = $.fn.WorldModule.defaults.chart.getOption();
            op.series = [];
            $.fn.WorldModule.defaults.chart.setOption(op);

            if(flag)
                $.fn.WorldModule.defaults.oldOption.geo[0].zoom = op.geo[0].zoom;
            else
                $.fn.WorldModule.defaults.oldOption.geo[0].zoom = 1.2;

            $.fn.WorldModule.defaults.chart.setOption($.fn.WorldModule.defaults.oldOption,true,false,false);

            /*if(flag) {
                $.fn.WorldModule.defaults.oldOption.geo[0].zoom = op.geo[0].zoom;
                $.fn.WorldModule.defaults.oldOption.geo[0].center = op.geo[0].center;
                $.fn.WorldModule.defaults.chart.setOption($.fn.WorldModule.defaults.oldOption,true,false,false);
            } else {
                $.fn.WorldModule.defaults.oldOption.geo[0].zoom = 1.2;
                $.fn.WorldModule.defaults.oldOption.geo[0].center = [160,20];
                $.fn.WorldModule.defaults.chart.setOption($.fn.WorldModule.defaults.oldOption,true,false,false);
            }*/

        }
    },
    $.fn.WorldModule.defaults = {
        chart: null,
        oldOption: null
    }
})(jQuery);