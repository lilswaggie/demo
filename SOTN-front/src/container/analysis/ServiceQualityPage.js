import React, { Component } from 'react';
import { connect } from 'react-redux';

import moment from 'moment';
import classNames from 'classnames';

import { Icon, Button, Select, Input, Table } from 'antd';

import DateSelect, { DateStyle } from '../../component/pub/DateSelect';
import RegionSelect from '../../component/pub/RegionSelect';
import AnalysisBarChart from '../../component/pub/AnalysisBarChart';
import AnalysisLineChart from '../../component/pub/AnalysisLineChart';
import AnalysisPieChart from '../../component/pub/AnalysisPieChart';
import TablePagination from '../../component/pub/TablePagination';

import {
  serviceFaultColumns,
  serviceComplainColumns,
  objectToDict,
  lineDateArr,
  timeGranularityArr,
  removeHms,
  getDictOptions
} from '../../util/AnalysisUtils';
import { formatNumber, msToHour } from '../../util/CommonUtils';
import { DictIdEnum } from '../../redux/dictRedux';
import { getDict } from '../../util/ReduxUtil';

import { postAxiosBodyAndQuery, postAxios } from '../../axios/mainAxios';

import '../../assets/css/network-quality/network-quality.scss';

const faultStatisticNameArr = [
  '故障工单总数',
  '故障处理时长（h）',
  '故障处理及时率（%）'
];
const complainStatisticNameArr = [
  '投诉工单总数',
  '投诉处理时长（h）',
  '投诉处理及时率（%）'
];

class ServiceQualityPage extends Component {
  state = {
    // 1：故障工单分析，2：投诉工单分析
    type: 1,

    startDate: [moment().day(-30), moment().day(-30)],
    endDate: [moment(), moment()],
    region: ['', ''],

    // 选中的统计信息index
    selectedStatisticIndex: 0,
    // 专线趋势时间筛选粒度。1：天，2：月，3：年
    lineDateType: 0,

    // 统计信息
    faultStatisticData: [0, 0, 0],
    complainStatisticData: [0, 0, 0],

    // 饼图数据
    faultPieData: [],
    complainPieData: [],

    // 分省统计
    faultProvinceData: [],
    complainProvinceData: [],

    // 工单总数趋势统计
    faultTimeData: [],
    complainTimeData: [],

    // 故障列表筛选条件
    customerServiceLevel: '',
    faultSecurityLevel: '',
    faultFlowIdLike: '',
    alarmLevel: '',
    elementNameLike: '',

    // 投诉列表筛选条件
    complainSecurityLevel: '',
    complainFlowIdLike: '',
    leasedLineNameLike: '',

    // table
    faultPageSize: 10,
    faultPageNum: 1,
    faultTableData: [],
    faultTotalCount: 0,
    complainPageSize: 10,
    complainPageNum: 1,
    complainTableData: [],
    complainTotalCount: 0
  };

  faultApi = 'api/flows/stats/net_fault/current';
  complainApi = 'api/flows/stats/complaint/current';

  faultPieApi = 'flows/stats/net_fault/alarm_severity';
  complainPieApi = 'flows/stats/complaint/service_level';

  faultStatisticApi = [
    'api/flows/stats/net_fault/num/timed',
    'api/network/stats/fault_handling_time/timed',
    'api/network/stats/fault_handling_rate/timed'
  ];

  complainStatisticApi = [
    'api/flows/stats/complaint/num/timed',
    'api/handling/stats/complaint_time/timed',
    'api/handling/stats/complaint_rate/timed'
  ];

  faultProvinceApi = [
    'api/flows/stats/net_fault/num/location',
    'api/network/stats/fault_handling_time/location',
    'api/network/stats/fault_handling_rate/location'
  ];

  complainProvinceApi = [
    'api/flows/stats/complaint/num/location',
    'api/handling/stats/complaint_time/location',
    'api/handling/stats/complaint_rate/location'
  ];

