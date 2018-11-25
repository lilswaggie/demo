// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.9/esri/copyright.txt for details.
//>>built
define("require exports ../../core/tsSupport/declareExtendsHelper ../../core/tsSupport/decorateHelper ../../core/tsSupport/paramHelper ../../core/Collection ../../core/Handles ../../core/MultiOriginJSONSupport ../../core/accessorSupport/decorators ../../core/accessorSupport/ensureType ../../geometry/Extent".split(" "),function(q,r,g,d,t,h,k,l,c,m,n){var p=0;return function(f){function b(a){a=f.call(this)||this;a._sublayersHandles=new k;a.fullExtents=null;a.featureInfoFormat=null;a.featureInfoUrl=
null;a.legendUrl=null;a.legendEnabled=!0;a.popupEnabled=!1;a.queryable=!1;a.spatialReferences=null;return a}g(b,f);e=b;Object.defineProperty(b.prototype,"description",{get:function(){return this._get("description")},set:function(a){this._set("description",a)},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"fullExtent",{get:function(){return this._get("fullExtent")},set:function(a){this._set("fullExtent",a)},enumerable:!0,configurable:!0});b.prototype.readExtent=function(a,b,c){return(a=
b.extent)?n.fromJSON(a):null};Object.defineProperty(b.prototype,"id",{get:function(){var a=this._get("id");return null==a?p++:a},set:function(a){this._set("id",a)},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"layer",{set:function(a){this._set("layer",a);this.sublayers&&this.sublayers.forEach(function(b){return b.layer=a})},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"name",{get:function(){return this._get("name")},set:function(a){this._set("name",a)},enumerable:!0,
configurable:!0});Object.defineProperty(b.prototype,"sublayers",{set:function(a){var b=this,c=this._get("sublayers");c&&(c.forEach(function(a){a.layer=null}),this._sublayersHandles.removeAll(),this._sublayersHandles=null);a&&(a.forEach(function(a){a.parent=b;a.layer=b.layer}),this._sublayersHandles.add([a.on("after-add",function(a){a=a.item;a.parent=b;a.layer=b.layer}),a.on("after-remove",function(a){a=a.item;a.parent=null;a.layer=null})]));this._set("sublayers",a)},enumerable:!0,configurable:!0});
b.prototype.castSublayers=function(a){return m.default(h.ofType(e),a)};Object.defineProperty(b.prototype,"title",{get:function(){return this._get("title")},set:function(a){this._set("title",a)},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"visible",{get:function(){return this._get("visible")},set:function(a){this._setAndNotifyLayer("visible",a)},enumerable:!0,configurable:!0});b.prototype.clone=function(){var a=new e;this.hasOwnProperty("description")&&(a.description=this.description);
this.hasOwnProperty("fullExtent")&&(a.fullExtent=this.fullExtent.clone());this.hasOwnProperty("fullExtents")&&(a.fullExtents=this.fullExtents.map(function(a){return a.clone()}));this.hasOwnProperty("featureInfoFormat")&&(a.featureInfoFormat=this.featureInfoFormat);this.hasOwnProperty("featureInfoUrl")&&(a.featureInfoUrl=this.featureInfoUrl);this.hasOwnProperty("legendUrl")&&(a.legendUrl=this.legendUrl);this.hasOwnProperty("legendEnabled")&&(a.legendEnabled=this.legendEnabled);this.hasOwnProperty("layer")&&
(a.layer=this.layer);this.hasOwnProperty("name")&&(a.name=this.name);this.hasOwnProperty("parent")&&(a.parent=this.parent);this.hasOwnProperty("queryable")&&(a.queryable=this.queryable);this.hasOwnProperty("sublayers")&&(a.sublayers=this.sublayers&&this.sublayers.map(function(a){return a.clone()}));this.hasOwnProperty("spatialReferences")&&(a.spatialReferences=this.spatialReferences.map(function(a){return a}));this.hasOwnProperty("visible")&&(a.visible=this.visible);this.hasOwnProperty("title")&&
(a.title=this.title);return a};b.prototype._setAndNotifyLayer=function(a,b){var c=this.layer;this._get(a)!==b&&(this._set(a,b),c&&c.emit("wms-sublayer-update",{propertyName:a,id:this.id}))};var e;d([c.property()],b.prototype,"description",null);d([c.property({value:null})],b.prototype,"fullExtent",null);d([c.reader("fullExtent",["extent"])],b.prototype,"readExtent",null);d([c.property()],b.prototype,"fullExtents",void 0);d([c.property()],b.prototype,"featureInfoFormat",void 0);d([c.property()],b.prototype,
"featureInfoUrl",void 0);d([c.property({type:String,json:{write:{ignoreOrigin:!0}}})],b.prototype,"id",null);d([c.property({type:String,json:{origins:{"web-document":{read:{source:"legendUrl"},write:{target:"legendUrl",ignoreOrigin:!0}}},read:{source:"legendURL"},write:{ignoreOrigin:!0}}})],b.prototype,"legendUrl",void 0);d([c.property({value:!0,type:Boolean,json:{read:{source:"showLegend"},write:{target:"showLegend"},origins:{"web-map":{read:!1,write:!1},"web-scene":{read:!1,write:!1}}}})],b.prototype,
"legendEnabled",void 0);d([c.property({value:null})],b.prototype,"layer",null);d([c.property({type:String,value:null,json:{read:{source:"name"},write:{ignoreOrigin:!0}}})],b.prototype,"name",null);d([c.property()],b.prototype,"parent",void 0);d([c.property({type:Boolean,json:{read:{source:"showPopup"},write:{ignoreOrigin:!0,target:"showPopup"}}})],b.prototype,"popupEnabled",void 0);d([c.property({type:Boolean,json:{write:{ignoreOrigin:!0}}})],b.prototype,"queryable",void 0);d([c.property()],b.prototype,
"sublayers",null);d([c.cast("sublayers")],b.prototype,"castSublayers",null);d([c.property({type:[Number],json:{read:{source:"spatialReferences"}}})],b.prototype,"spatialReferences",void 0);d([c.property({type:String,value:null,json:{write:{ignoreOrigin:!0}}})],b.prototype,"title",null);d([c.property({type:Boolean,value:!0,json:{read:{source:"defaultVisibility"}}})],b.prototype,"visible",null);return b=e=d([c.subclass("esri.layers.support.WMSSublayer")],b)}(c.declared(l))});