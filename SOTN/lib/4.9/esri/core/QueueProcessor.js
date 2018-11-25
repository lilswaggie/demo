// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.9/esri/copyright.txt for details.
//>>built
define(["require","exports","dojo/Deferred","./Queue","./scheduling"],function(m,n,h,k,l){return function(){function b(a){this._apiPromises=new Map;this._processingItems=new Map;this._isPaused=!1;this._scheduledNextHandle=null;this.concurrency=1;this.ordered=!1;a.concurrency&&(this.concurrency=a.concurrency);this.ordered=!!a.ordered;this._queue=new k(a.peeker?{peeker:a.peeker}:void 0);this.process=a.process}Object.defineProperty(b.prototype,"length",{get:function(){return this._processingItems.size+
this._queue.length},enumerable:!0,configurable:!0});b.prototype.clear=function(){this._queue.clear();var a=[];this._processingItems.forEach(function(c){return a.push(c.resultPromise)});this._processingItems.clear();a.forEach(function(a){return a.cancel()});a.length=0;this._apiPromises.forEach(function(c){return a.push(c)});this._apiPromises.clear();a.forEach(function(a){return a.cancel()});this._cancelNext()};b.prototype.find=function(a,c){var b=this,e=void 0;this._apiPromises.forEach(function(d,
g){a.call(c,g)&&(e=b._apiPromises.get(g).promise)});return e};b.prototype.get=function(a){return(a=this._apiPromises.get(a))&&a.promise||void 0};b.prototype.isOngoing=function(a){return this._processingItems.has(a)};b.prototype.has=function(a){return this._apiPromises.has(a)};b.prototype.pause=function(){this._isPaused||(this._isPaused=!0,this._cancelNext())};b.prototype.push=function(a){var c=this;if(this._apiPromises.has(a))return this._apiPromises.get(a).promise;var b=new h(function(b){var d=c._processingItems.get(a);
d?d.resultPromise.cancel(b):(c._remove(a),c._scheduleNext())});this._add(a,b);this._scheduleNext();return b.promise};b.prototype.reset=function(){var a=[];this._processingItems.forEach(function(b){return a.push(b)});this._processingItems.clear();for(var c=0;c<a.length;c++){var b=a[c];b.resultPromise.isFulfilled()?this._processReset(b):(b.isReset=!0,b.resultPromise.cancel())}};b.prototype.resume=function(){this._isPaused&&(this._isPaused=!1,this._scheduleNext())};b.prototype._scheduleNext=function(){var a=
this;this._isPaused||this._scheduledNextHandle||(this._scheduledNextHandle=l.schedule(function(){a._scheduledNextHandle=null;a._next()}))};b.prototype._next=function(){for(;0<this._queue.length&&this._processingItems.size<this.concurrency;)this._process(this._queue.pop())};b.prototype._processResult=function(a,b){this._remove(a.item);this._scheduleNext();a.dfd.resolve(b)};b.prototype._processError=function(a,b){a.isReset?this._processReset(a):(this._remove(a.item),this._scheduleNext(),a.dfd.reject(b))};
b.prototype._processReset=function(a){this._remove(a.item);this._add(a.item,a.dfd);this._scheduleNext()};b.prototype._processOrdered=function(a,b){var c=this,e=!1;if(a.isReset)this._processReset(a);else{a.result=b;this._itemsToProcess||(this._itemsToProcess=[]);this._processingItems.forEach(function(a){e||(a.result?c._itemsToProcess.push(a):e=!0)});a=0;for(b=this._itemsToProcess;a<b.length;a++){var d=b[a];!1===d.result.ok?this._processError(d,d.result.error):this._processResult(d,d.result.value)}this._itemsToProcess.length=
0}};b.prototype._process=function(a){var b=this;if(null!=a){var f=this._apiPromises.get(a),e=this.process(a);if(e&&"function"===typeof e.then){var d={item:a,resultPromise:e,result:null,dfd:f,isReset:!1};this._processingItems.set(a,d);this.ordered?e.then(function(a){return b._processOrdered(d,{ok:!0,value:a})},function(a){return b._processOrdered(d,{ok:!1,error:a})}):e.then(function(a){return b._processResult(d,a)},function(a){return b._processError(d,a)})}else f.resolve(e),this._remove(a)}};b.prototype._add=
function(a,b){this._apiPromises.set(a,b);this._queue.push(a)};b.prototype._remove=function(a){this._queue.remove(a);this._apiPromises.delete(a);this._processingItems.delete(a)};b.prototype._cancelNext=function(){this._scheduledNextHandle&&(this._scheduledNextHandle.remove(),this._scheduledNextHandle=null)};return b}()});