  componentDidMount() {
    this.getAllData();
    getDict(DictIdEnum.SERVICE_LEVEL_GUARANTEE);
    getDict(DictIdEnum.SECURITY_LEVEL);
    getDict(DictIdEnum.ALARM_LEVEL);
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { business } = this.props;
    const { type, selectedStatisticIndex: idx, lineDateType } = this.state;
    if (prevState.type !== type || prevProps.business !== business) {
      this.getAllData();
    }
    if (prevState.selectedStatisticIndex !== idx) {
      if (type === 1) {
        this.getStatisticData('faultStatisticData', this.faultApi);
        this.getPieData('faultPieData', this.faultPieApi);
        this.getBarData('faultProvinceData', this.faultProvinceApi[idx]);
        this.getLineData(
          'faultTimeData',
          this.faultStatisticApi[idx],
          lineDateType
        );
      }
      if (type === 2) {
        this.getStatisticData('complainStatisticData', this.complainApi);
        this.getPieData('complainPieData', this.complainPieApi);
        this.getBarData('complainProvinceData', this.complainProvinceApi[idx]);
        this.getLineData(
          'complainTimeData',
          this.complainStatisticApi[idx],
          lineDateType
        );
      }
    }
    if (prevState.lineDateType !== lineDateType) {
      if (type === 1) {
        this.getLineData(
          'faultTimeData',
          this.faultStatisticApi[idx],
          lineDateType
        );
      }
      if (type === 2) {
        this.getLineData(
          'complainTimeData',
          this.complainStatisticApi[idx],
          lineDateType
        );
      }
    }
  };

  // 时间选择改变
  onDateChange = name => (date, dateStr) => {
    const d = this.state[name];
    const { type } = this.state;
    d[type - 1] = date;
    this.setState({ [name]: d });
  };

  // 区域选择改变
  onRegionChange = region => {
    const { type, region: r } = this.state;
    r[type - 1] = region;
    this.setState({ region: r });
  };

  onInputChange = name => e => this.setState({ [name]: e.target.value });

  onSelectChange = name => v => this.setState({ [name]: v });

  resetAllFilter = () => {
    const { startDate, endDate, region, type } = this.state;
    const idx = type - 1;
    startDate[idx] = moment().day(-30);
    endDate[idx] = moment();
    region[idx] = '';
    this.setState({ startDate, endDate, region });
  };

  faultFilterKey = [
    'customerServiceLevel',
    'faultSecurityLevel',
    'faultFlowIdLike',
    'alarmLevel',
    'elementNameLike'
  ];
  complainFilterKey = [
    'complainSecurityLevel',
    'complainFlowIdLike',
    'leasedLineNameLike'
  ];

  resetFilter = resetKeyArr => () =>
    resetKeyArr.forEach(key => this.setState({ [key]: '' }));

  getFilterParams = () => {
    const { region, startDate, endDate, type } = this.state;
    const idx = type - 1;
    return {
      province: region[idx] || null,
      timeRange: {
        since: removeHms(startDate[idx]).valueOf(),
        until: removeHms(endDate[idx]).valueOf()
      }
    };
  };

  getParams = needTimeGranularity => {
    const { lineDateType } = this.state;
    let filter = this.getFilterParams();
    if (needTimeGranularity) {
      filter.needTimeGranularity = timeGranularityArr[lineDateType];
    }
    return filter;
  };

  getQuery = () => {
    return this.state.type === 2 ? { businessType: this.props.business } : {};
  };

  getTableFilterParams = filterKeyArr => {
    let filter = this.getFilterParams();
    filterKeyArr.forEach(key => (filter[key] = this.state[key]));
    return filter;
  };

  setStatisticData = (name, value, idx) => {
    const arr = this.state[name];
    arr[idx] =
      idx === 0 ? formatNumber(value) : idx === 1 ? msToHour(value) : value;
    this.setState({ [name]: arr });
  };

  statisticKeyIndexMap = {
    num: 0,
    handling_time: 1,
    handling_timely_rate: 2
  };

  getStatisticData = (name, api) => {
    postAxiosBodyAndQuery(
      api,
      this.getParams(),
      this.getQuery(),
      ({ values }) => {
        Object.keys(values).forEach(key => {
          this.setStatisticData(
            name,
            values[key],
            this.statisticKeyIndexMap[key]
          );
        });
      }
    );
  };

