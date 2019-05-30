import React, { Component } from 'react';
import { connect } from 'react-redux';

import moment from 'moment';
import classNames from 'classnames';

import { Icon, Button, Select, Input, Table } from 'antd';

import DateSelect, { DateStyle } from '../../component/pub/select/DateSelect';
import RegionSelect from '../../component/pub/select/RegionSelect';
import AnalysisBarChart from '../../component/pub/chart/AnalysisBarChart';
import AnalysisLineChart from '../../component/pub/chart/AnalysisLineChart';
import TablePagination from '../../component/pub/TablePagination';

import { postAxiosBodyAndQuery } from '../../axios/mainAxios';
import {
  businessQualityColumns,
  lineDateArr,
  timeGranularityArr,
  objectToDict,
  removeHms,
  getDictOptions
} from '../../util/AnalysisUtils';
import { formatNumber, msToHour } from '../../util/CommonUtils';
import { getDict } from '../../util/ReduxUtil';
import { DictIdEnum } from '../../redux/dictRedux';

import '../../assets/css/network-quality/network-quality.scss';

const statisticArr = [
  '专线可用率（%）',
  '专线中断时长（h）',
  '专线故障次数（次）',
  '专线投诉次数（次）',
  '专线倒换次数（次）',
  '专线时延（h）',
  '专线归一化平均时延（h）'
];
class BusinessQualityPage extends Component {
  state = {
    startDate: moment().day(-30),
    endDate: moment(),
    region: '',

    // 选中的统计信息index
    selectedStatisticIndex: 0,
    // 专线趋势时间筛选粒度。1：天，2：月，3：年
    lineDateType: 0,

    statisticData: [0, 0, 0, 0, 0, 0, 0],
    provinceData: [],
    timeData: [],

    // 专线业务质量详表筛选条件
    securityLevel: '',
    customName: '',

    // table
    pageSize: 10,
    pageNum: 1,
    tableData: [],
    totalCount: 0
  };

