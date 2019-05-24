//var toolbar = document.createElement('div');
var main = {
    box: "",
    network: "",
    init: function () {
        this.initLayout();
        image.network=this.network;
        image.init();
        this.initData();
    },
    initLayout: function () {
        var self = this;
        var box = new twaver.ElementBox();
        var network = new toponetwork(box);
        this.box = box;
        this.network = network;
        this.network.setScrollBarVisible(false);

        document.getElementById('main').appendChild(this.network.getView());

        var zoomManager = new twaver.vector.LogicalZoomManager(this.network,false);
        this.network.setZoomManager(zoomManager);

        this.network.adjustBounds({
            x: 0,
            y: 0,
            width: document.getElementById('main').clientWidth,
            height: document.getElementById('main').clientHeight
        });

        window.onresize = function (e) {
            self.network.adjustBounds({
                x: 0,
                y: 0,
                width: document.getElementById('main').clientWidth+16,
                height: document.getElementById('main').clientHeight+16
            });
            //重新定位
            self.initData();
        };

    },

    initData: function () {
        var result=data.resultxml;
        if(result.success='true') {
            this.box.clear();
            ParseData.parseData(result.circuit,this.box);
        }
    }
}
