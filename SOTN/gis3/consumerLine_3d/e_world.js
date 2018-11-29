/**
 * Created by wang.ning on 2018/11/23.
 */
(function($){
    $.fn.WorldModule = function(options,param){
        // 更改可视窗口的高度
        var height = $("body").GeoUtils('getHeight');
        $('#g_map').css('height', height);
        if(typeof options == 'string') return $.fn.WorldModule.methods[options](param);
        $.fn.WorldModule.methods.init();
    }
    $.fn.WorldModule.methods = {
        init:function(){
            var chart = echarts.init(document.getElementById("g_map"));
            $.get('../../geodata/world.json',function(mapJson){
                var data = [];
                $.each(mapJson.features,function(index,item){
                    var row = {};
                    data.push("1");
                });
                echarts.registerMap('world',mapJson);
                chart.setOption({
                    backgroundColor: '#060A10',
                    geo: $("body").GeoUtils('getWorldMapInstance'),
                    series:[/*{
                        //center:[145.3893,0.0516],
                        type:'map',
                        //zoom:0.3,
                        roam:false,
                        show:false,
                        map:'china'
                    }*/]
                });
                $.fn.WorldModule.methods.renderData(chart);
                chart.on('click',function(params){
                    console.log('params',params.data );
                });
            });
            // echarts自适应
            window.onresize = function () {
                var height = $("body").GeoUtils('getHeight');
                $('#g_map').css('height', height);
                $("body").GeoUtils('getResize',chart);
            }

        },
        renderData:function(chart){
            var lines = $("body").GeoUtils('getLine');
            var scatterPoint = $("body").GeoUtils('getScatter',{
                symbol:'circle'
            });

            $.get('world_service.json',function(datas){
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
                    // 白色拖尾
                    options.series.push(lines,{
                        name: 'linesTrail',
                        type: 'lines',
                        zlevel: 1,
                        effect: {
                            show: true,
                            period: 6,
                            trailLength: 0.7,
                            color: '#fff',
                            symbolSize: 3
                        },
                        lineStyle: {
                            normal: {
                                color: '#E1DCDD',
                                width: 0,
                                curveness: 0.2
                            }
                        },
                        data: ls
                    });
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
        renderWarningData:function(chart){
            $.get(Global.mapGlobal.queryPOI.queryWarningOTN,function(datas){
                if(datas && datas.serviceline){
                    datas.serviceline.map(function(warningItem,warningIndex){
                        var options = chart.getOption();
                        options.series.map(function(serieItem,nodeIndex){
                            if(serieItem.type == 'lines' && serieItem.name!='chinaLine'){
                                serieItem.data.map(function(serieItemData,sindex){
                                    var flag = false; //标识 是否告警
                                    serieItemData.data.aggr.map(function(aggrItem,aggrIndex){
                                        if(aggrItem.oid == warningItem){
                                            flag = true;
                                        }
                                    });
                                    if(flag){
                                        serieItemData.lineStyle = {
                                            color: '#9D3B3B'
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
        realRenderWarningData:function(chart){
            if(Global.mapGlobal.queryPOI.realQueryFlag){
                setInterval(function(){
                    $.fn.ChinaModule.methods.renderWarningData(chart);
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
                            color: '#fff',
                            symbolSize: 3
                        },
                        data:lightdatas
                    });
                    chart.setOption(opt);
                }else{
                    chart.setOption(old_opt);
                }
            });
        }
    }
})(jQuery);