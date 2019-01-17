define([
    "esri/symbols/PictureMarkerSymbol",
    "esri/symbols/SimpleLineSymbol", 
    "esri/Color",
    "esri/symbols/TextSymbol",
    "esri/symbols/Font"
],function(PictureMarkerSymbol,SimpleLineSymbol,Color,TextSymbol,Font){
    return {
        /**
         * 根据type类型获取点资源的Symbol,默认为OTM图标
         * @param type
         */
        getPointSymbol:function(type){
            var symbol;
            switch (type){
                case 'OTM':
                    symbol = this.getOTNSymbol();break;
                case 'OA':
                    symbol = this.getOASymbol();break;
                case 'CPE':
                    symbol = this.getCPESymbol();break;
                default:
                    symbol = this.getOTNSymbol();break;
            }
            return symbol;
        },
        //根据type类型获取点资源的高亮Symbol,默认为OTM高亮图标
        getHightPointSymbol:function(type){
            var symbol;
            switch (type){
                case 'OTM':
                    symbol = this.getOTNHightSymbol();break;
                case 'OA':
                    symbol = this.getOAHightSymbol();break;
                case 'CPE':
                    symbol = this.getCPEHightSymbol();break;
                default:
                    symbol = this.getOTNHightSymbol();break;
            }
            return symbol;
        },
        //OTM图标样式
        getOTNSymbol:function(){
            var picMarkerSymbol = new PictureMarkerSymbol(Global.mapGlobal.symbolConfig.OTM_SYMBOL,46,38);
            return picMarkerSymbol;
        },
        getOASymbol:function(){
            var picMarkerSymbol = new PictureMarkerSymbol(Global.mapGlobal.symbolConfig.OA_SYMBOL,30,28);
            return picMarkerSymbol;
        },
        getOAWarningSymbol:function(){
            var picMarkerSymbol = new PictureMarkerSymbol(Global.mapGlobal.symbolConfig.OA_WARNING_SYMBOL,30,28);
            return picMarkerSymbol;
        },

        getCPESymbol:function(){
            var picMarkerSymbol = new PictureMarkerSymbol(Global.mapGlobal.symbolConfig.OTM_SYMBOL,46,38);
            return picMarkerSymbol;
        },
        getOTNWarningSymbol:function(){
            var picMarkerSymbol = new PictureMarkerSymbol(Global.mapGlobal.symbolConfig.OTN_DEFAULT_SYMBOL,46,38);
            return picMarkerSymbol;
        },
        getOTNHightSymbol:function(){
            var picMarkerSymbol = new PictureMarkerSymbol(Global.mapGlobal.symbolConfig.OTN_LIGHT_SYMBOL,46,38);
            return picMarkerSymbol;
        },
        getOAHightSymbol:function(){
            var picMarkerSymbol = new PictureMarkerSymbol(Global.mapGlobal.symbolConfig.OA_LIGHT_SYMBOL,30,28);
            return picMarkerSymbol;
        },
        getCPEHightSymbol:function(){
            var picMarkerSymbol = new PictureMarkerSymbol(Global.mapGlobal.symbolConfig.OA_LIGHT_SYMBOL,30,28);
            return picMarkerSymbol;
        },
        getLineSymbol:function(){
            //var lineSymbol = new SimpleLineSymbol( SimpleLineSymbol.STYLE_SOLID, new Color("#508AF4"), 3);
            var lineSymbol = new SimpleLineSymbol( SimpleLineSymbol.STYLE_SOLID, new Color([80,138,244,1]), 3);
            return lineSymbol;
        },
        //线高亮Symbol
        getLineHightSymbol:function(){
            var lineSymbol = new SimpleLineSymbol( SimpleLineSymbol.STYLE_SOLID, new Color("#9013FE"), 3);
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