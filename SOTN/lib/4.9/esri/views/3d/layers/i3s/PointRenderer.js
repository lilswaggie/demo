// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.9/esri/copyright.txt for details.
//>>built
define("require exports ../../../../geometry/support/aaBoundingBox ../../lib/gl-matrix ../../support/geometryUtils ../../support/orientedBoundingBox ../../webgl-engine/lib/ProgramRepository ../../webgl-engine/lib/RenderPass ../../webgl-engine/materials/internal/MaterialUtil ../../webgl-engine/shaders/PointRendererPrograms ../../../webgl/BufferObject ../../../webgl/VertexArrayObject".split(" "),function(l,P,p,f,L,E,H,y,M,m,A,N){function B(b,a,e,d,c){if(e.drawScreenSpace)return e.fixedSize*a*d;c=(c?
256:64)*a*d;return e.drawFixedSize?Math.min(e.fixedSize/2,c):0<e.screenMinSize?Math.min(Math.max(e.screenMinSize*a*d,b/2),c):Math.min(b/2,c)}function K(b,a,e){null==e&&(e=f.vec3d.create());e[0]=b.origin[0]+b.coordinates[3*a];e[1]=b.origin[1]+b.coordinates[3*a+1];e[2]=b.origin[2]+b.coordinates[3*a+2];return e}var O={positions:[{name:"aPosition",count:3,type:5126,offset:0,stride:12,normalized:!1}],colors:[{name:"aColor",count:3,type:5121,offset:0,stride:3,normalized:!0}]};l=function(){function b(){this.didRender=
!1;this.needsRender=!0;this.layerUid="";this._useFixedSizes=!1;this._scaleFactor=1;this._minSizePx=0;this._useRealWorldSymbolSizes=!1;this._sizePx=this._size=0;this._slicePlaneEnabled=!1;this._clipBox=p.create(p.POSITIVE_INFINITY);this._programRep=null;this._needsPrograms=!0;this._programScreenDepth=this._programWorldDepth=this._programScreen=this._programWorld=null;this.tempMatrix4=f.mat4.create();this.tempVec3=f.vec3.create();this.nodes=[]}b.prototype.initializeRenderContext=function(a){this._programRep=
new H(a.rctx);this._needsPrograms=this.needsRender=!0};b.prototype.uninitializeRenderContext=function(a){this._programRep.dispose();this._programScreenDepth=this._programWorldDepth=this._programScreen=this._programWorld=this._programRep=null};b.prototype.intersect=function(a,e,d,c){var b=f.vec3d.create(),g=f.vec3d.create(),q=f.vec3d.create(),F=f.vec3d.create(),I=L.plane.create(),u=a.camera.perPixelRatio,n=a.camera.near,v=this._getSizeParams();f.vec3d.subtract(d,e,g);var G=1/f.vec3d.length(g);f.vec3d.scale(g,
G,g);f.vec3d.negate(g,q);f.vec4d.set4(g[0],g[1],g[2],-f.vec3d.dot(g,e),I);c={};d={};var m=p.create(),l=p.create(this._clipBox);p.offset(l,-e[0],-e[1],-e[2],l);for(var y=0,A=this.nodes;y<A.length;y++){var h=A[y],C=h.splatSize*this._scaleFactor,w=E.minimumDistancePlane(h.obb,I),r=E.maximumDistancePlane(h.obb,I),w=w-(v.drawScreenSpace?0:B(C,w+n,v,u,h.isLeaf)),r=r-(v.drawScreenSpace?0:B(C,r+n,v,u,h.isLeaf)),w=null!=c.dist&&null!=d.dist&&c.dist<w*G&&d.dist>r*G;if(!(0>r||w)&&(r=B(C,r+n,v,u,h.isLeaf),E.intersectLine(h.obb,
e,g,r))){r*=r;E.toAaBoundingBox(h.obb,m);p.offset(m,-e[0],-e[1],-e[2],m);w=!p.contains(l,m);f.vec3d.subtract(h.origin,e,F);for(var H=h.coordinates.length/3,x=0;x<H;x++)if(b[0]=F[0]+h.coordinates[3*x],b[1]=F[1]+h.coordinates[3*x+1],b[2]=F[2]+h.coordinates[3*x+2],!w||p.containsPoint(l,b)){var t=f.vec3d.dot(b,g),z=t+n,J=v.drawScreenSpace?0:B(C,z,v,u,h.isLeaf);if(!(0>t-J)){var D=f.vec3d.length2(b)-t*t;if(!(D>r||(z-=J,z=B(C,z,v,u,h.isLeaf),D>z*z))){D=this.layerUid+"/"+h.id+"/"+x;t=(t-J)*G;if(null==c.dist||
t<c.dist)c.point=K(h,x,c.point),c.dist=t,c.normal=q,c.pointId=D,c.layerUid=this.layerUid;if(null==d.dist||t>d.dist)d.point=K(h,x,d.point),d.dist=t,d.normal=q,d.pointId=D,d.layerUid=this.layerUid}}}}}null!=c.dist&&(b=a.minResult,null==b.dist||c.dist<b.dist)&&(e={type:"external",point:c.point,metadata:{pointId:c.pointId,layerUid:c.layerUid}},b.set(e,c.pointId,c.dist,c.normal,void 0),b.setIntersector("PointRenderer"));null!=d.dist&&(a=a.maxResult,null==a.dist||d.dist>a.dist)&&(e={type:"external",point:d.point,
metadata:{pointId:d.pointId,layerUid:d.layerUid}},a.set(e,d.pointId,d.dist,d.normal,void 0),a.setIntersector("PointRenderer"))};b.prototype.render=function(a){if(a.pass!==y.MATERIAL&&a.pass!==y.MATERIAL_DEPTH)return!1;for(var b=a.pass===y.MATERIAL_DEPTH,d=a.rctx,c=0,k=this.nodes;c<k.length;c++){var g=k[c];null==g.vao&&this._initNode(a,g)}this._selectPrograms();c=this._getSizeParams();k=b?c.drawScreenSpace?this._programScreenDepth:this._programWorldDepth:c.drawScreenSpace?this._programScreen:this._programWorld;
if(null==k||0===this.nodes.length)return!0;var q=this._clipBox,m=!p.equals(q,p.POSITIVE_INFINITY,function(a,b){return a===b});m||(f.vec3.set3(-Infinity,-Infinity,-Infinity,this.tempVec3),k.setUniform3fv("uClipMin",this.tempVec3),f.vec3.set3(Infinity,Infinity,Infinity,this.tempVec3),k.setUniform3fv("uClipMax",this.tempVec3));d.setDepthTestEnabled(!0);d.bindProgram(k);k.setUniformMatrix4fv("uProjectionMatrix",a.camera.projectionMatrix);b&&k.setUniform2f("nearFar",a.camera.near,a.camera.far);c.drawFixedSize&&
k.setUniform2f("uPointScale",c.fixedSize,a.camera.fullHeight);for(var b=this._slicePlaneEnabled?a.sliceHelper&&a.sliceHelper.plane:null,l=0,u=this.nodes;l<u.length;l++){g=u[l];k.setUniform2f("uScreenMinMaxSize",c.screenMinSize,g.isLeaf?256:64);c.drawFixedSize||k.setUniform2f("uPointScale",g.splatSize*this._scaleFactor,a.camera.fullHeight);var n=g.origin;m&&(f.vec3.set3(q[0]-n[0],q[1]-n[1],q[2]-n[2],this.tempVec3),k.setUniform3fv("uClipMin",this.tempVec3),f.vec3.set3(q[3]-n[0],q[4]-n[1],q[5]-n[2],
this.tempVec3),k.setUniform3fv("uClipMax",this.tempVec3));f.mat4.identity(this.tempMatrix4);f.mat4.translate(this.tempMatrix4,n,this.tempMatrix4);f.mat4.multiply(a.camera.viewMatrix,this.tempMatrix4,this.tempMatrix4);k.setUniformMatrix4fv("uModelViewMatrix",this.tempMatrix4);b&&M.bindSlicePlane(n,b,k);d.bindVAO(g.vao);d.drawArrays(0,0,g.coordinates.length/3)}return!0};Object.defineProperty(b.prototype,"useFixedSizes",{get:function(){return this._useFixedSizes},set:function(a){this._useFixedSizes!==
a&&(this._useFixedSizes=a,this._requestRender())},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"scaleFactor",{get:function(){return this._scaleFactor},set:function(a){this._scaleFactor!==a&&(this._scaleFactor=a,this._requestRender())},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"minSizePx",{get:function(){return this._minSizePx},set:function(a){this._minSizePx!==a&&(this._minSizePx=a,this._requestRender())},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,
"useRealWorldSymbolSizes",{get:function(){return this._useRealWorldSymbolSizes},set:function(a){this._useRealWorldSymbolSizes!==a&&(this._useRealWorldSymbolSizes=a,this._requestRender())},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"size",{get:function(){return this._size},set:function(a){this._size!==a&&(this._size=a,this._requestRender())},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"sizePx",{get:function(){return this._sizePx},set:function(a){this._sizePx!==
a&&(this._sizePx=a,this._requestRender())},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"clippingBox",{set:function(a){p.set(this._clipBox,a||p.POSITIVE_INFINITY)},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"slicePlaneEnabled",{set:function(a){this._slicePlaneEnabled!==a&&(this._slicePlaneEnabled=a,this._requestRender(),this._needsPrograms=!0)},enumerable:!0,configurable:!0});b.prototype.addNode=function(a){this.nodes.push(a);this._requestRender()};b.prototype.removeNode=
function(a){var b=null;this.nodes=this.nodes.filter(function(d){return d.id===a?(b=d,d.vao&&(d.vao.dispose(!0),d.vao=null),!1):!0});this._requestRender();return b};b.prototype.removeAll=function(){this.nodes.forEach(function(a){a.vao&&(a.vao.dispose(!0),a.vao=null)});this.nodes=[];this._requestRender()};b.prototype._initNode=function(a,b){a=a.rctx;b.vao=new N(a,m.program.attributes,O,{positions:A.createVertex(a,35044,b.coordinates),colors:A.createVertex(a,35044,b.rgb)})};b.prototype._requestRender=
function(){this.didRender=!1;this.needsRender=!0};b.prototype._getSizeParams=function(){var a=this._useFixedSizes,b=a&&!this._useRealWorldSymbolSizes,d=b?this._sizePx:this._size,c=this._minSizePx;a&&(c=0);return{drawScreenSpace:b,drawFixedSize:a,fixedSize:d,screenMinSize:c}};b.prototype._selectPrograms=function(){this._needsPrograms&&(this._needsPrograms=!1,this._programWorld=this._programRep.getProgram(m.program,{slicePlaneEnabled:this._slicePlaneEnabled}),this._programScreen=this._programRep.getProgram(m.program,
{drawScreenSize:!0,slicePlaneEnabled:this._slicePlaneEnabled}),this._programWorldDepth=this._programRep.getProgram(m.program,{depthPass:!0,slicePlaneEnabled:this._slicePlaneEnabled}),this._programScreenDepth=this._programRep.getProgram(m.program,{drawScreenSize:!0,depthPass:!0,slicePlaneEnabled:this._slicePlaneEnabled}))};return b}();(function(b){b.isInstanceOfNode=function(a){return a.hasOwnProperty("splatSize")}})(l||(l={}));return l});