// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.9/esri/copyright.txt for details.
//>>built
define("require exports ../../../../../core/tsSupport/assignHelper ../../../../../core/tsSupport/extendsHelper ../../../lib/gl-matrix ../../../support/mathUtils ../../materials/internal/MaterialUtil ../../shaders/EdgeRendererPrograms".split(" "),function(g,d,h,r,k,m,n,l){Object.defineProperty(d,"__esModule",{value:!0});d.LINE_WIDTH_FRACTION_FACTOR=8;d.EXTENSION_LENGTH_OFFSET=128;var p={type:"solid",slicePlaneEnabled:!1,uber:!0,strokesTexture:null},q=function(){function b(){this._value=0}Object.defineProperty(b.prototype,
"value",{get:function(){return this._value},enumerable:!0,configurable:!0});b.prototype.increment=function(){this._value++};b.prototype.decrement=function(){this._value--};return b}();g=function(){function b(a,c,e){this.rctx=a;this.programRepository=c;this.refCount=new q;this.renderables=new Set;this.depthBiasZ=-4E-4;this.depthBiasXY=.5;this.tmpViewToWorldNormalMatrix=k.mat3d.create();this.settings=h({},p,e);this.key=b.getKey(this.settings.uber,this.settings.type,this.settings.slicePlaneEnabled);
this.writerSettings={variants:this.settings.strokesTexture.variants};this.createPrograms()}b.prototype.dispose=function(){for(var a in this.programs){var c=this.programs[a];c&&(this.programRepository.decreaseRefCount(c),this.programs[a]=null)}};b.prototype.addRenderable=function(a){this.renderables.add(a)};b.prototype.removeRenderable=function(a){this.renderables.delete(a)};b.prototype.forEachRenderable=function(a){this.renderables.forEach(a)};b.prototype.bindRegularEdges=function(a,c){this.bind(this.programs.regular,
a,c)};b.prototype.bindSilhouetteEdges=function(a,c){this.bind(this.programs.silhouette,a,c)};b.prototype.bind=function(a,c,b){this.rctx.bindProgram(a);a.setUniformMatrix4fv("uProj",c.proj);a.setUniform2f("uDepthBias",this.depthBiasXY,this.depthBiasZ);a.setUniform2f("uPixelToNDC",2/c.viewport[2],2/c.viewport[3]);a.setUniform2f("uNDCToPixel",c.viewport[2]/2,c.viewport[3]/2);a.setUniform1f("uDistanceFalloffFactor",b.distanceFalloffFactor);a.setUniform2f("uViewportDimInv",1/c.viewport[2],1/c.viewport[3]);
a.setUniform1f("uPixelRatio",c.pixelRatio||1)};b.prototype.renderRegularEdges=function(a,c,b){this.render(this.programs.regular,a,a.regular.vao,c,b)};b.prototype.renderSilhouetteEdges=function(a,c,b){this.render(this.programs.silhouette,a,a.silhouette.vao,c,b)};b.prototype.render=function(a,c,b,d,f){this.setUniforms(a,c,d);a=this.rctx;a.bindVAO(b);a.capabilities.instancing.drawArraysInstanced(6,0,4,f)};b.prototype.setUniforms=function(a,c,b){c.components.buffer.textureBuffer.bind(a,d.componentDataBindParameters);
a.setUniformMatrix4fv("uView",b.view);a.setUniformMatrix4fv("uModel",c.transform.modelMatrix);var e=b.viewInvTransp,f=k.mat4d.toMat3(e,this.tmpViewToWorldNormalMatrix);a.setUniform3f("uCameraPosition",e[3],e[7],e[11]);a.setUniformMatrix3fv("uViewToWorldNormalMatrix",f);(this.settings.uber||"sketch"===this.settings.type)&&this.setSketchUniforms(a);a.setUniform1f("uWorldLineRadiusPerDistance",Math.tan(b.fovY/2)/(b.viewport[3]/2));a.setUniform3fv("uLocalOrigin",c.transform.origin.vec3);this.settings.slicePlaneEnabled&&
n.bindSlicePlane(c.transform.origin.vec3,b.slicePlane,a)};b.prototype.setSketchUniforms=function(a){var c=this.settings.strokesTexture,b=c.texture;this.rctx.bindTexture(b,0);a.setUniform1i("uStrokesTexture",0);a.setUniform2f("uStrokesTextureScale",1/b.descriptor.width,1/b.descriptor.height);a.setUniform1f("uStrokesLog2Resolution",m.log2(c.resolution));a.setUniform1f("uStrokesNormalizationScale",c.normalizationScale);a.setUniform1f("uStrokesAmplitude",c.amplitude);a.setUniform1f("uStrokeVariants",
c.variants)};b.prototype.getOptions=function(a){return h({},a,{antialiasing:!!this.rctx.capabilities.blendMinMax,mode:this.settings.uber?"uber":this.settings.type,slice:this.settings.slicePlaneEnabled})};b.prototype.createPrograms=function(){var a=this.programRepository.getProgram(l.program,this.getOptions({silhouette:!1})),b=this.programRepository.getProgram(l.program,this.getOptions({silhouette:!0}));this.programRepository.increaseRefCount(a);this.programRepository.increaseRefCount(b);this.programs=
{regular:a,silhouette:b}};b.getKey=function(a,b,d){return a?"edges-uber":"edges-t:"+b+":"+d};return b}();d.EdgeRenderer=g;d.componentDataBindParameters={texName:"uComponentDataTex",invDimName:"uComponentDataTexInvDim",unit:2}});