/**
 * Created by wang.ning on 2018/11/23.
 */
(function($){
    $.fn.WorldModule = function(options,param){

        var height = $("body").GeoUtils('getHeight');
        $('#g_map').css('height', height);

        if(typeof options == 'string') return $.fn.WorldModule.methods[options](param);
        $.fn.WorldModule.methods.init();
        $.fn.WorldModule.methods.exportMethod();
    }
    $.fn.WorldModule.methods = {
        init:function(){
            $.fn.WorldModule.defaults.chart = echarts.init(document.getElementById("g_map"));

            $.get('../../geodata/world.json',function(mapJson){
                var data = [];
                $.each(mapJson.features,function(index,item){
                    var row = {};
                    //row.name = item.properties.NAME;
                    //row.lon = item.CP[0];
                    //row.lat = item.CP[1];
                    //data.push(row);
                    data.push("1");
                });
                echarts.registerMap('world',mapJson);
                $.fn.WorldModule.defaults.chart.setOption({
                    backgroundColor: '#BEDBF9',
                    geo: $("body").GeoUtils('getWorldMapInstance'),
                    series:[]
                });
                $.fn.WorldModule.methods.renderData($.fn.WorldModule.defaults.chart);
                $.fn.WorldModule.defaults.chart.on('click',function(params){
                    console.log('params',params.data);
                });
            });

            // echarts自适应
            window.onresize = function () {
                var height = $("body").GeoUtils('getHeight');
                $('#g_map').css('height', height);
                $("body").GeoUtils('getResize',$.fn.WorldModule.defaults.chart);
                var newOption = $.fn.WorldModule.defaults.chart.getOption();
                $.fn.WorldModule.defaults.chart.clear();
                $.fn.WorldModule.defaults.chart.setOption(newOption);
            }
            // 线条高亮，两端闪烁
            $(".port").click(function () {
                    console.log('you clicked me')
                    // 点击时传递对应id触发事件
                    gis.renderLine({ id: "123" });
                    // gis.renderLine({ id: "234" });
            });
            $("#g_map").click(function(){
                $.fn.WorldModule.methods.clearEventTrigger();
                //回调超超接口
                top.gis.clearSelectedLine();
            })
        },
        renderData:function(chart){
            var lines = $("body").GeoUtils('getLine');
            var scatterPoint = $("body").GeoUtils('getScatter',{
                symbol:'circle'
            });
            $.ajax({
                url:Global.mapGlobal.queryPOI.queryServiceLines+'?scene=outdoor',
                type:'get',
                dataType:'json',
                headers:{
                    Accept:'application/json;charset=utf-8',
                    Authorization:Global.Authorization
                },
                success:function(data){
                    console.log('data',data);
                    var datas = data.data;
                    if(datas && datas.nodes){
                        var ps = [];
                        datas.nodes.map(function(nodeItem,nodeIndex){
                            var point = {
                                name:nodeItem.oname,
                                value:[nodeItem.longitude_excursion,nodeItem.lantitude_excursion].concat(20),
                                data:nodeItem
                            }
                            ps.push(point);
                        });

                        var ls = [];
                        datas.edges.map(function(edgeItem,edgeIndex){
                            var line = {
                                oname:edgeItem.oname,
                                coords:[[edgeItem.a_longitude_excursion,edgeItem.a_lantitude_excursion],[edgeItem.z_longitude_excursion,edgeItem.z_lantitude_excursion]],
                                //coords:[[edgeItem.a_longitude,edgeItem.a_lantitude],[edgeItem.z_longitude,edgeItem.z_lantitude]],
                                data:edgeItem
                            }
                            ls.push(line);
                        });
                        lines.data = ls;

                        scatterPoint.data = ps;
                        console.log('scatterPoint',scatterPoint)
                        var options = chart.getOption();
                        options.series.push(lines);
                        options.series.push(scatterPoint);

                        chart.setOption(options);

                        //渲染告警数据开启
                        $.fn.WorldModule.methods.renderWarningData(chart);

                        //实时渲染开启
                        $.fn.WorldModule.methods.realRenderWarningData(chart);
                    }
                },
                error:function(data){
                    console.error('errorData',data);
                }
            });
           /* $.get('../../geodata/world_service.json',function(datas){
                if(datas && datas.nodes){
                    var ps = [];
                    datas.nodes.map(function(nodeItem,nodeIndex){
                        var point = {
                            name:nodeItem.oname,
                            value:[nodeItem.longitude,nodeItem.lantitude].concat(20),
                            data:nodeItem
                        }
                        ps.push(point);
                    });

                    var ls = [];
                    datas.edges.map(function(edgeItem,edgeIndex){
                        var line = {
                            oname:edgeItem.oname,
                            coords:[[edgeItem.a_longitude,edgeItem.a_lantitude],[edgeItem.z_longitude,edgeItem.z_lantitude]],
                            data:edgeItem
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
            });*/
        },
        //渲染告警数据
        renderWarningData:function(chart){
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
                    if(datas && datas.serviceline){
                        datas.serviceline.map(function(warningItem,warningIndex){
                            var options = chart.getOption();
                            options.series.map(function(serieItem,nodeIndex){
                                if(serieItem.type == 'lines'){
                                    serieItem.data.map(function(serieItemData,s_index){
                                        var flag = false; //标识 是否告警
                                        serieItemData.data.aggr.map(function(aggrItem,aggrIndex){
                                            if(aggrItem.oid == warningItem){
                                                flag = true;
                                            }
                                        });
                                        if(flag){
                                            serieItemData.lineStyle = {
                                                color: Global.mapGlobal.echartsConfig.lineColor.fault
                                            };
                                        }
                                    });
                                }
                            });
                            console.error('warnningoptions',options);
                            chart.setOption(options);
                        });
                    }
                    $.fn.WorldModule.defaults.oldOption = chart.getOption();
                }
            });
            //$.get(Global.mapGlobal.queryPOI.queryWarningOTN,function(datas){
           /* $.get('../../geodata/queryWarnings.json',function(datas){
                if(datas && datas.serviceline){
                    datas.serviceline.map(function(warningItem,warningIndex){
                        var options = chart.getOption();
                        options.series.map(function(serieItem,nodeIndex){
                            if(serieItem.type == 'lines'){
                                serieItem.data.map(function(serieItemData,s_index){
                                    var flag = false; //标识 是否告警
                                    serieItemData.data.aggr.map(function(aggrItem,aggrIndex){
                                        if(aggrItem.oid == warningItem){
                                            flag = true;
                                        }
                                    });
                                    if(flag){
                                        serieItemData.lineStyle = {
                                            color: Global.mapGlobal.echartsConfig.lineColor.fault
                                        };
                                    }
                                });
                            }
                        });
                        console.error('warnningoptions',options);
                        chart.setOption(options);
                    });
                }
                $.fn.WorldModule.defaults.oldOption = chart.getOption();
            });*/
        },
        //实时渲染功能
        realRenderWarningData:function(chart){
            if(Global.mapGlobal.queryPOI.realQueryFlag){
                setInterval(function(){
                    $.fn.WorldModule.methods.renderWarningData(chart);
                },Global.mapGlobal.queryPOI.realQueryTimer);
            }
        },
        chartEventsTrigger:function(chart){
            chart.on('click',function(params){
                var old_opt = chart.getOption();
                var lightdatas = [];
                lightdatas.push(params.data);
                if(params.seriesType && params.seriesType == 'lines'){
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
                        data:lightdatas
                    });
                    chart.setOption(opt);
                }else{
                    chart.setOption(old_opt);
                }
            });
        },
        /**
         * @author 小皮
         * lineData = { id: '' }
         */
        renderLightLine: function (lineData) {
            // 清除高亮效果
            $.fn.WorldModule.methods.clearEventTrigger(true);
            // lineRecords: 高亮线条的集合
            var lineRecords = [];
            $.fn.WorldModule.defaults.chart.getOption().series.map(function (seri, key) {
                if (seri.type == 'lines') {
                    seri.data.map(function (line, key) {
                        var aggrs = line.data.aggr;
                        aggrs.map(function (aggr, aggrKey) {
                            if (aggr.oid == lineData.id) {
                                lineRecords.push(line)
                            }
                        });
                    });
                }
            });
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
            var lightLineSeri = $.fn.WorldModule.methods.renderScatterEffect(param);
            var chartOption = $.fn.WorldModule.defaults.chart.getOption();

            chartOption.series = chartOption.series.concat(lightLineSeri)
            console.error('chartOption',chartOption);
            $.fn.WorldModule.defaults.chart.setOption(chartOption);
        },
        /**
         * @author: 小皮
         * @param {dataLines,dataPorts} param
         * 处理线条和端点数据
         */
        renderScatterEffect: function (param) {
            var series = [];
            console.error('param',param);
            series.push({
                    type: 'lines',
                    name: 'lights_line',
                    lineStyle: {
                        color: '#4D8CF4',
                        width: 3,
                        curveness: 0.2
                    },
                    zlevel: 1,
                    effect: {
                        show: true,
                        period: 5,
                        trailLength: 0.3,
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
                    symbolSize: 2,
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
            gis.renderLine = $.fn.WorldModule.methods.renderLightLine;
        },
        // 地图点击事件清除chart上的现有特效,并将地图变为原来的样子
        clearEventTrigger: function (flag) {
            var op = $.fn.WorldModule.defaults.chart.getOption();
            op.series = [];
            $.fn.WorldModule.defaults.chart.setOption(op);
            if(flag) {
                $.fn.WorldModule.defaults.oldOption.geo[0].zoom = op.geo[0].zoom;
                $.fn.WorldModule.defaults.oldOption.geo[0].center = op.geo[0].center;
                $.fn.WorldModule.defaults.chart.setOption($.fn.WorldModule.defaults.oldOption,true,false,false);
            } else {
                $.fn.WorldModule.defaults.oldOption.geo[0].zoom = 1.2;
                $.fn.WorldModule.defaults.oldOption.geo[0].center = [160,20];
                $.fn.WorldModule.defaults.chart.setOption($.fn.WorldModule.defaults.oldOption,true,false,false);
            }
        }
    },
        $.fn.WorldModule.defaults = {
            chart: null,
            oldOption: null
        }
})(jQuery);