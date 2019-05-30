import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Select } from 'antd';
import { DateStyle } from '../component/pub/select/DateSelect';

/**
 * 用 Generator 函数包装普通对象，使其可以用for...of遍历.
 * 返回值为[key, value].
 * @param obj 被包装的普通对象.
 */
export function* object2Generator(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}

export const objectToDict = (obj = {}, nameF, valueF) => {
  let arr = [];
  for (let [k, v] of object2Generator(obj)) {
    arr.push({ name: nameF ? nameF(k) : k, value: valueF ? valueF(v) : v });
  }
  return arr;
};

export const SortEnum = {
  ASC: 'ASC',
  DESC: 'DESC'
};

export const sortMap = {
  ascend: 'ASC',
  descend: 'DESC'
};

export const securityLevelLineMap = {
  AAA: 'AAA专线',
  AA: 'AA专线',
  A: 'A专线',
  common: '普通专线'
};

export const removeHms = m => moment(m.format(DateStyle.YMD));

export const lineDateArr = ['天', '月', '年'];
export const timeGranularityArr = ['DAY', 'MONTH', 'YEAR'];

export const getDictOptions = (
  dictArr = [],
  allName = '',
  allValue = '全部'
) => {
  let dict = _.cloneDeep(dictArr);
  dict.forEach(d => (d.name = d.value));
  dict.unshift({ name: allName, value: allValue });
  return dict.map((d, i) => (
    <Select.Option key={i} value={d.name}>
      {d.value}
    </Select.Option>
  ));
};

export const timeRender = (text, record) =>
  !text ? '-' : moment(text - 0).format(DateStyle.YMDHM);

export const siteColumns = [
  {
    title: '站点ID',
    render: (text, record) => (
      <div>
        <span title={record.id}>{record.id}</span>
      </div>
    ),
    dataIndex: 'id',
    // sortDirections: ['ascend'],
    sorter: true,
    align: 'left',
    width: '7%',
    key: '1'
  },
  {
    title: '省份',
    render: (text, record) => (
      <div>
        <span title={record.province.name || '--'}>
          {record.province.name || '--'}
        </span>
      </div>
    ),
    dataIndex: 'province.name',
    align: 'left',
    width: '7%',
    key: '2'
  },
  {
    title: '站点名称',
    render: (text, record) => (
      <div>
        <span title={record.name}>{record.name}</span>
      </div>
    ),
    dataIndex: 'name',
    align: 'left',
    width: '16%',
    key: '3'
  },
  {
    title: '包含传输网元数',
    render: (text, record) => (
      <div>
        <span title={record.elementNum}>{record.elementNum}</span>
      </div>
    ),
    dataIndex: 'elementNum',
    // sortDirections: ['ascend'],
    sorter: true,
    align: 'left',
    width: '12%',
    key: '4'
  },
  {
    title: '站点类型',
    render: (text, record) => (
      <div>
        <span title={record.type}>{record.type}</span>
      </div>
    ),
    dataIndex: 'type',
    align: 'left',
    width: '11%',
    key: '5'
  },
  {
    title: '传输业务级别',
    render: (text, record) => (
      <div>
        <span title={record.serviceLevel || '--'}>
          {record.serviceLevel || '--'}
        </span>
      </div>
    ),
    dataIndex: 'serviceLevel',
    align: 'left',
    width: '12%',
    key: '6'
  },
  {
    title: '经纬度',
    render: (text, record) => (
      // const latAndLog = `${record.longitude}°E,${record.latitude}°N`;
      <div>
        {record.longitude >= 0 && record.latitude >= 0 ? (
          <span title={`${record.longitude}°E,${record.latitude}°N`}>{`${
            record.longitude
          }°E,${record.latitude}°N`}</span>
        ) : record.longitude >= 0 && record.latitude < 0 ? (
          <span title={`${record.longitude}°E,${record.latitude}°N`}>{`${
            record.longitude
          }°E,${record.latitude}°S`}</span>
        ) : record.longitude < 0 && record.latitude >= 0 ? (
          <span title={`${record.longitude}°W,${record.latitude}°N`}>{`${
            record.longitude
          }°E,${record.latitude}°S`}</span>
        ) : (
          <span title={`${record.longitude}°W,${record.latitude}°S`}>{`${
            record.longitude
          }°E,${record.latitude}°S`}</span>
        )}
      </div>
    ),
    // dataIndex: 'latAndLog',
    align: 'left',
    width: '12%',
    key: '7'
  },
  {
    title: '所在地址',
    render: (text, record) => (
      <div>
        <span title={record.location}>{record.location}</span>
      </div>
    ),
    dataIndex: 'location',
    align: 'left',
    width: '16%',
    key: '8'
  },
  {
    title: '状态',
    render: (text, record) => (
      <div>
        <span title={record.state}>{record.state}</span>
      </div>
    ),
    dataIndex: 'state',
    align: 'left',
    width: '7%',
    key: '9'
  }
];

