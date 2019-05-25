/**
 * @author wang.ning
 */
define([
    "esri/geometry/Point",
    "esri/geometry/Polyline",
    "esri/graphic",
    "esri/graphicsUtils"
],
function(Point,Polyline,Graphic,graphicsUtils){
    return {
        getPoint:function(x,y,wkid){
            if(!wkid) wkid = 4326;
            var point = new Point({
                x:x,
                y:y,
                spatialReference:{
                    wkid:wkid
                }
            });
            return point;
        },
        getPolylineByPoints:function(aPoint,zPoint){
            var paths = new Array();
            paths.push([aPoint.x, aPoint.y]);
            paths.push([zPoint.x, zPoint.y]);
            var polyline = new Polyline(paths);
            return polyline;
        },
        locationAndBigger: function(pointer) {
            Global.mapGlobal.map.centerAndZoom(pointer.geometry,10);
        },
    }
});