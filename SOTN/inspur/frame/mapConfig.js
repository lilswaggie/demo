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

    //OTN_SYMBOL:Global.sysPath+'images/OTN_N_B.png',           //OTN_N_B.png
    OTM_SYMBOL:Global.sysPath+'images/OTM.png',
    OTN_DEFAULT_SYMBOL:Global.sysPath+'images/OTN_F_B.png',
    OTN_LIGHT_SYMBOL:Global.sysPath+'images/OTN_LIGHT.png',
    OA_SYMBOL:Global.sysPath+'images/OA.png',
    SYMBOL_WIDTH:34,
    SYMBOL_HEIGHT:26,
    OTM_LIGHT_SYMBOL:Global.sysPath+'images/OTM_LIGHT.png',
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
        // light:'#D0021B'
        light: '#4D8CF4'
    },
    lineWidth:2,
    lightLineWidth: 3,
    lineCurveness:0.2

}
//map options
Global.mapGlobal.mapInstance = {
    mapOptions:{
        spatialReference: {
            wkid: 4326
        },
        isMapNavigation:true,
        isScrollWheel:true,
        isScrollWheelZoom:true,
        isPan:true,
        fadeOnZoom:true,
        displayGraphicsOnPan:true,
        center: [104.42361111111111, 36.54083333333333],
        zoom: 4,
        fadeOnZoom:true,
        maxZoom: 15,
        minZoom: 4,
        logo: false,
        //slider: true,
        wrapAround180: true,
        isZoomSlider: true,
        autoResize: true,
        notwork: '',
        MapType: '',
    },
    isCenter:true,                                        //系统初始化是否启用center定位
    center:[104.42361111111111,34.54083333333333],        //关联isCenter属性
    zoom:4,                                               //关联isCenter
    
}

//queryPOI
Global.mapGlobal.queryPOI = {
    //queryOTN:'https://easy-mock.com/mock/5bebdad3aa71eb233ec34828/example/queryOTN2',                    //otn设备数据查询接口
    //queryWarningOTN:'https://easy-mock.com/mock/5bebdad3aa71eb233ec34828/example/queryWarningOTN2',      //otn告警设备数据查询接口
    //queryServiceLines:'https://easy-mock.com/mock/5bebdad3aa71eb233ec34828/example/queryServiceLines',  //查询专线接口
    queryWarningOTN:Global.baseQueryURL+'/sotn/api/alert/active/resources',//告警
    queryServiceLines:Global.baseQueryURL+'/sotn/api/resource/servicelines',
    queryOTN:Global.baseQueryURL+'/sotn/api/resource/topolinks',
    queryONTLine:'',
    realQueryFlag:false,           //实时查询标志
    realQueryTimer:10000,          //1000为1s
}

//baseMap
Global.mapGlobal.base = {
    map:'http://sgdt.mlocso.com:8089/tileServer?x={col}&y={row}&z={level}&maptype=2&key=5592f4830d22caccc27546e61faf9048&number=123456789'
}

// 3d接口配置

Global.mapGlobal.threeDimensional = {
    element: 'http://10.154.8.22:8088/sotn/api/network/stats/element/location',
    optical_cable_length: 'http://10.154.8.22:8088/sotn/api/network/stats/optical_cable_length/location',
    optical_cable_fault: 'http://10.154.8.22:8088/sotn/api/network/stats/optical_cable_fault/location',
    element_fault: 'http://10.154.8.22:8088/sotn/api/network/stats/element_fault/location',
    port_fault: 'http://10.154.8.22:8088/sotn/api/network/stats/port_fault/location',
    wave_fault: 'http://10.154.8.22:8088/sotn/api/network/stats/wave_fault/location',
    fault_handling_time: 'http://10.154.8.22:8088/sotn/api/network/stats/fault_handling_time/location',
    fault_handling_rate: 'http://10.154.8.22:8088/sotn/api/network/stats/fault_handling_rate/location',
    bandwidth: 'http://10.154.8.22:8088/sotn/api/network/stats/all/bandwidth/location',
    coverage_area: 'http://10.154.8.22:8088/sotn/api/network/stats/all/coverage/location',
    // 国际客户数与国内客户数接口为同一个
    inter_customer: 'http://10.154.8.22:8088/sotn/api/customers/stats/num/location',
    national_customer: 'http://10.154.8.22:8088/sotn/api/customers/stats/num/location',
    inter_leased_line: 'http://10.154.8.22:8088/sotn/api/leased_lines/stats/num/location?businessType=1',
    gov_enter_leased_line: 'http://10.154.8.22:8088/sotn/api/leased_lines/stats/num/location?businessType=2',
    alarm: 'http://10.154.8.22:8088/sotn/api/alarms/stats/num/location',
    first_level_alarm: 'http://10.154.8.22:8088/sotn/api/alarms/stats/num/location?alarmSeverity=1',
    leased_line_fault_handling_time: 'http://10.154.8.22:8088/sotn/api/handling/stats/leased_line_fault_time/location',
    leased_line_usable_rate: 'http://10.154.8.22:8088/sotn/api/leased_lines/stats/usable/location',
    survey_handling_time: 'http://10.154.8.22:8088/sotn/api/handling/stats/survey_time/location',
    leased_line_switch_time: 'http://10.154.8.22:8088/sotn/api/leased_lines/stats/circuit_switch/location',
    leased_line_complaint_time: 'http://10.154.8.22:8088/sotn/api/handling/stats/complaint_time/location',
    leased_line_complaint_num: 'http://10.154.8.22:8088/sotn/api/handling/stats/complaint_num/location',
    leased_line_interrupt_time: 'http://10.154.8.22:8088/sotn/api/leased_lines/stats/interrupted/location',
    opening_handling_time: 'http://10.154.8.22:8088/sotn/api/handling/stats/opening_handling_avg_time/location',
    leased_line_delay_time: 'http://10.154.8.22:8088/sotn/api/leased_lines/stats/delay/location',
    leased_line_complaint_ongoing: 'http://10.154.8.22:8088/sotn/api/handling/stats/leased_line_complaint_ongoing_num/location'
}