export const multiplexSectionColumns = [
  {
    title: '复用段ID',
    render: (text, record) => (
      <div className="fuyong-id">
        <span title={record.id}>{record.id}</span>
      </div>
    ),
    dataIndex: 'id',
    align: 'left',
    width: '7.5rem',
    fixed: 'left'
  },
  {
    title: 'A端省',
    render: (text, record) => (
      <div>
        <span title={record.aProvince.name}>
          {record.aProvince.name || '--'}
        </span>
      </div>
    ),
    dataIndex: 'aProvince.name',
    align: 'left',
    width: '7.5rem',
    fixed: 'left'
  },
  {
    title: 'Z端省',
    render: (text, record) => (
      <div>
        <span title={record.zProvince.name}>
          {record.zProvince.name || '--'}
        </span>
      </div>
    ),
    dataIndex: 'zProvince.name',
    align: 'left',
    width: '7.5rem',
    fixed: 'left'
  },
  {
    title: '复用段名称',
    render: (text, record) => (
      <div className="record-name">
        <span title={record.name}>{record.name}</span>
      </div>
    ),
    dataIndex: 'name',
    align: 'left',
    width: '10rem',
    // width: '8%',
    fixed: 'left'
  },
  {
    title: 'A端网元',
    render: (text, record) => (
      <div>
        <span title={record.aElement.name}>{record.aElement.name}</span>
      </div>
    ),
    dataIndex: 'aElement.name',
    width: '7.5rem',
    align: 'left'
  },
  {
    title: 'A端物理端口',
    render: (text, record) => (
      <div>
        <span title={record.aPort.name}>{record.aPort.name}</span>
      </div>
    ),
    dataIndex: 'aPort.name',
    width: '7.5rem',
    align: 'left'
  },
  {
    title: 'Z端网元',
    render: (text, record) => (
      <div>
        <span title={record.zElement.name}>{record.zElement.name}</span>
      </div>
    ),
    dataIndex: 'zElement.name',
    width: '7.5rem',
    align: 'left'
  },
  {
    title: 'Z端物理端口',
    render: (text, record) => (
      <div>
        <span title={record.zPort.name}>{record.zPort.name}</span>
      </div>
    ),
    dataIndex: 'zPort.name',
    width: '7.5rem',
    align: 'left'
  },
  {
    title: '已利用带宽/已配置波道总带宽',
    render: (text, record) => (
      <div>
        <span
          title={`${record.bandwidthUsed || 0}/${record.bandwidthConf || 0}`}
        >
          <span className="color-first">{`${record.bandwidthUsed || 0}`}</span>/
          <span className="color-second">{`${record.bandwidthConf || 0}`}</span>
        </span>
      </div>
    ),
    dataIndex: 'bandwidthUsageRatio',
    width: '15rem',
    align: 'left'
  },
  {
    title: '已占用波道数/已配置波道数/可配置波道数',
    render: (text, record) => (
      <div>
        <span
          title={`${record.bandwidthUsed || 0}/${record.bandwidthConf ||
            0}/${record.waveConfNum || 0}`}
        >
          <span className="color-first">{`${record.bandwidthUsed || 0}`}</span>/
          <span className="color-second">{`${record.bandwidthConf || 0}`}</span>
          /<span>{`${record.waveConfNum || 0}`}</span>
        </span>
      </div>
    ),
    dataIndex: 'bandwidthUsed',
    width: '18.75rem',
    align: 'left'
  },
  {
    title: '距离(米)',
    render: (text, record) => (
      <div>
        <span title={record.distance}>{record.distance}</span>
      </div>
    ),
    dataIndex: 'distance',
    sorter: true,
    width: '6rem',
    align: 'left'
  },
  {
    title: '光放数',
    render: (text, record) => (
      <div>
        <span title={record.otsNum}>{record.otsNum}</span>
      </div>
    ),
    dataIndex: 'otsNum',
    sorter: true,
    width: '6rem',
    align: 'left'
  }
];

