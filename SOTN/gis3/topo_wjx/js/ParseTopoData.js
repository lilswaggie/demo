var ParseTopoData = {
    center_x: '',
    center_y: "",
    begin_x: 60,
    begin_y: 40,
    span: 2.5,
    box: null,
    idFinder: null,
    parentIdMap: {},
    init: function (box) {
        this.box = box;
        this.center_x = document.getElementById('main').clientWidth / 2;
        this.center_y = document.getElementById('main').clientHeight / 2;

        var layer = this.box.getLayerBox().getDataById("roomLayer");
        if (layer == null) {
            layer = new twaver.Layer("roomLayer");
            this.box.getLayerBox().add(layer);
        }
        var nelayer = this.box.getLayerBox().getDataById("neLayer");
        if (nelayer == null) {
            nelayer = new twaver.Layer("neLayer");
            this.box.getLayerBox().add(nelayer);
        }
        this.idFinder = new twaver.QuickFinder(this.box, 'id');
    },
    parseData: function (json, box) {
        this.init(box);
        // var aroom = new dataBaseObj();
        // aroom.setClient("int_id", json.a_transequiproom_id);
        // aroom.setClient("flag", 'a');
        // aroom.setClient("zh_label", json.a_transequiproom_value);
        // aroom.setCenterLocation(this.begin_x, this.center_y);
        // this.box.add(aroom);
        //
        // var zroom = new dataBaseObj();
        // zroom.setClient("int_id", json.z_transequiproom_id);
        // zroom.setClient("zh_label", json.z_transequiproom_value);
        // zroom.setClient("flag", 'z');
        // zroom.setCenterLocation(this.center_x * 2 - this.begin_x, this.center_y);
        // this.box.add(zroom);
        //
        // var aneid = json.a_transne_id;
        // var zneid = json.z_transne_id;
        // var anename = json.a_transne_id_value;
        // var znename = json.z_transne_id_value;
        //
        // var atrans = new TransNe(aneid);
        // atrans.setClient("int_id", aneid);
        // atrans.setClient("zh_label", anename);
        // atrans.setClient("isTermial", 'true');
        // atrans.setClient("flag", 'a');
        // atrans.setCenterLocation(this.span * this.begin_x, this.center_y);
        // this.box.add(atrans);
        //
        // var line_a = new CirLine('aline', aroom, atrans);
        // line_a.setStyle('link.width', 1)
        // this.box.add(line_a);
        //
        // var ztrans = new TransNe(zneid);
        // ztrans.setClient("int_id", zneid);
        // ztrans.setClient("zh_label", znename);
        // ztrans.setClient("isTermial", 'true');
        // ztrans.setClient("flag", 'z');
        // ztrans.setCenterLocation(this.center_x * 2 - this.span * this.begin_x, this.center_y);
        // this.box.add(ztrans);
        //
        // var line_z = new CirLine('zline', ztrans, zroom);
        // line_z.setStyle('link.width', 1)
        // this.box.add(line_z);

        //画通道
        var paths = json.path;
        if (paths) {
            for (var i = 0; i < paths.length; i++) {
                this.parsePath(paths[i]);
            }
        }
        this.doLayout();
    },

    parsePath: function (json) {

        var routes = json.route;
        if (routes) {
            for (var i = 0; i < routes.length; i++) {
                var route = routes[i];
                for (var j = 0; j < route.length; j++) {
                    var segData = route[j];
                    var a_port = this.addNode(segData.a_port_id, segData.a_port_name, segData.a_ne_id, segData.a_ne_name);
                    var z_port = this.addNode(segData.z_port_id, segData.z_port_name, segData.z_ne_id, segData.z_ne_name);
                    this.addLink(a_port, z_port);
                }
            }

        }

        // else{
        //     atrans.setCenterLocation(this.center_x-200,this.center_y);
        //     ztrans.setCenterLocation(this.center_x+200,this.center_y);
        //     var cirline=new CirLine(aneid+"-"+zneid,atrans,ztrans);
        //     cirline.setStyle('link.pattern',[8,8]);
        //     this.box.add(cirline);
        // }
    },
    addGroup: function () {
        for (var obj in this.parentIdMap) {
            this.box.add(this.parentIdMap[obj]);
        }
        var eleArray = []
        this.box.forEachReverse(function (ele) {
            if (ele instanceof TransNe && ele.getClient('parent')) {
                eleArray.push(ele);
            }
        })
        eleArray.forEach(function (ele) {
            ele.setParent(ele.getClient('parent'));
        })
    },
    addLink: function (from_node, to_node) {
        let link = new twaver.Link(null, from_node, to_node);
        this.box.add(link);
    },
    addNode: function (id, name, parent_id, parent_name) {
        var tmpNode = this.idFinder.findFirst(id);
        if (tmpNode) {
            return tmpNode;
        }

        var port = new TransNe(id);
        port.setClient('zh_label', name);
        var parentNode = this.parentIdMap[parent_id];
        if (!parentNode) {
            parentNode = new twaver.Group(parent_id)
            parentNode.setName(parent_name);
            parentNode.setExpand(true);
            this.parentIdMap[parent_id] = parentNode;
            // this.box.add(parentNode);
        }
        // port.setParent(parentNode);
        port.setClient('parent', parentNode);
        this.box.add(port);
        return port;
    },
    doLayout() {
        var self = this
        var autoLayouter = new twaver.layout.AutoLayouter(this.box)
        autoLayouter.setRepulsion(3)
        // autoLayouter.isMovable = function (ele) {
        //     return true;
        //     // return !(ele instanceof twaver.Group);
        // }
        autoLayouter.doLayout('hierarchic', function () {
            self.box.forEach(data => {
                if (data instanceof twaver.Node) {
                    data.setLocation(data.getY(), data.getX())
                }
            })
            self.addGroup();
        })

        // autoLayouter.doLayout('leftright', function () {
        //     self.box.forEach(data => {
        //         // if (data instanceof twaver.Node) {
        //         //     data.setLocation(data.getY(), data.getX())
        //         // }
        //     })
        // })
    }
}
