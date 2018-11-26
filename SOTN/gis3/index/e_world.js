/**
 * Created by wang.ning on 2018/11/26.
 */
$(function () {

    //处理数据:
    //处理各世界点
    var data = [];
    var cityfeatures = worldCity.features;
    $.each(cityfeatures,function(index,cityCfg){
        if (cityCfg.properties && cityCfg.properties.NAME && cityCfg.geometry && cityCfg.geometry.coordinates) {
            var cityTmp = {
                name: cityCfg.properties.NAME,
                value: cityCfg.geometry.coordinates
            }
            data.push(cityTmp)
        }
    });
    //处理线
    var links = [];
    var isAnimation = false;
    var linefeatures = worldLines.features;
    $.each(linefeatures,function (index,linkCfg) {
        //console.error('color',linkCfg.color);
        var link = {
            tooltip: {
                formatter: linkCfg.properties.NAME + linkCfg.properties.TYPE // '12345' // linkCfg.name // '{b}<br/>{c}'
            },
            type: 'lines',
            name: linkCfg.properties.NAME,
            link_type: linkCfg.properties.TYPE,
            shape_line: linkCfg.properties.SHAPE_LEN,
            coordinateSystem: 'geo',
            data: [{coords: linkCfg.geometry.coordinates}],
            polyline: true,
            // silent: true,
            lineStyle: {
                normal: {
                    color: linkCfg.color,
                    width: 2.5 // ,
                    // opacity: 0.6
                }
            },
            itemStyle: {
                emphasis: {
                    width: 5,
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
            // progressiveThreshold: 500,
            // progressive: 200
        }
        if (linkCfg.geometry.type === 'MultiLineString') {
            var linkdataT = []
            $.each(linkCfg.geometry.coordinates,function (index,linkCfgCoor) {
                var corrdT = {coords: linkCfgCoor};
                linkdataT.push(corrdT)
            });
            link.data = linkdataT
        }
        links.push(link);
        if (isAnimation) {
            var link1 = {
                tooltip: {
                    formatter: linkCfg.name // '{b}<br/>{c}'
                },
                type: 'lines',
                coordinateSystem: 'geo',
                data: linkCfg.lines,
                polyline: true,
                lineStyle: {
                    normal: {
                        color: '#fff',
                        width: 0
                    }
                },
                effect: {
                    constantSpeed: 20,
                    show: true,
                    // trailLength: 0.1,
                    symbolSize: 1.5
                },
                zlevel: 1,
                progressiveThreshold: 500,
                progressive: 200
            }
            links.push(link1)
        }
    });
    var categoryA = {
        name: 'categoryA',
        type: 'map',
        geoIndex: 0,
        tooltip: {show: false},
        data: [
        ]
    };
    var pointSer = {
        tooltip: {
            formatter: '{b}'
        },
        type: 'scatter',
        coordinateSystem: 'geo',
        data: data,
        symbol: 'circle',
        hoverAnimation: true,
        zlevel: 20,
        symbolSize: 4,
        symbolRotate: 0,
        label: {
            normal: {
                formatter: '{b}', // '{b}',
                position: 'center',
                color: '#000',
                fontWeight: 'bold',
                show: true
            },
            emphasis: {
                show: true
            }
        }
    };
    var series = [pointSer, categoryA].concat(links);

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
        var e_map = echarts.init(document.getElementById("g_map"));
        var options = {
            geo:{
                map:'world',
                silent:false,
                roam: true,
                zoom: 1.2,
                center: [160, 20],
                regions:[{
                    name:'中华人民共和国',
                    selected:true,
                    label:{
                        show:false
                    }
                }],
                itemStyle: {
                    normal: {
                        color: ' #ABC7EF',
                        borderWidth: 1,
                        borderColor: '#ABC7EF'
                    },
                    emphasis: {
                        areaColor: '#3F7FDB',
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        shadowBlur: 20,
                        borderWidth: 0,
                        //shadowColor: '#ffc7eb'
                    }
                },
                emphasis:{
                    label:{
                        show:false
                    }
                },
                data: [{name: '中华人民共和国', selected: true}],
            },
            series: series
        }
        e_map.setOption(options);
    });
});