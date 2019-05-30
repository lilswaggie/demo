import moment from 'moment';

export const TimeUnit = {
  HOUR: 'h',
  MINUTES: 'm',
  SECOND: 's',
  MS: 'ms',
  DAY: '工作日',
};


export const timeGranularity = {
  MONTH: 'MONTH',
  WEEK: 'WEEK',
  DAY: 'DAY',
  TIME: 'TIME'
};

export const timeGranularityMap = {
  MONTH: '月',
  WEEK: '周',
  DAY: '天',
  TIME: '时'
};

export const timeGranularityStyleMap = {
  MONTH: 'YYYY-MM',
  WEEK: 'YYYY-MM-DD',
  DAY: 'YYYY-MM-DD',
  TIME: 'HH:mm'
};

export const TimeGranularityDays = {
  HOUR: 1,
  DAY: 30,
  MONTH: 365
};

/**
 * 根据时间粒度格式化毫秒时间.
 * @param {number} ms 时间毫秒数
 * @param {string} granularity 时间粒度
 */
export const formatTimeByGranularity = (
  ms = 0,
  granularity = timeGranularityStyleMap.DAY
) => {
  if (ms === 0) {
    return null;
  }
  return moment(ms - 0).format(timeGranularityStyleMap[granularity]);
};

export const getUntilByTime = time => {
  if (time && time.timeRange && time.timeRange.until) {
    return time.timeRange.until;
  }
  return 0;
};

export const getGranularityByTime = time => {
  if (time && time.timeGranularity) {
    return time.timeGranularity;
  }
  return null;
};

export const makeTimeFilterByBeforeDays = (granularity) => {
  return {
    timeGranularity: granularity,
    timeRange: {
      since: moment()
        .subtract(TimeGranularityDays[granularity], 'days')
        .valueOf(),
      until: moment().valueOf()
    }
  };
};

export const TimeUnitMsMap = {
  [TimeUnit.DAY]: 24 * 60 * 60 * 1000,
  [TimeUnit.HOUR]: 60 * 60 * 1000,
  [TimeUnit.MINUTES]: 60 * 1000,
  [TimeUnit.SECOND]: 1000,
  [TimeUnit.MS]: 1
};

const unitArr = Object.keys(TimeUnitMsMap);

/**
 * 毫秒单位时间转换为其他单位时间.
 * @param {number} ms 毫秒单位时间
 * @param {string} unit 要转换的最大时间粒度
 * @param {number} fixed 保留几位小数
 */
export const ms2UnitTime = (ms, unit, fixed = 2) => {

  let index = unitArr.indexOf(unit);

  // 如果单位不在允许的范围内，直接返回数据
  if (ms === 0 || index === -1) {
    return {value: ms, unit};
  }

  let time = ms;
  // 逐层递归，找到最合适的单位
  // 转化的单位值如果<0.1，则继续往下找更小的单位
  while(index < unitArr.length && time / TimeUnitMsMap[unit] < 0.1) {
    unit = unitArr[++index];
  }
  time = ms / TimeUnitMsMap[unit];
  return {value: fixed ? time.toFixed(fixed).replace(/\.0+$/g, '') - 0 : time, unit };
};
