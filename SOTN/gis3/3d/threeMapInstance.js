(function ($) {
    $.fn.threeMap = function () {
        // 更改可视窗口的高度
        var height = $("body").GeoUtils('getHeight');
        $('#g_map').css('height', height);
        $.fn.threeMap.methods.init();
    }
    $.fn.threeMap.methods = {
        init: function () {
            var e_map = echarts.init(document.getElementById("g_map"));
            var chinaChart = $.fn.threeMap.methods.getChinaChart();
            var option = $("body").GeoUtils('get3dMapInstance', { chinaChart: chinaChart });
            e_map.setOption(option);
            // 渲染数据
            $.fn.threeMap.methods.renderNationalData(e_map);
            $.fn.threeMap.methods.renderChinaData(chinaChart);

            // echarts自适应
            window.onresize = function () {
                var height = $("body").GeoUtils('getHeight');
                $('#g_map').css('height', height);
                $("body").GeoUtils('getResize', chinaChart);
                $("body").GeoUtils('getResize', e_map);
            };
            // 点击事件
            $('.province').click(function () {
                $.fn.threeMap.methods.eventTrigger(e_map);
            });
            /*$('.colorChange').click(function () {
                $.fn.threeMap.methods.eventColor(chinaChart, e_map)
            });*/
            $('#g_map').click(function () {
                $.fn.threeMap.methods.eventMap(chinaChart, e_map)
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
                    silent: false,
                    boundingCoords: [[-180, 90], [180, -90]],
                    itemStyle: {
                        normal: {
                            areaColor: "rgba(0,0,152,0.5)",
                            borderColor: '#032E29'
                        }
                    },
                    emphasis: {
                        itemStyle: {
                            color: 'blue'
                        }
                    }

                },
                series: []
            });
            return mapChart;
        },

        //渲染中国数据
        renderChinaData: function (chinaChart) {
            var option = chinaChart.getOption();
            var series = [];
            
            var symbolPath = 'image://' +  Global.mapGlobal.symbolConfig.OTN_SYMBOL;
            $.get('geoData.json', function (data) {
                option['visualMap'] = {
                    left: 'right',
                    min: 500,
                    max: 5000,
                    // color:[#74B7E0','#4575b4','#1E69A6','#2791CB','#0A24A5'],
                    inRange: {
                        color: ['#0FF5D8', '#1a766c', '#1a766c', '#032E29']
                    },
                    text: ['High', 'Low'],           // 文本，默认为数值文本
                    calculable: true
                }
                series.push({
                    type: 'map',
                    map: 'china',//world是html页面引入的地图文件名字
                    // 绘制完整尺寸的 echarts 实例
                    top: 0, left: 0,
                    right: 0, bottom: 0,
                    // 控制缩放
                    roam: false,
                    //silent:true,//图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
                    boundingCoords: [[-180, 90], [180, -90]],
                    itemStyle: {
                        normal: {
                            areaColor: "rgba(0,0,152,0.5)",
                            //areaColor:'red'
                            // 测试使用，颜色的变淡应与此有关
                            opacity: 1
                        },
                        emphasis: { label: { show: true } }
                    },

                    emphasis: {
                        itemStyle: {
                            color: 'blue'
                        }
                    },
                    data: data.region
                }, {
                    type: 'lines',
                    name: 'lines3D',
                    lineStyle: {
                        width: 1,
                        color: '#0352DB',
                        opacity: 1
                    },
                    data: data.lines
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
                    data: data.spots
                })
                option.series = series;
                chinaChart.setOption(option);
            })
            // 渲染告警数据：
            $.get('geoData.json',function(data){
                
            })
        },
        //渲染国际数据
        renderNationalData: function (nathionalChart) {
            var option = nathionalChart.getOption();
            var series = [];
            series.push(
                {
                    type: 'lines3D',
                    name: '王宁测试',
                    // var effectColor = ['#1CD6CE','#0AFF8B','#0AE0FA'];
                    // var linesColor = ['#225755','#1F6F48','#298176',#0A464D'];
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

                    data: [
                        { coords: [[116.4136103013, 39.9110666857], [-95.639302, 37.266899]], lineStyle: { color: '#B33341' } },
                        { coords: [[101.4038, 36.8207], [-2.401801, 30.95309]], lineStyle: { color: '#94BD68' } },
                        { coords: [[106.6992, 26.7682], [133.003999, -26.013866]], lineStyle: { color: '#388283' } },
                        // 非洲
                        { coords: [[91.1865, 30.1465], [17.326883, -23.866826]], lineStyle: { color: '#94BD68' } },
                        { coords: [[102.9199, 25.4663], [97.393614, -68.480939]], lineStyle: { color: '#B33341' } },
                    ]

                }, {
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
                            color: '#000'
                        },
                        backgroundColor: '#d49f3e'
                    },
                    data: [
                        {
                            name: '北京', value: [116.4136103013, 39.9110666857]
                        }, {
                            name: '美国', value: [-95.639302, 37.266899]
                        }, {
                            name: "青海", value: [101.4038, 36.8207]
                        }, {
                            name: '阿尔及利亚', value: [-2.401801, 30.95309]
                        }, {
                            name: '贵州', value: [106.6992, 26.7682]
                        }, {
                            name: '澳大利亚', value: [134.247186, -25.479252]
                        }, {
                            name: '西藏', value: [91.1865, 30.1465]
                        }, {
                            name: '纳米比亚', value: [17.326883, -23.866826]
                        }, {
                            name: '云南', value: [102.9199, 25.4663]
                        }, {
                            name: '南极洲', value: [97.393614, -68.480939]
                        }
                    ]

                })
            option.series = series;
            option.backgroundColor = 'rgba(0,0,0,0)';
            nathionalChart.setOption(option);
        },
        eventTrigger: function (nathionalChart) {
            var option = nathionalChart.getOption();

            if (option.globe[0].viewControl.autoRotateSpeed == 5) {
                // 缩放效果
                //option.globe[0].viewControl.distance = 100;
                // option.globe[0].viewControl.autoRotate = false;
                // 控制速度达到效果
                option.globe[0].viewControl.targetCoord = [109.1162, 34.2004];
                option.globe[0].viewControl.autoRotateSpeed = 0;
            } else {
                // 缩放效果
                // option.globe[0].viewControl.distance = 200;
                // option.globe[0].viewControl.autoRotate = true;
                // 控制速度达到效果
                option.globe[0].viewControl.targetCoord = null;
                option.globe[0].viewControl.autoRotateSpeed = 5;
            }
            nathionalChart.setOption(option);
        },
        eventColor: function (chinaChart, e_map) {
            var option = chinaChart.getOption();
            if (option.visualMap[0].inRange.color.length == 3) {
                var optionMap = e_map.getOption();

                option.visualMap[0] = {
                    left: 'right',
                    min: 500,
                    max: 5000,
                    inRange: {
                        color: ['#74B7E0', '#4575b4', '#2791CB', '#0A24A5']
                    },
                    text: ['High', 'Low'],           // 文本，默认为数值文本
                    calculable: true
                }
                chinaChart.setOption(option);
                // 判断球的状态
                if (optionMap.globe[0].viewControl.autoRotate) {
                    optionMap.globe[0].viewControl.distance = 100;
                    optionMap.globe[0].viewControl.autoRotate = false;
                    e_map.setOption(optionMap);
                } else {
                    if (optionMap.globe[0].viewControl.distance != 100) {
                        optionMap.globe[0].viewControl.distance = 200;
                        optionMap.globe[0].viewControl.autoRotate = true;
                        e_map.setOption(optionMap);
                    }
                }

            } else {
                $.fn.threeMap.methods.eventTrigger(e_map);
            }
        },
        eventMap: function (chinaChart, nathionalChart) {
            var optionChina = chinaChart.getOption();
            var optionNational = nathionalChart.getOption();

            if (optionNational.globe[0].viewControl.autoRotateSpeed == 5) {
                // 颜色渲染
                /*if (optionChina.visualMap[0].inRange.color.length == 4) {
                    optionChina.visualMap[0] = {
                        left: 'right',
                        min: 500,
                        max: 5000,
                        inRange: {
                            color: ['#74B7E0', '#74B7E0', '#74B7E0']
                        },
                        text: ['High', 'Low'],           // 文本，默认为数值文本
                        calculable: true
                    }
                    // chinaChart.setOption(optionChina)
                }*/
                // 缩放功能
                //optionNational.globe[0].viewControl.distance = 200;
                // option.globe[0].viewControl.autoRotate = true;
                // 控制速度达到效果
                optionNational.globe[0].viewControl.autoRotateSpeed = 0;
                nathionalChart.setOption(optionNational);
            }else {
                // 控制速度达到效果

                optionNational.globe[0].viewControl.targetCoord = null;
                optionNational.globe[0].viewControl.autoRotateSpeed = 5;
                nathionalChart.setOption(optionNational);
            }
        }
    }
})(jQuery);