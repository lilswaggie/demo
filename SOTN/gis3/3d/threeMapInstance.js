(function ($) {
    $.fn.threeMap = function () {
        // 更改可视窗口的高度
        var height = $("body").GeoUtils('getHeight');
        $('#g_map').css('height', height);
        // 对外提供的方法
        $.fn.threeMap.methods.exportMethod();
        $.fn.threeMap.methods.init();
    }
    $.fn.threeMap.methods = {
        init: function () {
            $.fn.threeMap.defaults.nathionalChart = echarts.init(document.getElementById("g_map"));
            $.fn.threeMap.defaults.chinaChart = $.fn.threeMap.methods.getChinaChart();
            var option = $("body").GeoUtils('get3dMapInstance', { chinaChart: $.fn.threeMap.defaults.chinaChart });
            $.fn.threeMap.defaults.nathionalChart.setOption(option);
            // 渲染数据
            $.fn.threeMap.methods.renderNationalData();
            $.fn.threeMap.methods.renderChinaData();

            // echarts自适应
            window.onresize = function () {
                var height = $("body").GeoUtils('getHeight');
                $('#g_map').css('height', height);
                $("body").GeoUtils('getResize', $.fn.threeMap.defaults.chinaChart);
                $("body").GeoUtils('getResize', $.fn.threeMap.defaults.nathionalChart);
            };
            // 点击事件
            $('.province').click(function () {
                gis.eventTrigger();
            });
            $('.colorChange').click(function () {
                gis.renderColor('leased_line_usable_rate');
            });
            $('#g_map').click(function () {
                $.fn.threeMap.methods.eventMap();
            });
        },
        //获取中国地图贴图
        getChinaChart: function () {
            var canvas = document.createElement('canvas');
            var mapChart = echarts.init(canvas, null, {
                width: 4096, height: 2048
            });
            mapChart.setOption({
                geo: {
                    map: 'china',
                    top: 0, left: 0,
                    right: 0, bottom: 0,
                    silent: true,
                    boundingCoords: [[-180, 90], [180, -90]],
                    itemStyle: {
                        normal: {
                            areaColor: "rgba(0,0,152,0.5)",
                            borderColor: '#032E29',
                        }
                    },/*
                     emphasis: {
                     itemStyle: {
                     areaColor: 'red',
                     color: 'red',
                     // opacity 为0，不显示颜色
                     opacity: 0
                     }
                     }*/

                },
                series: []
            });
            return mapChart;
        },

        //渲染中国数据
        renderChinaData: function () {
            var option = $.fn.threeMap.defaults.chinaChart.getOption();
            var series = [];
            var symbolPath = 'image://' + Global.mapGlobal.symbolConfig.OTN_SYMBOL;


            $.fn.threeMap.methods.renderChinalabel(option,series);
            $.fn.threeMap.methods.renderChinaLinesPorts(symbolPath,option,series);


        },
        renderChinaLinesPorts: function(symbolPath,option,series) {
            $.ajax({
                url: Global.mapGlobal.queryPOI.queryOTN+'?scene=indoor',
                type:'get',
                dataType:'json',
                headers:{
                    Authorization: Global.Authorization
                },
                success:function(datas){
                    var data = datas.data;
                    if(data && data.nodes && data.edges) {
                        var dataPorts = []; var dataLines = [];
                        var edges = data.edges;
                        var nodes = data.nodes;
                        nodes.forEach(function (e) {
                            var temp = {
                                name: e.oname,
                                value: [e.longitude, e.lantitude]
                            };
                            dataPorts.push(temp);
                        });
                        edges.forEach(function (e) {
                            var temp = {
                                name: e.oname,
                                coords: [[e.a_longitude, e.a_lantitude], [e.z_longitude, e.z_lantitude]]
                            };
                            dataLines.push(temp);
                        });

                        option['visualMap'] = {
                            left: 'right',
                            min: 500,
                            max: 5000,
                            inRange: {
                                // color: ['#0FF5D8', '#1a766c', '#1a766c', '#032E29']
                                color: ['#5DF3F5', '#62CFC0', '#4AB4A5', '#1A766C']
                            },
                            text: ['High', 'Low'],           // 文本，默认为数值文本
                            calculable: true
                        }
                        series.push({
                            type: 'map',
                            map: 'china',
                            top: 0, left: 0,
                            right: 0, bottom: 0,
                            // 控制缩放
                            roam: false,
                            //silent:true,//图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
                            boundingCoords: [[-180, 90], [180, -90]],
                            itemStyle: {
                                normal: {
                                    // areaColor: "rgba(0,0,152,0.5)",
                                    areaColor: '#2791CB',
                                    opacity: 1
                                }
                            },
                            emphasis: {
                                itemStyle: {
                                    areaColor: 'none',
                                    opacity: 1
                                },
                                label: { show: false }
                            },
                            data: Regions
                        }, {
                            type: 'lines',
                            name: 'lines3D',
                            lineStyle: {
                                width: 1,
                                // color: '#09B5FE',
                                color: '#17AAFF',
                                opacity: 1,
                                shadowBlur: 5,
                                shadowColor: '#03364B',
                                shadowOffsetX: 0,
                                shadowOffsetY: 2
                            },
                            data: dataLines
                        }, {
                            type: 'scatter',
                            name: 'scatter3D',
                            coordinateSystem: 'geo',
                            symbol: symbolPath,
                            symbolSize: '15',
                            itemStyle: {
                                color: 'red',
                                opacity: 1
                            },
                            data: dataPorts
                        });
                        option.series = series.concat(option.series);
                        $.fn.threeMap.defaults.chinaChart.setOption(option);

                        $.fn.threeMap.defaults.oldOption = option;

                    }
                }
            });
        },
        renderChinalabel: function(option,series) {
            $.get('outdoor.json',function (datas) {
                if(datas && datas.nodes) {
                    var dataPorts = [];
                    var nodes = datas.nodes;
                    nodes.forEach(function (e) {
                        var temp2 = {
                            name: e.oname,
                            value: [e.longitude, e.lantitude]
                        };
                        dataPorts.push(temp2);
                        series.push({
                            type: 'scatter',
                            name: 'scatter2s',
                            coordinateSystem: 'geo',
                            symbol: 'circle',
                            symbolSize: '1',
                            itemStyle: {
                                color: 'red',
                                opacity: 1
                            },
                            label: {
                                show: true,
                                position: 'insideTopLeft',
                                distance: 8,
                                formatter: '{b}',
                                color: "#ffffff",
                                backgroundColor: '#24696C',
                                shadowColor: '#0B1717',
                                shadowBlur: 4,
                                shadowOffsetX: 0,
                                shadowOfsetY: 2,
                                fontSize: 18,
                                padding: [5,10],
                                opactity: 1,
                                borderWidth: 1,
                                borderColor: '#6BECD4'
                            },
                            data: dataPorts
                        });
                    });
                    option.series = series.concat(option.series);
                    $.fn.threeMap.defaults.chinaChart.setOption(option);

                    $.fn.threeMap.defaults.oldOption = option;
                }
            });
        },
        renderColor: function (arr) {
            var colors = ['#B33341', '#94BD68', '#388283'];
            arr.forEach(function (e, index) {
                e.lineStyle = {
                    color: colors[index % 3]
                };
            });
            return arr;
        },
        //渲染国际数据
        renderNationalData: function () {
            var option = $.fn.threeMap.defaults.nathionalChart.getOption();
            var series = [];

            $.get('outdoor.json', function (data) {
                /*var dataPorts = [];*/ var dataLines = [];
                /*var nodes = data.nodes;*/
                var edges = data.edges;

                /*nodes.forEach(function (e) {
                    var temp = {
                        name: e.oname,
                        value: [e.longitude, e.lantitude]
                    };
                    dataPorts.push(temp);
                });*/
                edges.forEach(function (e) {
                    var temp = {
                        name: e.oname,
                        coords: [[e.a_longitude, e.a_lantitude], [e.z_longitude, e.z_lantitude]]
                    };
                    dataLines.push(temp);
                });

                series.push(
                    {
                        type: 'lines3D',
                        name: '王宁测试',
                        effect: {
                            show: true,
                            trailWidth: 2,
                            trailLength: 0.15,
                            trailOpacity: 1,
                            trailColor: '#FBFCF9'
                        },

                        lineStyle: {
                            width: 2,
                            color: '#29676F',
                            opacity: 0.9
                        },
                        blendMode: 'lighter',

                        data: $.fn.threeMap.methods.renderColor(dataLines)
                    }/*, {
                        type: 'scatter3D',
                        name: 'scatter3D2',
                        coordinateSystem: 'globe',
                        symbol: 'none',
                        symbolSize: '5',
                        itemStyle: {
                            color: 'blue',
                            opacity: 0.9
                        },
                        label: {
                            show: true,
                            formatter: '{b}',
                            textStyle: {
                                color: '#000',
                                borderWidth: 1,
                                // borderColor: 'rgba(0,0,0,1)',
                                borderColor: '#fff',
                            }
                        },
                        data: dataPorts
                    }*/);
                option.series = series;
                option.backgroundColor = 'rgba(0,0,0,0)';
                $.fn.threeMap.defaults.nathionalChart.setOption(option);
            });
        },
        // 点击查看中国
        eventTrigger: function () {
            var option = $.fn.threeMap.defaults.nathionalChart.getOption();
            if (option.globe[0].viewControl.autoRotateSpeed == 5) {
                // 缩放效果
                //option.globe[0].viewControl.distance = 100;
                // option.globe[0].viewControl.autoRotate = false;
                // 控制速度达到效果
                option.globe[0].viewControl.targetCoord = [109.1162, 34.2004]
                option.globe[0].viewControl.autoRotateSpeed = 0;
            } else {
                // 缩放效果
                // option.globe[0].viewControl.distance = 200;
                // option.globe[0].viewControl.autoRotate = true;
                // 将中心点取消
                // option.globe[0].viewControl.targetCoord = null;
                option.globe[0].viewControl.autoRotateSpeed = 5;
            }
            $.fn.threeMap.defaults.nathionalChart.setOption(option);
        },
        // 点击渲染颜色
        eventColorHttp: function(key) {
            var url = Global.mapGlobal.threeDimensional[key];
            if(url) {
                $.ajax({
                    url: url,
                    type:'get',
                    dataType:'json',
                    headers:{
                        Accept:'application/json;charset=utf-8',
                        Authorization:'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzb3RuLW84IiwiZXhwIjoxNTQ2OTk5MzU4LCJpYXQiOjE1NDQ0MDczNTh9.AsyYb4RB6QLuW-Nt1FFnthh4-OvK3lIuUx7Q1FLrkpeu55klEV5g1XXBeB2Y0Lomz-aAcJoTqByLEBYdPt117Q'
                    },
                    success:function(data){
                        var datas = data.data.values;
                        var regions = [];
                        var min =0;var max = 0;
                        for(var key in datas) {
                            var temp = {
                                name: key,
                                value: datas[key]
                            };
                            regions.push(temp);
                            if(datas[key]<= min){
                                min = datas[key];
                            }
                            if(datas[key] >= max) {
                                max = datas[key];
                            }
                        }
                        max = (max==0?10:max);
                        $.fn.threeMap.methods.eventColor(regions,min,max);
                    }
                });
            } else {
                console.error("不存在该接口,请在'Global.mapGlobal.threeDimensional'中查看有哪些为可用接口");
            }
        },
        eventColor: function (regions,min,max) {
                var option = $.fn.threeMap.defaults.chinaChart.getOption();
                option.series.forEach(function (e, index) {
                    if (e.type == 'map') {
                        option.series[index].data = regions;
                    }
                })
                option.visualMap[0] = {
                    left: 'right',
                    min: min,
                    max: max,
                    inRange: {
                        // color: ['#0FF5D8', '#1a766c', '#1a766c', '#032E29']
                        color: ['#5DF3F5', '#62CFC0', '#4AB4A5', '#1A766C']
                    },
                    text: ['High', 'Low'],           // 文本，默认为数值文本
                    calculable: true
                }
                $.fn.threeMap.defaults.chinaChart.setOption(option);
            // 颜色渲染完成后是否需要球动起来
            $.fn.threeMap.methods.eventTrigger();
        },
        // 点击球动或不动，清除颜色
        eventMap: function () {
            var optionChina = $.fn.threeMap.defaults.chinaChart.getOption();
            var optionNational = $.fn.threeMap.defaults.nathionalChart.getOption();
            // 将中心点取消，从哪停止，从哪开始
            // optionNational.globe[0].viewControl.targetCoord = null;
            // 点击查看中国地图
            optionNational.globe[0].viewControl.targetCoord = [109.1162, 34.2004];
            if (optionNational.globe[0].viewControl.autoRotateSpeed == 5) {
                // 缩放功能
                //optionNational.globe[0].viewControl.distance = 200;
                // option.globe[0].viewControl.autoRotate = true;
                // 控制速度达到效果
                optionNational.globe[0].viewControl.autoRotateSpeed = 0;
            } else {
                // 控制速度达到效果
                optionNational.globe[0].viewControl.autoRotateSpeed = 5;
            }
            $.fn.threeMap.defaults.nathionalChart.setOption(optionNational);

            optionChina.series.forEach(function(element) {
                if (element.type == 'map') {
                if (element.data[0].name != '山东' || element.data[0].value != 50) {
                    $.fn.threeMap.defaults.chinaChart.setOption($.fn.threeMap.defaults.oldOption, true, false, false);
                }
            }
        });
        },
        // 对外暴露的方法
        exportMethod: function () {
            gis.renderColor = $.fn.threeMap.methods.eventColorHttp;
            gis.eventTrigger = $.fn.threeMap.methods.eventTrigger;
        }
    },
        $.fn.threeMap.defaults = {
            oldOption: null,
            nathionalChart: null,
            chinaChart: null
        }
})(jQuery);