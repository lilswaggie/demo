/**
 * 业务品质高js
 * Created by wang.ning on 2019/5/26.
 */
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
        $("#ceshi").on('click',function(){
            $.fn.ChinaModule.methods.locationAndZoomA();
        });
        $("#tab1").on('click',function(){
            $.fn.ChinaModule.methods.draw4Line('1');
        });
        $("#tab2").on('click',function(){
            $.fn.ChinaModule.methods.draw4Line('2');
        });
        $("#tab3").on('click',function(){
            $.fn.ChinaModule.methods.draw4Line('3');
        });
        $("#tab4").on('click',function(){
            $.fn.ChinaModule.methods.draw4Line('3');
        });
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
        locationAndZoomA: function () {
            var options = $.fn.ChinaModule.defaults.chart.getOption();
            $.fn.ChinaModule.defaults.lastOption = options;
            console.error('oldOptions', $.fn.ChinaModule.defaults.lastOption)
            console.error('options',options)
            // for (var i = 0; i < options.series.length; i++) {
            //     if(options.series[i].type !== 'map') {
            //         options.series[i] = {};
            //     }
            // }
            var series = options.series;
            var mapSery = null;
            if(series){
                series.map(function (sery,seyIndex) {
                    if(sery.type == 'map'){
                        mapSery = sery;
                    }
                });
            }
            var newSeries = [];
            console.error('mapSery',mapSery)
            options.geo[0].zoom = 5;
            options.geo[0].center = [112.3352,37.9413];
            mapSery.zoom = 5;
            mapSery.center = [112.3352,37.9413];
            newSeries.push(mapSery);
            newSeries.push({
                type:'scatter',
                coordinateSystem:'geo',
                symbol:'circle',
                symbolSize:20,
                itemStyle:{
                    color:'#fff'
                },
                data:[
                    // {value:[105.0468615290,37.2623659616],name:'中卫'},
                    {value:[109.6171830999,38.0798033595],name:'榆林'},
                    {value:[111.3857935211,39.7049361529],name:'鄂尔多斯'},
                    {value:[114.3412478635,40.7282243025],name:'张家口'},
                    // {value:[116.4396162794,39.7386319934],name:'北京'},
                    {value:[114.5828868018,39.0508916954],name:'大同'},
                    {value:[109.9355564159,36.3479752696],name:'延安'},
                    {value:[113.6489603436,36.9650010408],name:'邢台'}
                ]
            });
            newSeries.push({
                type:'scatter',
                coordinateSystem:'geo',
                symbol:'circle',
                symbolSize:20,
                itemStyle:{
                    color:'#71CA41'
                },
                data:[
                    {value:[105.0468615290,37.2623659616],name:'中卫'}
                ]
            });
            newSeries.push({
                type:'scatter',
                coordinateSystem:'geo',
                symbol:'circle',
                symbolSize:20,
                itemStyle:{
                    color:'#F2327E'
                },
                data:[
                    {value:[116.4396162794,39.7386319934],name:'北京'}
                ]
            });
            newSeries.push({
                id: '1',
                type:'lines',
                coordinateSystem:'geo',
                symbol:[
                    'none',
                    'none'
                ],
                symbolSize:[
                    10,
                    10
                ],
                lineStyle: {
                    color: '#4C88E4',
                    opacity: 0.5,
                    type: 'solid',
                    width: 5
                },
                data: [
                    {coords:[[109.6171830999, 38.0798033595],[111.3857935211, 39.7049361529]],onname:'榆林-鄂尔多斯',
                        label:{show: true, position: 'middle', color:'#4C88E4', formatter: function (params) {
                                str = '230us';
                                return str;
                            }}},
                    {coords:[[111.3857935211, 39.7049361529],[114.3412478635, 40.7282243025]],onname:'鄂尔多斯-张家口',
                        label:{show: true, position: 'middle', color:'#4C88E4', formatter: function (params) {
                                str = '230us';
                                return str;
                            }}}
                ]
            })
            newSeries.push({
                id: '2',
                type:'lines',
                coordinateSystem:'geo',
                symbol:[
                    'none',
                    'none'
                ],
                symbolSize:[
                    10,
                    10
                ],
                lineStyle: {
                    color: '#4C88E4',
                    opacity: 0.5,
                    type: 'solid',
                    width: 5
                },
                data: [
                    {coords:[[109.6171830999, 38.0798033595],[114.5828868018, 39.0508916954]],onname:'榆林-大同',
                        label:{show: true, position: 'middle', color:'#4C88E4', formatter: function (params) {
                                str = '400us';
                                return str;
                            }}},
                    {coords:[[114.5828868018, 39.0508916954],[114.3412478635, 40.7282243025]],onname:'大同-张家口',
                        label:{show: true, position: 'middle', color:'#4C88E4', formatter: function (params) {
                                str = '200us';
                                return str;
                            }}}
                ]
            })
            newSeries.push({
                id: '3',
                type:'lines',
                coordinateSystem:'geo',
                symbol:[
                    'none',
                    'none'
                ],
                symbolSize:[
                    10,
                    10
                ],
                lineStyle: {
                    color: '#4C88E4',
                    opacity: 0.5,
                    type: 'solid',
                    width: 5
                },
                data: [
                    {coords:[[105.046861529, 37.2623659616],[109.9355564159, 36.3479752696]],onname:'中卫-延安',
                        label:{show: true, position: 'middle', color:'#4C88E4', formatter: function (params) {
                                str = '460us';
                                return str;
                            }}},
                    {coords:[[109.9355564159, 36.3479752696],[113.6489603436, 36.9650010408]],onname:'延安-邢台',
                        label:{show: true, position: 'middle', color:'#4C88E4', formatter: function (params) {
                                str = '380us';
                                return str;
                            }}},
                    {coords:[[113.6489603436, 36.9650010408],[116.4396162794, 39.7386319934]],onname:'邢台-北京',
                        label:{show: true, position: 'middle', color:'#4C88E4', formatter: function (params) {
                                str = '450us';
                                return str;
                            }}}
                ]
            })
            newSeries.push({
                id: '4',
                type:'lines',
                coordinateSystem:'geo',
                symbol:[
                    'none',
                    'none'
                ],
                symbolSize:[
                    10,
                    10
                ],
                lineStyle: {
                    color: '#4C88E4',
                    opacity: 0.5,
                    type: 'solid',
                    width: 5
                },
                data: [
                    {coords:[[105.046861529, 37.2623659616],[109.6171830999, 38.0798033595]],onname:'中卫-榆林',
                        label:{show: true, position: 'middle', color:'#4C88E4', formatter: function (params) {
                                str = '450us';
                                return str;
                            }}},
                    {coords:[[114.3412478635, 40.7282243025],[116.4396162794, 39.7386319934]],onname:'张家口-北京',
                        label:{show: true, position: 'middle', color:'#4C88E4', formatter: function (params) {
                                str = '180us';
                                return str;
                            }}}
                ]
            })
            options.series = newSeries;
            console.error('修改后的',options)
            $.fn.ChinaModule.defaults.chart.clear();
            $.fn.ChinaModule.defaults.chart.setOption(options);

        },
        draw4Line: function (number) {
            var options = $.fn.ChinaModule.defaults.chart.getOption();
            var newSeries = options.series;
            for (var i = 0; i < newSeries.length; i++) {
                if (newSeries[i].type === 'lines') {
                    newSeries[i].lineStyle.color = '#4C88E4';
                    for (var j = 0; j < newSeries[i].data.length; j++) {
                        newSeries[i].data[j].label.color = '#4C88E4';
                    }
                }
            };
            if (number === '1') {
                for (var i = 0; i < newSeries.length; i++) {
                    if (newSeries[i].id === '4' || newSeries[i].id === '1') {
                        newSeries[i].lineStyle.color = '#fff';
                        for (var j = 0; j < newSeries[i].data.length; j++) {
                            newSeries[i].data[j].label.color = '#fff';
                        }
                    }
                }
            } else if (number === '2') {
                for (var i = 0; i < newSeries.length; i++) {
                    if (newSeries[i].id === '4' || newSeries[i].id === '2') {
                        newSeries[i].lineStyle.color = '#fff';
                        for (var j = 0; j < newSeries[i].data.length; j++) {
                            newSeries[i].data[j].label.color = '#fff';
                        }
                    }
                };
            } else if (number === '3') {
                for (var i = 0; i < newSeries.length; i++) {
                    if (newSeries[i].id === '3') {
                        newSeries[i].lineStyle.color = '#fff';
                        for (var j = 0; j < newSeries[i].data.length; j++) {
                            newSeries[i].data[j].label.color = '#fff';
                        }
                    }
                };
            }
            options.series = newSeries;
            $.fn.ChinaModule.defaults.chart.clear();
            $.fn.ChinaModule.defaults.chart.setOption(options);
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
                            symbol:'circle',
                            //symbol:'image://'+Global.mapGlobal.symbolConfig.OA_SYMBOL,
                            symbolSize:2,
                            cursor:'pointer',
                            itemStyle:{
                                color:'#fff',
                            },
                            data: p_oa
                        };
                        var p_otm_sery = {
                            type:'scatter',
                            coordinateSystem:'geo',
                            symbol:'circle',
                            //symbol:'image://'+Global.mapGlobal.symbolConfig.OTM_SYMBOL,
                            symbolSize:2,
                            cursor:'pointer',
                            itemStyle:{
                                color:'#fff',
                            },
                            data: p_otm
                        };
                        var p_otn_sery = {
                            type:'scatter',
                            coordinateSystem:'geo',
                            symbol:'circle',
                            //symbol:'image://'+Global.mapGlobal.symbolConfig.OTN_DEFAULT_SYMBOL,
                            symbolSize:2,
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
                                color:'#fff',
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
                    if (datas && datas.site) {
                        var options = chart.getOption();
                        console.error('series',options.series)
                        datas.site.map(function(warningSite,warningIndex){
                            options.series.map(function(seryItem,nodeIndex){
                                if(seryItem.type == 'scatter'){
                                    seryItem.data.map(function(seryItemData,s_index){
                                        //console.log('seryItemData...',seryItemData)
                                        var flag = false;
                                        if(warningSite == seryItemData.data.oid){
                                            flag = true;
                                        }
                                        if(flag){
                                            if(seryItemData.data.type == 'OA'){
                                                seryItemData.symbol = 'image://'+Global.mapGlobal.symbolConfig.OA_WARNING_SYMBOL
                                            }else if(seryItemData.data.type == 'OTM'){
                                                seryItemData.symbol = 'image://'+Global.mapGlobal.symbolConfig.OTN_DEFAULT_SYMBOL
                                            }else if(seryItemData.data.type == 'OTN'){
                                                seryItemData.symbol = 'image://'+Global.mapGlobal.symbolConfig.OTN_DEFAULT_SYMBOL
                                            }

                                        }
                                    });
                                }
                            });
                        });
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
            lastOption: null,
            count: 0
        }
})(jQuery);