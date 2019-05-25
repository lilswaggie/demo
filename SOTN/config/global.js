/**
 * Created by wang.ning on 2018/10/30.
 */
var Global = {};
Global.baseQueryURL='http://10.154.8.22:8088';         //请求后台接口ip地址配置
Global.sysAddr_317 = 'localhost:63342/SOTN/lib/3.17/';
Global.sysPath = 'http://localhost:63342/SOTN/';
Global.Authorization_a = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzb3RuLW84IiwiZXhwIjoxODExNjkyNjEzLCJpYXQiOjE1NTI0OTI2MTN9.MoNOIuaTUfqRS7Dgjd97XELoIs1HNMZwAifc1soZ6sXY7nOHFASuf4l7SIEI4utlYEcZQzeh9yOXPy6RuBknHg';
Global.Authorization = top && top.gis && top.gis.getToken ?top.gis.getToken():Global.Authorization_a;