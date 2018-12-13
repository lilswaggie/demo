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
    "esri/geometry/webMercatorUtils",
    "esri/toolbars/draw",
    "dojo/_base/declare"
],function(Map,WebTiledLayer,GeometryUtil,GraphicsLayer,Graphic,SymbolUtil,webMercatorUtils,Draw,declare){
    return declare(null,{
        map:null,
        constructor:function(){
            var map = new Map("map",Global.mapGlobal.mapInstance.mapOptions);
            this.map = map;
            Global.mapGlobal.map = map;

            if(Global.mapGlobal.mapInstance.isCenter)
                map.centerAndZoom(GeometryUtil.getPoint(Global.mapGlobal.mapInstance.center[0],Global.mapGlobal.mapInstance.center[1],''),Global.mapGlobal.mapInstance.zoom);
            
            var layer = new WebTiledLayer(Global.mapGlobal.base.map,{'copyright': 'Heditu','id': 'baseMap'});
            map.addLayer(layer);

            var lineLayer = new GraphicsLayer();
            map.addLayer(lineLayer);
            Global.mapGlobal.lineLayer = lineLayer;

            var graphicLayer = new GraphicsLayer();
            map.addLayer(graphicLayer);
            Global.mapGlobal.otnLayer = graphicLayer;

            var this_instance = this;

            this_instance.drawingGraphics(this_instance);
            this_instance.realQueryWarningOTN(this_instance);     //实时查询告警数据


            
            


           
        },
        /**
         * 
         * @param {绘制数据} this_instance 
         */
        drawingGraphics:function(this_instance){
            //$.get(Global.mapGlobal.queryPOI.queryOTN,function(datas){
            /*$.get('http://localhost:63342/SOTN/geodata/aa.json',function(data){
                var datas = data.data;
                if(datas && datas.nodes){
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
                    var datas = data.data;
                    if(datas && datas.nodes){
                        if(datas.edges) this_instance._drawingLines(datas.edges);   //绘制逻辑线
                        this_instance._drawingPoints(datas.nodes);                  //绘制点数据
                        this_instance.queryWarningOTN(this_instance);               //接入告警数据
                    }
                },
                error:function(data){
                    console.log('data',data);
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
                var g = new Graphic(p1,SymbolUtil.getOTNSymbol(),item);
                Global.mapGlobal.otnLayer.add(g);
            });
        },
        /**
         * 告警数据查询
         */
        queryWarningOTN:function(this_instance){
            $.get(Global.mapGlobal.queryPOI.queryWarningOTN,function(datas){
                if(datas && datas.site) this_instance._handlerOTNWarning(datas.site);                   //点设备告警数据处理
                if(datas && datas.topolink) this_instance._handlerLineWarning(datas.topolink);          //线告警数据处理
            });
        },
        /**
         * 处理otn设备告警
         */
        _handlerOTNWarning:function(warningPoints){
            warningPoints.map(function(warningOtnItem,otnIndex){
                Global.mapGlobal.otnLayer.graphics.map(function(graphic,gIndex){
                    if(graphic.attributes.oid == warningOtnItem){
                        graphic.setSymbol(SymbolUtil.getOTNWarningSymbol());
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