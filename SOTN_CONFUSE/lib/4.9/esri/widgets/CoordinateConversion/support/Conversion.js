// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.9/esri/copyright.txt for details.
//>>built
define("require exports ../../../core/tsSupport/declareExtendsHelper ../../../core/tsSupport/decorateHelper ../../../core/Accessor ../../../core/accessorSupport/decorators".split(" "),function(g,h,e,c,f,b){return function(d){function a(){var a=null!==d&&d.apply(this,arguments)||this;a.format=null;a.position={coordinate:null,location:null};return a}e(a,d);Object.defineProperty(a.prototype,"displayCoordinate",{get:function(){var a=this.get("format");return a&&a.getDisplayCoordinate(this.get("position.coordinate"))},
enumerable:!0,configurable:!0});c([b.property({readOnly:!0,dependsOn:["position","format.currentPattern"]})],a.prototype,"displayCoordinate",null);c([b.property()],a.prototype,"format",void 0);c([b.property()],a.prototype,"position",void 0);return a=c([b.subclass("esri.widgets.CoordinateConversion.support.Conversion")],a)}(b.declared(f))});