  getPieData = (name, api) => {
    // TODO:页面内其他接口都有业务类型查询参数，这两个接口没有？
    postAxios(api, this.getParams(), ({ values }) => {
      Object.keys(values).forEach(key => {
        this.setStatisticData(
          name,
          values[key],
          this.statisticKeyIndexMap[key]
        );
      });
    });
  };

  getBarData = (name, api) => {
    const params = this.getParams();
    delete params.province;
    postAxiosBodyAndQuery(api, params, this.getQuery(), ({ values }) =>
      this.setState({ [name]: objectToDict(values) })
    );
  };

  getLineData = (name, api, type) => {
    const nameF = ms =>
      moment(parseInt(ms)).format(
        [DateStyle.HM, DateStyle.MD, DateStyle.YM][type]
      );
    postAxiosBodyAndQuery(
      api,
      this.getParams(true),
      this.getQuery(),
      ({ values }) => this.setState({ [name]: objectToDict(values, nameF) })
    );
  };

  getAllData = (pageNum = 1, pageSize = 10) => {
    const { type, selectedStatisticIndex: idx, lineDateType } = this.state;

    // 获取故障工单数据
    if (type === 1) {
      this.getStatisticData('faultStatisticData', this.faultApi);
      // this.getBarAndLineData();
      this.getBarData('faultProvinceData', this.faultProvinceApi[idx]);
      this.getLineData(
        'faultTimeData',
        this.faultStatisticApi[idx],
        lineDateType
      );
      this.getFaultList(1, 10);
    }
    // 获取投诉工单数据
    if (type === 2) {
      this.getStatisticData('complainStatisticData', this.complainApi);
      this.getBarData('complainProvinceData', this.complainProvinceApi[idx]);
      this.getLineData(
        'complainTimeData',
        this.complainStatisticApi[idx],
        lineDateType
      );
      this.getComplainList(1, 10);
    }
  };

  getFaultList = (
    pageNum = this.state.faultPageNum,
    pageSize = this.state.faultPageSize
  ) => {
    postAxiosBodyAndQuery(
      'api/flows/fault',
      this.getTableFilterParams(this.faultFilterKey),
      { currentPage: pageNum - 1, pageSize },
      ({ results = [], totalElements }) => {
        results.forEach(record => (record.key = record.id));
        this.setState({
          faultTableData: results,
          faultTotalCount: totalElements,
          faultPageSize: pageSize,
          faultPageNum: pageNum
        });
      }
    );
  };

  getComplainList = (
    pageNum = this.state.complainPageNum,
    pageSize = this.state.complainPageSize
  ) => {
    postAxiosBodyAndQuery(
      'api/flows/complaint',
      this.getTableFilterParams(this.complainFilterKey),
      { currentPage: pageNum - 1, pageSize },
      ({ results = [], totalElements }) => {
        results.forEach(record => (record.key = record.id));
        this.setState({
          complainTableData: results,
          complainTotalCount: totalElements,
          complainPageSize: pageSize,
          complainPageNum: pageNum
        });
      }
    );
  };

  onTypeChange = type => () => this.setState({ type });

  onStatisticChange = idx => () =>
    this.setState({ selectedStatisticIndex: idx });

  onLineDateChange = lineDateType => () => this.setState({ lineDateType });

