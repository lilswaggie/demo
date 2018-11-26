// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.9/esri/copyright.txt for details.
//>>built
define("require exports ../../core/tsSupport/declareExtendsHelper ../../core/tsSupport/decorateHelper ../../core/Accessor ../../core/Evented ../../core/Logger ../../core/accessorSupport/decorators ../../geometry/support/aaBoundingRect ../../geometry/support/contains ../../geometry/support/webMercatorUtils ../../layers/support/ElevationSampler ../3d/terrain/TerrainConst".split(" "),function(t,u,g,d,h,k,l,c,m,n,p,q,r){var e=l.getLogger("esri.views.support.GroundViewElevationSampler");return function(f){function a(b){b=
f.call(this,b)||this;b.demResolution={min:-1,max:-1};b.noDataValue=r.noDataValueOpt.noDataValue;return b}g(a,f);a.prototype.initialize=function(){var b=this;this.view.basemapTerrain.on("elevation-change",function(){return b.emit("changed",{})})};Object.defineProperty(a.prototype,"extent",{get:function(){var b=this.view.basemapTerrain;return b.extent&&b.spatialReference?m.toExtent(b.extent,b.spatialReference):null},enumerable:!0,configurable:!0});a.prototype.elevationAt=function(b){var a=b.spatialReference,
c=this.spatialReference;if(!p.canProject(a,c))return e.error("Cannot sample elevation at a location with spatial reference ("+(a?a.wkid:"unknown")+") different from the view ("+c.wkid+")"),null;n.extentContainsPoint(this.extent,b)||(a=this.extent,e.warn("#elevationAt()","Point used to sample elevation ("+b.x+", "+b.y+") is outside of the sampler extent ("+(a.xmin+", "+a.ymin+", "+a.xmax+", "+a.ymax)+")"));return this.view.basemapTerrain.getElevation(b)};a.prototype.queryElevation=function(a){return q.updateGeometryElevation(a.clone(),
this)};d([c.property({readOnly:!0})],a.prototype,"demResolution",void 0);d([c.property({readOnly:!0,dependsOn:["view.basemapTerrain.extent","view.basemapTerrain.spatialReference"]})],a.prototype,"extent",null);d([c.property({readOnly:!0})],a.prototype,"noDataValue",void 0);d([c.property({readOnly:!0,aliasOf:"view.basemapTerrain.spatialReference"})],a.prototype,"spatialReference",void 0);d([c.property({constructOnly:!0})],a.prototype,"view",void 0);return a=d([c.subclass("esri.views.support.GroundViewElevationSampler")],
a)}(c.declared(h,k))});