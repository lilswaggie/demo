(function ($) {
    $.fn.WorldModule = function () {
        $.fn.WorldModule.methods.init();
    };

    $.fn.WorldModule.methods = {
        init: function () {
            // 更改可视窗口的高度
            var height = $("body").GeoUtils('getHeight');
            $('#g_map').css('height', height);
            $.get('../../geodata/world.json', function (mapJson) {
                var data = [];
                $.each(mapJson.features, function (index, item) {
                    var row = {};
                    //row.name = item.properties.NAME;
                    //row.lon = item.CP[0];
                    //row.lat = item.CP[1];
                    //data.push(row);
                    data.push("1");
                });
                echarts.registerMap('world', mapJson);
                var e_map = echarts.init(document.getElementById("g_map"));

                var pointSer = $.fn.WorldModule.methods.getSiteSer();


                var links = $.fn.WorldModule.methods.getLinkSers();
                var categoryA = {
                    name: 'categoryA',
                    type: 'map',
                    geoIndex: 0,
                    tooltip: { show: false },
                    data: [
                    ]
                }

                //var series = [pointSer, categoryA].concat(links);
                var series = [categoryA].concat(links);

                //  画出国内的点
                series.push(pointSer);
                console.error('pointer', pointSer);
                //  画出国内的线
                var chinaLinks = $.fn.WorldModule.methods.getChinaLinks();
                var newseries = series.concat(chinaLinks);


                e_map.setOption({
                    tooltip: {},
                    geo: $.fn.WorldModule.methods.getGeo(),
                    series: newseries
                });

                $.fn.WorldModule.methods.getPorts(e_map);
                // echarts自适应调整
                window.onresize = function () {
                    var height = $("body").GeoUtils('getHeight');
                    $('#g_map').css('height', height);
                    $("body").GeoUtils('getResize', e_map);
                };
                // 地图点击事件
                $("#g_map").click(function () {
                    $.fn.WorldModule.methods.eventMap(e_map);
                })
            });
        },
        getGeo: function () {
            var geo = $("body").GeoUtils('getWorldMapInstance');
            geo.emphasis = null;
            geo.itemStyle = {
                normal: {
                    color: '#1B2769',
                    borderWidth: 1,
                    borderColor: '#1B2769'
                },
                emphasis: {
                    areaColor: '#2866C7',
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    // shadowBlur: 20,
                    borderWidth: 0,
                    shadowColor: '#2866C7'
                }
            };
            geo.regions = [
                {
                    name: '中华人民共和国',
                    selected: true,
                    emphasis: {
                        label: {
                            show: false,
                            color: "#72758C"

                        }
                    }
                }, {
                    name: '瑞典',
                    label: {
                        show: true,
                        color: "#72758C"

                    }
                }, {
                    name: '尼日尔',
                    label: {

                        show: true,
                        color: "#72758C"

                    }
                }, {
                    name: '俄罗斯',
                    label: {

                        show: true,
                        color: "#72758C"

                    }
                }, {
                    name: '加拿大',
                    label: {
                        show: true,
                        color: "#72758C"
                    }
                }, {
                    name: '印度尼西亚',
                    label: {
                        show: true,
                        color: "#72758C"

                    }
                }, {
                    name: '巴西',
                    label: {

                        show: true,
                        color: "#72758C"
                    }
                }, {
                    name: '墨西哥',
                    label: {
                        show: true,
                        color: "#72758C"

                    }
                }, {
                    name: '苏丹',
                    label: {
                        show: true,
                        color: "#72758C"

                    }
                }, {
                    name: '澳大利亚',
                    label: {
                        show: true,
                        color: "#72758C"

                    }
                }, {
                    name: '伊朗',
                    label: {
                        show: true,
                        color: "#72758C"

                    }
                }, {
                    name: '扎伊尔',
                    label: {

                        show: true,
                        color: "#72758C"

                    }
                }
            ];
            return geo;
        },
        getSiteSer: function () {
            var sitedata = []

            var sitefeatures = siteJson.features;
            $.each(sitefeatures, function (index, siteCfg) {
                if (siteCfg.properties && siteCfg.properties.NAME && siteCfg.geometry && siteCfg.geometry.coordinates) {
                    var cityTmp = {
                        name: siteCfg.properties.NAME,
                        value: siteCfg.geometry.coordinates,
                        PROPERTY: siteCfg.properties.PROPERTY,
                        county: siteCfg.properties.PROVINCE
                    }
                    sitedata.push(cityTmp);
                }
            });
            var pointSer = $("body").GeoUtils('getScatter', 'circle');
            pointSer.tooltip = { formatter: '{b}' };
            pointSer.color = null;
            pointSer.data = sitedata;
            pointSer.hoverAnimation = true;
            pointSer.symbolSize = 4;
            pointSer.label = {
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
                    color: function (params) {
                        return $.fn.WorldModule.methods.getSiteColor(params.data)
                    }
                }
            };
            return pointSer;
        },
        getChinaLinks: function () {
            var links = [];
            var isAnimation = false;
            var linefeatures = worldLines.chinaFeatures;
            // 创建正则表达式
            var reg = /(海缆)|(陆缆)$/;
            //// + linkCfg.properties.TYPE // '12345' // linkCfg.name // '{b}<br/>{c}'
            $.each(linefeatures, function (index, linkCfg) {
                var link = {
                    tooltip: {
                        textStyle: {
                            color: '#3C3E4AFF',
                        },
                        backgroundColor: '#FFFFFFFF',
                        extraCssText: 'box-shadow: 0px 2px 4px 0px #00000033',
                        formatter: '<span style="font-size: 16px;font-weight: bold;padding:5px;height:28px;line-height: 28px;"><span style="display: inline-block;width:6px;height:6px;background:rgba(246,178,81,1);margin-right:5px;"></span>'+linkCfg.properties.NAME+'</span>' + '<span style="display: block;padding:5px;font-size: 14px;font-weight: bold;">端点：<span style="color:#2C9CFA;">'+linkCfg.properties.A_NAME+'</span>—<span  style="color:#2C9CFA;">'+linkCfg.properties.Z_NAME+ '</span></span><span style="display: block;line-height: 28px;padding:5px;font-size: 14px;font-weight: bold;">使用状态：<span style="color:#2C9CFA;">' + linkCfg.properties.TYPE.replace(reg,'')+'</span></span>',
                        /* formatter: `<div style={backgroundColor:'red'}><span style={width:'20px',height:'20px',backgroundColor:'red'}></span>${linkCfg.properties.NAME}</div>
                        <br/>端点：<em style={color: 'blue'}>${linkCfg.properties.A_NAME}-${linkCfg.properties.Z_NAME}</em>
                        <br/>使用状态：${linkCfg.properties.TYPE.replace(reg,'')}` */

                    },
                    type: 'lines',
                    name: linkCfg.properties.NAME,
                    link_type: linkCfg.properties.TYPE,
                    shape_line: linkCfg.properties.SHAPE_LEN,
                    coordinateSystem: 'geo',
                    data: [{ coords: linkCfg.geometry.coordinates }],
                    polyline: true,
                    // silent: true
                    lineStyle: {
                        normal: {
                            // 线条颜色的设置
                            color: '#fff', // '#000', // linkCfg.color,
                            width: 2.5,
                            opacity: 0.9

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
                    $.each(linkCfg.geometry.coordinates, function (index, linkCfgCoor) {
                        var corrdT = { coords: linkCfgCoor }
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
        getLinkSers: function () {
            var links = [];
            var isAnimation = false;
            var linefeatures = worldLines.features;
            // 创建正则表达式
            var reg = /(海缆)|(陆缆)$/;
            //// + linkCfg.properties.TYPE // '12345' // linkCfg.name // '{b}<br/>{c}'
            $.each(linefeatures, function (index, linkCfg) {
                var link = {
                    tooltip: {
                        textStyle: {
                            color: '#3C3E4AFF',
                        },
                        backgroundColor: '#FFFFFFFF',
                        extraCssText: 'box-shadow: 0px 2px 4px 0px #00000033',
                        formatter: '<span style="font-size: 16px;font-weight: bold;padding:5px;height:28px;line-height: 28px;"><span style="display: inline-block;width:6px;height:6px;background:rgba(246,178,81,1);margin-right:5px;"></span>'+linkCfg.properties.NAME+'</span>' + '<span style="display: block;padding:5px;font-size: 14px;font-weight: bold;">端点：<span style="color:#2C9CFA;">'+linkCfg.properties.A_NAME+'</span>—<span  style="color:#2C9CFA;">'+linkCfg.properties.Z_NAME+ '</span></span><span style="display: block;line-height: 28px;padding:5px;font-size: 14px;font-weight: bold;">使用状态：<span style="color:#2C9CFA;">' + linkCfg.properties.TYPE.replace(reg,'')+'</span></span>',
                        /* formatter: `<div style={backgroundColor:'red'}><span style={width:'20px',height:'20px',backgroundColor:'red'}></span>${linkCfg.properties.NAME}</div>
                        <br/>端点：<em style={color: 'blue'}>${linkCfg.properties.A_NAME}-${linkCfg.properties.Z_NAME}</em>
                        <br/>使用状态：${linkCfg.properties.TYPE.replace(reg,'')}` */
                        
                    },
                    type: 'lines',
                    name: linkCfg.properties.NAME,
                    link_type: linkCfg.properties.TYPE,
                    shape_line: linkCfg.properties.SHAPE_LEN,
                    coordinateSystem: 'geo',
                    data: [{ coords: linkCfg.geometry.coordinates }],
                    polyline: true,
                    // silent: true
                    lineStyle: {
                        normal: {
                            // 线条颜色的设置
                            color: $.fn.WorldModule.methods.getLinkColor(linkCfg), // '#000', // linkCfg.color,
                            width: 2.5,
                            opacity: 0.9

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
                    $.each(linkCfg.geometry.coordinates, function (index, linkCfgCoor) {
                        var corrdT = { coords: linkCfgCoor }
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
        getLinkColor: function (linkCfg) {
            var linkcolor;
            var lineColorJson = $.fn.WorldModule.methods.lineColorJson;
            $.each(lineColorJson.colors, function (index, colorItem) {
                if (colorItem.TYPE === linkCfg.properties.TYPE)
                    linkcolor = colorItem;
            });
            $.each(lineColorJson.built, function (index, colorItem) {
                if (colorItem.NAME === linkCfg.properties.NAME)
                    linkcolor = colorItem;
            });
            if (linkcolor instanceof Array && linkcolor.length) {
                linkcolor = linkcolor[0].COLOR;
            } else if (linkcolor && linkcolor.COLOR) {
                linkcolor = linkcolor.COLOR;
            } else {
                console.log('colorr', linkCfg.properties.NAME + '===' + linkCfg.properties.TYPE)
                linkcolor = '#05FF00';
            }
            return linkcolor;
        },
        getSiteColor: function (ponitData) {
            var lineColorJson = $.fn.WorldModule.methods.lineColorJson;
            var pointColor = lineColorJson.pointcolors.DEFAULT
            var pcolor;
            $.each(lineColorJson.pointcolors.CUSTOMER, function (index, colorItem) {
                if (colorItem.TYPE === ponitData.PROPERTY) {
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
        getPorts: function (e_map) {
            var option = e_map.getOption();
            var url = '../../geodata/S3_POINT_DATA.json';
            $.get(url, function (data) {
                if (data && data.features) {
                    var dataPorts = [];
                    data.features.forEach(function (ele, index) {
                        var temp = {
                            value: ele.geometry.coordinates
                        };
                        dataPorts.push(temp);
                    });
                    var series = [{
                        type: 'scatter',
                        name: 'scatterPort',
                        coordinateSystem: 'geo',
                        symbol: 'circle',
                        symbolSize: 2,
                        itemStyle: {
                            color: '#2AC4F4'
                        },
                        data: dataPorts
                    }];
                    option.series = series.concat(option.series);
                    e_map.setOption(option);
                }
            });
        },
        lineColorJson: {
            "colors": [
                {
                    "TYPE": "在建海缆",
                    "COLOR": "#979797"
                    // "COLOR":"#BE2DDC"
                    // "COLOR":"#4285F4"
                }, {
                    "TYPE": "租用海缆",
                    "COLOR": "#F84848"

                    // "COLOR":"#A752F2"
                }, {
                    "TYPE": "租用陆缆",
                    "COLOR": "#F8FF67"
                }

            ],
            "pointcolors": {
                "DEFAULT": "#FC5555",
                "CUSTOMER": [
                    {
                        "TYPE": "自有",
                        "COLOR": "#FC9222"
                    }
                ]
            },
            "built": [
                {
                    "NAME": "APG",
                    "COLOR": "#3FF658"
                },{
                    "NAME": "FASTER",
                    "COLOR": "#BE2DDC"
                },{
                    "NAME": "SJC",
                    "COLOR": "#72FAEF"
                },{
                    "NAME": "SWM5",
                    "COLOR": "#2AC4F4"
                },{
                    "NAME": "福淡海缆",
                    "COLOR": "#855512"
                },{
                    "NAME": "厦金海缆",
                    "COLOR": "#F6B251"
                }
            ]
        },
        eventMap: function (e_map) {
            var option = e_map.getOption();
            console.log(option);
            if (option.geo[0].center != [160, 20] || option.geo[0].zoom != 1.2) {
                option.geo[0].center = [160, 20];
                option.geo[0].zoom = 1.2;
                e_map.setOption(option);
            }
        }
    };
})(jQuery);