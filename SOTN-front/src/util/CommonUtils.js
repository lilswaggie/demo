// 判断是否是新版本
// export const newVersion = '1.0.0';
// import { LocalStorageEnum } from './LocalStorageUtils';
// const version = localStorage.getItem(LocalStorageEnum.YQT_VERSION_UPDATE_REFRESH);
// if (!version || version !== newVersion) {
//     // 页面强制刷新
//     localStorage.setItem(LocalStorageEnum.YQT_VERSION_UPDATE_REFRESH, newVersion);
//     window.location.reload();
// }
import { notification } from 'antd';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { lineName } from '../component/business-manage/components/constant';

let baseUrl = 'http://localhost:3000/sotn/';
let baseCheckUrl = 'http://localhost:3000/sotn-check/';
let baseStaticUrl = 'http://localhost:3000/';

export const mockBaseUrl = 'http://10.154.8.22:3000/mock/71/sotn/';

const isProdEnv = process.env.NODE_ENV === 'production';
if (isProdEnv) {
  baseUrl = 'http://10.24.44.17:8080/sotn/';
  baseCheckUrl = '/sotn-check/';
  if (/http?:\/\/10.154.8.22.*/.test(window.location.href)) {
    baseUrl = 'http://10.154.8.22:8088/sotn/';
    // baseCheckUrl = 'http://10.154.8.22:8088/sotn-check/';
  }
  if (/http?:\/\/10.139.18.62.*/.test(window.location.href)) {
    baseUrl = 'http://10.139.18.62:8088/sotn/';
    // baseCheckUrl = 'http://10.139.18.62:8088/sotn-check/';
  }
  baseStaticUrl = '/sotn/';
}

export { baseUrl, baseCheckUrl, baseStaticUrl };

export const mapState2PropsWithNoProps = () => ({});

export function object2Array(obj) {
  let arr = [];
  for (let key of Object.keys(obj)) {
    arr.push([key, obj[key]]);
  }
  return arr;
}
// 自定义obj2arr
export function obj2Arr(obj) {
  let arr = [];
  if (JSON.stringify(obj) === '{}') {
    arr.push({
      performance: '',
      number: ''
    });
  } else {
    for (let key of Object.keys(obj)) {
      arr.push({
        performance: key,
        number: obj[key]
      });
    }
  }
  return arr;
}
// 自定义折线图
export function objectLine(obj) {
  let arr1 = [];
  let arr2 = [];
  let arr3 = [];
  if (JSON.stringify(obj) === '{}') {
    arr1.push('');
    arr2.push('');
  } else {
    for (let key of Object.keys(obj)) {
      arr1.push(key);
      arr2.push(obj[key]);
    }
  }
  arr3.push(arr1, arr2);
  return arr3;
}
export function objectMomentLine(obj) {
  let arr1 = [];
  let arr2 = [];
  let arr3 = [];
  if (JSON.stringify(obj) === '{}') {
    arr1.push('');
    arr2.push('');
  } else {
    for (let key of Object.keys(obj)) {
      let date = moment(Number(key)).format('MM-DD');
      arr1.push(date);
      arr2.push(obj[key]);
    }
  }
  arr3.push(arr1, arr2);
  return arr3;
}
export function midArr(arr) {
  let midArr = [];
  const ele1 = arr[0];
  const ele2 = arr[parseInt(arr.length / 2)];
  const ele3 = arr[arr.length - 1];
  for (let i = 0; i < arr.length - 1; i++) {
    arr[i] = '';
    midArr.push(arr[i]);
  }
  midArr[0] = ele1;
  midArr[parseInt(arr.length / 2)] = ele2;
  midArr[arr.length - 1] = ele3;
  return midArr;
}
// 转换为echarts可识别的数组（地图，饼图）
export function objectEchartsArray(obj) {
  let arr = [];
  if (JSON.stringify(obj) === '{}') {
    arr.push({
      name: '',
      value: ''
    });
  } else {
    for (let key of Object.keys(obj)) {
      arr.push({
        name: key,
        value: obj[key]
      });
    }
  }
  return arr;
}
// 转换为echarts可识别的数组（地图，饼图）加转换小时
export function objectEchartsHourArray(obj) {
  let arr = [];
  if (JSON.stringify(obj) === '{}') {
    arr.push({
      name: '',
      value: ''
    });
  } else {
    for (let key of Object.keys(obj)) {
      arr.push({
        name: key,
        value: msToHour(obj[key])
      });
    }
  }
  return arr;
}
// AAA专线name
export function objLineName(obj) {
  let arr = [];
  if (JSON.stringify(obj) === '{}') {
    arr.push({
      name: '',
      value: ''
    });
  } else {
    for (let key of Object.keys(obj)) {
      arr.push({
        name: lineName[key].name,
        value: obj[key]
      });
    }
  }
  return arr;
}
// 转换为echarts可识别的数组（折线图）
export function objectLineArray(obj) {
  let arr = [];
  for (let key of Object.keys(obj)) {
    arr.push(obj[key]);
  }
  return arr;
}
// 转换为echarts可识别的数组（折线图）显示时长
export function objectLineHoutArray(obj) {
  let arr = [];
  for (let key of Object.keys(obj)) {
    arr.push(msToHour(obj[key]));
  }
  return arr;
}
//获得obj中各个类别之和
export function objSum(obj) {
  let sum = 0;
  if (JSON.stringify(obj) === '{}') {
    sum = 0;
  } else {
    for (let key of Object.keys(obj)) {
      sum += obj[key];
    }
  }
  return sum;
}
// 获得折线图x坐标显示数组(时间戳转换为日期)
export function objectLineXArray(obj) {
  let arr = [];
  for (let key of Object.keys(obj)) {
    arr.push(moment(parseInt(key)).format('MM-DD'));
  }
  return arr;
}
// 转换为echarts可识别的数组（柱状图）
export function objectBarArray(obj) {
  let data = [];
  for (let key of Object.keys(obj)) {
    data.push(obj[key]);
  }
  let result = {
    axis: Object.keys(obj),
    data: data
  };
  return result;
}

