define([
    "esri/symbols/PictureMarkerSymbol",
    "esri/symbols/SimpleLineSymbol", 
    "esri/Color",
    "esri/symbols/TextSymbol",
    "esri/symbols/Font"
],function(PictureMarkerSymbol,SimpleLineSymbol,Color,TextSymbol,Font){
    return {
        getOTNSymbol:function(){
            var picMarkerSymbol = new PictureMarkerSymbol(Global.mapGlobal.symbolConfig.OTN_SYMBOL,Global.mapGlobal.symbolConfig.SYMBOL_WIDTH,Global.mapGlobal.symbolConfig.SYMBOL_WIDTH);
            return picMarkerSymbol;
        },
        getOTNWarningSymbol:function(){
            var picMarkerSymbol = new PictureMarkerSymbol(Global.mapGlobal.symbolConfig.OTN_DEFAULT_SYMBOL,Global.mapGlobal.symbolConfig.SYMBOL_WIDTH,Global.mapGlobal.symbolConfig.SYMBOL_HEIGHT);
            return picMarkerSymbol;
        },
        getOTNHightSymbol:function(){
            var picMarkerSymbol = new PictureMarkerSymbol(Global.mapGlobal.symbolConfig.OTN_LIGHT_SYMBOL,Global.mapGlobal.symbolConfig.SYMBOL_WIDTH,Global.mapGlobal.symbolConfig.SYMBOL_HEIGHT);
            return picMarkerSymbol;
        },
        getLineSymbol:function(){
            //var lineSymbol = new SimpleLineSymbol( SimpleLineSymbol.STYLE_SOLID, new Color("#508AF4"), 3);
            var lineSymbol = new SimpleLineSymbol( SimpleLineSymbol.STYLE_SOLID, new Color([80,138,244,1]), 3);
            return lineSymbol;
        },
        getWarningLineSymbol:function(){
            var lineSymbol = new SimpleLineSymbol( SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 3);
            return lineSymbol;
        },
        getTextSymbol:function(text,font,color){
            var f = new Font("12pt").setWeight(Font.WEIGHT_BOLD);
            var c = new Color([128,0,0]);
            var txtSymbol = new TextSymbol(text,f,c);
            return txtSymbol;
        }
    }
});