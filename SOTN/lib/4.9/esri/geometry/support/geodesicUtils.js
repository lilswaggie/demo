// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.9/esri/copyright.txt for details.
//>>built
define("require exports ../../core/unitUtils ../../core/wgs84Constants ../Point ../Polygon ../Polyline ../SpatialReference".split(" "),function(K,z,E,A,G,H,I,J){function B(a,q,e,h){var b=A.wgs84Radius,f=A.wgs84PolarRadius,g=A.wgs84Flattening,m=Math.sin(e);e=Math.cos(e);var d=(1-g)*Math.tan(a);a=1/Math.sqrt(1+d*d);for(var c=d*a,n=Math.atan2(d,e),d=a*m*a*m,l=1-d,b=l*(b*b-f*f)/(f*f),u=1+b/16384*(4096+b*(-768+b*(320-175*b))),p=b/1024*(256+b*(-128+b*(74-47*b))),b=h/(f*u),v=2*Math.PI,r,t,k,w;1E-12<Math.abs(b-
v);)k=Math.cos(2*n+b),r=Math.sin(b),t=Math.cos(b),w=p*r*(k+p/4*(t*(-1+2*k*k)-p/6*k*(-3+4*r*r)*(-3+4*k*k))),v=b,b=h/(f*u)+w;h=c*r-a*t*e;f=g/16*l*(4+g*(4-3*l));return new G((q+(Math.atan2(r*m,a*t-c*r*e)-(1-f)*g*Math.sqrt(d)*(b+f*r*(k+f*t*(-1+2*k*k)))))/(Math.PI/180),Math.atan2(c*t+a*r*e,(1-g)*Math.sqrt(d+h*h))/(Math.PI/180),new J({wkid:4326}))}function D(a,q,e,h){var b=A.wgs84Radius,f=A.wgs84PolarRadius,g=A.wgs84Flattening,m=h-q,d=Math.atan((1-g)*Math.tan(a)),c=Math.atan((1-g)*Math.tan(e)),n=Math.sin(d),
d=Math.cos(d),l=Math.sin(c),c=Math.cos(c),u=1E3,p=m,v,r,t,k,w,z,x,y;do{k=Math.sin(p);w=Math.cos(p);t=Math.sqrt(c*k*c*k+(d*l-n*c*w)*(d*l-n*c*w));if(0===t)return{geodesicDistance:0};w=n*l+d*c*w;z=Math.atan2(t,w);x=d*c*k/t;r=1-x*x;k=w-2*n*l/r;isNaN(k)&&(k=0);y=g/16*r*(4+g*(4-3*r));v=p;p=m+(1-y)*g*x*(z+y*t*(k+y*w*(-1+2*k*k)))}while(1E-12<Math.abs(p-v)&&0<--u);if(0===u)return f=h-q,{geodesicDistance:6371009*Math.acos(Math.sin(a)*Math.sin(e)+Math.cos(a)*Math.cos(e)*Math.cos(h-q)),azimuth:Math.atan2(Math.sin(f)*
Math.cos(e),Math.cos(a)*Math.sin(e)-Math.sin(a)*Math.cos(e)*Math.cos(f))};a=r*(b*b-f*f)/(f*f);q=a/1024*(256+a*(-128+a*(74-47*a)));return{geodesicDistance:f*(1+a/16384*(4096+a*(-768+a*(320-175*a))))*(z-q*t*(k+q/4*(w*(-1+2*k*k)-q/6*k*(-3+4*t*t)*(-3+4*k*k)))),azimuth:Math.atan2(c*Math.sin(p),d*l-n*c*Math.cos(p)),reverseAzimuth:Math.atan2(d*Math.sin(p),d*l*Math.cos(p)-n*c)}}function F(a,q){if("polyline"!==a.type&&"polygon"!==a.type)throw a="geodesicDensify: the input geometry is neither polyline nor polygon",
console.error(a),Error(a);if(!a.spatialReference.isWGS84)throw a="geodesicDensify: the input geometry must use the WGS84 spatial reference",console.error(a),Error(a);var e=Math.PI/180;637.100877151506>q&&(q=637.100877151506);for(var h=[],b=0,f="polyline"===a.type?a.paths:a.rings;b<f.length;b++){var g=f[b],m=[];h.push(m);m.push([g[0][0],g[0][1]]);for(var d=g[0][0]*e,c=g[0][1]*e,n=void 0,l=void 0,u=0;u<g.length-1;u++)if(n=g[u+1][0]*e,l=g[u+1][1]*e,d!==n||c!==l){var l=D(c,d,l,n),n=l.azimuth,l=l.geodesicDistance,
p=l/q;if(1<p){for(var v=1;v<=p-1;v++){var r=B(c,d,n,v*q);m.push([r.x,r.y])}p=B(c,d,n,(l+Math.floor(p-1)*q)/2);m.push([p.x,p.y])}c=B(c,d,n,l);m.push([c.x,c.y]);d=c.x*e;c=c.y*e}}return"polyline"===a.type?new I({paths:h,spatialReference:a.spatialReference}):new H({rings:h,spatialReference:a.spatialReference})}function C(a,q){var e=Math.PI/180,h=A.wgs84Radius,b=Math.sin(q[1]*e),b=.9933056200098026*(b/(1-.006694379990197414*b*b)-6.111035746609262*Math.log((1-.0818191908429643*b)/(1+.0818191908429643*b)));
a[0]=h*q[0]*e;a[1]=h*b*.5;return a}Object.defineProperty(z,"__esModule",{value:!0});z.directGeodeticSolver=B;z.inverseGeodeticSolver=D;z.geodesicDensify=F;z.geodesicLengths=function(a,q){if(a.some(function(a){return!a.spatialReference.isWGS84}))throw console.error("geodesicLengths: the input geometries must use the WGS84 spatial reference"),Error("geodesicLengths: the input geometries must use the WGS84 spatial reference");for(var e=Math.PI/180,h=[],b=0;b<a.length;b++){for(var f=a[b].paths,g=0,m=
0;m<f.length;m++){for(var d=f[m],c=0,n=1;n<d.length;n++){var l=d[n-1][0]*e,u=d[n][0]*e,p=d[n-1][1]*e,v=d[n][1]*e;if(p!==v||l!==u)l=D(p,l,v,u),c+=l.geodesicDistance}g+=c}g=E.convertUnit(g,"meters",q);h.push(g)}return h};var x=[0,0],y=[0,0];z.geodesicAreas=function(a,q){if(a.some(function(a){return!a.spatialReference.isWGS84}))throw console.error("geodesicAreas: the input geometries must use the WGS84 spatial reference"),Error("geodesicAreas: the input geometries must use the WGS84 spatial reference");
for(var e=[],h=0;h<a.length;h++){var b=F(a[h],1E4);e.push(b)}a=[];for(h=0;h<e.length;h++){for(var b=e[h].rings,f=0,g=0;g<b.length;g++){var m=b[g];C(x,m[0]);C(y,m[m.length-1]);for(var d=y[0]*x[1]-x[0]*y[1],c=0;c<m.length-1;c++)C(x,m[c+1]),C(y,m[c]),d+=y[0]*x[1]-x[0]*y[1];f+=d}f=E.convertUnit(f,"square-meters",q);a.push(f/-2)}return a}});