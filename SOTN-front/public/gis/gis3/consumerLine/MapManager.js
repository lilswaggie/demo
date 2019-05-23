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

            // this_instance.drawingGraphics(this_instance);
            // this_instance.realQueryWarningOTN(this_instance);     //实时查询告警数据

            Global.mapGlobal.otnLayer.on('click',function(params){
                if(Global.mapGlobal.clickGraphic.gra && Global.mapGlobal.clickGraphic.sym)
                    Global.mapGlobal.clickGraphic.gra.setSymbol(Global.mapGlobal.clickGraphic.sym);
                Global.mapGlobal.clickGraphic.gra = params.graphic;
                Global.mapGlobal.clickGraphic.sym = params.graphic.symbol;
                console.log('站点数据',params.graphic.attributes)
                //oid: 一个网元的id
                var arrItem = params.graphic.attributes;
                if(params.graphic.attributes.oid){
                    Global.mapGlobal.textLayer.clear();
                    params.graphic.setSymbol(SymbolUtil.getHightPointSymbol(params.graphic.attributes.type));
                    var g = new Graphic(params.graphic.geometry,SymbolUtil.getTextSymbol(params.graphic.attributes.oname).setOffset(0,15));
                    Global.mapGlobal.textLayer.add(g);
                    console.log('点击网元',arrItem);
                    // 弹框出现展示数据
                    //当前弹框调用的id为前接口的id，后面会有改动
                    $.ajax({
                        url:Global.mapGlobal.queryPOI.queryNe+arrItem.oid+'/detail',
                        type:'get',
                        dataType:'json',
                        headers:{
                            Accept:'application/json;charset=utf-8',
                            Authorization:Global.Authorization
                        },
                        success: function(data){
                            console.error('网元详情',data)
                            //清除另一个弹框
                            //this_instance._clearF('elasticFrame2');
                            $("#elasticFrame2").css('display','none');
                            //弹框：小p写布局
                            $("#elasticFrame").css({'display': 'block'});
                            $("#neName").text(data.data.neName);
                            $("#neName").text(data.data.neName);
                            $("#state").text(data.data.state);
                            $("#vender").text(data.data.vendor);
                            $("#serviceLevel").text(data.data.serviceLevel);
                            $("#modelName").text(data.data.modelName);
                            $("#location").text(data.data.location);
                            $("#siteName").text(data.data.relatedSiteName);
                            $("#roomName").text(data.data.relatedRoomName);
                        }
                    })
                        
                    //调用超超接口
                        //top.gis.setWarnOtnNetworkFault(arrItem.oid,arrItem.oname);
                }else{
                    alert('暂无告警数据')
                }
                // if(params.graphic.attributes.aggr){
                //     if(Global.datas.warningDatas){
                //         var $menu = $("<div/>").menu({});
                //         console.log('站点数据',params.graphic.attributes)

                //         params.graphic.attributes.aggr.map(function(arrItem,index){
                //             var text = arrItem.oname;
                //             if(Global.datas.warningDatas.ne.indexOf(arrItem.oid) > -1){
                //                 text = '<span style="color: red;">'+arrItem.oname+'</span>';
                //             }
                //             $menu.menu('appendItem',{
                //                 text: text,
                //                 data:arrItem,
                //                 //iconCls: 'icon-ok',
                //                 onclick: function(){
                //                     Global.mapGlobal.textLayer.clear();
                //                     params.graphic.setSymbol(SymbolUtil.getHightPointSymbol(params.graphic.attributes.type));
                //                     var g = new Graphic(params.graphic.geometry,SymbolUtil.getTextSymbol(params.graphic.attributes.oname).setOffset(0,15));
                //                     Global.mapGlobal.textLayer.add(g);
                //                     console.log('点击网元',arrItem);
                //                     // 弹框出现展示数据
                //                     $.ajax({
                //                         url:Global.mapGlobal.queryPOI.queryNe+arrItem.oid+'/detail',
                //                         type:'get',
                //                         dataType:'json',
                //                         headers:{
                //                             Accept:'application/json;charset=utf-8',
                //                             Authorization:Global.Authorization
                //                         },
                //                         success: function(data){
                //                             console.error('网元详情',data)
                //                             //清除另一个弹框
                //                             //this_instance._clearF('elasticFrame2');
                //                             $("#elasticFrame2").css('display','none');
                //                             //弹框：小p写布局
                //                             $("#elasticFrame").css({'display': 'block'});
                //                             $("#neName").text(data.data.neName);
                //                             $("#neName").text(data.data.neName);
                //                             $("#state").text(data.data.state);
                //                             $("#vender").text(data.data.vendor);
                //                             $("#serviceLevel").text(data.data.serviceLevel);
                //                             $("#modelName").text(data.data.modelName);
                //                             $("#location").text(data.data.location);
                //                             $("#siteName").text(data.data.relatedSiteName);
                //                             $("#roomName").text(data.data.relatedRoomName);
                //                         }
                //                     })
                                    
                //                     //调用超超接口
                //                     //top.gis.setWarnOtnNetworkFault(arrItem.oid,arrItem.oname);
                //                 }
                //             });
                //         });
                //     }else{
                //         alert('暂无告警数据')
                //     }

                // // }
                // $menu.menu('show',{
                //     left: params.pageX,
                //     top: params.pageY
                // });
            });

            Global.mapGlobal.map.on('click',function(params){

                if(params && params.graphic)  return false;
                // 点击地图清除特效渲染数据
                this_instance.clearAndRender(this_instance);
                // 点击地图清除专线弹框
                this_instance._clearF('elasticFrame2');
                this_instance._clearF('elasticFrame');
                Global.mapGlobal.textLayer.clear();
                if(Global.mapGlobal.clickGraphic.gra && Global.mapGlobal.clickGraphic.sym){
                    Global.mapGlobal.clickGraphic.gra.setSymbol(Global.mapGlobal.clickGraphic.sym);
                }


                // if(Global.mapGlobal.topo_link_flag){        //如果专线关联拓扑,topoLink数据高亮，进行取消高亮效果

                //     var lineGraphics = Global.mapGlobal.lineLayer.graphics;
                //     $.each(lineGraphics,function(index,item){
                //         item.setSymbol(SymbolUtil.getLineSymbol());
                //     });

                //     var otnGraphics = Global.mapGlobal.otnLayer.graphics;
                //     $.each(otnGraphics,function(index,item){
                //         console.error('item',item)
                //         item.setSymbol(SymbolUtil.getPointSymbol(item.attributes.type));
                //     })
                // }
                top.gis.clearSelectedLine();
                /*if(!params.graphic){
                    top.gis.clearWarnOtnNetworkFault();   //调用超超接口
                }*/
            });

            Global.mapGlobal.otnLayer.on('mouse-over',function(params){
                var g = new Graphic(params.graphic.geometry,SymbolUtil.getTextSymbol(params.graphic.attributes.oname).setOffset(0,15));
                Global.mapGlobal.mouseGraphTextLayer.add(g);
            })

            Global.mapGlobal.otnLayer.on('mouse-out',function(params){
                Global.mapGlobal.mouseGraphTextLayer.clear();
            })


            $("#clearFrame").click(function(){
                $("#elasticFrame").css({'display': 'none'});
                Global.mapGlobal.textLayer.clear();
                if(Global.mapGlobal.clickGraphic.gra && Global.mapGlobal.clickGraphic.sym){
                    Global.mapGlobal.clickGraphic.gra.setSymbol(Global.mapGlobal.clickGraphic.sym);
                }
            })
            $("#closeFrame").click(function(){
                $("#elasticFrame2").css({'display': 'none'});
            })


            //对外暴露接口
            this.exportMethod();



           
        },
        clearAndRender:function(this_instance){
            Global.mapGlobal.lineLayer.clear();
            Global.mapGlobal.otnLayer.clear();
            var data = Global.datas.defaultDatas;
            var warningData = Global.datas.warningDatas;
            data.map(function(item,index){             
                this_instance._drawingLines(item);//绘制逻辑线
                this_instance._drawingPoints(item);//绘制点数据
            })
            warningData.map(function(item,index){
                this_instance._handlerOTNWarning(item.oid);
                this_instance._handlerLineWarning(item.serviceline_id);
            })
        },
        //清除弹框
        _clearF:function(id){
            var css = $("#"+id).css('display');
            if(css == 'block') 
                $("#"+id).css('display','none');
        },
        /**
         * 
         * @param {绘制数据} this_instance 
         */
        drawingGraphics:function(params){
            var this_instance = this;
            if(params && params.name) {
                $.ajax({
                    url: Global.mapGlobal.queryPOI.queryCustomerLines + params.name,
                    type:'get',
                    dataType:'json',
                    headers:{
                        Accept:'application/json;charset=utf-8',
                        Authorization:Global.Authorization
                    },
                    success:function(data){
                        if(data && data.data && data.data.message && data.data.message.servicelines){      
                            console.error('datas',data)
                            // 将客户下的所有数据放入本地
                            Global.datas.defaultDatas = data.data.message.servicelines;                 
                            Global.mapGlobal.lineLayer.clear();
                            Global.mapGlobal.otnLayer.clear();
                            data.data.message.servicelines.map(function(item,index){                        
                                if(item.edges) this_instance._drawingLines(item);   //绘制逻辑线
                                if(item.nodes) this_instance._drawingPoints(item);                  //绘制点数据
                            })
                            this_instance.queryWarningOTN(this_instance);
                        }
                        // if(datas && datas.nodes){
                        //     Global.mapGlobal.lineLayer.clear();
                        //     Global.mapGlobal.otnLayer.clear();
                        //     if(datas.edges) this_instance._drawingLines(datas.edges);   //绘制逻辑线
                        //     this_instance._drawingPoints(datas.nodes);                  //绘制点数据
                        //     this_instance.queryWarningOTN(this_instance);               //接入告警数据
                        // }
                    }
                });
            }
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
        _drawingLines:function(data){
            data.edges.map(function(lineItem,index){
                var a_p = GeometryUtil.getPoint(lineItem.a_longitude,lineItem.a_lantitude,'');
                var z_p = GeometryUtil.getPoint(lineItem.z_longitude,lineItem.z_lantitude,'');
                var line = GeometryUtil.getPolylineByPoints(a_p,z_p);
                // 存放该专线的id值
                var g = new Graphic(line,SymbolUtil.getLineSymbol(),{id: data.serviceline_id});
                Global.mapGlobal.lineLayer.add(g);
            });
        },
        /**
         * 绘制点设施
         * @param {} points 
         */
        _drawingPoints:function(data){
            data.nodes.map(function(item,index){
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
                url:Global.mapGlobal.queryPOI.queryWarningCustomerLines,
                dataType:'json',
                type:'get',
                headers:{
                    Accept:'application/json;charset=utf-8',
                    Authorization: Global.Authorization
                },
                success:function(data){
                    console.log('告警数据',data);
                    if(data && data.data && data.data.message && data.data.message.servicelines) {
                        Global.datas.warningDatas = data.data.message.servicelines;
                        data.data.message.servicelines.map(function(item,index){
                            this_instance._handlerOTNWarning(item.oid);
                            this_instance._handlerLineWarning(item.serviceline_id);
                        })
                    }
                    // Global.datas.warningDatas = data.data;
                    // var datas = data.data;
                    // if(datas && datas.site) this_instance._handlerOTNWarning(datas.site);                   //点设备告警数据处理
                    // if(datas && datas.topolink) this_instance._handlerLineWarning(datas.topolink);          //线告警数据处理
                }
            });
            // 假设数据，测试用例，obj应为调用接口后返回的数据。
            // var obj = {
            //     "ne":[
            //         123,3345,123                     //网元id
            //     ],
            //     "serviceline":[
            //         '1310102012201HWCSANELefdd678f84da3842',421,534                       //专线id
            //     ]
            // }
            // // 将告警数据放入本地
            // Global.datas.warningDatas = obj;
            // this_instance._handlerOTNWarning(obj.ne);  
            // this_instance._handlerLineWarning(obj.serviceline); 
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
                        graphic.setSymbol(SymbolUtil.getHightPointSymbol(graphic.attributes.type));
                    }
                });
            });
        },
        /**
         * 处理逻辑线告警
         */
        _handlerLineWarning:function(warningToplink){
            // warningToplink.map(function(warningLinkItem,warningLinkIndex){
                Global.mapGlobal.lineLayer.graphics.map(function(graphic,lIndex){
                    var flag = false;
                    if(graphic.attributes.id == warningToplink){
                        flag = true;
                    }
                    // graphic.attributes.aggr.map(function(aggrItem,aggrIndex){
                    //     if(aggrItem.oid == warningLinkItem){
                    //         flag = true;
                    //         //break;
                    //     }
                    // });
                    if(flag)  graphic.setSymbol(SymbolUtil.getWarningLineSymbol()); 
                });
            // });
        },
        /**
         * 专线关联到拓扑,整条拓扑高亮
         */
        topoLinkHightLight:function(lineData){
            if(lineData && lineData.id){
                var _this = this;
                var data = Global.datas.defaultDatas;
                var warningData = Global.datas.warningDatas;
                data.map(function(item,index){
                    var flag = false;
                    if(lineData.id == item.serviceline_id) {
                        flag = true;
                    }
                    if(flag){              
                        Global.mapGlobal.lineLayer.clear();
                        Global.mapGlobal.otnLayer.clear();
                        _this._drawingLines(item);//绘制逻辑线
                        _this._drawingPoints(item);//绘制点数据
                        return false;
                    }
                })
                warningData.map(function(item,index){
                    _this._handlerOTNWarning(item.oid);//点告警数据处理
                    _this._handlerLineWarning(item.serviceline_id);//线告警数据处理
                })
            }
            //线
            // var lineGraphics = Global.mapGlobal.lineLayer.graphics;
            // $.each(lineGraphics,function(index,item){
            //     item.setSymbol(SymbolUtil.getLineHightSymbol());
            // });

            // //点
            // var otnGraphics = Global.mapGlobal.otnLayer.graphics;
            // $.each(otnGraphics,function(index,item){
            //     item.setSymbol(SymbolUtil.getHightPointSymbol(item.attributes.type));
            // })
            Global.mapGlobal.topo_link_flag = true;             //设置高亮标志

            //查询专线两端的网元设备
            $.ajax({
                url:Global.mapGlobal.queryPOI.queryLineDetail,
                type:'get',
                dataType:'json',
                headers:{
                    Accept:'application/json;charset=utf-8',
                    Authorization:Global.Authorization
                },
                success:function(data){
                    console.error('专线详情data',data);
                    if(data && data.data && data.data.results) {
                        data.data.results.map(function(item,index){
                            if(item.id == lineData.id) {
                                $("#oName").text(item.name);
                                $("#a_name").text(item.aNe.name);
                                $("#z_name").text(item.zNe.name);
                            }
                        })
                    }
                },
            });

            //查询专线的统计信息
            $.ajax({
                url:Global.mapGlobal.queryPOI.queryLineStatics+lineData.id,
                type:'get',
                dataType:'json',
                headers:{
                    Accept:'application/json;charset=utf-8',
                    Authorization:Global.Authorization
                },
                success:function(data){
                    console.error('专线统计data',data);
                    $("#faultFrequencyNum").text(data.data.values.faultFrequencyNum);
                    $("#alarmFrequencyNum").text(data.data.values.alarmFrequencyNum);
                    $("#complaintFrequencyNum").text(data.data.values.complaintFrequencyNum);
                    $("#efficiencyDegradationFrequencyNum").text(data.data.values.efficiencyDegradationFrequencyNum);
                },
            });

            //小p写弹框代码：
            $("#elasticFrame2").css({'display':'block'});
            $("#elasticFrame").css({'display':'none'});
            //this_instance._clearF('elasticFrame');
        },
        /**
         * 对苏研提供的对外接口
         */
        exportMethod:function(){
            //进来绘制数据
            gis.renderCustomerLines = this.drawingGraphics.bind(this);
            //点击右侧
            gis.renderTopoLink = this.topoLinkHightLight.bind(this);
        }
    });
});