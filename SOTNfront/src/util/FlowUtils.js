import PropTypes from 'prop-types';

export const FlowStat = {
  HANDLING_TIME: 'handling_time',
  HANDLING_TIME_RING_RATE: 'handling_time_ring_rate',
  HANDLING_TIMELY_RATE: 'handling_timely_rate',
  HANDLING_TIMELY_RATE_RING_RATE: 'handling_timely_rate_ring_rate',
  NORMAL_ONGOING_NUM: 'normal_ongoing_num',
  EXPIRED_NUM: 'expired_num',
  EXPIRING_NUM: 'expiring_num',
  TOTAL_NUM: 'total_num',
  FINISHED_NUM: 'finished_num',
  ONGOING_NUM: 'ongoing_num'
};

export const FlowStatNameMap = {
  handling_time: '处理时长',
  handling_time_ring_rate: '处理时长环比',
  handling_timely_rate: '处理及时率',
  handling_timely_rate_ring_rate: '处理及时率环比',
  normal_ongoing_num: '正常在途',
  expiring_num: '即将超时',
  expired_num: '超时未完成',
  total_num: '总数',
  finished_num: '已归档',
  ongoing_num: '在途'
};

export const TypeDataPropType = {
  [FlowStat.NORMAL_ONGOING_NUM]: PropTypes.number,
  [FlowStat.EXPIRED_NUM]: PropTypes.number,
  [FlowStat.EXPIRING_NUM]: PropTypes.number,
  [FlowStat.FINISHED_NUM]: PropTypes.number,
  [FlowStat.ONGOING_NUM]: PropTypes.number,
  [FlowStat.TOTAL_NUM]: PropTypes.number
};
