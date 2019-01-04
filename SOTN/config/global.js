/**
 * Created by wang.ning on 2018/10/30.
 */
var Global = {};
Global.baseQueryURL='http://10.154.8.22:8088';         //请求后台接口ip地址配置
Global.sysAddr_317 = 'localhost:63342/SOTN/lib/3.17/';
Global.sysPath = 'http://localhost:63342/SOTN/';
Global.Authorization_a = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzb3RuLW84IiwiZXhwIjoxNTQ2OTk5MzU4LCJpYXQiOjE1NDQ0MDczNTh9.AsyYb4RB6QLuW-Nt1FFnthh4-OvK3lIuUx7Q1FLrkpeu55klEV5g1XXBeB2Y0Lomz-aAcJoTqByLEBYdPt117Q';
Global.Authorization = top && top.gis && top.gis.getToken ?top.gis.getToken():Global.Authorization_a;