export const lightSectionColumns = [
  {
    title: '光放段ID',
    render: (text, record) => (
      <div>
        <span title={record.id}>{record.id}</span>
      </div>
    ),
    sorter: true,
    align: 'left',
    width: '6.25rem'
  },
  {
    title: 'A端省',
    render: (text, record) => (
      <div>
        <span title={record.aProvince.name}>{record.aProvince.name}</span>
      </div>
    ),
    align: 'left',
    width: '6.25rem'
  },
  {
    title: 'Z端省',
    render: (text, record) => (
      <div>
        <span title={record.zProvince.name}>{record.zProvince.name}</span>
      </div>
    ),
    align: 'left',
    width: '6.25rem'
  },
  {
    title: '光放段名称',
    render: (text, record) => (
      <div>
        <span title={record.name}>{record.name}</span>
      </div>
    ),
    dataIndex: 'name',
    align: 'left',
    width: '7.5rem'
  },
  {
    title: 'A端网元',
    render: (text, record) => (
      <div>
        <span title={record.aElement.name}>{record.aElement.name}</span>
      </div>
    ),
    align: 'left'
  },
  {
    title: 'A端物理端口',
    render: (text, record) => (
      <div>
        <span title={record.aPort.name}>{record.aPort.name}</span>
      </div>
    ),
    dataIndex: 'aPort',
    align: 'left'
  },
  {
    title: 'Z端网元',
    render: (text, record) => (
      <div>
        <span title={record.zElement.name}>{record.zElement.name}</span>
      </div>
    ),
    dataIndex: 'zElement',
    align: 'left'
  },
  {
    title: 'Z端物理端口',
    render: (text, record) => (
      <div>
        <span title={record.zPort.name}>{record.zPort.name}</span>
      </div>
    ),
    dataIndex: 'zPort',
    align: 'left'
  },
  {
    title: '所属复用段',
    render: (text, record) => (
      <div>
        <span title={record.oms.name}>{record.oms.name}</span>
      </div>
    ),
    dataIndex: 'oms.name',
    align: 'left'
  },
  {
    title: '距离(米)',
    render: (text, record) => (
      <div>
        <span title={record.distance}>{record.distance}</span>
      </div>
    ),
    dataIndex: 'distance',
    sorter: true,
    align: 'left'
  }
];

