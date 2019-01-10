/**
 * Created by wang.ning on 2018/10/30.
 */
var Global = {};
Global.baseQueryURL='http://10.154.8.22:8088';         //请求后台接口ip地址配置
Global.sysAddr_317 = 'localhost:63342/SOTN/lib/3.17/';
Global.sysPath = 'http://localhost:63342/SOTN/';
// Global.Authorization_a = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzb3RuLW84IiwiZXhwIjoxNTQ2OTk5MzU4LCJpYXQiOjE1NDQ0MDczNTh9.AsyYb4RB6QLuW-Nt1FFnthh4-OvK3lIuUx7Q1FLrkpeu55klEV5g1XXBeB2Y0Lomz-aAcJoTqByLEBYdPt117Q';
Global.Authorization_a = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzb3RuLW84IiwiZXhwIjoxNTQ5NTkyNDg5LCJpYXQiOjE1NDcwMDA0ODl9.8Jtdcxr-PVzdBFYLh63_7oBys7W-51dCo0xhMN15X3t78iERMaqeLeSStj5Wqj7Ka4LuI-WF6rXeeLSu65tObw';
Global.Authorization = top && top.gis && top.gis.getToken ?top.gis.getToken():Global.Authorization_a;