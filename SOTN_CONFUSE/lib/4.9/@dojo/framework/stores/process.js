//>>built
(function(a){"object"===typeof module&&"object"===typeof module.exports?(a=a(require,exports),void 0!==a&&(module.exports=a)):"function"===typeof define&&define.amd&&define(["require","exports","tslib","../shim/Promise","../shim/Map"],a)})(function(a,e){function l(c,a,b,d,e){function A(c,a,d){return c(b)(a)}var f=this,z=b.apply,u=b.get,v=b.path,w=b.at;return function(l){return m.__awaiter(f,void 0,void 0,function(){var f,y,n,k,x,p,h,q,r,t;return m.__generator(this,function(g){switch(g.label){case 0:f=
[],y=m.__spread(a),n=[],k=y.shift(),x=null,p=e?e(l):l,g.label=1;case 1:g.trys.push([1,9,,10]),g.label=2;case 2:if(!k)return[3,8];h=[];if(!Array.isArray(k))return[3,4];h=k.map(function(c){return c({at:w,get:u,path:v,payload:p})});return[4,Promise.all(h)];case 3:return h=g.sent(),[3,7];case 4:return q=k({at:w,get:u,path:v,payload:p}),C.isThenable(q)?[4,q]:[3,6];case 5:q=g.sent(),g.label=6;case 6:h=[q],g.label=7;case 7:for(r=0;r<h.length;r++)f.push.apply(f,m.__spread(h[r])),n=m.__spread(z(h[r]),n);b.invalidate();
k=y.shift();return[3,2];case 8:return[3,10];case 9:return t=g.sent(),x={error:t,command:k},[3,10];case 10:return d&&d(x,{undoOperations:n,store:b,id:c,operations:f,apply:z,at:w,get:u,path:v,executor:A,payload:p}),[2,Promise.resolve({store:b,undoOperations:n,id:c,error:x,operations:f,apply:z,at:w,get:u,path:v,executor:A,payload:p})]}})})}}function t(c,a,b){B.set(c,[c,a,b]);return function(d,f){return l(c,a,d,b,f)}}Object.defineProperty(e,"__esModule",{value:!0});var m=a("tslib"),C=a("../shim/Promise");
a=a("../shim/Map");e.createCommandFactory=function(){return function(a){return a}};var B=new a.default;e.getProcess=function(a){return B.get(a)};e.processExecutor=l;e.createProcess=t;e.createProcessFactoryWith=function(a){return function(c,b,d){d=a.reduce(function(a,b){return b(a)},d);return t(c,b,d)}};e.createCallbackDecorator=function(a){return function(c){return function(b,d){a(b,d);c&&c(b,d)}}}});