(function($){
    $.fn.WorldModule = function(){
        $.fn.WorldModule.methods.init();
    };

    $.fn.WorldModule.methods = {
        init:function () {
            // 更改可视窗口的高度
            var height = $("body").GeoUtils('getHeight');
            $('#g_map').css('height', height);
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
                var pointSer = $.fn.WorldModule.methods.getSiteSer()
                var links = $.fn.WorldModule.methods.getLinkSers();
                var categoryA = {
                    name: 'categoryA',
                    type: 'map',
                    geoIndex: 0,
                    tooltip: {show: false},
                    data: [
                    ]
                }

                var series = [pointSer, categoryA].concat(links);

                e_map.setOption({
                    tooltip: {},
                    geo: $.fn.WorldModule.methods.getGeo(),
                    series: series
                });

                // echarts自适应调整
                window.onresize = function () {
                    var height = $("body").GeoUtils('getHeight');
                    $('#g_map').css('height', height);
                    $("body").GeoUtils('getResize',e_map);
                };
            });
        },
        getGeo: function(){
            var geo = $("body").GeoUtils('getWorldMapInstance');
            geo.emphasis = null;
            geo.itemStyle = {
                normal: {
                    color: '#ABC7EF',
                    borderWidth: 1,
                    borderColor: '#ABC7EF'
                },
                emphasis: {
                    areaColor: '#3F7FDB',
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 20,
                    borderWidth: 0,
                    shadowColor: '#fff'
                }
            };
            geo.regions = [
                {
                    name:'中华人民共和国',
                    selected:true,
                    emphasis: {
                        label: {
                            show: false
                        }
                    }
                },{
                    name: '瑞典',
                    label: {
                        show: true
                    }
                },{
                    name: '尼日尔',
                    label:{
                        show: true
                    }
                },{
                    name: '俄罗斯',
                    label: {
                        show: true
                    }
                },{
                    name: '加拿大',
                    label: {
                        show: true
                    }
                },{
                    name: '印度尼西亚',
                    label: {
                        show: true
                    }
                },{
                    name: '巴西',
                    label: {
                        show: true
                    }
                },{
                    name: '墨西哥',
                    label: {
                        show: true
                    }
                },{
                    name: '苏丹',
                    label: {
                        show: true
                    }
                },{
                    name: '澳大利亚',
                    label: {
                        show: true
                    }
                },{
                    name: '伊朗',
                    label: {
                        show: true
                    }
                },{
                    name: '扎伊尔',
                    label: {
                        show: true
                    }
                }
            ];
            return geo;
        },
        getSiteSer: function () {
            var sitedata = []

            var sitefeatures = siteJson.features;
            $.each(sitefeatures,function(index,siteCfg){
                if (siteCfg.properties && siteCfg.properties.NAME && siteCfg.geometry && siteCfg.geometry.coordinates) {
                    var cityTmp = {
                        name: siteCfg.properties.NAME,
                        value: siteCfg.geometry.coordinates,
                        PROPERTY: siteCfg.properties.PROPERTY,
                        county:siteCfg.properties.PROVINCE
                    }
                    sitedata.push(cityTmp);
                }
            });
            var pointSer = $("body").GeoUtils('getScatter','circle');
            pointSer.tooltip = {formatter: '{b}'};
            pointSer.color = null;
            pointSer.data = sitedata;
            pointSer.hoverAnimation = true;
            pointSer.symbolSize = 4;
            pointSer.label= {
                // normal: {
                //   formatter: '{b}', // '{b}',
                //   position: 'center',
                //   color: '#000',
                //   // fontWeight: 'bold',
                //   show: true
                // },
                // emphasis: {
                //   show: true
                // }
            };
            pointSer.itemStyle = {
                normal: {
                    // shadowBlur: 5,
                    // shadowColor: function (params) {
                    //     return $.fn.WorldModule.methods.getSiteColor(params.data)
                    // },
                    // shadowOffsetY: 5,
                    color: function (params) {
                        return $.fn.WorldModule.methods.getSiteColor(params.data)
                    }
                }
            };
            // var pointSer = {
            //     tooltip: {
            //         formatter: '{b}'
            //     },
            //     type: 'scatter',
            //     coordinateSystem: 'geo',
            //     data: sitedata,
            //     symbol: 'circle',
            //     hoverAnimation: true,
            //     zlevel: 20,
            //     symbolSize: 4,
            //     symbolRotate: 0,
            //     label: {
            //         // normal: {
            //         //   formatter: '{b}', // '{b}',
            //         //   position: 'center',
            //         //   color: '#000',
            //         //   // fontWeight: 'bold',
            //         //   show: true
            //         // },
            //         // emphasis: {
            //         //   show: true
            //         // }
            //     },
            //     itemStyle: {
            //         normal: {
            //             shadowBlur: 5,
            //             shadowColor: function (params) {
            //                 return $.fn.WorldModule.methods.getSiteColor(params.data)
            //             },
            //             shadowOffsetY: 5,
            //             color: function (params) {
            //                 return $.fn.WorldModule.methods.getSiteColor(params.data)
            //             }
            //         }
            //     }
            // }
            return pointSer;
        },
        getLinkSers:function () {
            var links = [];
            var isAnimation = false;
            var linefeatures = worldLines.features;

            $.each(linefeatures,function(index,linkCfg){
                var link = {
                    tooltip: {
                        formatter: linkCfg.properties.NAME // + linkCfg.properties.TYPE // '12345' // linkCfg.name // '{b}<br/>{c}'
                    },
                    type: 'lines',
                    name: linkCfg.properties.NAME,
                    link_type: linkCfg.properties.TYPE,
                    shape_line: linkCfg.properties.SHAPE_LEN,
                    coordinateSystem: 'geo',
                    data: [{coords: linkCfg.geometry.coordinates}],
                    polyline: true,
                    // silent: true
                    lineStyle: {
                        normal: {
                            // 线条颜色的设置
                            color: $.fn.WorldModule.methods.getLinkColor(linkCfg), // '#000', // linkCfg.color,
                            width: 2.5 // ,
                            // opacity: 0.6
                        },
                        emphasis: {
                            width: 5,
                            shadowBlur: 200,
                            shadowColor: $.fn.WorldModule.methods.getLinkColor(linkCfg)
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
                    var linkdataT = [];
                    $.each(linkCfg.geometry.coordinates,function(index,linkCfgCoor){
                        var corrdT = {coords: linkCfgCoor}
                        linkdataT.push(corrdT);
                    });

                    link.data = linkdataT
                }
                links.push(link)
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
                    links.push(link1);
                }
            });
            return links;
        },
        getLinkColor:function (linkCfg) {
            var linkcolor ;
            var lineColorJson = $.fn.WorldModule.methods.lineColorJson;
            $.each(lineColorJson.colors,function(index,colorItem){
                if( colorItem.TYPE === linkCfg.properties.TYPE)
                    linkcolor = colorItem;
            });
            if (linkcolor instanceof Array && linkcolor.length) {
                linkcolor = linkcolor[0].COLOR;
            } else if (linkcolor && linkcolor.COLOR) {
                linkcolor = linkcolor.COLOR;
            } else {
                linkcolor = '#F8FF67';
            }
            return linkcolor;
        },
        getSiteColor:function (ponitData) {
            var lineColorJson = $.fn.WorldModule.methods.lineColorJson;
            var pointColor = lineColorJson.pointcolors.DEFAULT
            var pcolor;
            $.each(lineColorJson.pointcolors.CUSTOMER,function(index,colorItem){
                if(colorItem.TYPE === ponitData.PROPERTY){
                    pcolor = colorItem;
                }
            });
            if (pcolor instanceof Array && pcolor.length) {
                pointColor = pcolor[0].COLOR;
            } else if (pcolor && pcolor.COLOR) {
                pointColor = pcolor.COLOR;
            }
            // console.log(pointColor)
            return pointColor;
        },
        lineColorJson: {
            "colors":[
                {
                    "TYPE":"自有海缆",
                    "COLOR":"#BE2DDC"
                    // "COLOR":"#4285F4"
                },{
                    "TYPE":"租用海缆",
                    "COLOR":"#F35B5B"
                    // "COLOR":"#A752F2"
                },{
                    "TYPE":"自有陆缆",
                    "COLOR":"#E8FF00"
                },{
                    "TYPE":"租有陆缆",
                    "COLOR":"#E8FF00"
                }

            ],
            "pointcolors":{
                "DEFAULT":"#FC5555",
                "CUSTOMER":[
                    {
                        "TYPE":"自有",
                        "COLOR":"#FC9222"
                    }
                ]
            }
        }
    };
})(jQuery);