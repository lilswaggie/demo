(function(a){a.fn.WorldModule=function(b,c){if(typeof b=="string"){return a.fn.WorldModule.methods[b](c)}a.fn.WorldModule.methods.init()};a.fn.WorldModule.methods={init:function(){var b=echarts.init(document.getElementById("g_map"));a.get("../../geodata/world.json",function(c){var d=[];a.each(c.features,function(e,f){var g={};d.push("1")});echarts.registerMap("world",c);b.setOption({backgroundColor:"#BEDBF9",geo:a("body").GeoUtils("getWorldMapInstance"),series:[]});a.fn.WorldModule.methods.renderData(b);b.on("click",function(e){console.log("params",e.data)})})},renderData:function(d){var b=a("body").GeoUtils("getLine");var c=a("body").GeoUtils("getScatter",{symbol:"circle"});a.get("../../geodata/world_service.json",function(e){if(e&&e.nodes){var h=[];e.nodes.map(function(j,k){var i={name:j.oname,value:[j.longitude,j.lantitude].concat(20),data:j};h.push(i)});var f=[];e.edges.map(function(j,k){var i={oname:j.oname,coords:[[j.a_longitude,j.a_lantitude],[j.z_longitude,j.z_lantitude]],data:j};f.push(i)});b.data=f;c.data=h;var g=d.getOption();g.series.push(b);g.series.push(c);d.setOption(g);a.fn.WorldModule.methods.renderWarningData(d);a.fn.WorldModule.methods.realRenderWarningData(d)}})},renderWarningData:function(b){a.get(Global.mapGlobal.queryPOI.queryWarningOTN,function(c){if(c&&c.serviceline){c.serviceline.map(function(f,e){var d=b.getOption();d.series.map(function(g,h){if(g.type=="lines"){g.data.map(function(j,k){var i=false;j.data.aggr.map(function(l,m){if(l.oid==f){i=true}});if(i){j.lineStyle={color:Global.mapGlobal.echartsConfig.lineColor.fault}}})}});console.error("warnningoptions",d);b.setOption(d)})}})},realRenderWarningData:function(b){if(Global.mapGlobal.queryPOI.realQueryFlag){setInterval(function(){a.fn.ChinaModule.methods.renderWarningData(b)},Global.mapGlobal.queryPOI.realQueryTimer)}},chartEventsTrigger:function(b){b.on("click",function(e){var f=b.getOption();var c=[];c.push(e.data);if(e.seriesType&&e.seriesType=="lines"){var d=b.getOption();d.series.push({name:"lights_line",type:"lines",zlevel:1,lineStyle:{normal:{color:Global.mapGlobal.echartsConfig.lineColor.light,width:Global.mapGlobal.echartsConfig.lineWidth,curveness:Global.mapGlobal.echartsConfig.lineCurveness}},effect:{show:true,period:6,trailLength:0.7,color:"red",symbolSize:3},data:c});b.setOption(d)}else{b.setOption(f)}})}}})(jQuery);