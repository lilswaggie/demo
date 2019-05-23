/**
 * @author wang.ning
 */
var gis = {};
if(jQuery)(function(){
    $.extend($.fn,{
        gis:function(){
            var func = arguments[0];
            arguments[0] = this;
            return eval('gis["'+ func+'"]').apply(this, arguments);
        }
    });
})(jQuery)