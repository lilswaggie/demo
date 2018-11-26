
var ParseData = {
    start_y: 80,
    center_x:'',
    center_y:"",
    min_a:200,
    min_b:"",
    max_b:"",
    max_a:"",
    a_b_scale:2,
    box:null,
    init:function (box) {
        this.box=box;
        this.center_x=document.getElementById('main').clientWidth/2;
        this.center_y=(document.getElementById('main').clientHeight-170)/2+170;

        this.max_b=(document.getElementById('main').clientHeight-170)/2;
        this.max_a=this.a_b_scale*this.max_b;
        this.minb=this.min_a/this.a_b_scale;

        var layer = new twaver.Layer("roomLayer");
        this.box.getLayerBox().add(layer);
        var nelayer = new twaver.Layer("neLayer");
        this.box.getLayerBox().add(nelayer);
    },
    parseData: function (json,box) {
        this.init(box);
        //生成上部的机房和网元
        var cir_id=json.int_id;
        var cir_name=json.zh_label;
        var aroom=new RoomObj();
        aroom.setClient("int_id",json.a_transequiproom_id);
        aroom.setClient("zh_label",json.a_transequiproom_value);
        aroom.setCenterLocation(this.center_x-aroom.getWidth()*1.2,this.start_y);
        this.box.add(aroom);

        var zroom=new RoomObj();
        zroom.setClient("int_id",json.z_transequiproom_id);
        zroom.setClient("zh_label",json.z_transequiproom_value);
        zroom.setCenterLocation(this.center_x+zroom.getWidth()*1.2,this.start_y);
        this.box.add(zroom);

        var cirline=new CirLine(cir_id,aroom,zroom);
        cirline.setClient("zh_label",cir_name);
        this.box.add(cirline);

        var atrans=new TransNe();
        atrans.setClient("int_id",json.a_transne_id);
        atrans.setClient("zh_label",json.a_transne_id_value);
        atrans.setClient("top",'true');
        atrans.setClient("isTermial",'true');
        atrans.setCenterLocation(this.center_x-aroom.getWidth()*1.2,this.start_y);
        this.box.add(atrans);

        var ztrans=new TransNe();
        ztrans.setClient("int_id",json.z_transne_id);
        ztrans.setClient("zh_label",json.z_transne_id_value);
        ztrans.setClient("top",'true');
        ztrans.setClient("isTermial",'true');
        ztrans.setCenterLocation(this.center_x+zroom.getWidth()*1.2,this.start_y);
        this.box.add(ztrans);

        //生成机房下面的数据库节点
        var data_a=new dataBaseObj();
        data_a.setCenterLocation(aroom.getCenterLocation().x,this.start_y+120);
        this.box.add(data_a);
        var vitual_a=new RoomObj();
        vitual_a.setSize(1,1);
        vitual_a.setCenterLocation(aroom.getCenterLocation().x,aroom.getCenterLocation().y+aroom.getHeight()/2);
        this.box.add(vitual_a);
        var line_a=new CirLine('avirtualine',vitual_a,data_a);
        line_a.setStyle('link.width',1)
        this.box.add(line_a);

        var data_z=new dataBaseObj();
        data_z.setCenterLocation(zroom.getCenterLocation().x,this.start_y+120);
        this.box.add(data_z);
        var vitual_z=new RoomObj();
        vitual_z.setSize(1,1);
        vitual_z.setCenterLocation(zroom.getCenterLocation().x,zroom.getCenterLocation().y+zroom.getHeight()/2);
        this.box.add(vitual_z);
        var line_z=new CirLine('zvirtualine',vitual_z,data_z);
        line_z.setStyle('link.width',1)
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
        var aneid=json.a_ne_id;
        var zneid=json.z_ne_id;
        var anename=json.a_ne_name;
        var znename=json.z_ne_name;

        var atrans=new TransNe(aneid);
        atrans.setClient("int_id",aneid);
        atrans.setClient("zh_label",anename);
        atrans.setClient("isTermial",'true');
        this.box.add(atrans);

        var ztrans=new TransNe(zneid);
        ztrans.setClient("int_id",zneid);
        ztrans.setClient("zh_label",znename);
        ztrans.setClient("isTermial",'true');
        this.box.add(ztrans);

        var routes=json.route;
        if(routes){
            var size=routes.length;
            if(size==2){   //椭圆
                var route1=routes[0];
                var route2=routes[1];
                var size1=route1.length;
                var size2=route2.length;
                var bigsize=size1;
                if(bigsize<size2){
                    bigsize=size2
                }

                var pai=3.1415926;
                var initAngle = pai;  //180°
                var spanAngle=pai/100;

                var radius_b = bigsize*23;
                if(radius_b<this.min_b){
                    radius_b=this.min_b;
                }
                else if(radius_b>this.max_b){
                    radius_b=this.max_b;
                }
                var radius_a=radius_b*2;

                atrans.setCenterLocation(this.center_x-radius_a,this.center_y);
                ztrans.setCenterLocation(this.center_x+radius_a,this.center_y);

                //机房的连接和路由的连接
                var virtual1=new RoomObj();
                virtual1.setSize(1,1);
                virtual1.setCenterLocation(this.center_x,this.start_y);
                this.box.add(virtual1);

                var virtual2=new RoomObj();
                virtual2.setSize(1,1);
                virtual2.setCenterLocation(this.center_x,this.center_y-radius_b);
                this.box.add(virtual2);

                var vitualline = new CirLine('virtual', virtual1, virtual2);
                vitualline.setStyle('link.pattern', [8, 8]);
                this.box.add(vitualline);

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
                            to.setCenterLocation(this.center_x + radius_a * (Math.sin(angle)), this.center_y + radius_b * (Math.cos(angle)));
                            this.box.add(to);
                        }
                        if (seg.z_alarm) {
                            to.setStyle("inner.color", '#ff0000');
                        }

                        var routeline = new RouteLine(seg.a_ne_id + "-" + seg.z_ne_id, from, to);
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
        else{
            atrans.setCenterLocation(this.center_x-200,this.center_y);
            ztrans.setCenterLocation(this.center_x+200,this.center_y);
            var cirline=new CirLine(aneid+"-"+zneid,atrans,ztrans);
            cirline.setStyle('link.pattern',[8,8]);
            this.box.add(cirline);
        }
    }




}
