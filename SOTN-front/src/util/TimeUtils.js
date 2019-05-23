import moment from 'moment';

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


export const makeTimeFilterByBeforeDays = day => {
  return {
    timeGranularity: timeGranularity.DAY,
    timeRange: {
      since: moment().subtract(day, 'days').valueOf(),
      until: moment().valueOf()
    }
  };
};