  componentDidMount() {
    getDict(DictIdEnum.SERVICE_LEVEL_GUARANTEE);
    this.getAllData();
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedStatisticIndex: idx, lineDateType } = this.state;
    if (prevState.selectedStatisticIndex !== idx) {
      this.getStatisticData();
      this.getBarData(this.provinceApi[idx]);
      if (idx !== 5 && idx !== 6) {
        this.getLineData(this.statisticApi[idx], lineDateType);
      }
    }
    if (prevState.lineDateType !== lineDateType) {
      this.getLineData(this.statisticApi[idx], lineDateType);
    }
  }

  // 时间选择改变
  onDateChange = name => (date, dateStr) => this.setState({ [name]: date });

  // 区域选择改变
  onRegionChange = region => this.setState({ region });

  onInputChange = name => e => this.setState({ [name]: e.target.value });

  onSelectChange = name => v => this.setState({ [name]: v });

  resetAllFilter = () =>
    this.setState({
      startDate: moment().day(-30),
      endDate: moment(),
      region: ''
    });

  getFilterParams = () => {
    const { region, startDate, endDate } = this.state;
    return {
      province: region || null,
      timeRange: {
        since: removeHms(startDate).valueOf(),
        until: removeHms(endDate).valueOf()
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

  filterKeyArr = [];

  getTableFilterParams = filterKeyArr => {
    let filter = this.getFilterParams();
    filterKeyArr.forEach(key => (filter[key] = this.state[key]));
    return filter;
  };

  statisticApi = [
    'api/leased_lines/stats/usable/timed',
    'api/leased_lines/stats/interrupted/timed',
    'api/leased_lines/stats/fault/timed',
    'api/leased_lines/stats/complaint/timed',
    'api/leased_lines/stats/circuit_switch/timed'
  ];

  provinceApi = [
    'api/leased_lines/stats/usable/location',
    'api/leased_lines/stats/interrupted/location',
    'api/leased_lines/stats/fault/frequency/location',
    'api/leased_lines/stats/complaint/location',
    'api/leased_lines/stats/circuit_switch/location',
    'api/leased_lines/stats/delay/location',
    'api/leased_lines/stats/normalized_time_delay/location'
  ];

  setStatisticData = (value, idx) => {
    const arr = this.state.statisticData;
    arr[idx] =
      [1, 5, 6].indexOf(idx) >= 0
        ? msToHour(value)
        : [2, 3, 4].indexOf(idx) >= 0
          ? formatNumber(value)
          : value;
    this.setState({ statisticData: arr });
  };

  statisticKeyIndexMap = {
    usable_rate: 0,
    interrupt_time: 1,
    fault_frequency_num: 2,
    complaint_frequency_num: 3,
    circuit_switch_num: 4,
    time_delay: 5,
    normalized_time_delay: 6
  };

  getStatisticData = () => {
    postAxiosBodyAndQuery(
      'api/leased_lines/stats/current',
      this.getParams(),
      ({ values = {} }) => {
        Object.keys(values).forEach(key => {
          this.setStatisticData(values[key], this.statisticKeyIndexMap[key]);
        });
      }
    );
  };

  getBarData = api => {
    const params = this.getParams();
    delete params.province;
    postAxiosBodyAndQuery(api, params, ({ values }) =>
      this.setState({ provinceData: objectToDict(values) })
    );
  };

  getLineData = (api, type) => {
    const nameF = ms =>
      moment(parseInt(ms)).format(
        [DateStyle.HM, DateStyle.MD, DateStyle.YM][type]
      );
    postAxiosBodyAndQuery(
      api,
      this.getParams(true),
      ({ values }) => this.setState({ timeData: objectToDict(values, nameF) })
    );
  };

  getAllData = (pageNum = 1, pageSize = 10) => {
    const { selectedStatisticIndex: idx, lineDateType } = this.state;

    this.getStatisticData();
    this.getBarData(this.provinceApi[idx]);
    this.getLineData(this.statisticApi[idx], lineDateType);
  };

  onStatisticChange = idx => () =>
    this.setState({ selectedStatisticIndex: idx });

  onLineDateChange = lineDateType => () => this.setState({ lineDateType });

  handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter);
  };

  handlePageChange = (
    pageNum = this.state.pageNum,
    pageSize = this.state.pageSize
  ) => {};

  render() {
    const {
      selectedStatisticIndex,
      statisticData,
      provinceData,
      timeData,
      securityLevel,
      customName
    } = this.state;
    const securityLevelOptions = getDictOptions(
      this.props.dict[DictIdEnum.SERVICE_LEVEL_GUARANTEE]
    );
    return (
      <div className="analysis-wrap business-quality">
        <header>
          <span className="text">业务质量分析</span>
        </header>
        <div className="analysis-body">
          <div className="filter-wrap">
            <span className="filter-item">
              <span className="label">
                时间范围
                <Icon
                  type="question-circle"
                  style={{ color: '#CBCBCB', marginLeft: 5 }}
                />
                ：
              </span>
              <DateSelect
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                onStartChange={this.onDateChange('startDate')}
                onEndChange={this.onDateChange('endDate')}
              />
            </span>
            <span className="filter-item">
              <span className="label">区域：</span>
              <RegionSelect
                value={this.state.region}
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
            <div className="statistic-info business">
              {statisticArr.map((name, idx) => {
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
                    <p className="info-value">{statisticData[idx]}</p>
                  </span>
                );
              })}
            </div>
            <div className="province-info">
              <div className="echart-wrap">
                <p className="echart-title">
                  <span className="text">专线可用率分省情况</span>
                  <span className="export">
                    <Icon type="download" />
                    导出
                  </span>
                </p>
                <AnalysisBarChart
                  className="province-echart"
                  itemName={'专线可用率'}
                  dataArr={provinceData}
                  needPercent={true}
                  needDataZone={false}
                />
              </div>
              {selectedStatisticIndex !== 5 && selectedStatisticIndex !== 6 && (
                <div className="echart-wrap">
                  <div className="echart-title">
                    <span className="text">专线可用率</span>
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
                    dataArr={timeData}
                  />
                </div>
              )}
              <p className="title table-title">专线业务质量详表</p>
              <div className="filter-wrap table-filter">
                <span className="filter-item">
                  <span className="label">业务保障等级：</span>
                  <Select
                    value={securityLevel}
                    onChange={this.onSelectChange('securityLevel')}
                  >
                    {securityLevelOptions}
                  </Select>
                </span>
                <span className="filter-item">
                  <span className="label">客户名称：</span>
                  <Input
                    placeholder="支持模糊搜索"
                    value={customName}
                    onChange={this.onInputChange('customName')}
                  />
                </span>
                <span className="right-btn">
                  <Button type="primary">筛选</Button>
                  <Button>重置</Button>
                </span>
              </div>
              <p className="echart-title">
                <span className="text">
                  共
                  <span className="num">
                    {formatNumber(this.state.totalCount)}
                  </span>
                  条记录
                </span>
                <span className="export">
                  <Icon type="download" />
                  导出
                </span>
              </p>
              <Table
                className="business-quality-table"
                columns={businessQualityColumns}
                bordered={true}
                dataSource={this.state.tableData}
                onChange={this.handleTableChange}
                pagination={false}
                scroll={{ x: '78.875rem' }}
              />
              <TablePagination
                pageSize={this.state.pageSize}
                pageNumber={this.state.pageNum}
                total={this.state.totalCount}
                preventDefaultLoad={true}
                hideTotal={true}
                handlePageChange={this.handlePageChange}
              />
            </div>
          </section>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  dict: state.dict
});

export default connect(mapStateToProps)(BusinessQualityPage);