export const portColumns = [
  {
    title: '端口ID',
    render: (text, record) => (
      <div className="port-id">
        <span title={record.id}>{record.id}</span>
      </div>
    ),
    dataIndex: 'id',
    sortDirections: ['ascend'],
    sorter: (a, b) => a.id - b.id,
    align: 'left',
    width: '6.25rem',
    fixed: 'left'
  },
  {
    title: '省份',
    render: (text, record) => (
      <div>
        <span title={'北京'}>{'北京'}</span>
      </div>
    ),
    dataIndex: '北京',
    align: 'left',
    width: '6.25rem',
    fixed: 'left'
  },
  {
    title: '传输端口名称',
    render: (text, record) => (
      <div className="record-name">
        <span title={record.name || '--'}>{record.name || '--'}</span>
      </div>
    ),
    dataIndex: 'name',
    align: 'left',
    width: '8.5rem',
    fixed: 'left'
  },
  {
    title: '所属网元名称',
    render: (text, record) => (
      <div className="net-belongs-name">
        <span title={record.element.name || '--'}>
          {record.element.name || '--'}
        </span>
      </div>
    ),
    dataIndex: 'element.name',
    align: 'left',
    width: '7.5rem'
  },
  {
    title: '端口类型',
    render: (text, record) => (
      <div>
        <span title={record.type || '--'}>{record.type || '--'}</span>
      </div>
    ),
    dataIndex: 'type',
    align: 'left'
  },
  {
    title: '光电属性',
    render: (text, record) => (
      <div>
        <span title={record.oe || '--'}>{record.oe || '--'}</span>
      </div>
    ),
    dataIndex: 'oe',
    align: 'left'
  },
  {
    title: '端口速率',
    render: (text, record) => (
      <div>
        <span title={record.rate || '--'}>{record.rate || '--'}</span>
      </div>
    ),
    dataIndex: 'rate',
    align: 'left'
  },
  {
    title: '端口状态',
    render: (text, record) => (
      <div>
        <span title={record.state || '--'}>{record.state || '--'}</span>
      </div>
    ),
    dataIndex: 'state',
    // width: '15rem',
    align: 'left'
  },
  {
    title: '承载专线数',
    render: (text, record) => (
      <div>
        <span title={record.leasedLineNum}>{record.leasedLineNum}</span>
      </div>
    ),
    dataIndex: 'leasedLineNum',
    // width: '18.75rem',
    align: 'left'
  },
  {
    title: '承载客户数',
    render: (text, record) => (
      <div>
        <span title={record.customerNum}>{record.customerNum}</span>
      </div>
    ),
    dataIndex: 'customerNum',
    align: 'left'
  }
];

export const transmissionColumns = [
  {
    title: '网元ID',
    render: (text, record) => (
      <div>
        <span title={record.id}>{record.id}</span>
      </div>
    ),
    dataIndex: 'id',
    // sortDirections: ['ascend'],
    sorter: (a, b) => a.id - b.id,
    align: 'left',
    key: '1'
  },
  {
    title: '省份',
    render: (text, record) => (
      <div>
        <span title={record.province.name || '--'}>
          {record.province.name || '--'}
        </span>
      </div>
    ),
    dataIndex: 'province.name',
    align: 'left',
    key: '2'
  },
  {
    title: '传输网元名称',
    render: (text, record) => (
      <div>
        <span title={record.name}>{record.name}</span>
      </div>
    ),
    dataIndex: 'name',
    align: 'left',
    width: '7rem',
    key: '3'
  },
  {
    title: '所属站点',
    render: (text, record) => (
      <div>
        <span title={record.siteName}>{record.siteName}</span>
      </div>
    ),
    dataIndex: 'siteName',
    // sortDirections: ['ascend'],
    align: 'left',
    key: '4'
  },
  {
    title: '所属EMS',
    render: (text, record) => (
      <div>
        <span title={record.emsName}>{record.emsName}</span>
      </div>
    ),
    dataIndex: 'emsName',
    align: 'left',
    key: '5'
  },
  {
    title: '所属传输子网',
    render: (text, record) => (
      <div>
        <span title={record.transSubnet}>{record.transSubnet}</span>
      </div>
    ),
    dataIndex: 'transSubnet',
    align: 'left',
    width: '7rem',
    key: '6'
  },
  {
    title: '传输业务级别',
    render: (text, record) => (
      <div>
        <span title={record.serviceLevel}>{record.serviceLevel}</span>
      </div>
    ),
    dataIndex: 'serviceLevel',
    align: 'left',
    width: '7rem',
    key: '7'
  },
  {
    title: '支路端口数',
    render: (text, record) => (
      <div>
        <span title={100}>{100}</span>
      </div>
    ),
    dataIndex: 'childPort',
    // sorter: (a, b) => a.childPort - b.childPort,
    align: 'left',
    width: '7rem',
    key: '8'
  },
  {
    title: 'IRDI端口数',
    render: (text, record) => (
      <div>
        <span title={100}>{100}</span>
      </div>
    ),
    dataIndex: 'IRDIPort',
    // sorter: (a, b) => a.IRDIPort - b.IRDIPort,
    align: 'left',
    width: '7rem',
    key: '9'
  },
  {
    title: '板卡数',
    render: (text, record) => (
      <div>
        <span title={100}>{100}</span>
      </div>
    ),
    dataIndex: 'cardNumber',
    // sorter: (a, b) => a.cardNumber - b.cardNumber,
    align: 'left',
    key: '10'
  },
  {
    title: '入网时间',
    render: (text, record) => (
      <div>
        <span
          title={
            record.accessTime
              ? moment(parseInt(record.accessTime)).format(DateStyle.YMD)
              : '--'
          }
        >
          {record.accessTime
            ? moment(parseInt(record.accessTime)).format(DateStyle.YMD)
            : '--'}
        </span>
      </div>
    ),
    dataIndex: 'accessTime',
    sorter: (a, b) => a.accessTime - b.accessTime,
    align: 'left',
    width: '7.5rem',
    key: '11'
  },
  {
    title: '状态',
    render: (text, record) => (
      <div>
        <span title={record.state}>{record.state}</span>
      </div>
    ),
    dataIndex: 'state',
    align: 'left',
    key: '12'
  }
];

