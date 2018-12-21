var TransNe = function (id) {
    TransNe.superClass.constructor.apply(this, arguments);
    this.init();
};

twaver.Util.ext(TransNe, twaver.Follower, {
    init: function () {
        this.setImage("route");
        this.setStyle('select.style', 'border');
        this.setStyle('select.width', 1);
        this.setStyle('select.color', '#d501cf');
        this.setStyle('label.color', '#5FB5FC');
        this.setSize(70,70);
        this.setLayerId("neLayer");
        this.addPropertyChangeListener(this.handlePropertyChangeListener);
    },
    handlePropertyChangeListener: function (e) {
        if (e.property === 'C:isTermial') {
            var node = e.source;
            if (node.getClient("isTermial")=='true') {
                    node.setImage("sideroute");
            }
        }
    }
});
