// 业务管理--客户（专线）详情--性能指标
const functionIdx = {
  ser: {
    name: '误码率(%)'
  },
  esr: {
    name: '误块秒比'
  },
  up_bandwidth_usage: {
    name: '上行带宽利用率(%)'
  },
  down_bandwidth_usage: {
    name: '下行带宽利用率(%)'
  }
};
// 业务管理--客户（专线）详情--活动告警
const activityAlarmIdx = {
  alarmFirst: {
    name: '一级告警数量'
  },
  alarmTotal: {
    name: '告警总数'
  },
  sendAlready: {
    name: '已派单'
  },
  alarmRate: {
    name: '告警处理及时率'
  }
};
// 资源管理--网络资源
const resourceIdx = {
  space: '空间资源',
  inner_line: '内线资源',
  outer_line: '外线资源',
  other_statistics: '统计指标'
};
// 空间资源
const spaceResourceIdx = {
  site: {
    name: '站点数',
    unit: '个'
  },
  room: {
    name: '机房数',
    unit: '个'
  },
  bay: {
    name: '机架数',
    unit: '个'
  }
};
// 站点类型
const siteType = {
  backbone_station: {
    name: '骨干局站'
  },
  convergence_station: {
    name: '汇聚局站'
  },
  access_station: {
    name: '接入局站'
  },
  other_station: {
    name: '其他局站'
  },
  customer_access_station: {
    name: '专线客户接入站'
  },
  straight_station: {
    name: '直放站'
  }
};
// 机房级别分布
const roomClass = {
  core_room: {
    name: '核心机房'
  },
  trans_internationl_room: {
    name: '传输国际机房'
  },
  trans_provincial_room: {
    name: '传输省际机房'
  },
  backbone_room: {
    name: '骨干机房'
  },
  convergence_room: {
    name: '汇聚机房'
  },
  access_room: {
    name: '接入机房'
  },
  customer_room: {
    name: '用户机房'
  }
};
// 机架类型
const bayType = {
  transmission: {
    name: '传输'
  },
  wireless: {
    name: '无线'
  },
  exchange: {
    name: '交换'
  },
  IMS: {
    name: 'IMS'
  },
  CMNET: {
    name: 'CMNET'
  },
  IP_bearer_network: {
    name: 'IP承载网'
  },
  moving_ring: {
    name: '动环'
  },
  integrated_architecture: {
    name: '综合架构'
  }
};
// 内线资源
const innerResourceIdx = {
  odf_usage: {
    name: 'ODF端子利用率',
    unit: '%'
  },
  ddf_usage: {
    name: 'DDF端子利用率',
    unit: '%'
  },
  idf_usage: {
    name: 'IDF端子利用率',
    unit: '%'
  },
  oms_num: {
    name: '复用段个数',
    unit: '个'
  },
  ots_num: {
    name: '光放段个数',
    unit: '个'
  }
};
// 统计指标
const statsIndicator = {
  element: {
    name: '传输网元数',
    unit: '个'
  },
  port_usage: {
    name: '端口利用率',
    unit: '%'
  },
  circuit_routing_integrity: {
    name: '电路路由完整率',
    unit: '%'
  },
  circuit_info_integrity: {
    name: '电路信息完整率',
    unit: '%'
  },
  dsr_wave_integrity: {
    name: 'DSR层波道串接完整率',
    unit: '%'
  },
  och_wave_integrity: {
    name: 'OCH层波道串接完整率',
    unit: '%'
  },
  dsr_wave_usage: {
    name: 'DSR层波道利用率',
    unit: '%'
  },
  och_wave_usage: {
    name: 'OCH层波道利用率',
    unit: '%'
  },
  trans_system_usage: {
    name: '传输系统利用率',
    unit: '%'
  },
  vc_sysem_usage: {
    name: 'VC系统利用率',
    unit: '%'
  }
};
// 传输网元分布类型
const transNetworkType = {
  provincial_line: {
    name: '省际干线'
  },
  interprovincial_line: {
    name: '省内干线'
  },
  metro_line: {
    name: '城域核心'
  },
  metro_convergence: {
    name: '城域汇聚'
  },
  metro_access: {
    name: '城域接入'
  }
};
const cutStatus = {
  analysising: {
    name: '割接影响分析中'
  },
  auditing: {
    name: '割接审批中'
  },
  cutovering: {
    name: '割接中'
  },
  changing: {
    name: '资源变更中'
  },
  achiving: {
    name: '待归档'
  },
  achived: {
    name: '已归档'
  }
};
const lineName = {
  AAA: {
    name: 'AAA专线'
  },
  AA: {
    name: 'AA专线'
  },
  A: {
    name: 'A专线'
  },
  common: {
    name: '普通专线'
  }
};
const siteTypeInfo = {
  gugan: {
    name: '骨干局站'
  },
  huiju: {
    name: '汇聚局站'
  },
  jieru: {
    name: '接入局站'
  },
  qita: {
    name: '其他局站'
  },
  zhuanxian: {
    name: '专线客户接入站'
  },
  zhifang: {
    name: '直放站'
  }
};
const siteTransInfo = {
  shengji: {
    name: '省际'
  },
  shengnei: {
    name: '省内'
  },
  shengneiadd: {
    name: '省内+本地'
  },
  bendigugan: {
    name: '本地骨干'
  },
  bendihuiju: {
    name: '本地汇聚'
  },
  bendijieru: {
    name: '本地接入'
  },
  qita: {
    name: '其他'
  }
};
const multiplexPerformanceMap = {
  num: {
    name: '复用段总数',
    unit: '个'
  },
  distance: {
    name: '复用段平均距离',
    unit: '米'
  },
  hop_num: {
    name: '复用段平均包含光跳数',
    unit: '个'
  }
};
const lightPerformanceMap = {
  num: {
    name: '光放段总数',
    unit: '个'
  },
  distance: {
    name: '光放段平均距离',
    unit: '米'
  },
  attenuation: {
    name: '光放段平均衰耗',
    unit: '个'
  }
};
const photoelectricConfig = {
  ePort: {
    name: '电口'
  },
  oPort: {
    name: '光口'
  }
};

export {
  functionIdx,
  activityAlarmIdx,
  resourceIdx,
  spaceResourceIdx,
  siteType,
  roomClass,
  bayType,
  innerResourceIdx,
  statsIndicator,
  transNetworkType,
  cutStatus,
  lineName,
  siteTypeInfo,
  siteTransInfo,
  multiplexPerformanceMap,
  lightPerformanceMap,
  photoelectricConfig
};
