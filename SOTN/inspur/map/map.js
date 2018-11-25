/**
 * @author wang.ning
 */
require(["myModules/MapManager"],function(MapManager){
    if(!Global.mapGlobal) Global.mapGlobal = {};
    
    Global.mapGlobal.instance = {};     //instances
    Global.mapGlobal.instance.mapManager = new MapManager();
    
});