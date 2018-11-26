// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.9/esri/copyright.txt for details.
//>>built
define("require exports ../../../lib/gl-matrix ../../lib/RenderSlot ./MaterialUtil ../../shaders/MiscPrograms".split(" "),function(h,k,d,e,c,f){var g=d.vec4d.createFrom(1,1,1,1);return function(){function b(a,b,c,d,e){this.program=a.getProgram(f.texOnly);this.color=c;this.depthFunc=e;this.blend=d;this.texGLName=b}b.prototype.beginSlot=function(a){return a===e.INTERNAL_MATERIAL};b.prototype.getProgram=function(){return this.program};b.prototype.setColor=function(a){this.color=a};b.prototype.bind=function(a,
b){a.bindProgram(this.program);this.program.setUniformMatrix4fv("model",c.IDENTITY);this.program.setUniformMatrix4fv("proj",b.proj);this.program.setUniform4fv("color",void 0!==this.color?this.color:g);this.program.setUniform1i("tex",0);a.bindTexture(this.texGLName,0);this.blend&&(a.setBlendingEnabled(!0),a.setBlendFunctionSeparate(a.gl.SRC_ALPHA,a.gl.ONE_MINUS_SRC_ALPHA,a.gl.ONE,a.gl.ONE_MINUS_SRC_ALPHA));a.setDepthTestEnabled(!0);void 0!==this.depthFunc&&a.setDepthFunction(this.depthFunc)};b.prototype.release=
function(a){void 0!==this.depthFunc&&a.setDepthFunction(513);this.blend&&a.setBlendingEnabled(!1)};b.prototype.bindView=function(a,b){c.bindView(b.origin,b.view,this.program)};b.prototype.bindInstance=function(a,b){this.program.setUniformMatrix4fv("model",b.transformation)};b.prototype.getDrawMode=function(a){return a.gl.TRIANGLES};return b}()});