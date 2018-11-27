(function ($) {
    $.fn.threeMap = function () {
        // 更改可视窗口的高度
        var height = $.fn.GeoUtils.methods.getHeight();
        console.log(height)
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
                $.fn.GeoUtils.methods.getResize(chinaChart);
                $.fn.GeoUtils.methods.getResize(e_map);
                // 更改可视窗口的高度
                var height = $.fn.GeoUtils.methods.getHeight();
                console.log(height)
                $('#g_map').css('height', height);
                var height2 =  $('#g_map').css('height');
                console.log(height2)
            }
            // 点击事件
            // $('.province').click($.fn.threeMap.methods.eventTrigger(e_map));
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
                            borderColor: 'red'
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
            $.get('geoData.json', function (data) {
                option['visualMap'] = {
                    left: 'right',
                    min: 500000,
                    max: 38000000,
                    inRange: {
                        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
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
                    roam: true,
                    //silent:true,//图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
                    boundingCoords: [[-180, 90], [180, -90]],
                    itemStyle: {
                        normal: {
                            areaColor: "rgba(0,0,152,0.5)"
                            //areaColor:'red'
                        },
                        emphasis: { label: { show: true } }
                    },


                    emphasis: {
                        itemStyle: {
                            color: 'blue'
                        }
                    },
                    data: data.region
                })
                option.series = series;
                chinaChart.setOption(option);
            })
        },
        //渲染国际数据
        renderNationalData: function (nathionalChart) {
            var option = nathionalChart.getOption();
            var series = [];
            $.get('geoData.json', function (data) {
                series.push(
                    {
                        type: 'lines3D',
                        name: 'lines3D',
                        lineStyle: {
                            width: 1,
                            color: 'red',
                            opacity: 0.8
                        },
                        data: data.lines
                    }, {
                        type: 'scatter3D',
                        name: 'scatter3D',
                        coordinateSystem: 'globe',
                        symbol: 'circle',
                        symbolSize: '5',
                        itemStyle: {
                            color: 'blue',
                            opacity: 0.9
                        },
                        data: data.spots
                    }, {
                        type: 'lines3D',
                        name: '王宁测试',
                        effect: {
                            show: true,
                            trailWidth: 3,
                            trailLength: 0.15,
                            trailOpacity: 1,
                            // trailColor: 'rgb(30, 30, 60)'
                            trailColor: 'red'
                        },

                        lineStyle: {
                            width: 1,
                            //color: 'rgb(50, 50, 150)',
                            color: 'rgb(118, 233, 241)',
                            opacity: 0.1
                        },
                        blendMode: 'lighter',

                        data: [[[116.4136103013, 39.9110666857], [132.5390625000, -25.6415263731]], [[116.4136103013, 39.9110666857], [-0.368333, 51.874722]]]
                    }
                )
                option.series = series;
                nathionalChart.setOption(option)
            });

        },
        eventTrigger: function (nathionalChart) {
            alert(1)
            var option = nathionalChart.getOption();

            if (option.globe[0].viewControl.autoRotate) {
                option.globe[0].viewControl.distance = 100;
                option.globe[0].viewControl.autoRotate = false;
            } else {
                option.globe[0].viewControl.distance = 200;
                option.globe[0].viewControl.autoRotate = true;
            }
            nathionalChart.setOption(option);
        }

    }

})(jQuery);