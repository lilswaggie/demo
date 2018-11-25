// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.9/esri/copyright.txt for details.
//>>built
define("require exports ../../../../core/tsSupport/extendsHelper ./Camera ../../lib/gl-matrix ../../webgl-engine/lib/Camera ../../../animation/pointToPoint/Animation".split(" "),function(e,k,q,l,f,m,n){Object.defineProperty(k,"__esModule",{value:!0});var p=f.vec3d.create();e=function(){function d(b){this.currentTime=0;this.animation=new n.Animation(function(){return new l.default(b)});this._current=new l.default(b)}Object.defineProperty(d.prototype,"finished",{get:function(){return this.currentTime>=
this.animation.time},enumerable:!0,configurable:!0});Object.defineProperty(d.prototype,"time",{get:function(){return this.animation.time},enumerable:!0,configurable:!0});d.prototype.update=function(b,c,d){var g=this.animation.definition.source,e=this.animation.definition.target,a=f.vec3d.subtract(c.center,b.center,p),h=f.vec3d.length(a);1E-5<=h?(a[0]/=h,a[1]/=h,a[2]/=h):(a[0]=0,a[1]=1,a[0]=0);f.vec3d.set(a,g.lookAtDirection);f.vec3d.set(a,e.lookAtDirection);g.copyFromRenderCamera(b);e.copyFromRenderCamera(c);
this._current.copyFrom(g);this.animation.update(g,e,d);this.currentTime=0;b.almostEquals(c,5E-4,!0)&&(this.currentTime=this.animation.time)};d.prototype.cameraAt=function(b,c){this.animation.cameraAt(b,this._current);c=c||new m;this._current.copyToRenderCamera(c);return c};d.prototype.step=function(b,c){this.finished||(this.currentTime+=b,this.currentTime>=this.time&&(this.currentTime=this.time));return this.cameraAt(this.currentTime/this.time,c)};return d}();k.Animation=e;k.default=e});