export const serviceFaultColumns = [
  {
    key: '1',
    title: '工单编号',
    dataIndex: 'id',
    width: '10rem',
    className: 'control-line',
    fixed: 'left'
  },
  {
    key: '2',
    title: '工单主题',
    dataIndex: 'title',
    width: '14.375rem',
    className: 'control-line',
    fixed: 'left'
  },
  {
    key: '3',
    title: '省份地市',
    width: '11.25rem',
    render: (text, record) => record.province.name + '-' + record.city.name
  },
  {
    key: '4',
    title: '网元名称',
    dataIndex: 'elementName',
    width: '6.4375rem',
    className: 'control-line'
  },
  {
    key: '5',
    title: '告警级别',
    width: '6.75rem',
    dataIndex: 'alarmLevel'
    // render: (text, record) => (
    //     <div
    //         className="alarm"
    //         style={{
    //         backgroundColor: `${alarmCh[record.alarmLevel - 1].color}`
    //     }}>
    //         {alarmCh[record.alarmLevel - 1].name}
    //     </div>
    // ),
  },
  {
    key: '6',
    title: '电路名称',
    dataIndex: 'circuitName',
    width: '6.4375rem',
    className: 'control-line'
  },
  {
    key: '7',
    title: '客户名称',
    width: '10rem',
    className: 'control-line',
    render: (text, record) => record.customer.name
  },
  {
    key: '8',
    title: '客户服务等级',
    width: '6rem',
    className: 'control-line',
    render: (text, record) => record.customer.level
  },
  {
    key: '9',
    title: '专线保障等级',
    width: '6rem',
    className: 'control-line',
    render: (text, record) => record.level
  },
  {
    key: '10',
    title: '派发时间',
    dataIndex: 'sendTime',
    width: '7rem',
    className: 'control-line',
    render: timeRender
  },
  {
    key: '11',
    title: '归档时间',
    dataIndex: 'finishTime',
    width: '7rem',
    render: timeRender
  }
];
export const serviceComplainColumns = [
  {
    key: '1',
    title: '工单编号',
    dataIndex: 'id',
    width: '10rem',
    className: 'control-line'
  },
  {
    key: '2',
    title: '工单主题',
    dataIndex: 'title',
    width: '14.375rem',
    className: 'control-line'
  },
  {
    key: '3',
    title: '投诉时间',
    dataIndex: 'sendTime',
    width: '11.25rem',
    render: timeRender
  },
  {
    key: '4',
    title: '客户名称',
    width: '7.875rem',
    className: 'control-line',
    render: (text, record) => record.customer.name
  },
  {
    key: '5',
    title: '客户服务等级',
    width: '8.75rem',
    render: (text, record) => record.customer.level
  },
  {
    key: '6',
    title: '专线名称',
    width: '6.4375rem',
    className: 'control-line',
    render: (text, record) => record.leasedLine.name
  },
  {
    key: '7',
    title: '专线保障等级',
    width: '10rem',
    className: 'control-line',
    render: (text, record) =>
      securityLevelLineMap[record.leasedLine.securityLevel]
  }
];

