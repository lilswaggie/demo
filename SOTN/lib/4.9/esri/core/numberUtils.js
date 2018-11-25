// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.9/esri/copyright.txt for details.
//>>built
define(["dojo/number","dojo/i18n!dojo/cldr/nls/number"],function(r,t){function v(b,a){return b-a}var w=/^-?(\d+)(\.(\d+))?$/i,x=new RegExp("\\"+t.decimal+"0+$","g"),y=/(\d)0*$/g,p={numDigits:function(b){var a=String(b),c=a.match(w);b={integer:0,fractional:0};c&&c[1]?(b.integer=c[1].split("").length,b.fractional=c[3]?c[3].split("").length:0):-1<a.toLowerCase().indexOf("e")&&(c=a.split("e"),a=c[0],c=c[1],a&&c&&(a=Number(a),c=Number(c),(b=0<c)||(c=Math.abs(c)),a=p.numDigits(a),b?(a.integer+=c,a.fractional=
c>a.fractional?0:a.fractional-c):(a.fractional+=c,a.integer=c>a.integer?1:a.integer-c),b=a));return b},percentChange:function(b,a,c,m){var k={previous:null,next:null},d;null!=c&&(d=b-c,k.previous=Math.floor(Math.abs(100*(a-c-d)/d)));null!=m&&(d=m-b,k.next=Math.floor(Math.abs(100*(m-a-d)/d)));return k},round:function(b,a){b=b.slice(0);var c,m,k,d,h,q,f,l,r=a&&null!=a.tolerance?a.tolerance:2,n=a&&a.indexes,t=a&&null!=a.strictBounds?a.strictBounds:!1;if(n)n.sort(v);else for(n=[],h=0;h<b.length;h++)n.push(h);
for(h=0;h<n.length;h++)if(l=n[h],a=b[l],c=0===l?null:b[l-1],m=l===b.length-1?null:b[l+1],k=p.numDigits(a),k=k.fractional){q=0;for(f=!1;q<=k&&!f;){d=a;f=q;var e=void 0,g=void 0,e=Number(d.toFixed(f));e<d?g=e+1/Math.pow(10,f):(g=e,e-=1/Math.pow(10,f));e=Number(e.toFixed(f));g=Number(g.toFixed(f));d=[e,g];d=t&&0===h?d[1]:d[0];f=r;var e=p.percentChange(a,d,c,m),u=g=void 0,g=void 0,g=null==e.previous||e.previous<=f,u=null==e.next||e.next<=f;f=g=g&&u||e.previous+e.next<=2*f;q++}f&&(b[l]=d)}return b},format:function(b,
a){a=a||{places:20,round:-1};(b=r.format(b,a))&&(b=b.replace(y,"$1").replace(x,""));return b}};return p});