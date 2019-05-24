/**
 * Created by weijx on 2017/8/7.
 */
var image={
    network:'',
    init:function () {
        twaver.Util.registerImageByUrl('./images/sideroute.png','sideroute',this.network);
        twaver.Util.registerImageByUrl('./images/database.png','database',this.network);
        twaver.Util.registerImageByUrl('./images/route.png','route',this.network);
    },
    registerImage: function (url, svg) {
        var image = new Image();
        image.src = url;
        var views = arguments;
        image.onload = function () {
            twaver.Util.registerImage(demo.Util.getImageName(url), image, image.width, image.height, svg === true);
            image.onload = null;
            for (var i = 1; i < views.length; i++) {
                var view = views[i];
                if (view.invalidateElementUIs) {
                    view.invalidateElementUIs();
                }
                if (view.invalidateDisplay) {
                    view.invalidateDisplay();
                }
            }
        };
    },

    registerNormalImage: (function () {
        var loadingImages = {};
        return function (url, name, view) {
            if (loadingImages[url]) {
                loadingImages[url].push(callback);
                return;
            }
            if (twaver.Util.getImageAsset(name)) {
                return;
            }
            loadingImages[url] = [callback];
            var image = new Image();
            image.src = url;

            // Fix IE bug
            // if (twaver.Util.isIE && url.substr(url.length - 4) === '.svg') {
            //     image.style.visibility = 'hidden';
            //     RegisterImage.network.getView().appendChild(image);
            //     image.onload = function () {
            //         setTimeout(function () {
            //             twaver.Util.registerImage(name, image, image.clientWidth, image.clientHeight, true);
            //             image.onload = null;
            //             RegisterImage.network.getView().removeChild(image);
            //             loadingImages[url].forEach(function (cb) {
            //                 cb();
            //             });
            //             delete loadingImages[url];
            //         }, 200);
            //     };
            // } else {
                image.onload = function () {
                    twaver.Util.registerImage(name, image, image.width, image.height);
                    image.onload = null;
                    loadingImages[url].forEach(function (cb) {
                        cb();
                    });
                    delete loadingImages[url];
                };
            // }

            function callback() {
                if (view.invalidateElementUIs) {
                    view.invalidateElementUIs();
                } else if (view.invalidateDisplay) {
                    view.invalidateDisplay();
                } else {
                    view(image);
                }
            }
        };
    })(),
    getImageName: function (url) {
        var index = url.lastIndexOf('/');
        var name = url;
        if (index >= 0) {
            name = url.substring(index + 1);
        }
        index = name.lastIndexOf('.');
        if (index >= 0) {
            name = name.substring(0, index);
        }
        return name;
    },
}