  render() {
    const {
      type,
      selectedStatisticIndex,
      faultStatisticData,
      complainStatisticData,
      faultProvinceData,
      complainProvinceData,
      faultTimeData,
      complainTimeData,
      faultPageNum,
      faultPageSize,
      faultTableData,
      faultTotalCount,
      complainPageNum,
      complainPageSize,
      complainTableData,
      complainTotalCount
    } = this.state;

    const serviceLevelGuaranteeOptions = getDictOptions(
      this.props.dict[DictIdEnum.SERVICE_LEVEL_GUARANTEE]
    );
    const securityLevelOptions = getDictOptions(
      this.props.dict[DictIdEnum.SECURITY_LEVEL]
    );
    const alarmLevelOptions = getDictOptions(
      this.props.dict[DictIdEnum.ALARM_LEVEL]
    );

    const tabArr = [
      {
        name: '故障',
        statisticNameArr: faultStatisticNameArr,
        statisticData: faultStatisticData,
        statisticPieData: [],
        provinceData: faultProvinceData,
        timeData: faultTimeData,
        tableFilter: (
          <div className="filter-wrap table-filter service-fault">
            <span className="filter-item">
              <span className="label">客户服务等级：</span>
              <Select
                value={this.state.customerServiceLevel}
                onChange={this.onSelectChange('customerServiceLevel')}
              >
                {securityLevelOptions}
              </Select>
            </span>
            <span className="filter-item">
              <span className="label">业务保障等级：</span>
              <Select
                value={this.state.faultSecurityLevel}
                onChange={this.onSelectChange('faultSecurityLevel')}
              >
                {serviceLevelGuaranteeOptions}
              </Select>
            </span>
            <span className="filter-item">
              <span className="label">工单编号：</span>
              <Input
                placeholder="支持模糊搜索"
                value={this.state.faultFlowIdLike}
                onChange={this.onInputChange('faultFlowIdLike')}
              />
            </span>
            <div className="new-line">
              <span className="filter-item">
                <span className="label">告警级别：</span>
                <Select
                  value={this.state.alarmLevel}
                  onChange={this.onSelectChange('alarmLevel')}
                >
                  {alarmLevelOptions}
                </Select>
              </span>
              <span className="filter-item">
                <span className="label">网元名称：</span>
                <Input
                  placeholder="支持模糊搜索"
                  value={this.state.elementNameLike}
                  onChange={this.onInputChange('elementNameLike')}
                />
              </span>
            </div>
            <span className="right-btn">
              <Button type="primary" onClick={() => this.getFaultList(1)}>
                筛选
              </Button>
              <Button onClick={this.resetFilter(this.faultFilterKey)}>
                重置
              </Button>
            </span>
          </div>
        ),
        tableColumn: serviceFaultColumns,
        pageNum: faultPageNum,
        pageSize: faultPageSize,
        tableData: faultTableData,
        totalCount: faultTotalCount,
        handlePageChange: this.getFaultList,
        pieText: '告警级别',
        pieData: []
      },
      {
        name: '投诉',
        statisticNameArr: complainStatisticNameArr,
        statisticData: complainStatisticData,
        statisticPieData: [],
        provinceData: complainProvinceData,
        timeData: complainTimeData,
        tableFilter: (
          <div className="filter-wrap table-filter">
            <span className="filter-item">
              <span className="label">业务保障等级：</span>
              <Select
                value={this.state.complainSecurityLevel}
                onChange={this.onSelectChange('complainSecurityLevel')}
              >
                {serviceLevelGuaranteeOptions}
              </Select>
            </span>
            <span className="filter-item">
              <span className="label">工单编号：</span>
              <Input
                placeholder="支持模糊搜索"
                value={this.state.complainFlowIdLike}
                onChange={this.onInputChange('complainFlowIdLike')}
              />
            </span>
            <span className="filter-item">
              <span className="label">专线名称：</span>
              <Input
                placeholder="支持模糊搜索"
                value={this.state.leasedLineNameLike}
                onChange={this.onInputChange('leasedLineNameLike')}
              />
            </span>
            <span className="right-btn">
              <Button type="primary" onClick={() => this.getComplainList()}>
                筛选
              </Button>
              <Button onClick={this.resetFilter(this.complainFilterKey)}>
                重置
              </Button>
            </span>
          </div>
        ),
        tableColumn: serviceComplainColumns,
        pageNum: complainPageNum,
        pageSize: complainPageSize,
        tableData: complainTableData,
        totalCount: complainTotalCount,
        handlePageChange: this.getComplainList,
        pieText: '专线保障级别',
        pieData: []
      }
    ];
    const typeIdx = type - 1;
    const tabObj = tabArr[typeIdx];

    return (
      <div className="analysis-wrap business-quality">
        <header>
          <span className="text">服务质量分析</span>
          <span className="type-select">
            {[
              { name: '故障工单分析', type: 1 },
              { name: '投诉工单分析', type: 2 }
            ].map(item => {
              const cls = classNames({ active: type === item.type });
              return (
                <span
                  key={item.type}
                  onClick={this.onTypeChange(item.type)}
                  className={cls}
                >
                  {item.name}
                </span>
              );
            })}
          </span>
        </header>
        <div className="analysis-body">
          <div className="filter-wrap">
            <span className="filter-item">
              <span className="label">
                要求完成时间
                <Icon
                  type="question-circle"
                  style={{ color: '#CBCBCB', marginLeft: 5 }}
                />
                ：
              </span>
              <DateSelect
                startDate={this.state.startDate[typeIdx]}
                endDate={this.state.endDate[typeIdx]}
                onStartChange={this.onDateChange('startDate')}
                onEndChange={this.onDateChange('endDate')}
              />
            </span>
            <span className="filter-item">
              <span className="label">区域：</span>
              <RegionSelect
                value={this.state.region[typeIdx]}
                onChange={this.onRegionChange}
              />
            </span>
            <span className="right-btn">
              <Button type="primary" onClick={this.getAllData}>
                查询
              </Button>
              <Button onClick={this.resetAllFilter}>重置</Button>
            </span>
          </div>
          <section>
            <p className="title">统计信息</p>
            <div className="statistic-info service">
              {tabObj.statisticNameArr.map((name, idx) => {
                const cls = classNames('info-item', {
                  active: selectedStatisticIndex === idx
                });
                return (
                  <span
                    key={idx}
                    className={cls}
                    onClick={this.onStatisticChange(idx)}
                  >
                    <p className="info-name">{name}</p>
                    <p className="info-value">{tabObj.statisticData[idx]}</p>
                  </span>
                );
              })}
              <AnalysisPieChart
                className="pie-chart"
                text={tabObj.pieText}
                dataArr={tabObj.pieData}
              />
            </div>
            <div className="province-info">
              <div className="echart-wrap">
                <p className="echart-title">
                  <span className="text">{`${tabObj.name}工单分省情况`}</span>
                  <span className="export">
                    <Icon type="download" />
                    导出
                  </span>
                </p>
                <AnalysisBarChart
                  className="province-echart"
                  itemName={`${tabObj.name}工单分省情况`}
                  dataArr={tabObj.provinceData}
                  needPercent={true}
                  needDataZone={false}
                />
              </div>
              <div className="echart-wrap">
                <div className="echart-title">
                  <span className="text">{`${tabObj.name}工单总数趋势`}</span>
                  <span className="export">
                    <Icon type="download" />
                    导出
                  </span>
                  <div className="filter-btn">
                    {lineDateArr.map((name, idx) => (
                      <span
                        key={idx}
                        className={classNames({
                          active: idx === this.state.lineDateType
                        })}
                        onClick={this.onLineDateChange(idx)}
                      >
                        {name}粒度
                      </span>
                    ))}
                  </div>
                </div>
                <AnalysisLineChart
                  className="line-chart"
                  dataArr={tabObj.timeData}
                />
              </div>

              <p className="title table-title">{`${tabObj.name}工单列表`}</p>
              {tabObj.tableFilter}
              <p className="echart-title">
                <span className="text">
                  共
                  <span className="num">{formatNumber(tabObj.totalCount)}</span>
                  条记录
                </span>
                <span className="export">
                  <Icon type="download" />
                  导出
                </span>
              </p>
              <Table
                className="business-quality-table"
                columns={tabObj.tableColumn}
                dataSource={tabObj.tableData}
                pagination={false}
                scroll={{ x: '78.875rem' }}
              />
              <TablePagination
                pageSize={tabObj.pageSize}
                pageNumber={tabObj.pageNum}
                total={tabObj.totalCount}
                preventDefaultLoad={true}
                hideTotal={true}
                handlePageChange={tabObj.handlePageChange}
              />
            </div>
          </section>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  business: state.business,
  dict: state.dict
});

export default connect(mapStateToProps)(ServiceQualityPage);
