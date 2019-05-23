/**
 * @author wang.ning
 */
require(["./MapManager.js"],function(MapManager){
    if(!Global.mapGlobal) Global.mapGlobal = {};
    
    Global.mapGlobal.clickGraphic = {}
    Global.mapGlobal.clickGraphic.gra = null;    //单击选中的graphic 
    Global.mapGlobal.clickGraphic.sym = null;    //单击选中graphic的symbol
    
    Global.mapGlobal.instance = {};     //instances
    Global.mapGlobal.instance.mapManager = new MapManager();
    
});