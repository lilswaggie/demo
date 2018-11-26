// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.9/esri/copyright.txt for details.
//>>built
define(["require","exports","dojo/regexp"],function(g,d,f){Object.defineProperty(d,"__esModule",{value:!0});d.evaluateFunction=function(a,b){var c=e[a.toLowerCase()];if(null==c)throw Error("Function Not Recognised");if(b.length<c.minParams||b.length>c.maxParams)throw Error("Invalid Parameter count for call to "+a.toUpperCase());return c.evaluate(b)};d.isStandardized=function(a,b){a=e[a.toLowerCase()];return null!=a&&b>=a.minParams&&b<=a.maxParams};var e={extract:{minParams:2,maxParams:2,evaluate:function(a){var b=
a[0];a=a[1];if(null==a)return null;if(a instanceof Date)switch(b.toUpperCase()){case "SECOND":return a.getSeconds();case "MINUTE":return a.getMinutes();case "HOUR":return a.getHours();case "DAY":return a.getDate();case "MONTH":return a.getMonth()+1;case "YEAR":return a.getFullYear()}throw Error("Invalid Parameter for call to EXTRACT");}},substring:{minParams:2,maxParams:3,evaluate:function(a){if(2===a.length){var b=a[0],c=a[1];return null==b||null==c?null:b.toString().substring(c-1)}if(3===a.length)return b=
a[0],c=a[1],a=a[2],null==b||null==c||null==a?null:0>=a?"":b.toString().substring(c-1,c+a-1)}},position:{minParams:2,maxParams:2,evaluate:function(a){var b=a[0];a=a[1];return null==b||null==a?null:a.indexOf(b)+1}},trim:{minParams:2,maxParams:3,evaluate:function(a){var b=3===a.length,c=b?a[1]:" ",b=b?a[2]:a[1];if(null==c||null==b)return null;c="("+f.escapeString(c)+")";switch(a[0]){case "BOTH":return b.replace(new RegExp("^"+c+"*|"+c+"*$","g"),"");case "LEADING":return b.replace(new RegExp("^"+c+"*",
"g"),"");case "TRAILING":return b.replace(new RegExp(c+"*$","g"),"")}throw Error("Invalid Parameter for call to TRIM");}},abs:{minParams:1,maxParams:1,evaluate:function(a){return null==a[0]?null:Math.abs(a[0])}},ceiling:{minParams:1,maxParams:1,evaluate:function(a){return null==a[0]?null:Math.ceil(a[0])}},floor:{minParams:1,maxParams:1,evaluate:function(a){return null==a[0]?null:Math.floor(a[0])}},log:{minParams:1,maxParams:1,evaluate:function(a){return null==a[0]?null:Math.log(a[0])}},log10:{minParams:1,
maxParams:1,evaluate:function(a){return null==a[0]?null:Math.log(a[0])*Math.LOG10E}},sin:{minParams:1,maxParams:1,evaluate:function(a){return null==a[0]?null:Math.sin(a[0])}},cos:{minParams:1,maxParams:1,evaluate:function(a){return null==a[0]?null:Math.cos(a[0])}},tan:{minParams:1,maxParams:1,evaluate:function(a){return null==a[0]?null:Math.tan(a[0])}},asin:{minParams:1,maxParams:1,evaluate:function(a){return null==a[0]?null:Math.asin(a[0])}},acos:{minParams:1,maxParams:1,evaluate:function(a){return null==
a[0]?null:Math.acos(a[0])}},atan:{minParams:1,maxParams:1,evaluate:function(a){return null==a[0]?null:Math.atan(a[0])}},sign:{minParams:1,maxParams:1,evaluate:function(a){return null==a[0]?null:0<a[0]?1:0>a[1]?-1:0}},power:{minParams:2,maxParams:2,evaluate:function(a){return null==a[0]||null==a[1]?null:Math.pow(a[0],a[1])}},mod:{minParams:2,maxParams:2,evaluate:function(a){return null==a[0]||null==a[1]?null:a[0]%a[1]}},round:{minParams:1,maxParams:2,evaluate:function(a){var b=a[0];a=2===a.length?
Math.pow(10,a[1]):1;return null==b?null:Math.round(b*a)/a}},truncate:{minParams:1,maxParams:2,evaluate:function(a){return null==a[0]?null:1===a.length?parseInt(a[0].toFixed(0),10):parseFloat(a[0].toFixed(a[1]))}},char_length:{minParams:1,maxParams:1,evaluate:function(a){return"string"===typeof a[0]||a[0]instanceof String?a[0].length:0}},concat:{minParams:1,maxParams:Infinity,evaluate:function(a){for(var b="",c=0;c<a.length;c++){if(null==a[c])return null;b+=a[c].toString()}return b}},lower:{minParams:1,
maxParams:1,evaluate:function(a){return null==a[0]?null:a[0].toString().toLowerCase()}},upper:{minParams:1,maxParams:1,evaluate:function(a){return null==a[0]?null:a[0].toString().toUpperCase()}}}});