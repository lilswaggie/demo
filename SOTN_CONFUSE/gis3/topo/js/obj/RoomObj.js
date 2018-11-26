var RoomObj = function (id) {
    RoomObj.superClass.constructor.apply(this, arguments);
    this.init();
};

twaver.Util.ext(RoomObj, twaver.Node, {
    init:function () {
        this.setStyle('body.type', 'vector');
        this.setStyle("vector.shape","rectangle");
        this.setStyle('vector.fill.alpha',0.1);
        this.setStyle('vector.outline.color','#EFF5FF');
        this.setStyle('vector.fill.color','#EFF5FF');
        this.setStyle('vector.padding',1);
        this.setStyle('label.font','16px 黑体');
        this.setLayerId("roomLayer");
        this.setSize(260,110);

    }
});