// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.9/esri/copyright.txt for details.
//>>built
define("require exports ../../../../geometry/support/coordsUtils ../../../../geometry/support/triangulationUtils ../../../../layers/graphics/dehydratedFeatures ../../../../symbols/callouts/calloutUtils ./graphicUtils ../../lib/gl-matrix ../../support/projectionUtils ../../webgl-engine/lib/Object3D".split(" "),function(M,e,B,H,x,I,C,D,q,J){function y(b,a,c,d,f){var p=a.z||0,e=c.featureExpressionInfoContext;switch(c.mode){case "on-the-ground":return c=b.getElevation(a,"ground")||0,f&&(f.verticalDistanceToGround=
0,f.terrainElevation=c),c;case "relative-to-ground":return b=b.getElevation(a,"ground")||0,c=c.calculateOffsetRenderUnits(d),null==e&&(c+=p),f&&(f.verticalDistanceToGround=c,f.terrainElevation=b),c+b;case "relative-to-scene":return b=b.getElevation(a,"scene")||0,c=c.calculateOffsetRenderUnits(d),f&&(f.verticalDistanceToGround=c,f.terrainElevation=b),c+b;case "absolute-height":return c=c.calculateOffsetRenderUnits(d),null==e&&(c+=p),f&&(b=b.getElevation(a,"ground")||0,f.verticalDistanceToGround=c-
b,f.terrainElevation=b),c}return 0}function z(b,a){b=H.pathsToTriangulationInfo(b,a);return{vertexData:b.position,polygons:b.polygons,outlines:b.outlines}}function E(b,a,c,d,f){a*=3;d*=3;for(var e=0;e<f;++e)c[d++]=b[a++],c[d++]=b[a++],c[d++]=b[a++]}function A(b,a,c,d,f,e,h){return q.bufferToBuffer(b,c,a,d,e,f,h)}function w(b,a,c){q.pointToVector(b,a,c)}function F(b,a){return!(b[0]>a[3]||b[0]<a[0]||b[1]>a[4]||b[1]<a[1])}function G(b,a){return!(a[0]>b[3]||a[3]<b[0]||a[1]>b[4]||a[4]<b[1])}Object.defineProperty(e,
"__esModule",{value:!0});var g=D.vec3d.create(),K=D.mat4d.identity(),m=x.makeDehydratedPoint(0,0,0,null);e.createStageObjectForPoint=function(b,a,c,d,f,e,h,k,m,L,r){var p=a?a.length:0,v=this._context.clippingExtent;w(b,g,this._context.elevationProvider.spatialReference);if(v&&!F(g,v))return null;w(b,g,this._context.renderSpatialReference);v=this._context.localOriginFactory.getOrigin(g);h=new J({castShadow:!1,metadata:{layerUid:k,graphicUid:m,usesVerticalDistanceToGround:!!L},idHint:h});for(k=0;k<
p;k++)h.addGeometry(a[k],c[k],d?d[k]:K,f,v,r);a=this._context.renderSpatialReference;d=this._context.elevationProvider;f=this._context.renderCoordsHelper;c=0;var l;h.metadata.usesVerticalDistanceToGround?(c=y(d,b,e,f,n),C.updateVertexAttributeAuxpos1w(h,n.verticalDistanceToGround),l=n.terrainElevation):(r="absolute-height"!==e.mode,c=y(d,b,e,f,r?n:null),r&&(l=n.terrainElevation));e=h.getObjectTransformation();g[0]=b.x;g[1]=b.y;g[2]=c;q.computeLinearTransformation(b.spatialReference,g,e,a)?h.setObjectTransformation(e):
console.warn("Could not locate symbol object properly, it might be misplaced");return{object:h,terrainElevation:l}};e.extendPointGraphicElevationContext=function(b,a,c){b=b.elevationContext;c=c.spatialReference;w(a,g,c);b.centerPointInElevationSR=x.makeDehydratedPoint(g[0],g[1],a.hasZ?g[2]:0,c)};e.placePointOnGeometry=function(b){switch(b.type){case "point":return b;case "polygon":case "extent":return C.computeCentroid(b);case "polyline":var a=b.paths[0];if(!a||0===a.length)break;a=B.getPointOnPath(a,
B.getPathLength(a)/2);return x.makeDehydratedPoint(a[0],a[1],a[2],b.spatialReference);case "mesh":return b.extent.center}return null};e.computeElevation=y;e.getSingleSizeDriver=function(b,a){void 0===a&&(a=0);return isFinite(b[a])?b[a]:null};e.copyPathData=z;e.copyVertices=E;e.chooseOrigin=function(b,a,c,d){a=Math.floor(a+(c-1)/2);d[0]=b[3*a+0];d[1]=b[3*a+1];d[2]=b[3*a+2]};e.subtractCoordinates=function(b,a,c,d){a*=3;for(var f=0;f<c;++f)b[a++]-=d[0],b[a++]-=d[1],b[a++]-=d[2]};e.setZ=function(b,a,
c,d){a*=3;for(var f=0;f<c;++f)b[a+2]=d,a+=3};e.offsetZ=function(b,a,c,d){a*=3;for(var f=0;f<c;++f)b[a+2]+=d,a+=3};e.scaleZ=function(b,a,c,d){a*=3;for(var f=0;f<c;++f)b[a+2]*=d,a+=3};e.flatArrayToArrayOfArrays=function(b,a,c){var d=[];a*=3;for(var f=0;f<c;++f)d.push([b[a++],b[a++],b[a++]]);return d};e.reproject=A;e.reprojectPoint=w;e.getGeometryVertexData3D=function(b,a,c,d,f,e,h){var k=f.spatialReference;b=z(b,a);a=b.vertexData;var p=a.length/3,g=new Float64Array(a.length),r=!0;c.equals(k)?E(a,0,
g,0,a.length):r=A(a,0,c,g,0,k,p);var u=c=0,v=h.mode,l=0,t=0,n=0;e=h.calculateOffsetRenderUnits(e);h=h.featureExpressionInfoContext;m.spatialReference=f.spatialReference;c*=3;for(var u=3*u,q=0;q<p;++q){m.x=g[c+0];m.y=g[c+1];m.z=g[c+2];switch(v){case "on-the-ground":t=l=f.getElevation(m)||0;n+=l;break;case "relative-to-ground":l=f.getElevation(m)||0;t=l+e;null==h&&(t+=m.z);n+=l;break;case "relative-to-scene":l=f.getElevation(m,"scene")||0;t=l+e;n+=l;break;case "absolute-height":t=e,null==h&&(t+=m.z)}a[u+
0]=g[c+0];a[u+1]=g[c+1];a[u+2]=t;c+=3;u+=3}f=n/p;k.equals(d)||A(a,0,k,a,0,d,p);return{geometryData:b,vertexData:a,eleVertexData:g,terrainElevation:f,projectionSuccess:r}};e.getGeometryVertexDataDraped=function(b,a,c){b=z(b,!1);var d=b.vertexData,f=d.length/3,e=!0;a.equals(c)||(e=q.bufferToBuffer(d,a,0,d,c,0,f));return{geometryData:b,vertexData:d,projectionSuccess:e}};e.computeBoundingBox=function(b,a,c,d){d[0]=Number.MAX_VALUE;d[1]=Number.MAX_VALUE;d[2]=Number.MAX_VALUE;d[3]=-Number.MAX_VALUE;d[4]=
-Number.MAX_VALUE;d[5]=-Number.MAX_VALUE;a*=3;for(var e=0;e<c;++e){var g=b[a++],h=b[a++],k=b[a++];g<d[0]&&(d[0]=g);h<d[1]&&(d[1]=h);k<d[2]&&(d[2]=k);g>d[3]&&(d[3]=g);h>d[4]&&(d[4]=h);k>d[5]&&(d[5]=k)}return d};e.pointInBox2D=F;e.boxesIntersect2D=G;e.boundingBoxClipped=function(b,a){return a?!G(b,a):!1};e.needsElevationUpdates2D=function(b){return"relative-to-ground"===b||"relative-to-scene"===b};e.needsElevationUpdates3D=function(b){return"absolute-height"!==b};e.needsOffsetAdjustment=function(b,
a,c,d){if(!1===a.needsOffsetAdjustment||!1===a.supportsOffsetAdjustment||"on-the-ground"===b.mode)return!1;if(0===b.meterUnitOffset){if(!0===a.needsOffsetAdjustment)return!0;if(I.isCalloutSupport(d)&&d.hasVisibleVerticalOffset())return!1;if("relative-to-ground"===b.mode&&(!c.hasZ||b.featureExpressionInfoContext)||"relative-to-scene"===b.mode)return!0}return!1};var n={verticalDistanceToGround:0,terrainElevation:0}});