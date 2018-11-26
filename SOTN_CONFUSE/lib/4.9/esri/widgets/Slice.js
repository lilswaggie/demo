// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.9/esri/copyright.txt for details.
//>>built
define("require exports ../core/tsSupport/declareExtendsHelper ../core/tsSupport/decorateHelper ../core/accessorSupport/decorators ./Widget ./slice/SliceViewModel ./support/widget".split(" "),function(k,l,g,c,b,h,f,d){return function(e){function a(){var a=null!==e&&e.apply(this,arguments)||this;a.view=null;a.viewModel=new f;a.plane=null;return a}g(a,e);a.prototype.render=function(){var a=this,b=this.plane?d.tsx("button",{class:"esri-button esri-button--secondary",bind:this,onclick:function(){a.plane=
null}},"Clear"):null,c=this.plane?null:d.tsx("section",{key:"esri-slice__hint",class:"esri-slice__hint"},d.tsx("p",null,"Start to slice by clicking and dragging on a surface in the scene")),b=d.tsx("div",{class:"esri-slice__container"},c,b);return d.tsx("div",{key:"",class:"esri-slice esri-widget esri-widget--panel",role:"presentation"},b)};c([b.aliasOf("viewModel.view")],a.prototype,"view",void 0);c([b.property({type:f})],a.prototype,"viewModel",void 0);c([b.aliasOf("viewModel.plane"),d.renderable()],
a.prototype,"plane",void 0);return a=c([b.subclass("esri.widgets.Slice")],a)}(b.declared(h))});