// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.9/esri/copyright.txt for details.
//>>built
define("require exports ../../core/tsSupport/declareExtendsHelper ../../core/tsSupport/decorateHelper ../../core/Accessor ../../core/accessorSupport/decorators ../../portal/Portal".split(" "),function(k,l,f,c,g,b,h){return function(d){function a(){var a=null!==d&&d.apply(this,arguments)||this;a.portal=null;return a}f(a,d);e=a;a.prototype.clone=function(){return new e({name:this.name,styleUrl:this.styleUrl,styleName:this.styleName,portal:this.portal})};var e;c([b.property({type:String})],a.prototype,
"name",void 0);c([b.property({type:String})],a.prototype,"styleUrl",void 0);c([b.property({type:String})],a.prototype,"styleName",void 0);c([b.property({type:h})],a.prototype,"portal",void 0);return a=e=c([b.subclass("esri.symbols.support.StyleOrigin")],a)}(b.declared(g))});