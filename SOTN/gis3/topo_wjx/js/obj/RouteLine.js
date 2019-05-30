
function RouteLine (id,fromnode,tonode) {
    RouteLine.superClass.constructor.apply(this, arguments);
    this.init();
}

twaver.Util.ext(RouteLine, twaver.ShapeLink, {
    init:function () {
        this.setStyle('link.width',1);
        this.setStyle('select.style','border');
        this.setStyle('select.width',1);
        this.setStyle('select.color','#d501cf');
        this.setStyle('link.color','#000000');
    }
});