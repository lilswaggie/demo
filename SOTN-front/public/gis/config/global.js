/**
 * Created by wang.ning on 2018/10/30.
 */
var Global = {};
Global.baseQueryURL='http://10.154.8.22:8088';         //请求后台接口ip地址配置
Global.sysAddr_317 = '10.24.44.16:8080/arcgis/3.17/';
Global.sysPath = '/sotn/gis/';
Global.Authorization_a = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzb3RuLW84IiwiZXhwIjoxNTQ2OTk5MzU4LCJpYXQiOjE1NDQ0MDczNTh9.AsyYb4RB6QLuW-Nt1FFnthh4-OvK3lIuUx7Q1FLrkpeu55klEV5g1XXBeB2Y0Lomz-aAcJoTqByLEBYdPt117Q';
Global.Authorization = top.gis.getToken ? top.gis.getToken() : Global.Authorization_a;
if (/http:\/\/localhost:3000.*/.test(top.location.href)) {
    Global.sysPath = 'http://localhost:3000/gis/';
    Global.sysAddr_317 = '10.154.8.22:8020/arcgis/3.17/';
}
if (/http?:\/\/10.154.8.22.*/.test(top.location.href)) {
    Global.sysAddr_317 = '10.154.8.22:8020/arcgis/3.17/';
}
if (/http?:\/\/10.24.44.16.*/.test(top.location.href)) {
    Global.baseQueryURL='http://10.24.44.17:8080';
}
if (/http?:\/\/10.139.18.62.*/.test(top.location.href)) {
    Global.baseQueryURL='http://10.139.18.62:8088';
    Global.sysAddr_317 = '10.139.18.62:8080/arcgis/3.17/';
}
