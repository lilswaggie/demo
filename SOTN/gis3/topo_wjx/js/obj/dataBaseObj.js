var dataBaseObj = function (id) {
    dataBaseObj.superClass.constructor.apply(this, arguments);
    this.init();
};

twaver.Util.ext(dataBaseObj, twaver.Node, {
    init:function () {
        this.setImage("database");
        this.setStyle('select.style', 'border');
        this.setStyle('select.width', 1);
        this.setStyle('select.color', '#d501cf');
        this.setSize(28,28);
        this.setLayerId("roomLayer");
    }
});