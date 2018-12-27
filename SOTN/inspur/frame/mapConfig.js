/**
 * @author wang.ning
 */

if(!Global.mapGlobal) Global.mapGlobal = {};

Global.mapGlobal.treeMapConfig = {
    noRotate:{                               
        distance:100,                      //视角距离
        targetCoord:[109.1162,34.2004]     //定位位置
    },
    rotate:{                             
        distance:200,         
        targetCoord:[116.46, 39.92]
    }
}

//symbol:otn line 
Global.mapGlobal.symbolConfig = {

    OTN_SYMBOL:Global.sysPath+'images/OTN_N_B.png',           //OTN_N_B.png
    OTN_DEFAULT_SYMBOL:Global.sysPath+'images/OTN_F_B.png',
    OTN_LIGHT_SYMBOL:Global.sysPath+'images/ceshi2.png',
    SYMBOL_WIDTH:34,
    SYMBOL_HEIGHT:26,
}

//symbol:
Global.mapGlobal.echartsConfig = {
    effectSymbol:{
        //飞机
        planePath: 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
    },
    //var color = ['#a6c84c', '#ffa022', '#46bee9'];
    lineColor:{
        normal:'#4D8CF4',
        fault:'#F84848',
        light:'#D0021B'
    },
    lineWidth:2,
    lineCurveness:0.2

}
//map options
Global.mapGlobal.mapInstance = {
    mapOptions:{
        spatialReference: {
            wkid: 4326
        },
        center: [108.92361111111111, 34.54083333333333],
        maxZoom: 15,
        minZoom: 5,
        logo: false,
        slider: false,
        wrapAround180: false,
        isZoomSlider: false,
        autoResize: true,
        notwork: '',
        MapType: ''
    },
    isCenter:true,                                        //系统初始化是否启用center定位
    center:[108.92361111111111,34.54083333333333],        //关联isCenter属性 
    zoom:6,                                               //关联isCenter
    
}

//queryPOI
Global.mapGlobal.queryPOI = {
    //queryOTN:'https://easy-mock.com/mock/5bebdad3aa71eb233ec34828/example/queryOTN2',                    //otn设备数据查询接口

    queryWarningOTN:'https://easy-mock.com/mock/5bebdad3aa71eb233ec34828/example/queryWarningOTN2',      //otn告警设备数据查询接口
    queryLinks:'https://easy-mock.com/mock/5bebdad3aa71eb233ec34828/example/queryLinks',                //otn设备间逻辑线呈现
    queryServiceLines:'https://easy-mock.com/mock/5bebdad3aa71eb233ec34828/example/queryServiceLines',  //查询专线接口
    queryOTN:'http://10.154.8.22:8088/sotn/api/resource/topolinks',
    queryONTLine:'',
    realQueryFlag:false,           //实时查询标志
    realQueryTimer:5000,          //1000为1s
}

//baseMap
Global.mapGlobal.base = {
    map:'http://sgdt.mlocso.com:8089/tileServer?x={col}&y={row}&z={level}&maptype=2&key=5592f4830d22caccc27546e61faf9048&number=123456789'
}

// 3d接口配置
Global.mapGlobal.threeDimensional = function (value) {
    if(value === 'element'){
        return 'http://10.154.8.22:8088/sotn/api/network/stats/element/location';
    } else if(value === 'optical_cable_length'){
        return 'http://10.154.8.22:8088/sotn/api/network/stats/optical_cable_length/location';
    } else if(value === 'optical_cable_fault') {
        return 'http://10.154.8.22:8088/sotn/api/network/stats/optical_cable_fault/location';
    } else if(value === 'element_fault') {
        return 'http://10.154.8.22:8088/sotn/api/network/stats/element_fault/location';
    } else if(value === 'port_fault') {
        return 'http://10.154.8.22:8088/sotn/api/network/stats/port_fault/location';
    } else if(value === 'wave_fault') {
        return 'http://10.154.8.22:8088/sotn/api/network/stats/wave_fault/location';
    } else if(value === 'fault_handling_time') {
        return 'http://10.154.8.22:8088/sotn/api/network/stats/fault_handling_time/location';
    } else if(value === 'fault_handling_rate') {
        return 'http://10.154.8.22:8088/sotn/api/network/stats/fault_handling_rate/location';
    } else {
        return false;
    }
    // // 传输网元个数的分省统计
    // element: 'http://10.154.8.22:8088/sotn/api/network/stats/element/location',
    // // 一干光缆长度的分省统计
    // optical_cable_length: 'http://10.154.8.22:8088/sotn/api/network/stats/optical_cable_length/location',
    // 光缆故障次数分省统计。统计当前实时的值
    // optical_cable_fault: 'http://10.154.8.22:8088/sotn/api/network/stats/optical_cable_fault/location',
    // 网元故障次数分省统计。获取的是实时的统计结果
    // element_fault: 'http://10.154.8.22:8088/sotn/api/network/stats/element_fault/location',
    // 光功率不合格端口数（故障端口数）的分省统计
    // port_fault: 'http://10.154.8.22:8088/sotn/api/network/stats/port_fault/location',
    // 误码率不合格端口数(个)
    // wave_fault: 'http://10.154.8.22:8088/sotn/api/network/stats/wave_fault/location',
    // 网络故障处理时长(h)
    // fault_handling_time: 'http://10.154.8.22:8088/sotn/api/network/stats/fault_handling_time/location',
    // 网络故障处理及时率(%)
    // fault_handling_rate: 'http://10.154.8.22:8088/sotn/api/network/stats/fault_handling_rate/location'
}