
var ParseTopoData = {
    center_x:'',
    center_y:"",
    begin_x:60,
    begin_y:40,
    span:2.5,
    box:null,
    init:function (box) {
        this.box=box;
        this.center_x=document.getElementById('main').clientWidth/2;
        this.center_y=document.getElementById('main').clientHeight/2;

        var layer = this.box.getLayerBox().getDataById("roomLayer");
        if(layer==null) {
            layer=new twaver.Layer("roomLayer");
            this.box.getLayerBox().add(layer);
        }
        var nelayer = this.box.getLayerBox().getDataById("neLayer");
        if(nelayer==null) {
            nelayer=new twaver.Layer("neLayer");
            this.box.getLayerBox().add(nelayer);
        }
    },
    parseData: function (json,box) {
        this.init(box);
        var aroom=new dataBaseObj();
        aroom.setImage('room');
        aroom.setClient("int_id",json.a_transequiproom_id);
        aroom.setClient("flag",'a');
        aroom.setClient("zh_label",json.a_transequiproom_value);
        aroom.setCenterLocation(this.begin_x,this.center_y);
        this.box.add(aroom);

        var zroom=new dataBaseObj();
        zroom.setImage('room');
        zroom.setClient("int_id",json.z_transequiproom_id);
        zroom.setClient("zh_label",json.z_transequiproom_value);
        zroom.setClient("flag",'z');
        zroom.setCenterLocation(this.center_x*2-this.begin_x,this.center_y);
        this.box.add(zroom);

        var aneid=json.a_transne_id;
        var zneid=json.z_transne_id;
        var anename=json.a_transne_id_value;
        var znename=json.z_transne_id_value;

        var atrans=new TransNe(aneid);
        atrans.setClient("int_id",aneid);
        atrans.setClient("zh_label",anename);
        atrans.setClient("isTermial",'true');
        atrans.setClient("flag",'a');
        atrans.setCenterLocation(this.span*this.begin_x,this.center_y);
        atrans.setImage('bigtrans');
        this.box.add(atrans);

        var line_a=new CirLine('aline',aroom,atrans);
        line_a.setStyle('link.color','#2D9395');
        line_a.setStyle('link.width',1)
        this.box.add(line_a);

        var ztrans=new TransNe(zneid);

        ztrans.setClient("int_id",zneid);
        ztrans.setClient("zh_label",znename);
        ztrans.setClient("isTermial",'true');
        ztrans.setClient("flag",'z');
        ztrans.setCenterLocation(this.center_x*2-this.span*this.begin_x,this.center_y);
        ztrans.setImage('bigtrans');
        this.box.add(ztrans);

        var line_z=new CirLine('zline',ztrans,zroom);
        line_z.setStyle('link.width',1);
        line_z.setStyle('link.color','#2D9395');
        this.box.add(line_z);

        //画通道
        var paths=json.path;
        if(paths){
            for(var i=0;i<paths.length;i++){
                this.parsePath(paths[i]);
            }
        }
    },

    parsePath:function (json) {
        var routes=json.route;
        if(routes){
            var size=routes.length;
            if(size==2){   //椭圆
                var pai=3.1415926;
                var initAngle = pai;  //180°
                var spanAngle=pai/100;

                var radius_b = document.getElementById('main').clientHeight/2-this.begin_y;
                var radius_a=document.getElementById('main').clientWidth/2-this.span*this.begin_x;

                for(var i=0;i<size;i++) {
                    var index=1;
                    if(i==0){
                        index=-1;
                    }
                    var route = routes[i];
                    var routesize = route.length;
                    var perAngle = initAngle / routesize;
                    var angle=-pai/2;


                    for(var j=0;j<route.length;j++) {
                        var seg=route[j];

                        var beginangle=angle;
                        angle += index*perAngle;
                        var from = this.box.getDataById(seg.a_ne_id);
                        if (from == null) {
                            from = new TransNe(seg.a_ne_id);
                            from.setSize(28,28);
                            from.setClient("int_id", seg.a_ne_id);
                            from.setClient("zh_label", seg.a_ne_name);
                            from.setClient("angle",angle);
                            from.setImage('transne');
                            from.setCenterLocation(this.center_x + radius_a * (Math.sin(angle)), this.center_y + radius_b * (Math.cos(angle)));
                            this.box.add(from);
                        }
                        if (seg.a_alarm) {
                            from.setStyle("inner.color", '#ff0000');
                        }

                        var to = this.box.getDataById(seg.z_ne_id);
                        if (to == null) {
                            to = new TransNe(seg.z_ne_id);
                            to.setSize(28,28);
                            to.setClient("int_id", seg.z_ne_id);
                            to.setClient("zh_label", seg.z_ne_name);
                            to.setClient("angle",angle);
                            to.setImage('transne');
                            to.setCenterLocation(this.center_x + radius_a * (Math.sin(angle)), this.center_y + radius_b * (Math.cos(angle)));
                            this.box.add(to);
                        }
                        if (seg.z_alarm) {
                            to.setStyle("inner.color", '#ff0000');
                        }

                        var routeline = new RouteLine(seg.a_ne_id + "-" + seg.z_ne_id, from, to);
                        routeline.setStyle('link.color','#2D9395');
                        if (seg.iscutoff == 'true') {
                            routeline.setStyle('link.pattern', [8, 8]);
                        }
                        points = new twaver.List();
                        if(beginangle<angle){
                            for(var offset=beginangle;offset<angle;offset+=spanAngle){
                                var offsetx=this.center_x + radius_a * (Math.sin(offset));
                                var offsety=this.center_y + radius_b * (Math.cos(offset));
                                var point={x:offsetx,y:offsety};
                                points.add(point);
                            }
                        }
                        else if(beginangle>angle){
                            for(var offset=beginangle;offset>angle;offset-=spanAngle){
                                var offsetx=this.center_x + radius_a * (Math.sin(offset));
                                var offsety=this.center_y + radius_b * (Math.cos(offset));
                                var point={x:offsetx,y:offsety};
                                points.add(point);
                            }
                        }
                        routeline.setPoints(points);
                        this.box.add(routeline);
                    }
                }
            }
            else if(size==1){  //线型

            }
        }
        // else{
        //     atrans.setCenterLocation(this.center_x-200,this.center_y);
        //     ztrans.setCenterLocation(this.center_x+200,this.center_y);
        //     var cirline=new CirLine(aneid+"-"+zneid,atrans,ztrans);
        //     cirline.setStyle('link.pattern',[8,8]);
        //     this.box.add(cirline);
        // }
    }
}
