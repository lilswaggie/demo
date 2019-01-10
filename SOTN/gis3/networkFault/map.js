/**
 * @author wang.ning
 */
require(["./MapManager.js"],function(MapManager){
    if(!Global.mapGlobal) Global.mapGlobal = {};
    
    Global.mapGlobal.clickGraphic = {}
    Global.mapGlobal.clickGraphic.gra = null;    //单击选中的graphic,用来做图标切换
    Global.mapGlobal.clickGraphic.sym = null;    //单击选中graphic的symbol

    Global.mapGlobal.instance = {};     //instances
    Global.mapGlobal.instance.mapManager = new MapManager();

    Global.datas = {};
    Global.ddatas.warningDatas = null;    //存放告警数据
    
});