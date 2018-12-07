
function CirLine (id,fromnode,tonode) {
    CirLine.superClass.constructor.apply(this, arguments);
    this.init();
}

twaver.Util.ext(CirLine, twaver.Link, {
    init:function () {
        this.setStyle('link.width',1);
        this.setStyle('select.style','border');
        this.setStyle('select.width',1);
        this.setStyle('select.color','#d501cf');
        this.setStyle('label.position','top.top');
        this.setStyle('link.color','#000000');
    }
});