// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.9/esri/copyright.txt for details.
//>>built
define("require exports ../../../../../core/tsSupport/extendsHelper ../../../camera/constraintUtils ../../../lib/gl-matrix ../PointToPointAnimationController ../../utils/navigationUtils ../../../webgl-engine/lib/Camera ../../../../animation/easing".split(" "),function(h,l,p,m,c,q,k,n,r){Object.defineProperty(l,"__esModule",{value:!0});h=function(h){function e(a,d){var b=h.call(this,a.state,a.sceneIntersectionHelper,"interaction"===d?null:void 0)||this;b.view=a;b.mode=d;b.zoomLocation=c.vec3d.create();
b.tmpCamera=new n;b.panAxis=c.vec3d.create();b.tmpViewDir=c.vec3d.create();b.targetOnSphere=c.vec3d.create();b.tmpCenter=c.vec3d.create();b.constraintOptions={selection:7,interactionType:1,interactionFactor:null,interactionStartCamera:new n,interactionDirection:null,tiltMode:0};b.sphere={center:c.vec3d.create(),radius:0};return b}p(e,h);Object.defineProperty(e.prototype,"isInteractive",{get:function(){return"interaction"===this.mode},enumerable:!0,configurable:!0});e.prototype.zoomStep=function(a,
d){if(this.active){var b=this.view.state,f=this.constraintOptions.interactionStartCamera;this.animation.finished?f.copyFrom(b.camera):this.animation.cameraAt(1,f);f=!1;0<a&&this.intersectionHelper.pickPointInScreen(d,this.zoomLocation)&&(f=!0);this.tmpCamera.copyFrom(b.camera);f?this.intersectionHelper.pickPointFromSegment(this.tmpCamera.eye,this.tmpCamera.center,this.tmpCenter)&&(this.tmpCamera.center=this.tmpCenter):this.intersectionHelper.pickPointFromSegment(this.tmpCamera.eye,this.tmpCamera.center,
this.zoomLocation)?this.tmpCamera.center=this.zoomLocation:c.vec3d.set(this.tmpCamera.center,this.zoomLocation);this.updateCamera(this.tmpCamera,Math.pow(.6,a),this.zoomLocation,d);this.begin(this.tmpCamera)}};e.prototype.animationSettings=function(){return{apex:null,duration:.6,easing:r.outExpo}};e.prototype.updateCamera=function(a,d,b,f){this.sphere.radius=c.vec3d.length(b);c.vec3d.subtract(a.center,a.eye,this.tmpViewDir);var g=c.vec3d.length(this.tmpViewDir),e=g*d;1>=d&&4>e&&(e=4,d=e/g);1E-6>Math.abs(g-
e)||(g=c.vec3d.length(a.center),this.sphere.radius!==g&&c.vec3d.scale(a.center,(this.sphere.radius+d*(g-this.sphere.radius))/g),c.vec3d.scale(this.tmpViewDir,-d),c.vec3d.add(a.center,this.tmpViewDir,a.eye),m.applyAll(this.view,a,this.constraintOptions),1E-12<c.vec3d.dist2(b,a.center)&&k.intersectSphereFromScreenPoint(this.sphere,a,f,this.targetOnSphere)&&(d=k.rotationAndAxisFromPoints(b,this.targetOnSphere,this.panAxis),k.applyRotation(a,this.sphere.center,this.panAxis,d)),m.applySurfaceCollision(this.view,
a))};return e}(q.PointToPointAnimationController);l.ZoomStepController=h});