// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.9/esri/copyright.txt for details.
//>>built
define("require exports ../core/tsSupport/declareExtendsHelper ../core/tsSupport/decorateHelper dojo/dom dojo/dom-construct dojo/on ../core/Accessor ../core/Evented ../core/Handles ../core/scheduling ../core/watchUtils ../core/accessorSupport/decorators ./PopupManager ./overlay/ViewOverlay ../widgets/Popup".split(" "),function(z,A,u,f,m,k,v,w,x,y,n,l,e,p,q,r){var h=[0,0];return function(t){function b(){var a=t.call(this)||this;a._domHandles=new y;a._freqInfo={freq:16,time:750};a._overlayRenderTaskHandle=
null;a.height=0;a.popup=new r({view:a});a.position=null;a.resizing=!1;a.root=null;a.surface=null;a.suspended=!0;a.ui=null;a.userContent=null;a.width=0;a.watch("cursor",function(d){var c=a.surface;c&&c.setAttribute("data-cursor",d)});a.watch("interacting",function(d){var c=a.surface;c&&c.setAttribute("data-interacting",d.toString())});a._focusEvent=a._focusEvent.bind(a);a._blurEvent=a._blurEvent.bind(a);return a}u(b,t);b.prototype.initialize=function(){this.watch("ui",this._handleUIChange);this._wireUI(this.ui)};
b.prototype.destroy=function(){this.ui.destroy();this.popup&&!this.popup.destroyed&&this.popup.destroy();this.container=null;this._domHandles.destroy()};Object.defineProperty(b.prototype,"container",{set:function(a){var d=this,c=this._get("container");if(c!==a){this._domHandles.remove("dom-size");this._stopMeasuring();if(c){var b=this.surface;b&&(b.removeEventListener("focus",this._focusEvent),b.removeEventListener("blur",this._blurEvent));c.classList.remove("esri-view");this.popupManager.destroy();
this._set("popupManager",null);this._overlayRenderTaskHandle&&(this._overlayRenderTaskHandle.remove(),this._overlayRenderTaskHandle=null);this.overlay.destroy();this._set("overlay",null);k.destroy(this.root);this._set("root",null);k.destroy(this.userContent);this._set("userContent",null)}if(a){a.classList.add("esri-view");c=document.createElement("div");for(c.className="esri-view-user-storage";a.hasChildNodes();)c.appendChild(a.firstChild);a.appendChild(c);c=document.createElement("div");c.className=
"esri-view-root";a.insertBefore(c,a.firstChild);this._set("root",c);var g=document.createElement("div");g.className="esri-view-surface";g.setAttribute("role","application");g.tabIndex=0;g.addEventListener("focus",this._focusEvent);g.addEventListener("blur",this._blurEvent);m.setSelectable(g,!1);c.appendChild(g);this._set("surface",g);b=new q;c.appendChild(b.surface);this._set("overlay",b);b.watch("needsRender",function(a){a&&!d._overlayRenderTaskHandle?d._overlayRenderTaskHandle=n.addFrameTask({render:function(){d.overlay.render()}}):
d._overlayRenderTaskHandle&&(d._overlayRenderTaskHandle.remove(),d._overlayRenderTaskHandle=null)});this._forceReadyCycle();this._domHandles.add(l.init(this,"size",function(a){var c=a[1];g.classList.toggle("esri-view-surface--inset-outline",a[0]>=document.body.clientWidth||c>=document.body.clientHeight)}),"dom-size");this._set("container",a);this._startMeasuring();a=new p({enabled:!0,view:this});this._set("popupManager",a)}else this._set("width",0),this._set("height",0),this._set("position",null),
this._set("suspended",!0),this._set("surface",null),this._set("container",null)}},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"focused",{get:function(){return document.activeElement===this.surface},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"size",{get:function(){return[this.width,this.height]},enumerable:!0,configurable:!0});b.prototype.blur=function(){this.surface&&this.surface.blur()};b.prototype.focus=function(){this.surface&&this.surface.focus()};
b.prototype.pageToContainer=function(a,b,c){var d=this.position;a-=d[0];b-=d[1];c?(c[0]=a,c[1]=b):c=[a,b];return c};b.prototype.containerToPage=function(a,b,c){var d=this.position;a+=d[0];b+=d[1];c?(c[0]=a,c[1]=b):c=[a,b];return c};b.prototype._handleUIChange=function(a,b){b&&(this._domHandles.remove("ui"),b.destroy());a&&this._wireUI(a);this._set("ui",a)};b.prototype._wireUI=function(a){this._domHandles.remove("ui");a&&(a.view=this,this._domHandles.add([l.init(this,"root",function(b){a.container=
b?k.create("div",null,b):null}),l.init(this,"popup",function(b,c){c&&(a.remove(c,"popup"),c!==b&&c.destroy());b&&(b.view=a.view,a.add(b,{key:"popup",position:"manual"}))})],"ui"))};b.prototype._focusEvent=function(a){this.notifyChange("focused");this.emit("focus",{native:a})};b.prototype._blurEvent=function(a){this.notifyChange("focused");this.emit("blur",{native:a})};b.prototype._stopMeasuring=function(){this._domHandles.remove("measuring");this._get("resizing")&&this._set("resizing",!1)};b.prototype._startMeasuring=
function(){var a=this,b=this._freqInfo;b.freq=16;b.time=750;this._domHandles.add([v(window,"resize",function(){b.freq=16;b.time=750}),n.addFrameTask({prepare:function(b){var c=a._measure(),d=a._freqInfo;d.time+=b.deltaTime;c&&(d.freq=16,a._get("resizing")||a._set("resizing",!0));d.time<d.freq||(d.time=0,a._position()||c?d.freq=16:d.freq=Math.min(750,2*d.freq),!c&&512<=d.freq&&a._get("resizing")&&a._set("resizing",!1))}})],"measuring");this._measure();this._position()};b.prototype._measure=function(){var a=
this.container,b=a?a.clientWidth:0,c=a?a.clientHeight:0;if(0===b||0===c||"hidden"===window.getComputedStyle(a).visibility)return this.suspended||this._set("suspended",!0),!1;var a=this.width,e=this.height;if(b===a&&c===e)return this.suspended&&this._set("suspended",!1),!1;this._set("width",b);this._set("height",c);this.suspended&&this._set("suspended",!1);this.emit("resize",{oldWidth:a,oldHeight:e,width:b,height:c});return!0};b.prototype._position=function(){var a=this.container,b=this.position,c=
(a.ownerDocument||window.document).defaultView,a=a.getBoundingClientRect();h[0]=a.left+c.pageXOffset;h[1]=a.top+c.pageYOffset;return b&&h[0]===b[0]&&h[1]===b[1]?!1:(this._set("position",[h[0],h[1]]),!0)};f([e.property({value:null,cast:function(a){return m.byId(a)}})],b.prototype,"container",null);f([e.property({readOnly:!0,dependsOn:["surface"]})],b.prototype,"focused",null);f([e.property({readOnly:!0})],b.prototype,"height",void 0);f([e.property({type:r})],b.prototype,"popup",void 0);f([e.property({type:p})],
b.prototype,"popupManager",void 0);f([e.property({type:q})],b.prototype,"overlay",void 0);f([e.property({readOnly:!0})],b.prototype,"position",void 0);f([e.property({readOnly:!0})],b.prototype,"resizing",void 0);f([e.property({readOnly:!0})],b.prototype,"root",void 0);f([e.property({value:null,dependsOn:["width","height"],readOnly:!0})],b.prototype,"size",null);f([e.property({readOnly:!0})],b.prototype,"surface",void 0);f([e.property({readOnly:!0})],b.prototype,"suspended",void 0);f([e.property()],
b.prototype,"ui",void 0);f([e.property({readOnly:!0})],b.prototype,"userContent",void 0);f([e.property({readOnly:!0})],b.prototype,"width",void 0);return b=f([e.subclass("esri.views.DOMContainer")],b)}(e.declared(w,x))});