export function makeLineFeedFormatFun(length) {
  return function(val) {
    var strArr = val.split('');
    var str = '';
    for (var i = 0, s; (s = strArr[i++]); ) {
      str += s;
      if (!(i % length)) str += '\n';
    }
    return str;
  };
}
// 时间戳转换为日期
export function timestampToTime(timeGranularity, timestamp) {
  let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  // let Y = date.getFullYear() + '-';
  let M =
    date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1;
  let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  // let h = date.getHours() + ':';
  // let m = date.getMinutes() + ':';
  // let s = date.getSeconds();
  return timeGranularity === 'MONTH' ? M + '月' : M + '-' + D;
}

/**
 * 毫秒转换为小时.
 * ms为要转换的毫秒数
 * fixed是保留的小数位，不传默认保留2位
 */
export const msToHour = (ms, fixed = 2) => {
  let h = ms / (60 * 60 * 1000);
  return fixed ? h.toFixed(fixed).replace(/\.0+$/g, '') : h;
};
// 判断是否为整数
export function isInteger(obj) {
  return Math.floor(obj) === obj;
}
// 通知提醒框
export const openNotification = (type, title, duration, description, key) => {
  notification[type]({
    message: title,
    description: description,
    duration: duration,
    key: key,
    style: { top: 20 }
  });
};
// 邮箱 验证正则
export const emailPatternRegex = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
// URL 验证正则
export const urlPatternRegex = /(https?|ftp|mms):\/\/.*/;
// 手机号 验证正则
export const phonePatternRegex = /^1[3456789][0-9]{9}$/;

// 判断小数
export const isDot = n => {
  // const nStr = Number(n).toString();
  const dotLength = String(n).indexOf('.') + 1;
  return dotLength > 0;
};

// 分割数组，arr为数组，len为分割后所有数组的长度
export const splitArr = (arr, len = 1) => {
  let newArr = cloneDeep(arr);
  let result = [];
  while (newArr.length) {
    result.push(newArr.splice(0, len));
  }
  return result;
};

// 获取数组维数
export const dimensionArr = arr => {
  if (arr instanceof Array) {
    return Math.max(
      ...arr.map(e => {
        return 1 + parseInt(dimensionArr(e));
      })
    );
  }
  return 0;
};

/**
 * 数字每隔三位加逗号的处理.
 * s是要处理的字符串或者数字
 * n是要保留的小数位，不传默认保留2位
 */
export const formatNumber = (s, n = 2) => {
  if (!s) {
    return '0';
  }
  n = n > 0 && n <= 20 ? n : 2;
  s = parseFloat((s + '').replace(/[^\d.-]/g, '')).toFixed(n) + '';
  let l = s
      .split('.')[0]
      .split('')
      .reverse(),
    r = s.split('.')[1];
  let t = '';
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? ',' : '');
  }
  let result =
    t
      .split('')
      .reverse()
      .join('') +
    '.' +
    r;
  return result.replace(/\.0+$/g, '');
};

export const camel2Constant = (s = '') => {
  const re = /\B([A-Z])/g;
  return s.replace(re, (_, c) => (c ? '_' + c : '')).toUpperCase();
};
