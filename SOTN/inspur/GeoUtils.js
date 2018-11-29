/**
 * Created by wang.ning on 2018/11/2.
 */
(function ($) {
    $.fn.GeoUtils = function(options,param){
        if(typeof options == 'string') return $.fn.GeoUtils.methods[options](param);
    }
    $.fn.GeoUtils.methods = {
        // chart自适应
        getResize: function(chart){
            chart.resize();
        },
        // 获取高度
        getHeight:function () {
            var height =   $(window).height();
            return height + 'px';
        },
        /**
         * 获取3d地球实例
         * @param param {chinaChart:''}
         * @returns {{globe: {show: boolean, viewControl: {targetCoord: [number,number], autoRotateSpeed: number, distance: number, autoRotate: boolean}, baseTexture: string, displacementScale: number, shading: string, environment: string, postEffect: {enable: boolean}, layers: [*]}, series: Array}}
         */

        get3dMapInstance:function(param){
            var geo = {
                backgroundColor: '#000',
                globe: {
                    /*  viewControl:{
                     rotateSensitivity:0, //鼠标旋转灵敏度
                     zoomSensitivity:0,//鼠标缩放灵敏度
                     autoRotate:true,//地球是否自传
                     autoRotateAfterStill:0.001,//鼠标停止后多久恢复旋转(为0时暂停后不恢复旋转)
                     //alpha:160,//视角绕 x 轴，即上下旋转的角度
                     //beta:-20,//视角绕 y 轴，即左右旋转的角度。
                     targetCoord: [116.46, 39.92]//定位到哪里
                     },*/
                    //baseColor:'#fff',
                    show:true,
                    viewControl:{
                        targetCoord: [109.1162, 34.2004],
                        autoRotateSpeed: 5,
                        distance: 200,
                        autoRotate: true
                    },
                    baseTexture: 'http://localhost:63342/SOTN/images/lizi.png',
                    displacementScale: 0.1,
                    shading: 'color',
                    environment:'transparent',
                    // 地球背景星图设置 http://localhost:63342/SOTN/images/background.png
                    //environment: 'auto',
                    //environment: 'asset/starfield.jpg',
                    //environment: '#000',
                    /*environment: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0, color: '#00aaff' // 天空颜色
                    }, {
                        offset: 0.7, color: '#998866' // 地面颜色
                    }, {
                        offset: 1, color: '#998866' // 地面颜色
                    }], false),*/
                    postEffect:{
                        enable:true,
                    },

                    layers: [
                        /*{
                         type: 'overlay',
                         blendTo: 'emission',
                         texture:param.chinaChart
                         //texture: 'http://localhost:63342/SOTN/images/earth.jpg'
                         }*/
                        {
                            type: 'overlay',
                            blendTo: 'emission',
                            texture:param.chinaChart
                            //texture: 'http://localhost:63342/SOTN/images/earth.jpg'
                        },
                        {
                         type: 'blend',
                         blendTo: 'emission',
                         texture: 'http://localhost:63342/SOTN/images/night.jpg'
                         }],
                },
                series:[]
            }
            return geo;
        },
        //获取中国map实例
        getChinaMapInstance:function(){
            var geo = {
                map:'china',
                itemStyle:{
                    borderColor:'#4DA7F5',
                    borderWidth:5,
                    areaColor:'#F9FBFF'
                },
                emphasis:{
                    itemStyle:{
                        areaColor:'#F9FBFF'
                    }
                },
                //regions:$("body").GeoUtils('getChinaRegions')
            }
            return geo;
        },
        getWorldMapInstance:function(){
            var geo = {
                map:'world',
                silent:false,
                roam: false,
                show:true,
                zoom: 1.2,
                center: [160, 20],
                itemStyle: {
                    color: '#F5F5F5',
                    borderWidth: 1,
                    borderColor: '#CCC4B9'
                },
                emphasis: {
                    label:{
                        show:true
                    },
                    itemStyle:{
                        areaColor: '#E4EFFF',
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        shadowBlur: 20,
                        borderWidth: 1,
                        borderColor:'#63B6F6',
                        shadowColor: '#F5F5F5'
                    }
                },
                regions:$.fn.GeoUtils.default.echartRegionsContry
                //data: [{name: '中华人民共和国', selected: true}],
            }
            return geo;
        },
        /**
         *
         * @param param {symbol:''}
         * @returns {{name: string, type: string, color: string, coordinateSystem: string, label: {normal: {show: boolean, position: string, formatter: string}}, symbol: string, symbolSize: symbolSize, itemStyle: {normal: {color: string}}, data: Array}}
         */
        getScatter:function(param){
            var es = {
                name:'devices',
                type:'scatter',
                color: 'blue',
                coordinateSystem: 'geo',
                label: {
                    normal: {
                        show: false,
                        position: 'right',
                        formatter: '{b}'
                    }
                },
                //'image://http://localhost:63342/SOTN/images/OTN_N_B.png'
                symbol:param.symbol ,
                symbolSize: function (val) {
                    return val[2] / 4;
                },
                itemStyle: {
                    normal: {
                        color: '#4D8CF4'
                    }
                },
                data:[]
            };
            return es
        },
        /* networkDefault */
        getEffectScatter:function () {
            var es = {
                type:'effectScatter',
                coordinateSystem:'geo',
                rippleEffect: {
                    brushType: 'stroke'
                },
                label: {
                    normal: {
                        show: false,
                        position: 'center',
                        formatter: '{b}'
                    }
                },
                symbolSize: function (val) {
                    return val[2] / 8;
                },
                itemStyle: {
                    normal: {
                        color: 'blue'
                    }
                },
                data:[]
            };
            return es;
        },
        getEffectScatters:function(){
            var es = {
                type:'effectScatter',
                coordinateSystem:'geo',
                rippleEffect: {
                    brushType: 'stroke'
                },
                label: {
                    normal: {
                        show: false,
                        position: 'center',
                        formatter: '{b}'
                    }
                },
                symbolSize: function (val) {
                    return val[2] / 8;
                },
                itemStyle: {
                    normal: {
                        color: '#FDC400'
                    }
                },
                data:[]
            };
            return es;
        },
        /* networkDefault */
        getLine:function(){
            var lines = {
                type: 'lines',
                symbol: ['none'],
                symbolSize: 10,
                lineStyle: {
                    normal: {
                        color: Global.mapGlobal.echartsConfig.lineColor.normal,
                        width: Global.mapGlobal.echartsConfig.lineWidth,
                        curveness: Global.mapGlobal.echartsConfig.lineCurveness
                    }
                },
                emphasis:{
                    lineStyle:{
                        color:Global.mapGlobal.echartsConfig.lineColor.light,
                        width:Global.mapGlobal.echartsConfig.lineWidth,
                        type:'solid'
                    },
                    label:{
                        position:'middle',
                        show:false,
                        formatter:'测试',
                        color:Global.mapGlobal.echartsConfig.lineColor.light
                    }
                },
                label:{
                    show:true,
                    position:'middle',
                },
                data:[]
            }
            return lines;
        },
        getLines:function(){
            var lines = {
                type: 'lines',
                symbol: ['none'],
                symbolSize: 10,
                // effect: {
                //         show: true,
                //         period: 6,
                //         trailLength: 0,
                //         symbol: Global.mapGlobal.echartsConfig.effectSymbol.planePath,
                //         symbolSize: 15
                // },
                lineStyle: {
                    normal: {
                        color: Global.mapGlobal.echartsConfig.lineColor.normal,
                        width: Global.mapGlobal.echartsConfig.lineWidth,
                        curveness: Global.mapGlobal.echartsConfig.lineCurveness
                    }
                },
                emphasis:{
                    lineStyle:{
                        color:Global.mapGlobal.echartsConfig.lineColor.light,
                        width:Global.mapGlobal.echartsConfig.lineWidth,
                        type:'solid'
                    },
                    label:{
                        position:'middle',
                        show:false,
                        formatter:'测试',
                        color:Global.mapGlobal.echartsConfig.lineColor.light
                    }
                },
                label:{
                    show:true,
                    position:'middle',
                },
                data:[]
            }
            return lines;
        },
        getLightsLine:function(){
            var lightLine = {
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
                data:[]
            }
            return lightLine;
        },
        getGeoCoordMapDatas:function(){
            return $.fn.GeoUtils.default.geoCoordMap;
        },
        //获取中国省份
        getChinaRegions:function(){
            return   $.fn.GeoUtils.default.echartsRegions;
        },
        convertData:function(data){
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var dataItem = data[i];
                var fromCoord = $("body").GeoUtils('getGeoCoordMapDatas')[dataItem[0].name];
                var toCoord = $("body").GeoUtils('getGeoCoordMapDatas')[dataItem[1].name];
                if (fromCoord && toCoord) {
                    res.push({
                        fromName: dataItem[0].name,
                        toName: dataItem[1].name,
                        coords: [fromCoord, toCoord]
                    });
                }
            }
            return res;
        }
    }
    $.fn.GeoUtils.default = {
        echartRegionsContry:[
            {
                "name": "俄罗斯",
                "selected": false,
                "label": {
                    //color:'#C5C8D4',
                    "show": true
                }
            },
            {
                "name": "北极地区",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "扬马延岛（挪）",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "冰岛",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "法罗群岛（丹）",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "芬兰",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "爱沙尼亚",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            /*{
             "name": "拉脱维亚",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            /*{
             "name": "立陶宛",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "丹麦",
                "selected": false,
                "label": {
                    "show": true
                }
            },
            {
                "name": "白俄罗斯",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "爱尔兰",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "波兰",
                "selected": false,
                "label": {
                    "show": true
                }
            },
            /*{
             "name": "捷克",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "蒙古",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "乌克兰",
                "selected": false,
                "label": {
                    "show": false
                }
            }/*,
             {
             "name": "卢森堡",
             "selected": false,
             "label": {
             "show": true
             }
             }*/,
            {
                "name": "德国",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            /*{
             "name": "斯洛伐克",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            /*{
             "name": "摩尔多瓦",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "匈牙利",
                "selected": false,
                "label": {
                    "show": false
                }
            }/*,
             {
             "name": "奥地利",
             "selected": false,
             "label": {
             "show": true
             }
             }*//*,
             {
             "name": "列支敦士登",
             "selected": false,
             "label": {
             "show": true
             }
             }*//*,
             {
             "name": "斯洛文尼亚",
             "selected": false,
             "label": {
             "show": true
             }
             }*/,
            /*{
             "name": "瑞士",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "法国",
                "selected": false,
                "label": {
                    "show": true
                }
            },
            {
                "name": "罗马尼亚",
                "selected": false,
                "label": {
                    "show": false
                }
            }/*,
             {
             "name": "波斯尼亚",
             "selected": false,
             "label": {
             "show": true
             }
             }*//*,
             {
             "name": "克罗地亚",
             "selected": false,
             "label": {
             "show": true
             }
             }*/,
            {
                "name": "保加利亚",
                "selected": false,
                "label": {
                    "show": false
                }
            }/*,
             {
             "name": "圣马力诺",
             "selected": false,
             "label": {
             "show": true
             }
             }*/,
            /*{
             "name": "摩纳哥",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            /*{
             "name": "吉尔吉斯斯坦",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "安道尔",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            /*{
             "name": "马其顿",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            /*{
             "name": "阿塞拜疆",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            /*{
             "name": "阿尔巴尼亚",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "土库曼斯坦",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "乌兹别克斯坦",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            /*{
             "name": "塔吉克斯坦",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "朝鲜",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "阿尔及利亚",
                "selected": false,
                "label": {
                    "show": false
                }
            }/*,
             {
             "name": "直布罗陀（英占）",
             "selected": false,
             "label": {
             "show": true
             }
             }*/,
            {
                "name": "阿富汗",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "马耳他",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "伊拉克",
                "selected": false,
                "label": {
                    "show": false
                }
            }/*,
             {
             "name": "塞浦路斯",
             "selected": false,
             "label": {
             "show": true
             }
             }*//*,
             {
             "name": "黎巴嫩",
             "selected": false,
             "label": {
             "show": true
             }
             }*/,
            {
                "name": "利比亚",
                "selected": false,
                "label": {
                    "show": true
                }
            }/*,
             {
             "name": "约旦",
             "selected": false,
             "label": {
             "show": true
             }
             }*//*,
             {
             "name": "巴勒斯坦",
             "selected": false,
             "label": {
             "show": true
             }
             }*/,
            {
                "name": "日本",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "巴基斯坦",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "尼泊尔",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "不丹",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "巴哈马",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "西撒哈拉",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "孟加拉国",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "阿曼",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "毛利塔尼亚",
                "selected": false,
                "label": {
                    "show": true
                }
            },
            {
                "name": "沙特阿拉伯",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "老挝",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "多米尼加",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            /*{
             "name": "开曼群岛（英）",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            /*{
             "name": "安圭拉（英）",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            /*{
             "name": "波多黎各",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "尼日尔",
                "selected": false,
                "label": {
                    "show": true
                }
            },
            /*{
             "name": "厄立特里亚",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "马里",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "塞内加尔",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "布基纳法索",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "埃塞俄比亚",
                "selected": false,
                "label": {
                    "show": true
                }
            },
            /*{
             "name": "萨尔瓦多",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "菲律宾",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            /*{
             "name": "喀麦隆",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "尼加拉瓜",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "缅甸",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            /*{
             "name": "荷属安的列斯",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "柬埔寨",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "吉布提",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "特立尼达",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "乍得",
                "selected": false,
                "label": {
                    "show": false
                }
            }/*,
             {
             "name": "多哥",
             "selected": false,
             "label": {
             "show": true
             }
             }*/,
            /*{
             "name": "塞拉利昂",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            /*{
             "name": "苏里南",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "利比里亚",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            /*{
             "name": "贝宁",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "斯里兰卡",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "尼日利亚",
                "selected": false,
                "label": {
                    color:'#eee',
                    "show": true
                }
            },
            {
                "name": "苏丹",
                "selected": false,
                "label": {
                    color:'#C5C8D4',
                    "show": true
                }
            },
            {
                "name": "马来西亚",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "圭亚那",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            /*{
             "name": "法属圭亚那",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "索马里",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "瑙鲁",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "文莱",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "马尔代夫",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "赤道几内亚",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "乌干达",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "新加坡",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            /*{
             "name": "圣多美和普林西比",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "肯尼亚",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "加蓬",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "厄瓜多尔",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            /*{
             "name": "卢旺达",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            /*{
             "name": "布隆迪",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            /*{
             "name": "刚果",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "坦桑尼亚",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "查戈斯群岛",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "所罗门群岛",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "东帝汶",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "塞舌尔",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "科摩罗",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "马拉维",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "赞比亚",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "澳大利亚",
                "selected": false,
                "label": {
                    "show": true
                }
            },
            {
                "name": "津巴布韦",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "纳米比亚",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "巴拉圭",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            /*{
             "name": "博茨瓦纳",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "阿根廷",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "斯威士兰",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "南非",
                "selected": false,
                "label": {
                    color:'#C5C8D4',
                    "show": true
                }
            },
            {
                "name": "莱索托",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "乌拉圭",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "新西兰",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "福克兰群岛",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "哈萨克斯坦",
                "selected": false,
                "label": {
                    "show": true
                }
            },
            {
                "name": "格鲁吉亚",
                "selected": false,
                "label": {
                    "show": false
                }
            }/*,
             {
             "name": "梵蒂冈",
             "selected": false,
             "label": {
             "show": true
             }
             }*/,
            /*{
             "name": "亚美尼亚",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "伊朗",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "巴林",
                "selected": false,
                "label": {
                    "show": false
                }
            }/*,
             {
             "name": "卡塔尔",
             "selected": false,
             "label": {
             "show": true
             }
             }*/,
            /*{
             "name": "荷兰",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "比利时",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            /*{
             "name": "科特迪瓦",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "墨西哥",
                "selected": false,
                "label": {
                    "show": true
                }
            },
            {
                "name": "美国",
                "selected": false,
                "label": {
                    "show": true
                }
            },
            {
                "name": "智利",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "加拿大",
                "selected": false,
                "label": {
                    "show": true
                }
            },
            {
                "name": "委内瑞拉",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "秘鲁",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "玻利维亚",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "巴西",
                "selected": false,
                "label": {
                    "show": true
                }
            },
            /*{
             "name": "伯利兹",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            /*{
             "name": "洪都拉斯",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "危地马拉",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            /*{
             "name": "哥斯达黎加",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "巴拿马",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "哥伦比亚",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            /*{
             "name": "牙买加",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            /*{
             "name": "海地",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "古巴",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "斐济群岛",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "巴布亚新几内亚",
                "selected": false,
                "label": {
                    "show": true
                }
            },
            {
                "name": "韩国",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "马达加斯加",
                "selected": false,
                "label": {
                    "show": true
                }
            },
            {
                "name": "安哥拉",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "也门",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "印度尼西亚",
                "selected": false,
                "label": {
                    "show": true
                }
            },
             {
             "name": "泰国",
             "selected": false,
             "label": {
             "show": true
             }
             }/*,
             {
             "name": "莫桑比克",
             "selected": false,
             "label": {
             "show": true
             }
             }*/,
            {
                "name": "科威特",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "几内亚",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "中非",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            /*{
             "name": "加纳",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "扎伊尔",
                "selected": false,
                "label": {
                    color:'#C5C8D4',
                    "show": true
                }
            },
            /*{
             "name": "阿拉伯联合酋长国",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            /*{
             "name": "几内亚比绍",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "葡萄牙",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "希腊",
                "selected": false,
                "label": {
                    color:'#C5C8D4',
                    "show": true
                }
            },
            {
                "name": "突尼斯",
                "selected": false,
                "label": {
                    color:'#C5C8D4',
                    "show": true
                }
            },
            {
                "name": "摩洛哥",
                "selected": false,
                "label": {
                    color:'#C5C8D4',
                    "show": true
                }
            }/*,
             {
             "name": "冈比亚",
             "selected": false,
             "label": {
             "show": true
             }
             }*/,
            {
                "name": "越南",
                "selected": false,
                "label": {
                    color:'#C5C8D4',
                    "show": true
                }
            },
            {
                "name": "土耳其",
                "selected": false,
                "label": {
                    color:'#C5C8D4',
                    "show": true
                }
            },
            {
                "name": "叙利亚",
                "selected": false,
                "label": {
                    color:'#C5C8D4',
                    "show": true
                }
            },
            {
                "name": "以色列",
                "selected": false,
                "label": {
                    color:'#C5C8D4',
                    "show": true
                }
            }/*,
             {
             "name": "阿拉伯区",
             "selected": false,
             "label": {
             "show": true
             }
             }*/,
            {
                "name": "埃及",
                "selected": false,
                "label": {
                    color:'#C5C8D4',
                    "show": true
                }
            },
            {
                "name": "西班牙",
                "selected": false,
                "label": {
                    color:'#C5C8D4',
                    "show": true
                }
            },
            /*{
             "name": "挪威",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "瑞典",
                "selected": false,
                "label": {
                    "show": true
                }
            },
            {
                "name": "意大利",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "英国",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            /*{
             "name": "南斯拉夫",
             "selected": false,
             "label": {
             "show": true
             }
             },*/
            {
                "name": "印度",
                "selected": false,
                "label": {
                    "show": false
                }
            },
            {
                "name": "中华人民共和国",
                "selected": false,
                "label": {
                    "show": true
                }
            }

        ],
        echartsRegions:[
            {
                name:'新疆',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'西藏',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'青海',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'甘肃',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'四川',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'云南',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'贵州',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'广西',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'重庆',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'海南',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'广东',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'湖南',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'湖北',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'江西',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'福建',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'台湾',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'浙江',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'安徽',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'上海',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'江苏',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'河南',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'陕西',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'山东',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'山西',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'河北',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'宁夏',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'内蒙古',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'北京',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'天津',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'辽宁',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'吉林',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            },{
                name:'黑龙江',
                label:{
                    show:true,
                    verticalAlign:'middle',
                    color:'#C5C8D4'
                }
            }
        ],
        /**
         * 各地市经纬度对应表
         */
        geoCoordMap:{
            '上海': [121.4648,31.2891],
            '东莞': [113.8953,22.901],
            '东营': [118.7073,37.5513],
            '中山': [113.4229,22.478],
            '临汾': [111.4783,36.1615],
            '临沂': [118.3118,35.2936],
            '丹东': [124.541,40.4242],
            '丽水': [119.5642,28.1854],
            '乌鲁木齐': [87.9236,43.5883],
            '佛山': [112.8955,23.1097],
            '保定': [115.0488,39.0948],
            '兰州': [103.5901,36.3043],
            '包头': [110.3467,41.4899],
            '北京': [116.4551,40.2539],
            '北海': [109.314,21.6211],
            '南京': [118.8062,31.9208],
            '南宁': [108.479,23.1152],
            '南昌': [116.0046,28.6633],
            '南通': [121.1023,32.1625],
            '厦门': [118.1689,24.6478],
            '台州': [121.1353,28.6688],
            '合肥': [117.29,32.0581],
            '呼和浩特': [111.4124,40.4901],
            '咸阳': [108.4131,34.8706],
            '哈尔滨': [127.9688,45.368],
            '唐山': [118.4766,39.6826],
            '嘉兴': [120.9155,30.6354],
            '大同': [113.7854,39.8035],
            '大连': [122.2229,39.4409],
            '天津': [117.4219,39.4189],
            '太原': [112.3352,37.9413],
            '威海': [121.9482,37.1393],
            '宁波': [121.5967,29.6466],
            '宝鸡': [107.1826,34.3433],
            '宿迁': [118.5535,33.7775],
            '常州': [119.4543,31.5582],
            '广州': [113.5107,23.2196],
            '廊坊': [116.521,39.0509],
            '延安': [109.1052,36.4252],
            '张家口': [115.1477,40.8527],
            '徐州': [117.5208,34.3268],
            '德州': [116.6858,37.2107],
            '惠州': [114.6204,23.1647],
            '成都': [103.9526,30.7617],
            '扬州': [119.4653,32.8162],
            '承德': [117.5757,41.4075],
            '拉萨': [91.1865,30.1465],
            '无锡': [120.3442,31.5527],
            '日照': [119.2786,35.5023],
            '昆明': [102.9199,25.4663],
            '杭州': [119.5313,29.8773],
            '枣庄': [117.323,34.8926],
            '柳州': [109.3799,24.9774],
            '株洲': [113.5327,27.0319],
            '武汉': [114.3896,30.6628],
            '汕头': [117.1692,23.3405],
            '江门': [112.6318,22.1484],
            '沈阳': [123.1238,42.1216],
            '沧州': [116.8286,38.2104],
            '河源': [114.917,23.9722],
            '泉州': [118.3228,25.1147],
            '泰安': [117.0264,36.0516],
            '泰州': [120.0586,32.5525],
            '济南': [117.1582,36.8701],
            '济宁': [116.8286,35.3375],
            '海口': [110.3893,19.8516],
            '淄博': [118.0371,36.6064],
            '淮安': [118.927,33.4039],
            '深圳': [114.5435,22.5439],
            '清远': [112.9175,24.3292],
            '温州': [120.498,27.8119],
            '渭南': [109.7864,35.0299],
            '湖州': [119.8608,30.7782],
            '湘潭': [112.5439,27.7075],
            '滨州': [117.8174,37.4963],
            '潍坊': [119.0918,36.524],
            '烟台': [120.7397,37.5128],
            '玉溪': [101.9312,23.8898],
            '珠海': [113.7305,22.1155],
            '盐城': [120.2234,33.5577],
            '盘锦': [121.9482,41.0449],
            '石家庄': [114.4995,38.1006],
            '福州': [119.4543,25.9222],
            '秦皇岛': [119.2126,40.0232],
            '绍兴': [120.564,29.7565],
            '聊城': [115.9167,36.4032],
            '肇庆': [112.1265,23.5822],
            '舟山': [122.2559,30.2234],
            '苏州': [120.6519,31.3989],
            '莱芜': [117.6526,36.2714],
            '菏泽': [115.6201,35.2057],
            '营口': [122.4316,40.4297],
            '葫芦岛': [120.1575,40.578],
            '衡水': [115.8838,37.7161],
            '衢州': [118.6853,28.8666],
            '西宁': [101.4038,36.8207],
            '西安': [109.1162,34.2004],
            '贵阳': [106.6992,26.7682],
            '连云港': [119.1248,34.552],
            '邢台': [114.8071,37.2821],
            '邯郸': [114.4775,36.535],
            '郑州': [113.4668,34.6234],
            '鄂尔多斯': [108.9734,39.2487],
            '重庆': [107.7539,30.1904],
            '金华': [120.0037,29.1028],
            '铜川': [109.0393,35.1947],
            '银川': [106.3586,38.1775],
            '镇江': [119.4763,31.9702],
            '长春': [125.8154,44.2584],
            '长沙': [113.0823,28.2568],
            '长治': [112.8625,36.4746],
            '阳泉': [113.4778,38.0951],
            '青岛': [120.4651,36.3373],
            '韶关': [113.7964,24.7028]
        }
    }
})(jQuery);