// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.9/esri/copyright.txt for details.
//>>built
define("require exports ../../kernel ../kernel ../languageUtils ./centroid ../../geometry/Extent ../../geometry/Geometry ../../geometry/Multipoint ../../geometry/Point ../../geometry/Polygon ../../geometry/Polyline ../../geometry/support/jsonUtils".split(" "),function(B,u,x,l,d,y,r,k,z,v,q,t,w){function m(d){return p?d.clone():w.fromJSON(d.toJSON())}function A(d){return 0===x.version.indexOf("4.")?q.fromExtent(d):new q({spatialReference:d.spatialReference,rings:[[[d.xmin,d.ymin],[d.xmin,d.ymax],[d.xmax,
d.ymax],[d.xmax,d.ymin],[d.xmin,d.ymin]]]})}Object.defineProperty(u,"__esModule",{value:!0});var g=null,p=0===x.version.indexOf("4.");u.setGeometryEngine=function(d){g=d};u.registerFunctions=function(e,h){function n(b){d.pcCheck(b,2,2);if(!(b[0]instanceof k&&b[1]instanceof k||b[0]instanceof k&&null===b[1]||b[1]instanceof k&&null===b[0]||null===b[0]&&null===b[1]))throw Error("Illegal Argument");}e.disjoint=function(b,c){return h(b,c,function(f,b,a){a=d.autoCastFeatureToGeometry(a);n(a);return null===
a[0]||null===a[1]?!0:g.disjoint(a[0],a[1])})};e.intersects=function(b,c){return h(b,c,function(f,b,a){a=d.autoCastFeatureToGeometry(a);n(a);return null===a[0]||null===a[1]?!1:g.intersects(a[0],a[1])})};e.touches=function(b,c){return h(b,c,function(f,b,a){a=d.autoCastFeatureToGeometry(a);n(a);return null===a[0]||null===a[1]?!1:g.touches(a[0],a[1])})};e.crosses=function(b,c){return h(b,c,function(f,b,a){a=d.autoCastFeatureToGeometry(a);n(a);return null===a[0]||null===a[1]?!1:g.crosses(a[0],a[1])})};
e.within=function(b,c){return h(b,c,function(f,b,a){a=d.autoCastFeatureToGeometry(a);n(a);return null===a[0]||null===a[1]?!1:g.within(a[0],a[1])})};e.contains=function(b,c){return h(b,c,function(f,b,a){a=d.autoCastFeatureToGeometry(a);n(a);return null===a[0]||null===a[1]?!1:g.contains(a[0],a[1])})};e.overlaps=function(b,c){return h(b,c,function(f,b,a){a=d.autoCastFeatureToGeometry(a);n(a);return null===a[0]||null===a[1]?!1:g.overlaps(a[0],a[1])})};e.equals=function(b,c){return h(b,c,function(f,b,
a){d.pcCheck(a,2,2);return a[0]===a[1]?!0:a[0]instanceof k&&a[1]instanceof k?g.equals(a[0],a[1]):d.isDate(a[0])&&d.isDate(a[1])?a[0].getTime()===a[1].getTime():!1})};e.relate=function(b,c){return h(b,c,function(f,b,a){a=d.autoCastFeatureToGeometry(a);d.pcCheck(a,3,3);if(a[0]instanceof k&&a[1]instanceof k)return g.relate(a[0],a[1],d.toString(a[2]));if(a[0]instanceof k&&null===a[1]||a[1]instanceof k&&null===a[0]||null===a[0]&&null===a[1])return!1;throw Error("Illegal Argument");})};e.intersection=function(b,
c){return h(b,c,function(f,b,a){a=d.autoCastFeatureToGeometry(a);n(a);return null===a[0]||null===a[1]?null:g.intersect(a[0],a[1])})};e.union=function(b,c){return h(b,c,function(f,c,a){a=d.autoCastFeatureToGeometry(a);f=[];if(0===a.length)throw Error("Function called with wrong number of Parameters");if(1===a.length)if(d.isArray(a[0]))for(a=d.autoCastFeatureToGeometry(a[0]),c=0;c<a.length;c++){if(null!==a[c])if(a[c]instanceof k)f.push(a[c]);else throw Error("Illegal Argument");}else if(d.isImmutableArray(a[0]))for(a=
d.autoCastFeatureToGeometry(a[0].toArray()),c=0;c<a.length;c++){if(null!==a[c])if(a[c]instanceof k)f.push(a[c]);else throw Error("Illegal Argument");}else{if(a[0]instanceof k)return d.fixSpatialReference(m(a[0]),b.spatialReference);if(null===a[0])return null;throw Error("Illegal Argument");}else for(c=0;c<a.length;c++)if(null!==a[c])if(a[c]instanceof k)f.push(a[c]);else throw Error("Illegal Argument");return 0===f.length?null:g.union(f)})};e.difference=function(b,c){return h(b,c,function(f,b,a){a=
d.autoCastFeatureToGeometry(a);n(a);return null!==a[0]&&null===a[1]?m(a[0]):null===a[0]?null:g.difference(a[0],a[1])})};e.symmetricdifference=function(b,c){return h(b,c,function(f,b,a){a=d.autoCastFeatureToGeometry(a);n(a);return null===a[0]&&null===a[1]?null:null===a[0]?m(a[1]):null===a[1]?m(a[0]):g.symmetricDifference(a[0],a[1])})};e.clip=function(b,c){return h(b,c,function(f,b,a){a=d.autoCastFeatureToGeometry(a);d.pcCheck(a,2,2);if(!(a[1]instanceof r)&&null!==a[1])throw Error("Illegal Argument");
if(null===a[0])return null;if(!(a[0]instanceof k))throw Error("Illegal Argument");return null===a[1]?null:g.clip(a[0],a[1])})};e.cut=function(b,c){return h(b,c,function(f,b,a){a=d.autoCastFeatureToGeometry(a);d.pcCheck(a,2,2);if(!(a[1]instanceof t)&&null!==a[1])throw Error("Illegal Argument");if(null===a[0])return[];if(!(a[0]instanceof k))throw Error("Illegal Argument");return null===a[1]?[m(a[0])]:g.cut(a[0],a[1])})};e.area=function(b,c){return h(b,c,function(f,b,a){a=d.autoCastFeatureToGeometry(a);
d.pcCheck(a,1,2);if(null===a[0])return 0;if(!(a[0]instanceof k))throw Error("Illegal Argument");return g.planarArea(a[0],l.convertSquareUnitsToCode(d.defaultUndefined(a[1],-1)))})};e.areageodetic=function(b,c){return h(b,c,function(f,b,a){a=d.autoCastFeatureToGeometry(a);d.pcCheck(a,1,2);if(null===a[0])return 0;if(!(a[0]instanceof k))throw Error("Illegal Argument");return g.geodesicArea(a[0],l.convertSquareUnitsToCode(d.defaultUndefined(a[1],-1)))})};e.length=function(b,c){return h(b,c,function(f,
b,a){a=d.autoCastFeatureToGeometry(a);d.pcCheck(a,1,2);if(null===a[0])return 0;if(!(a[0]instanceof k))throw Error("Illegal Argument");return g.planarLength(a[0],l.convertLinearUnitsToCode(d.defaultUndefined(a[1],-1)))})};e.lengthgeodetic=function(b,c){return h(b,c,function(f,b,a){a=d.autoCastFeatureToGeometry(a);d.pcCheck(a,1,2);if(null===a[0])return 0;if(!(a[0]instanceof k))throw Error("Illegal Argument");return g.geodesicLength(a[0],l.convertLinearUnitsToCode(d.defaultUndefined(a[1],-1)))})};e.distance=
function(b,c){return h(b,c,function(f,b,a){a=d.autoCastFeatureToGeometry(a);d.pcCheck(a,2,3);if(!(a[0]instanceof k))throw Error("Illegal Argument");if(!(a[1]instanceof k))throw Error("Illegal Argument");return g.distance(a[0],a[1],l.convertLinearUnitsToCode(d.defaultUndefined(a[2],-1)))})};e.densify=function(b,c){return h(b,c,function(f,b,a){a=d.autoCastFeatureToGeometry(a);d.pcCheck(a,2,3);if(null===a[0])return null;if(!(a[0]instanceof k))throw Error("Illegal Argument");f=d.toNumber(a[1]);if(isNaN(f))throw Error("Illegal Argument");
if(0>=f)throw Error("Illegal Argument");return a[0]instanceof q||a[0]instanceof t?g.densify(a[0],f,l.convertLinearUnitsToCode(d.defaultUndefined(a[2],-1))):a[0]instanceof r?g.densify(A(a[0]),f,l.convertLinearUnitsToCode(d.defaultUndefined(a[2],-1))):a[0]})};e.densifygeodetic=function(b,c){return h(b,c,function(b,c,a){a=d.autoCastFeatureToGeometry(a);d.pcCheck(a,2,3);if(null===a[0])return null;if(!(a[0]instanceof k))throw Error("Illegal Argument");b=d.toNumber(a[1]);if(isNaN(b))throw Error("Illegal Argument");
if(0>=b)throw Error("Illegal Argument");return a[0]instanceof q||a[0]instanceof t?g.geodesicDensify(a[0],b,l.convertLinearUnitsToCode(d.defaultUndefined(a[2],-1))):a[0]instanceof r?g.geodesicDensify(A(a[0]),b,l.convertLinearUnitsToCode(d.defaultUndefined(a[2],-1))):a[0]})};e.generalize=function(b,c){return h(b,c,function(b,c,a){a=d.autoCastFeatureToGeometry(a);d.pcCheck(a,2,4);if(null===a[0])return null;if(!(a[0]instanceof k))throw Error("Illegal Argument");b=d.toNumber(a[1]);if(isNaN(b))throw Error("Illegal Argument");
return g.generalize(a[0],b,d.toBoolean(d.defaultUndefined(a[2],!0)),l.convertLinearUnitsToCode(d.defaultUndefined(a[3],-1)))})};e.buffer=function(b,c){return h(b,c,function(b,c,a){a=d.autoCastFeatureToGeometry(a);d.pcCheck(a,2,3);if(null===a[0])return null;if(!(a[0]instanceof k))throw Error("Illegal Argument");b=d.toNumber(a[1]);if(isNaN(b))throw Error("Illegal Argument");return 0===b?m(a[0]):g.buffer(a[0],b,l.convertLinearUnitsToCode(d.defaultUndefined(a[2],-1)))})};e.buffergeodetic=function(b,c){return h(b,
c,function(b,c,a){a=d.autoCastFeatureToGeometry(a);d.pcCheck(a,2,3);if(null===a[0])return null;if(!(a[0]instanceof k))throw Error("Illegal Argument");b=d.toNumber(a[1]);if(isNaN(b))throw Error("Illegal Argument");return 0===b?m(a[0]):g.geodesicBuffer(a[0],b,l.convertLinearUnitsToCode(d.defaultUndefined(a[2],-1)))})};e.offset=function(b,c){return h(b,c,function(b,c,a){a=d.autoCastFeatureToGeometry(a);d.pcCheck(a,2,6);if(null===a[0])return null;if(!(a[0]instanceof q||a[0]instanceof t))throw Error("Illegal Argument");
b=d.toNumber(a[1]);if(isNaN(b))throw Error("Illegal Argument");c=d.toNumber(d.defaultUndefined(a[4],10));if(isNaN(c))throw Error("Illegal Argument");var f=d.toNumber(d.defaultUndefined(a[5],0));if(isNaN(f))throw Error("Illegal Argument");return g.offset(a[0],b,l.convertLinearUnitsToCode(d.defaultUndefined(a[2],-1)),d.toString(d.defaultUndefined(a[3],"round")).toLowerCase(),c,f)})};e.rotate=function(b,c){return h(b,c,function(b,c,a){a=d.autoCastFeatureToGeometry(a);d.pcCheck(a,2,3);b=a[0];if(null===
b)return null;if(!(b instanceof k))throw Error("Illegal Argument");b instanceof r&&(b=q.fromExtent(b));c=d.toNumber(a[1]);if(isNaN(c))throw Error("Illegal Argument");a=d.defaultUndefined(a[2],null);if(null===a)return g.rotate(b,c);if(a instanceof v)return g.rotate(b,c,a);throw Error("Illegal Argument");})};e.centroid=function(b,c){return h(b,c,function(c,g,a){a=d.autoCastFeatureToGeometry(a);d.pcCheck(a,1,1);if(null===a[0])return null;if(!(a[0]instanceof k))throw Error("Illegal Argument");return a[0]instanceof
v?d.fixSpatialReference(m(a[0]),b.spatialReference):a[0]instanceof q?p?a[0].centroid:a[0].getCentroid():a[0]instanceof t?y.centroidPolyline(a[0]):a[0]instanceof z?y.centroidMultiPoint(a[0]):a[0]instanceof r?p?a[0].center:a[0].getExtent().getCenter():null})};e.multiparttosinglepart=function(b,c){return h(b,c,function(c,e,a){a=d.autoCastFeatureToGeometry(a);d.pcCheck(a,1,1);e=[];if(null===a[0])return null;if(!(a[0]instanceof k))throw Error("Illegal Argument");if(a[0]instanceof v||a[0]instanceof r)return[d.fixSpatialReference(m(a[0]),
b.spatialReference)];c=g.simplify(a[0]);if(c instanceof q){e=[];var f=[];for(a=0;a<c.rings.length;a++)if(c.isClockwise(c.rings[a])){var h=w.fromJSON({rings:[c.rings[a]],hasZ:p?c.hasZ:!1,hasM:p?c.hasM:!1,spatialReference:p?c.spatialReference.toJSON():c.spatialReference.toJson()});e.push(h)}else f.push({ring:c.rings[a],pt:c.getPoint(a,0)});for(c=0;c<f.length;c++)for(a=0;a<e.length;a++)if(e[a].contains(f[c].pt)){e[a].addRing(f[c].ring);break}return e}if(c instanceof t){e=[];for(a=0;a<c.paths.length;a++)f=
w.fromJSON({paths:[c.paths[a]],hasZ:p?c.hasZ:!1,hasM:p?c.hasM:!1,spatialReference:p?c.spatialReference.toJSON():c.spatialReference.toJson()}),e.push(f);return e}if(a[0]instanceof z){c=d.fixSpatialReference(m(a[0]),b.spatialReference);for(a=0;a<c.points.length;a++)e.push(c.getPoint(a));return e}return null})};e.issimple=function(b,c){return h(b,c,function(b,c,a){a=d.autoCastFeatureToGeometry(a);d.pcCheck(a,1,1);if(null===a[0])return!0;if(a[0]instanceof k)return g.isSimple(a[0]);throw Error("Illegal Argument");
})};e.simplify=function(b,c){return h(b,c,function(b,c,a){a=d.autoCastFeatureToGeometry(a);d.pcCheck(a,1,1);if(null===a[0])return null;if(a[0]instanceof k)return g.simplify(a[0]);throw Error("Illegal Argument");})}}});