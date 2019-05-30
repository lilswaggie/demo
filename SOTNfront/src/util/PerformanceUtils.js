import { TimeUnit, formatTimeByGranularity } from './TimeUtils';

export const PerformanceUnit = {
  ...TimeUnit,
  PERCENT: '%',
  TIME: '次',
  ONE: '个',
  KM: '皮厂公里'
};

/**
 * 根据返回的时间和数据的对应，生成二维坐标数据.
 * @param {object} values
 * @param {string} granularity
 * @returns {object} {xDataArr: [time], yDataArr: [value]}
 */
export const getXYDataByGranularity = (values, granularity) => {
  return {
    xDataArr: Object.keys(values).map(v =>
      formatTimeByGranularity(v, granularity)
    ),
    yDataArr: Object.values(values)
  };
};
