// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.9/esri/copyright.txt for details.
//>>built
define("require exports ../../../../core/tsSupport/extendsHelper ../../../../core/tsSupport/decorateHelper ../../../../core/tsSupport/assignHelper ../../../../core/tsSupport/awaiterHelper ../../../../core/tsSupport/generatorHelper ../../../../core/Accessor ../../../../core/asyncUtils ../../../../core/Handles ../../../../core/iteratorUtils ../../../../core/Logger ../../../../core/promiseUtils ../../../../core/QueueProcessor ../../../../core/scheduling ../../../../core/throttle ../../../../core/watchUtils ../../../../core/accessorSupport/decorators ../../../../geometry/support/aaBoundingRect ../../../../layers/graphics/dehydratedFeatures ../../../../tasks/support/QuantizationParameters ./featureReference".split(" "),
function(x,p,F,l,G,q,r,H,y,I,J,K,z,L,M,N,O,k,m,P,Q,A){Object.defineProperty(p,"__esModule",{value:!0});var R=A.SingleFeatureReference,S=A.MultiFeatureReference,B=K.getLogger("esri.views.3d.layers.support.FeatureTileFetcher3D");x=function(h){function b(a){a=h.call(this,a)||this;a.updating=!1;a.displayLimitExceeded=!1;a.displayLimitExceededThrottle=1E3;a.handles=new I;a.idToFeatureTile=new Map;a.displayingFeatureReferences=new Map;a.suspended=!0;a.pendingEdits=null;return a}F(b,h);Object.defineProperty(b.prototype,
"displayFeatureLimit",{set:function(a){var c=this._get("displayFeatureLimit");if(!(a===c||a&&c&&a.min===c.min&&a.max===c.max&&a.perTile===c.perTile)){var c=c?c.perTile:Infinity,d=a?a.perTile:Infinity;this._set("displayFeatureLimit",G({},a));this.perTileLimitUpdated(c,d);this.update()}},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"filterExtent",{set:function(a){if(a&&this.tilingScheme&&!a.spatialReference.equals(this.tilingScheme.spatialReference))B.error("#filterExtent\x3d",
"extent needs to be in the same spatial reference as the tiling scheme");else{var c=this._get("filterExtent");c===a||c&&a&&c.equals(a)||(a=a?a.clone():null,this._set("filterExtent",a),this.reclip(a,c))}},enumerable:!0,configurable:!0});b.prototype.initialize=function(){var a=this;this.updateDisplayLimitExceededThrottled=N.throttle(this.updateDisplayLimitExceeded,this.displayLimitExceededThrottle,this);this.capabilities=this.calculateCapabilities();this.fetchQueue=this.createFetchQueue();this.handles.add(O.on(this,
"tileDescriptors","change",function(){return a.update()},function(){return a.update()}));this.objectIdField=this.layer.objectIdField;this.FeatureReferenceClass=this.capabilities.supportsMultipleResolutions?S:R;this.update()};b.prototype.destroy=function(){var a=this;this.handles&&(this.handles.destroy(),this.handles=null);this.updateDisplayLimitExceededThrottled.remove();this.forEachFeatureTile(function(c){return a.cancelFetchTile(c)});this.fetchQueue.clear();this.pendingEdits&&(this.pendingEdits.edits.cancel(C),
this.pendingEdits=null)};Object.defineProperty(b.prototype,"paused",{get:function(){return this.suspended||!!this.pendingEdits},enumerable:!0,configurable:!0});b.prototype.filtersChanged=function(){var a=this;this.fetchQueue.clear();this.forEachFeatureTile(function(c){a.resetFetchTile(c);a.queueFetchTile(c)});this.update()};b.prototype.suspend=function(){this.suspended||(this.suspended=!0,this.pause())};b.prototype.resume=function(){this.suspended&&(this.suspended=!1,this.unpause())};b.prototype.pause=
function(){this.paused&&(this.fetchQueue.pause(),this.fetchQueue.reset(),this.updated())};b.prototype.unpause=function(){this.paused||(this.update(),this.fetchQueue.resume(),this.updated())};b.prototype.getFeatureTileById=function(a){return this.idToFeatureTile.get(a)||null};b.prototype.forEachFeatureTile=function(a){this.idToFeatureTile.forEach(a)};b.prototype.applyEdits=function(a){var c=this;this.pendingEdits||(this.pendingEdits={edits:z.resolve(),count:0},this.pause());this.pendingEdits.count++;
this.pendingEdits.edits=this.pendingEdits.edits.then(function(){return a.result.catch(function(a){if(a===C)throw a;return null}).then(function(a){if(a)return c.applyEditsDeleteFeatures(a.deletedFeatures),c.applyEditsAddUpdateFeatures(a.addedFeatures,a.updatedFeatures)}).then(function(){0===--c.pendingEdits.count&&(c.pendingEdits=null,c.unpause())})})};b.prototype.applyEditsDeleteFeatures=function(a){var c=this;if(0!==a.length){var d=new Set;a.forEach(function(a){return d.add(a.objectId)});this.forEachFeatureTile(function(a){if(a.features){var e=
a.features.filter(function(a){return!d.has(c.getFeatureId(a))});e.length!==a.features.length&&(a.features=e)}})}};b.prototype.applyEditsAddUpdateFeatures=function(a,c){return q(this,void 0,void 0,function(){var d,e,b,g=this;return r(this,function(f){switch(f.label){case 0:d=[];e=new Set;a.forEach(function(a){return d.push(a.objectId)});c.forEach(function(a){d.push(a.objectId);e.add(a.objectId)});if(0===d.length)return[2];b=[];this.forEachFeatureTile(function(a){(a=y.safeCast(g.applyEditsAddUpdateTile(a,
d,e)))&&b.push(a)});return[4,z.eachAlways(b)];case 1:return f.sent(),[2]}})})};b.prototype.applyEditsAddUpdateTile=function(a,c,d){return q(this,void 0,void 0,function(){var e,b,g,k,l,h,m,n=this;return r(this,function(f){switch(f.label){case 0:if(!a.features)return[2];e=this.createQuery(a);e.resultType=void 0;e.objectIds=c;return[4,this.queryFeatures(e)];case 1:b=f.sent();g=null;0<d.size&&(k=a.features.filter(function(a){return!d.has(n.getFeatureId(a))}),k.length!==a.features.length&&(g=k));if(0<
b.features.length)for(g||(g=a.features.slice()),this.verticalScale.adjust(b.features),l=0,h=b.features;l<h.length;l++)m=h[l],g.push(m);g&&(a.features=g);return[2]}})})};b.prototype.queryFeatures=function(a){return this.layer.queryFeaturesJSON?this.layer.queryFeaturesJSON(a).then(function(a){return{features:P.fromFeatureSetJSON(a),exceededTransferLimit:!!a.exceededTransferLimit}}):this.layer.queryFeatures(a).then(function(a){return{features:a.features,exceededTransferLimit:!!a.exceededTransferLimit}})};
b.prototype.calculateCapabilities=function(){var a=this.layer,c=!!(a.capabilities&&a.capabilities.query&&a.capabilities.query.supportsPagination),d=!!(a.capabilities&&a.capabilities.query&&a.capabilities.query.supportsResultType),a=!!(a.capabilities&&a.capabilities.query&&a.capabilities.query.supportsQuantization);return{supportsMultipleResolutions:this.calculateSupportsMultipleResolutions(),supportsPagination:c,supportsResultType:d,supportsQuantization:a}};b.prototype.calculateSupportsMultipleResolutions=
function(){var a=this.layer,c=a.geometryType;return"polyline"===c?!0:"polygon"===c?a.capabilities&&a.capabilities.query&&a.capabilities.query.supportsQuantization:!1};b.prototype.createFetchQueue=function(){var a=this;return new L({concurrency:6,ordered:!0,peeker:function(c){return a.highestPriorityTile(c)},process:function(c){return y.safeCast(a.fetchTile(c))}})};b.prototype.highestPriorityTile=function(a){return a.reduce(function(a,d){return a&&a.descriptor.loadPriority<=d.descriptor.loadPriority?
a:d},null)};b.prototype.update=function(){if(!this.suspended&&this.constructed){var a=this.getListOfTiles();this.markTilesNotAlive(a);this.addTiles(a);a=this.sortTiles(a);this.removeTiles(a);this.displayTiles(a);this.queueFetchTiles(a);this.updated()}};b.prototype.markTilesNotAlive=function(a){for(var c=0;c<a.length;c++)a[c].alive=0};b.prototype.addTiles=function(a){var c=this;this.tileDescriptors.forEach(function(d){var b=c.getFeatureTileById(d.id);b?b.alive=1:a.push(c.addTile(d))})};b.prototype.tileHasRelatives=
function(a){var c=this;return!J.everyMap(this.idToFeatureTile,function(d){return!c.tilesAreRelated(d,a)})};b.prototype.removeTiles=function(a){for(var c=0;c<a.length;c++){var d=a[c];0===d.alive||d.intersects(this.filterExtent)||this.clearTile(d)}for(var c=!1,b=a.length-1;0<=b;b--)d=a[b],d.displayingFeatures&&0<d.displayingFeatures.length&&this.displayFeatureLimit&&this.displayingFeatureReferences.size<=this.displayFeatureLimit.min&&!this.tileHasRelatives(d)?0===d.alive&&(d.alive=2):0===d.alive&&(this.removeTile(d),
b!==a.length-1&&(c=!0),a[b]=a[a.length-1],a.pop());c&&this.sortTiles(a)};b.prototype.sortTiles=function(a){a.sort(function(a,d){return a.descriptor.loadPriority-d.descriptor.loadPriority});return a};b.prototype.displayTiles=function(a){for(var c=0,d=a.length-1,b=null;c<=d;)if(!b&&this.isDisplayingFeaturesAtMaximumLimit()){var f=a[d--],g=this.featureCountDifferenceWhenHidingTile(f);this.displayFeatureLimit&&this.displayingFeatureReferences.size-g>=this.displayFeatureLimit.max?this.hideTile(f):b=f}else f=
a[c++],g=this.featureCountDifferenceWhenShowingTile(f),0<g&&b&&(this.hideTile(b),b=null),this.showTile(f);b&&this.showTile(b)};b.prototype.queueFetchTiles=function(a){var c=a.length-1;if(this.isDisplayingFeaturesAtMaximumLimit())for(var d=a.length-1;0<=d;d--){var b=a[d];if(b.displayingFeatures&&0<b.displayingFeatures.length){c=d;break}}for(d=0;d<=c;d++)this.queueFetchTile(a[d])};b.prototype.reclip=function(a,c){var d=this;if(this.constructed){var b=[];this.forEachFeatureTile(function(e){e.displayingFeatures&&
0!==e.displayingFeatures.length&&(e.intersection(c,t),e.intersection(a,D),m.equals(t,D)||(b.push(e),d.hideTileFeatures(e)))});for(var f=0;f<b.length;f++)this.showTile(b[f]);this.updated()}};b.prototype.updated=function(){this._set("updating",0<this.fetchQueue.length);this.debugger&&this.debugger.update();this.updateDisplayLimitExceededThrottled()};b.prototype.updateDisplayLimitExceeded=function(){if(!this.updating){var a=!1;this.forEachFeatureTile(function(c){if(c.perTileDisplayLimitExceeded&&2!==
c.alive||!c.displayingFeatures&&!c.isFetchFetching)a=!0});this._set("displayLimitExceeded",a)}};b.prototype.perTileLimitUpdated=function(a,c){if(a!==c)if(c<a){a=0;for(var b=this.getListOfTiles();a<b.length;a++){var e=b[a];e.features&&e.features.length>c&&(e.features=e.features.slice(0,c),e.perTileDisplayLimitExceeded=!0)}}else for(c=0,b=this.getListOfTiles();c<b.length;c++)e=b[c],e.features&&e.features.length>=a&&(this.cancelFetchTile(e),this.resetFetchTile(e))};b.prototype.addTile=function(a){a=
new E(a);this.idToFeatureTile.set(a.id,a);this.resetFetchTile(a);this.referenceDisplayingFeaturesFromRelatedTiles(a);return a};b.prototype.referenceDisplayingFeaturesFromRelatedTiles=function(a){var c=this,b=a.descriptor.resolution;this.forEachFeatureTile(function(d){if(d.displayingFeatures&&c.tilesAreRelated(a,d)){a.displayingFeatures||(a.displayingFeatures=[]);var e=0;for(d=d.displayingFeatures;e<d.length;e++){var g=d[e];a.displayingFeatures.push(g);g=c.getDisplayingFeatureReference(g);g.ref(b,
g.feature)}}})};b.prototype.tilesAreRelated=function(a,c){if(a===c)return!1;a=a.descriptor.lij;var b=c.descriptor.lij;if(!a||!b)return!0;var e=a[0]<b[0];c=e?a:b;a=e?b:a;b=a[0]-c[0];if(0===b)return!1;b=1<<b;return Math.floor(a[1]/b)===c[1]&&Math.floor(a[2]/b)===c[2]};b.prototype.removeTile=function(a){this.clearTile(a);this.idToFeatureTile.delete(a.id)};b.prototype.resetFetchTile=function(a){a.intersects(this.filterExtent)?a.fetchStatus=0:0===a.fetchStatus&&(a.fetchStatus=2)};b.prototype.cancelFetchTile=
function(a){var c=a.fetchRequest;c&&(a.fetchRequest=null,a.fetchStatus=0,c.cancel())};b.prototype.fetchTile=function(a){return q(this,void 0,void 0,function(){return r(this,function(c){switch(c.label){case 0:return[4,this.fetchTileAll(a)];case 1:return[2,c.sent()]}})})};b.prototype.setPagingParameters=function(a,c,b){if(!this.capabilities.supportsPagination)return!1;var d=this.capabilities.supportsResultType&&this.layer.tileMaxRecordCount||this.layer.maxRecordCount||T;a.start=c;0<b&&this.capabilities.supportsResultType?
(a.maxRecordCountFactor=Math.ceil(b/d),a.num=b):a.num=Math.min(d,b);return!0};b.prototype.fetchTileAll=function(a){return q(this,void 0,void 0,function(){var b,d,e,f,g,l,k,h,m,n;return r(this,function(c){switch(c.label){case 0:b=0,d=[],e=!1,a.perTileDisplayLimitExceeded=!1,c.label=1;case 1:return f=this.createQuery(a),g=this.displayFeatureLimit&&this.displayFeatureLimit.perTile,l=this.setPagingParameters(f,b,g),[4,this.queryFeatures(f)];case 2:k=c.sent();h=k.features;e=m=k.exceededTransferLimit;d=
0===d.length?h:d.concat(h);if(!l||!m||0<g&&d.length>=g)return[3,3];a.features=a.needsDisplayUpdate?a.features.concat(h):a.displayingFeatures?a.displayingFeatures.concat(h):h;this.update();b+=f.num;return[3,1];case 3:return(n=this.displayFeatureLimit&&this.displayFeatureLimit.perTile)&&d.length>n?(a.perTileDisplayLimitExceeded=!0,d=d.slice(0,n)):e&&(a.perTileDisplayLimitExceeded=!0),this.verticalScale.adjust(d),[2,d]}})})};b.prototype.createQuery=function(a){var b=this.tilingScheme.spatialReference,
d=a.descriptor.extent,e=this.createDefaultQuery();d&&(e.geometry=m.toExtent(d,b));this.setResolutionParams(e,a);this.capabilities.supportsResultType&&(e.resultType="tile");return e};b.prototype.createDefaultQuery=function(){var a=this.tilingScheme.spatialReference,b=this.layer.createQuery(),d=this.layer.capabilities&&this.layer.capabilities.data;d&&d.supportsZ&&null==b.returnZ&&(b.returnZ=!0);b.outSpatialReference=a;return b};b.prototype.getEffectiveTileResolution=function(a){var b="global"===this.viewingMode?
this.tilingScheme.resolutionAtLevel(3):Infinity;return Math.min(a.descriptor.resolution,b)};b.prototype.setResolutionParams=function(a,b){if(this.capabilities.supportsMultipleResolutions){var c=this.layer,e=c.geometryType;b=this.getEffectiveTileResolution(b);null!=b&&("polyline"===e&&(a.maxAllowableOffset=b),this.capabilities.supportsQuantization&&(a.quantizationParameters=new Q.default({mode:"view",originPosition:"upper-left",tolerance:b,extent:c.fullExtent})))}};b.prototype.queueFetchTile=function(a){var b=
this;if(a.isFetchPending){var d=!1,e=this.fetchQueue.push(a).then(function(b){a.fetchRequest=null;a.fetchStatus=2;a.features=b}).catch(function(b){a.fetchRequest===e&&(a.fetchRequest=null,a.fetchStatus=2);b&&"cancel"===b.dojoType?d=!0:(a.features=[],B.error("#fetchTile()",b&&b.message?b.message:b))}).then(function(){d||b.update();b.scheduleUpdated()});e.isFulfilled()?a.fetchStatus=2:(a.fetchRequest=e,a.fetchStatus=1)}};b.prototype.scheduleUpdated=function(){var a=this;this.handles.has("scheduleUpdated")||
this.handles.add(M.schedule(function(){a.handles.remove("scheduleUpdated");a.updated()}),"scheduleUpdated")};b.prototype.getDisplayingFeatureReference=function(a){return this.displayingFeatureReferences.get(this.getFeatureId(a))};b.prototype.showTile=function(a){if(!a.displayingFeatures||a.needsDisplayUpdate)if(a.features){for(var b=a.descriptor.resolution,d=0,e=a.features;d<e.length;d++){var f=e[d],g=this.getFeatureId(f),h=this.displayingFeatureReferences.get(g);h?(f=h.ref(b,f),f.oldVersion!==f.newVersion&&
(u.push(f.oldVersion),n.push(f.newVersion))):(this.displayingFeatureReferences.set(g,new this.FeatureReferenceClass(b,f)),n.push(f))}this.hideTileFeatures(a);0<u.length&&this.features.removeMany(u);0<n.length&&this.features.addMany(n);u.length=0;n.length=0;a.displayingFeatures=a.features}else a.displayingFeatures=[]};b.prototype.featureCountDifferenceWhenShowingTile=function(a){if(!a.needsDisplayUpdate)return 0;for(var b=-this.featureCountDifferenceWhenHidingTile(a,!0),d=0,e=a.features;d<e.length;d++){var f=
this.getDisplayingFeatureReference(e[d]);(!f||f.isSingle&&f.markedTile===a)&&b++}return b};b.prototype.getFeatureId=function(a){return null!=a.objectId?a.objectId:a.attributes[this.objectIdField]};b.prototype.featureCountDifferenceWhenHidingTile=function(a,b){void 0===b&&(b=!1);if(!a.displayingFeatures)return 0;for(var c=0,e=0,f=a.displayingFeatures;e<f.length;e++){var g=this.getDisplayingFeatureReference(f[e]);g&&g.isSingle&&(b&&(g.markedTile=a),c++)}return c};b.prototype.hideTile=function(a){this.cancelFetchTile(a);
this.hideTileFeatures(a)};b.prototype.hideTileFeatures=function(a){if(a.displayingFeatures){for(var b=0,d=a.displayingFeatures;b<d.length;b++){var e=this.getFeatureId(d[b]),f=this.displayingFeatureReferences.get(e);f&&(f=f.unref(a.descriptor.resolution),f.oldVersion!==f.newVersion&&(null==f.newVersion?this.displayingFeatureReferences.delete(e):v.push(f.newVersion),w.push(f.oldVersion)))}0<w.length&&this.features.removeMany(w);0<v.length&&this.features.addMany(v);v.length=0;w.length=0}a.displayingFeatures=
null};b.prototype.clearTile=function(a){this.hideTile(a);a.features=null};b.prototype.isDisplayingFeaturesAtMaximumLimit=function(){return this.displayFeatureLimit&&this.displayingFeatureReferences.size>=this.displayFeatureLimit.max};b.prototype.getListOfTiles=function(){var a=Array(this.idToFeatureTile.size),b=0;this.forEachFeatureTile(function(c){return a[b++]=c});return a};l([k.property({constructOnly:!0})],b.prototype,"features",void 0);l([k.property()],b.prototype,"tileDescriptors",void 0);l([k.property({constructOnly:!0})],
b.prototype,"tilingScheme",void 0);l([k.property()],b.prototype,"displayFeatureLimit",null);l([k.property({constructOnly:!0})],b.prototype,"layer",void 0);l([k.property({readOnly:!0})],b.prototype,"updating",void 0);l([k.property({readOnly:!0})],b.prototype,"displayLimitExceeded",void 0);l([k.property({constructOnly:!0})],b.prototype,"displayLimitExceededThrottle",void 0);l([k.property()],b.prototype,"filterExtent",null);l([k.property({constructOnly:!0})],b.prototype,"verticalScale",void 0);l([k.property({constructOnly:!0})],
b.prototype,"viewingMode",void 0);return b=l([k.subclass("esri.views.3d.layers.support.FeatureTileFetcher3D")],b)}(k.declared(H));p.FeatureTileFetcher3D=x;var E=function(){function h(b){this.descriptor=b;this.fetchRequest=null;this.fetchStatus=0;this.displayingFeatures=this.features=null;this.perTileDisplayLimitExceeded=!1;this.alive=1}Object.defineProperty(h.prototype,"id",{get:function(){return this.descriptor.id},enumerable:!0,configurable:!0});Object.defineProperty(h.prototype,"isFetchFetching",
{get:function(){return 1===this.fetchStatus},enumerable:!0,configurable:!0});Object.defineProperty(h.prototype,"isFetchPending",{get:function(){return 0===this.fetchStatus},enumerable:!0,configurable:!0});Object.defineProperty(h.prototype,"isFetchDone",{get:function(){return 2===this.fetchStatus},enumerable:!0,configurable:!0});Object.defineProperty(h.prototype,"needsDisplayUpdate",{get:function(){return this.features&&this.displayingFeatures!==this.features},enumerable:!0,configurable:!0});h.prototype.intersects=
function(b){if(!b||!this.descriptor.extent)return!0;m.fromExtent(b,t);return m.intersects(this.descriptor.extent,t)};h.prototype.intersection=function(b,a){void 0===a&&(a=m.create());if(!b&&!this.descriptor.extent)return a;b?(m.fromExtent(b,a),this.descriptor.extent&&m.intersection(a,this.descriptor.extent,a)):m.set(a,this.descriptor.extent);return a};return h}();p.FeatureTile=E;var T=2E3,t=m.create(),D=m.create(),n=[],u=[],v=[],w=[],C={};p.default=x});