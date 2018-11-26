var toponetwork = function (box) {
    toponetwork.superClass.constructor.call(this, box);
    this.init();
};

twaver.Util.ext(toponetwork, twaver.vector.Network, {
    init: function () {
        var self = this;
        self.setKeyboardRemoveEnabled(false);
        self.setZoomDivVisible(false);
        self.setMaxZoom(10);
        self.setMinZoom(0.07);
        self.addInteractionListener(self.interactionHandler, self);
        self.setEditableFunction(function (element) {
            return false;
        });

        self.setLinkPathFunction(function (linkUI, defaultPoints) {
            var link = linkUI._element;
            if(link instanceof RouteLine) {
                var f = linkUI.getFromPoint();
                var t = linkUI.getToPoint();

                var points = new twaver.List();
                points.add(f);
                points.add(t);

                //todo   改成根据角度算坐标xy
                var lineLength = _twaver.math.getDistance(f, t);
                var offset = lineLength / 10;
                var m = {
                    x: (f.x + t.x) / 2 + offset + 1 * 15,
                    y: (f.y + t.y) / 2 + offset - 1 * 15
                }
                //改成根据角度算坐标xy

                var cps = new twaver.List();
                cps.add(m);
                cps.add(t);

                points.removeAt(1);
                points.add(cps);

                return points;
            }
            else {
                return defaultPoints;
            }
        });
        self.getLabel = function (data) {
            if(data instanceof RoomObj || (data instanceof TransNe && data.getClient("top")=='true') || data instanceof CirLine) {
                return data.getClient('zh_label');
            }
            return "";
        };
        self.getToolTip = function (data) {
            return data.getClient('zh_label');
        }
        self.setMovableFunction(function (ele) {
            return false;
        });

        self.setVisibleFunction(function (element) {
            return true;
        });

        self.getElementBox().addDataBoxChangeListener(function (e) {

        });

        self.getSelectionModel().setFilterFunction(function (ele) {
            return true;
        });
    },
    interactionHandler: function (e) {
    }
});