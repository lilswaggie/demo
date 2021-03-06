// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.9/esri/copyright.txt for details.
//>>built
define("require exports ../../../core/Error ../../../core/promiseUtils ../../../geometry/support/contains ../../../geometry/support/intersects ../../../geometry/support/webMercatorUtils".split(" "),function(g,c,f,d,h,k,l){function e(){return d.create(function(b){return g(["../../../geometry/geometryEngine"],b)})}Object.defineProperty(c,"__esModule",{value:!0});var m={intersects:!0,contains:!0,within:!0,crosses:!0,touches:!0,overlaps:!0,"envelope-intersects":!0},n={point:!0,multipoint:!0,polyline:!0,
polygon:!0,extent:!0},p={esriGeometryPoint:!0,esriGeometryMultipoint:!0,esriGeometryPolyline:!0,esriGeometryPolygon:!0};c.importGeometryEngine=e;c.getGeodesicBufferOperator=function(){return e().then(function(b){return b.geodesicBuffer})};c.getSpatialQueryOperator=function(b,a,c){if("intersects"===b){if("polygon"===a.type&&"esriGeometryPoint"===c)return d.resolve(h.polygonContainsPoint.bind(null,a.toJSON()));if("extent"===a.type)return d.resolve(k.getExtentIntersector(c).bind(null,a))}return e().then(function(c){return c[b].bind(null,
a.toJSON())})};c.checkSpatialQuerySupport=function(b,a,c){var e=b.geometry;return e?!0!==m[b.spatialRelationship]?d.reject(new f("feature-store:unsupported-query","Unsupported query spatial relationship",{query:b})):!0!==n[e.type]?d.reject(new f("feature-store:unsupported-query","Unsupported query geometry type",{query:b})):!0!==p[a]?d.reject(new f("feature-store:unsupported-query","Unsupported layer geometry type",{query:b})):l.canProject(e.spatialReference,c)?d.resolve():d.reject(new f("feature-store:unsupported-query",
"Unsupported geometry spatialReference",{query:b})):null};c.canQueryWithRBush=function(b){switch(b.type){case "extent":return!0;case "polygon":return b.rings.every(function(a){return 5!==a.length?!1:a[0][0]===a[1][0]&&a[0][0]===a[4][0]&&a[2][0]===a[3][0]&&a[0][1]===a[3][1]&&a[0][1]===a[4][1]&&a[1][1]===a[2][1]});default:return!1}}});