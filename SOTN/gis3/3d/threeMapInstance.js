(function($){
    $.fn.threeMap = function(){
        $.fn.threeMap.methods.init();
    }
    $.fn.threeMap.methods = {
        init:function(){
            var e_map = echarts.init(document.getElementById("g_map"));
            var chinaChart = $.fn.threeMap.methods.getChinaChart();
            var option = $("body").GeoUtils('get3dMapInstance',{chinaChart:chinaChart});
            e_map.setOption(option);
        },
        //获取中国地图贴图
        getChinaChart:function(){
            var canvas = document.createElement('canvas');
            var mapChart = echarts.init(canvas, null, {
                width: 4096, height: 2048
            });
            mapChart.setOption({
                series : [
                    {
                        type: 'map',
                        map: 'china',
                        top: 0, left: 0,
                        right: 0, bottom: 0,
                        silent:false,
                        boundingCoords: [[-180, 90], [180, -90]],
                        itemStyle:{
                            normal:{
                                areaColor:"rgba(0,0,152,0.5)",
                                borderColor:'red'
                            }},
                        emphasis:{
                            itemStyle:{
                                color:'blue'
                            }
                        },
                        data:[
                            {
                                name:'山东',
                                value:999,
                                selected:true,
                                itemStyle:{
                                    areaColor:'blue'
                                }
                            }
                        ]
                    }
                ]
            });
            return mapChart;
        },
        renderData:function(){},
        //渲染中国数据
        renderChinaData:function(){},
        //渲染国际数据
        renderNationalData:function(){}

    }

})(jQuery);