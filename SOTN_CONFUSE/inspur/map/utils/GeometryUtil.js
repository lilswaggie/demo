define(["esri/geometry/Point","esri/geometry/Polyline","esri/graphic","esri/graphicsUtils"],function(d,b,c,a){return{getPoint:function(f,h,g){if(!g){g=4326}var e=new d({x:f,y:h,spatialReference:{wkid:g}});return e},getPolylineByPoints:function(h,f){var g=new Array();g.push([h.x,h.y]);g.push([f.x,f.y]);var e=new b(g);return e}}});