/**
 * @author wang.ning
 */
define([
    "esri/map",
    "esri/layers/WebTiledLayer",
    "utils/GeometryUtil",
    "esri/layers/GraphicsLayer",
    "esri/graphic",
    "utils/SymbolUtil",
    "dojo/_base/declare"
],function(Map,WebTiledLayer,GeometryUtil,GraphicsLayer,Graphic,SymbolUtil,declare){
    return declare(null,{
        map:null,
        constructor:function(){
            var map = new Map("map",Global.mapGlobal.mapInstance.mapOptions);
            this.map = map;
            map.setMapCursor("pointer");

            Global.mapGlobal.map = map;

            if(Global.mapGlobal.mapInstance.isCenter)
                map.centerAndZoom(GeometryUtil.getPoint(Global.mapGlobal.mapInstance.center[0],Global.mapGlobal.mapInstance.center[1],''),Global.mapGlobal.mapInstance.zoom);
            
            var layer = new WebTiledLayer(Global.mapGlobal.base.map,{'id': 'baseMap'});
            map.addLayer(layer);

            map.setZoom(Global.mapGlobal.mapInstance.mapOptions.zoom)
            map.centerAt(GeometryUtil.getPoint(Global.mapGlobal.mapInstance.mapOptions.center[0],Global.mapGlobal.mapInstance.mapOptions.center[1]));

            var mouseGraphTextLayer = new GraphicsLayer();
            map.addLayer(mouseGraphTextLayer);
            Global.mapGlobal.mouseGraphTextLayer = mouseGraphTextLayer;       //鼠标移动站点，提示站点名称

            var lineLayer = new GraphicsLayer();
            map.addLayer(lineLayer);
            Global.mapGlobal.lineLayer = lineLayer;

            var graphicLayer = new GraphicsLayer({cursor:'pointer'});
            map.addLayer(graphicLayer);
            Global.mapGlobal.otnLayer = graphicLayer;

            var textLayer = new GraphicsLayer();
            map.addLayer(textLayer);     //点击高亮文字图层
            Global.mapGlobal.textLayer = textLayer;



            var this_instance = this;

            this_instance.drawingGraphics(this_instance);
            this_instance.realQueryWarningOTN(this_instance);     //实时查询告警数据

            Global.mapGlobal.otnLayer.on('click',function(params){
                if(Global.mapGlobal.clickGraphic.gra && Global.mapGlobal.clickGraphic.sym)
                    Global.mapGlobal.clickGraphic.gra.setSymbol(Global.mapGlobal.clickGraphic.sym);
                Global.mapGlobal.clickGraphic.gra = params.graphic;
                Global.mapGlobal.clickGraphic.sym = params.graphic.symbol;
                console.log('站点数据',params.graphic.attributes)
                if(params.graphic.attributes.aggr){
                    if(Global.datas.warningDatas){
                        var $menu = $("<div/>").menu({});
                        console.log('站点数据',params.graphic.attributes)

                        params.graphic.attributes.aggr.map(function(arrItem,index){
                            var text = arrItem.oname;
                            if(Global.datas.warningDatas.ne.indexOf(arrItem.oid) > -1){
                                text = '<span style="color: red;">'+arrItem.oname+'</span>';
                            }
                            $menu.menu('appendItem',{
                                text: text,
                                data:arrItem,
                                //iconCls: 'icon-ok',
                                onclick: function(){
                                    Global.mapGlobal.textLayer.clear();
                                    params.graphic.setSymbol(SymbolUtil.getHightPointSymbol(params.graphic.attributes.type));
                                    var g = new Graphic(params.graphic.geometry,SymbolUtil.getTextSymbol(params.graphic.attributes.oname).setOffset(0,15));
                                    Global.mapGlobal.textLayer.add(g);
                                    console.log('点击网元',arrItem);
                                    //调用超超接口
                                    top.gis.setWarnOtnNetworkFault(arrItem.oid,arrItem.oname);
                                }
                            });
                        });
                    }else{
                        alert('暂无告警数据')
                    }

                }
                $menu.menu('show',{
                    left: params.pageX,
                    top: params.pageY
                });
            });

            Global.mapGlobal.map.on('click',function(params){
                Global.mapGlobal.textLayer.clear();
                if(Global.mapGlobal.clickGraphic.gra && Global.mapGlobal.clickGraphic.sym){
                    Global.mapGlobal.clickGraphic.gra.setSymbol(Global.mapGlobal.clickGraphic.sym);
                }
                if(!params.graphic){
                    top.gis.clearWarnOtnNetworkFault();   //调用超超接口
                }
            });

            Global.mapGlobal.otnLayer.on('mouse-over',function(params){
                var g = new Graphic(params.graphic.geometry,SymbolUtil.getTextSymbol(params.graphic.attributes.oname).setOffset(0,15));
                Global.mapGlobal.mouseGraphTextLayer.add(g);
            })

            Global.mapGlobal.otnLayer.on('mouse-out',function(params){
                Global.mapGlobal.mouseGraphTextLayer.clear();
            })



           
        },
        /**
         * 
         * @param {绘制数据} this_instance 
         */
        drawingGraphics:function(this_instance){
            //$.get(Global.mapGlobal.queryPOI.queryOTN,function(datas){
           /* $.get('../../geodata/queryOTN.json',function(datas){
                if(datas && datas.nodes){
                    Global.mapGlobal.lineLayer.clear();
                    Global.mapGlobal.otnLayer.clear();
                    if(datas.edges) this_instance._drawingLines(datas.edges);   //绘制逻辑线
                    this_instance._drawingPoints(datas.nodes);                  //绘制点数据
                    this_instance.queryWarningOTN(this_instance);               //接入告警数据
                }
            });*/

            $.ajax({
                url:Global.mapGlobal.queryPOI.queryOTN+'?scene=indoor',
                type:'get',
                dataType:'json',
                headers:{
                    Accept:'application/json;charset=utf-8',
                    Authorization:Global.Authorization
                },
                success:function(data){
                    //var datas = data.data;
                    var datas = JSON.parse(data.data.message)
                    console.error('datas',datas)
                    if(datas && datas.nodes){
                        Global.mapGlobal.lineLayer.clear();
                        Global.mapGlobal.otnLayer.clear();
                        if(datas.edges) this_instance._drawingLines(datas.edges);   //绘制逻辑线
                        this_instance._drawingPoints(datas.nodes);                  //绘制点数据
                        this_instance.queryWarningOTN(this_instance);               //接入告警数据
                    }
                }
            });
        },
        /**
         * 实时查询告警数据
         */
        realQueryWarningOTN:function(this_instance){
            if(Global.mapGlobal.queryPOI.realQueryFlag){
                setInterval(function(){
                    this_instance.queryWarningOTN(this_instance);
                },Global.mapGlobal.queryPOI.realQueryTimer);
            }
        },
        /**
         * 绘制线数据
         */
        _drawingLines:function(lines){
            lines.map(function(lineItem,index){
                var a_p = GeometryUtil.getPoint(lineItem.a_longitude,lineItem.a_lantitude,'');
                var z_p = GeometryUtil.getPoint(lineItem.z_longitude,lineItem.z_lantitude,'');
                var line = GeometryUtil.getPolylineByPoints(a_p,z_p);
                var g = new Graphic(line,SymbolUtil.getLineSymbol(),lineItem);
                Global.mapGlobal.lineLayer.add(g);
            });
        },
        /**
         * 绘制点设施
         * @param {} points 
         */
        _drawingPoints:function(points){
            points.map(function(item,index){
                var p1 = GeometryUtil.getPoint(item.longitude,item.lantitude,'');
                var g = new Graphic(p1,SymbolUtil.getPointSymbol(item.type),item);
                Global.mapGlobal.otnLayer.add(g);
            });
        },
        /**
         * 告警数据查询
         */
        queryWarningOTN:function(this_instance){

            $.ajax({
                url:Global.mapGlobal.queryPOI.queryWarningOTN,
                dataType:'json',
                type:'get',
                headers:{
                    Accept:'application/json;charset=utf-8',
                    Authorization: Global.Authorization
                },
                success:function(data){
                    console.log('告警数据',data);
                    Global.datas.warningDatas = data.data;
                    var datas = data.data;
                    if(datas && datas.site) this_instance._handlerOTNWarning(datas.site);                   //点设备告警数据处理
                    if(datas && datas.topolink) this_instance._handlerLineWarning(datas.topolink);          //线告警数据处理
                }
            });

            //$.get(Global.mapGlobal.queryPOI.queryWarningOTN,function(datas){
           /* $.get('../../geodata/queryWarnings.json',function(datas){
                if(datas && datas.site) this_instance._handlerOTNWarning(datas.site);                   //点设备告警数据处理
                if(datas && datas.topolink) this_instance._handlerLineWarning(datas.topolink);          //线告警数据处理
            });*/
        },
        /**
         * 处理otn设备告警
         */
        _handlerOTNWarning:function(warningPoints){
            warningPoints.map(function(warningOtnItem,otnIndex){
                Global.mapGlobal.otnLayer.graphics.map(function(graphic,gIndex){
                    if(graphic.attributes.oid == warningOtnItem){
                        console.error('graphic.attributes.oid',graphic.attributes.oid)
                        graphic.setSymbol(SymbolUtil.getWarningPointSymbol(graphic.attributes.type));
                    }
                });
            });
        },
        /**
         * 处理逻辑线告警
         */
        _handlerLineWarning:function(warningToplink){
            warningToplink.map(function(warningLinkItem,warningLinkIndex){
                Global.mapGlobal.lineLayer.graphics.map(function(graphic,lIndex){
                    var flag = false;
                    graphic.attributes.aggr.map(function(aggrItem,aggrIndex){
                        if(aggrItem.oid == warningLinkItem){
                            flag = true;
                            //break;
                        }
                    });
                    if(flag)  graphic.setSymbol(SymbolUtil.getWarningLineSymbol()); 
                });
            });
        }         
    });
});