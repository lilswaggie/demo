//>>built
define("dojo/_base/lang dojo/_base/declare dojo/_base/Color dojo/_base/connect dojox/color/_base ./PlotAction dojo/fx/easing dojox/gfx/fx".split(" "),function(k,l,m,n,e,p,q,r){var t=function(a){return function(){return a}},f=function(a){a=new e.Color(a);var b=a.toHsl();0==b.s?b.l=50>b.l?100:0:(b.s=100,b.l=50>b.l?75:75<b.l?50:b.l-50>75-b.l?50:75);b=e.fromHsl(b);b.a=a.a;return b},u=function(a){a=f(a);a.a=.7;return a};return l("dojox.charting.action2d.Highlight",p,{defaultParams:{duration:400,easing:q.backOut},
optionalParams:{highlight:"red"},constructor:function(a,b,d){this.colorFunc=(a=d&&d.highlight)?k.isFunction(a)?a:t(a):f;this.connect()},process:function(a){if(a.shape&&a.type in this.overOutEvents&&"spider_circle"!=a.element&&"spider_plot"!=a.element){"spider_poly"==a.element&&this.colorFunc==f&&(this.colorFunc=u);var b=a.run.name,d=a.index,c;b in this.anim?c=this.anim[b][d]:this.anim[b]={};if(c)c.action.stop(!0);else{c=a.shape.getFill();if(!(c&&c instanceof m))return;this.anim[b][d]=c={start:c,end:this.colorFunc(c)}}var g=
c.start,h=c.end;if("onmouseout"==a.type)var e=g,g=h,h=e;c.action=r.animateFill({shape:a.shape,duration:this.duration,easing:this.easing,color:{start:g,end:h}});"onmouseout"==a.type&&n.connect(c.action,"onEnd",this,function(){this.anim[b]&&delete this.anim[b][d]});c.action.play()}}})});