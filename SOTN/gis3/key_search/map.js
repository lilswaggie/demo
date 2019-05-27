/**
 * @author li.suhao
 */
require(["./MapManager.js"],function(MapManager){
    if(!Global.mapGlobal) Global.mapGlobal = {};

    Global.mapGlobal.clickGraphic = {}
    Global.mapGlobal.clickGraphic.gra = null;    //单击选中的graphic,用来做图标切换
    Global.mapGlobal.clickGraphic.sym = null;    //单击选中graphic的symbol

    Global.mapGlobal.instance = {};     //instances
    Global.mapGlobal.instance.mapManager = new MapManager();
    console.error('mapManager', Global.mapGlobal.instance.mapManager);
    gis.aa = Global.mapGlobal.instance.mapManager.searchPoint; // 搜索点并且定位
    Global.datas = {};
    Global.datas.warningDatas = null;    //存放告警数据

});