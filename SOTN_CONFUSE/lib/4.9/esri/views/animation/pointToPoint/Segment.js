// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.9/esri/copyright.txt for details.
//>>built
define(["require","exports"],function(h,k){Object.defineProperty(k,"__esModule",{value:!0});h=function(){function c(a){a&&this.update(a)}c.prototype.update=function(a){a&&(this.definition?this.definition.copyFrom(a):this.definition=a.clone());this._updatePrecomputedVariables();this._updatePixelFlow()};c.prototype._updatePrecomputedVariables=function(){var a=this.definition,b=a.compared,d=b.sourceZoom,f=b.targetZoom;this._zoomSign=d>f?1:-1;this._panPixelsAtSource=b.pan*a.source.pixelsPerPanAtZoom(d);
a=(a.source.pixelsPerRotateAtZoom(d)+a.target.pixelsPerRotateAtZoom(f))/2;this._rotatePixels=b.rotate*a};c.prototype._updatePixelFlow=function(){var a=this.definition.compared.sourceZoom,b=this.definition.compared.targetZoom,d=this.definition,f=d.hasZoom,c=d.hasPan,d=d.hasRotate,e=0,g=0;f&&(c&&(e=(b/a-1)/(-1/(this._zoomSign*this.definition.halfWindowSize)*Math.LN2*this._panPixelsAtSource)),d&&(g=Math.log(a/b)/Math.LN2*this._zoomSign*this.definition.halfWindowSize/this._rotatePixels));this._rotatePixelFlow=
this._panPixelFlow=this._zoomPixelFlow=0;a=this.definition.desiredPixelFlow;f&&c&&d?(b=e+g+e*g,this._zoomPixelFlow=e*g/b*a,this._panPixelFlow=g/b*a,this._rotatePixelFlow=e/b*a):f&&c?(b=1+e,this._zoomPixelFlow=e/b*a,this._panPixelFlow=1/b*a):f&&d?(b=1+g,this._zoomPixelFlow=g/b*a,this._rotatePixelFlow=1/b*a):c&&d?(e=this._panPixelsAtSource/this._rotatePixels,b=1+e,this._panPixelFlow=e/b*a,this._rotatePixelFlow=1/b*a):c?this._panPixelFlow=a:f?this._zoomPixelFlow=a:d&&(this._rotatePixelFlow=a);this.time=
d?this.rotateTime:f?this.zoomTime:c?this.panTime:0};Object.defineProperty(c.prototype,"zoomTime",{get:function(){return this.definition.hasZoom?Math.log(this.definition.compared.sourceZoom/this.definition.compared.targetZoom)/Math.LN2*this._zoomSign*this.definition.halfWindowSize/this._zoomPixelFlow:0},enumerable:!0,configurable:!0});Object.defineProperty(c.prototype,"panTime",{get:function(){if(this.definition.hasPan){if(this.definition.hasZoom){var a=-1/(this._zoomSign*this.definition.halfWindowSize)*
Math.LN2;return Math.log(this._zoomPixelFlow/this._panPixelFlow*this._panPixelsAtSource*a+1)/(a*this._zoomPixelFlow)}return this._panPixelsAtSource/this._panPixelFlow}return 0},enumerable:!0,configurable:!0});Object.defineProperty(c.prototype,"rotateTime",{get:function(){return this.definition.hasRotate?this._rotatePixels/this._rotatePixelFlow:0},enumerable:!0,configurable:!0});c.prototype._interpolateComponentsZoom=function(a){if(this.definition.hasZoom){var b=this.definition.compared.sourceZoom,
d=this.definition.compared.targetZoom;return(b*Math.pow(b/d,-a)-b)/(d-b)}return a};c.prototype._interpolateComponentsPan=function(a){if(this.definition.hasPan&&this.definition.hasZoom){var b=-1/(this._zoomSign*this.definition.halfWindowSize)*this._zoomPixelFlow;return 1/this._panPixelsAtSource*this._panPixelFlow*(Math.pow(2,b*a*this.time)-1)/(b*Math.LN2)}return a};c.prototype._interpolateComponentsRotate=function(a){return a};c.prototype.interpolateComponentsAt=function(a,b){a=Math.min(Math.max(a,
0),1);var d=this._interpolateComponentsZoom(a),c=this._interpolateComponentsPan(a);a=this._interpolateComponentsRotate(a);b?(b.zoom=d,b.pan=c,b.rotate=a):b={zoom:d,pan:c,rotate:a};return b};return c}();k.Segment=h;k.default=h});