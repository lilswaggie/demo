//>>built
define(["dojo","dijit","dojox","dojo/require!dojox/lang/oo/Filter,dojox/lang/oo/Decorator"],function(e,y,t){e.provide("dojox.lang.oo.mixin");e.experimental("dojox.lang.oo.mixin");e.require("dojox.lang.oo.Filter");e.require("dojox.lang.oo.Decorator");(function(){var l=t.lang.oo,u=l.Filter,p=l.Decorator,k={},v=function(b){return b},w=function(b,a,c){return a},x=function(b,a,c,h){b[a]=c},q=e._extraNames,r=q.length,n=l.applyDecorator=function(b,a,c,h){if(c instanceof p){var k=c.decorator;c=n(b,a,c.value,
h);return k(a,c,h)}return b(a,c,h)};l.__mixin=function(b,a,c,h,l){var g,f,d,m,e;for(g in a)d=a[g],g in k&&k[g]===d||!(f=h(g,b,a,d))||f in b&&f in k&&k[f]===d||(m=b[f],d=n(c,f,d,m),m!==d&&l(b,f,d,m));if(r)for(e=0;e<r;++e)g=q[e],d=a[g],g in k&&k[g]===d||!(f=h(g,b,a,d))||f in b&&f in k&&k[f]===d||(m=b[f],d=n(c,f,d,m),m!==d&&l(b,f,d,m));return b};l.mixin=function(b,a){for(var c,h,e=1,g=arguments.length;e<g;++e)a=arguments[e],a instanceof u?(h=a.filter,a=a.bag):h=v,a instanceof p?(c=a.decorator,a=a.value):
c=w,l.__mixin(b,a,c,h,x);return b}})()});