export const businessQualityColumns = [
  {
    key: '1',
    title: '专线ID',
    dataIndex: 'id',
    width: '8.25rem',
    // sorter: true,
    fixed: 'left'
  },
  {
    key: '2',
    title: '客户名称',
    dataIndex: 'province',
    width: '12.8125rem',
    fixed: 'left'
  },
  {
    key: '3',
    title: '产品实例标识',
    dataIndex: 'title',
    width: '12.5rem',
    fixed: 'left'
  },
  {
    key: '4',
    title: '业务保障等级',
    dataIndex: 'level',
    width: '6.5rem'
  },
  {
    key: '5',
    title: '专线可用率(%)',
    dataIndex: 'faultCount',
    width: '8.125rem',
    sorter: true
  },
  {
    key: '6',
    title: '专线中断时长(h)',
    dataIndex: 'historyAlarmCount',
    width: '8.125rem',
    sorter: true
  },
  {
    key: '7',
    title: '专线故障次数(次)',
    dataIndex: 'count',
    width: '8.75rem',
    sorter: true
  },
  {
    key: '8',
    title: '专线投诉次数(次)',
    dataIndex: 'count',
    width: '8.75rem',
    sorter: true
  },
  {
    key: '9',
    title: '专线倒换次数(次)',
    dataIndex: 'count',
    width: '8.75rem',
    sorter: true
  },
  {
    key: '10',
    title: '专线归一化平均时延/专线时延(h)',
    dataIndex: 'count',
    width: '15rem',
    sorter: true
  }
];

export const elementColumns = [
  {
    key: '1',
    title: '网元ID',
    dataIndex: 'id',
    width: '12%',
    // sorter: true,
    className: 'control-line'
  },
  {
    key: '2',
    title: '省份',
    width: '8%',
    render: (text, record) => record.province.name
  },
  {
    key: '3',
    title: '传输网元名称',
    dataIndex: 'name',
    width: '28%',
    className: 'control-line'
  },
  {
    key: '4',
    title: '传输业务级别',
    dataIndex: 'serviceLevel',
    width: '11%'
  },
  {
    key: '5',
    title: '故障次数',
    dataIndex: 'faultFrequencyNum',
    width: '11%',
    sorter: true
  },
  {
    key: '6',
    title: '历史告警数',
    dataIndex: 'alarmFrequencyNum',
    width: '11%',
    sorter: true
  },
  {
    key: '7',
    title: '影响专线数',
    dataIndex: 'affectedLeasedLineNum',
    width: '11%',
    sorter: true
  }
];

export const cardColumns = [
  {
    key: '1',
    title: '网元ID',
    dataIndex: 'id',
    width: '12%'
    // sorter: true
  },
  {
    key: '2',
    title: '省份',
    width: '8%',
    render: (text, record) => record.province.name
  },
  {
    key: '3',
    title: '板卡名称',
    dataIndex: 'name',
    width: '25%'
  },
  {
    key: '4',
    title: '所属传输网元',
    width: '28%',
    className: 'control-line',
    render: (text, record) => record.element.name
  },
  {
    key: '5',
    title: '板卡类型',
    dataIndex: 'model',
    width: '16%',
    sorter: true
  },
  {
    key: '6',
    title: '故障次数',
    dataIndex: 'faultFrequencyNum',
    width: '11%',
    sorter: true
  }
];
