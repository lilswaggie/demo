// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.9/esri/copyright.txt for details.
//>>built
define("require exports ../../../../core/arrayUtils ../../../../core/iteratorUtils ./ModelContentType ./Util".split(" "),function(w,x,u,v,q,r){return function(){function d(a){this._residentGeomRecords=new Map;this._dirtyGeomRecords=new Map;this._dirtyMaterials=new Set;this._model=a}Object.defineProperty(d.prototype,"residentLayerCount",{get:function(){return this._residentGeomRecords.size},enumerable:!0,configurable:!0});Object.defineProperty(d.prototype,"residentObjectCount",{get:function(){var a=
0;this._residentGeomRecords.forEach(function(b){a+=b.size});return a},enumerable:!0,configurable:!0});d.prototype.getDirtyMaterials=function(){return 0<this._dirtyMaterials.size?this._dirtyMaterials:null};d.prototype.clearDirtyMaterials=function(){this._dirtyMaterials.clear()};d.prototype.hasDirtyGeometryRecords=function(){var a=!1;v.everyMap(this._dirtyGeomRecords,function(b){if(a)return!1;v.everyMap(b,function(b){if(!a&&b&&0<b.size)return a=!0,!1})});return a};d.prototype.handleUpdate=function(a,
b,c){r.assert(this[b],"ModelDirtySet doesn't know how to process "+b);return this[b](a,c)};d.prototype.shaderTransformationChanged=function(a){var b=this;(a=this._residentGeomRecords.get(a.id))&&a.forEach(function(a,n){(n=b._model.content[q.OBJECT][n])&&n.hasVolativeTransformation()&&a.forEach(function(a){var b=0;for(a=a[1];b<a.length;b++)a[b].shaderTransformationChanged()})})};d.prototype.commit=function(){return this.commitLayers(u.keysOfMap(this._dirtyGeomRecords))};d.prototype.commitLayers=function(a){for(var b=
this,c=[],n=[],d=[],h=function(h){var e=a[h];h=g._dirtyGeomRecords.get(e);if(!h)return"continue";h.forEach(function(a,h){var f=b._ensureGeomRecord(e,h);a.forEach(function(a,e){var g=a[0],m=a[1];a=a[2];var k=m&2&&a&1;if(m&4||k){var l=f.get(e);l?n.push.apply(n,l[1]):4===m&&r.assert(!1,"ModelDirtySet.getAddRemoveListFilteredByLayers: invalid remove");l&&f.delete(e)}if(m&1||k){var p=[g,[]],l=b._model.get(q.OBJECT,h);b._model.getGeometryRenderGeometries(l,g,p[1]);c.push.apply(c,p[1]);f.set(e,p)}if(m&2&&
!k)if(l=f.get(e)){e=l[1];m=e.length;if(a&16)for(l=b._model.get(q.OBJECT,h),k=0;k<m;k++)p=e[k],b._model.updateRenderGeometryTransformation(l,g,p);for(k=0;k<m;k++)p=e[k],d.push({renderGeometry:p,updateType:a})}else r.assert(!1,"ModelDirtySet.getAddRemoveListFilteredByLayers: invalid update")});0===f.size&&b._residentGeomRecords.get(e).delete(h)});0===g._residentGeomRecords.get(e).size&&g._residentGeomRecords.delete(e);g._dirtyGeomRecords.delete(e)},g=this,f=0;f<a.length;f++)h(f);return[c,n,d]};d.prototype.getResidentRenderGeometries=
function(){return this.getResidentRenderGeometriesFilteredByLayers(u.keysOfMap(this._residentGeomRecords))};d.prototype.getResidentRenderGeometriesFilteredByLayers=function(a){for(var b=[],c=0;c<a.length;c++){var d=this._residentGeomRecords.get(a[c]);d&&d.forEach(function(a){a.forEach(function(a){b.push.apply(b,a[1])})})}return b};d.prototype.visibilityChanged=function(a,b,c){if(null!=b)this._componentPropertyChanged(a,b,c,2);else{b=0;for(var d=a.getGeometryRecords();b<d.length;b++)this._componentPropertyChanged(a,
d[b],c,2)}};d.prototype.componentHighlightChanged=function(a,b,c){if(null!=b)this._componentPropertyChanged(a,b,c,32);else{b=0;for(var d=a.getGeometryRecords();b<d.length;b++)this._componentPropertyChanged(a,d[b],c,32)}};d.prototype.vertexAttrsUpdated=function(a,b,c){this._updateOrCreateDirtyRecord(a,b,c,2,0,0,2,5,4)};d.prototype.matChanged=function(a){this._dirtyMaterials.add(a.id);if(this.onMaterialChanged)this.onMaterialChanged(a)};d.prototype.layerAdded=function(a){for(var b=a.getObjects(),c=
0;c<b.length;c++)this.layObjectAdded(a,b[c])};d.prototype.layerRemoved=function(a){for(var b=a.getObjects(),c=0;c<b.length;c++)this.layObjectRemoved(a,b[c])};d.prototype.layObjectAdded=function(a,b){a=a.id;for(var c=b.getGeometryRecords(),d=0;d<c.length;d++)this.objGeometryAdded(b,c[d],a)};d.prototype.layObjectRemoved=function(a,b){a=a.id;for(var c=b.getGeometryRecords(),d=0;d<c.length;d++)this.objGeometryRemoved(b,c[d],a)};d.prototype.layObjectReplaced=function(a,b){this.layObjectRemoved(a,b[0]);
this.layObjectAdded(a,b[1])};d.prototype.objDirty=function(a,b){var c=this;b=b||this._getParentLayerId(a);this._ensureGeomRecord(b,a.id).forEach(function(d){c._updateOrCreateDirtyRecord(a,d[0],b,2,0,2,0,5,1)})};d.prototype.objTransformation=function(a,b){var c=this;b=b||this._getParentLayerId(a);this._ensureGeomRecord(b,a.id).forEach(function(d){c._updateOrCreateDirtyRecord(a,d[0],b,2,0,0,2,5,16)})};d.prototype.objGeometryAdded=function(a,b,c){this._updateOrCreateDirtyRecord(a,b,c,1,4,0,0,0)};d.prototype.objGeometryRemoved=
function(a,b,c){this._updateOrCreateDirtyRecord(a,b,c,4,1,2,0,0)};d.prototype.objGeometryReplaced=function(a,b){this.objGeometryRemoved(a,b[0]);this.objGeometryAdded(a,b[1])};d.prototype.objGeometryTransformation=function(a,b){this.objGeometryReplaced(a,b)};d.prototype._componentPropertyChanged=function(a,b,c,d){this._updateOrCreateDirtyRecord(a,b,c,2,0,0,2,5,d)};d.prototype._updateOrCreateDirtyRecord=function(a,b,c,d,q,h,g,f,t){c=c||this._getParentLayerId(a);var e=b.id;a=this._ensureDirtyRecord(c,
a.id);(c=a.get(e))?(b=c[1],b&q?a.delete(e):b&h?(c[1]=d,c[2]=t):b&g?c[2]|=t:b&f||r.assert(!1,"ModelDirtySet.objGeometryAdded: inconsistent state")):a.set(e,[b,d,t])};d.prototype._ensureGeomRecord=function(a,b){var c=this._residentGeomRecords.get(a);c||(c=new Map,this._residentGeomRecords.set(a,c));a=c.get(b);a||(a=new Map,c.set(b,a));return a};d.prototype._ensureDirtyRecord=function(a,b){var c=this._dirtyGeomRecords.get(a);c||(c=new Map,this._dirtyGeomRecords.set(a,c));a=c.get(b);a||(a=new Map,c.set(b,
a));return a};d.prototype._getParentLayerId=function(a){return a.parentLayer.id};d.prototype.formatDebugInfo=function(a){if(a)return"";var b=["ADD","UPD",void 0,"REM"],c="";this._dirtyGeomRecords.forEach(function(a,d){a.forEach(function(a,g){0<c.length&&(c+="\n");c+=d+"."+g;var f=[];a.forEach(function(a){var b=a[1];f[b]||(f[b]=[]);f[b].push(a[0].geometry.id)});for(a=0;a<f.length;a++)if(f[a])for(c+=" "+b[a-1]+": ",g=0;g<f[a].length;g++)c+=f[a][g]+", "})});return c};return d}()});