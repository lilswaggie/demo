import React from 'react';
import { connect } from 'react-redux';

import { Radio, Select, Button, Icon, Table, Input } from 'antd';

import _ from 'lodash';
import moment from 'moment';

import TimeAndRegionFilter from './component/TimeAndRegionFilter';
import StatisticInfo from './component/StatisticInfo';
import AnalysisBarChart from '../../pub/AnalysisBarChart';
import TablePagination from '../../pub/TablePagination';

import { postAxios, postAxiosBodyAndQuery } from '../../../axios/mainAxios';
import { DictIdEnum } from '../../../redux/dictRedux';

import {
  formatNumber,
  objectEchartsArray,
  camel2Constant
} from '../../../util/CommonUtils';
import { getDict, getNameByDictKey } from '../../../util/ReduxUtil';
import {
  getDictOptions,
  portColumns,
  removeHms,
  sortMap
} from '../../../util/AnalysisUtils';

import './stylesheets/site.scss';

class SourcePort extends React.Component {
  state = {
    // 全局过滤条件
    date: moment(),
    province: '',

    // 端口类型分布
    typeArr: [],
    // 光电属性分布
    oeArr: [],
    // 端口速率分布
    rateArr: [],

    // 分省情况筛选条件
    radioValue: 2,
    // 端口类型
    typeValue: '',
    // 光电属性
    oeValue: '',

    // 端口状态分布
    statusArr: [],
    // 分省统计
    provinceArr: [],

    // 列表筛选条件
    type: '',
    oe: '',
    rate: '',
    state: '',
    elementName: '',
    lineName: '',

    // 表格排序字段
    tableSorter: {},

    pageNum: 1,
    pageSize: 10,
    totalCount: 0,
    portList: []
  };

  componentDidMount() {
    this.getAllData();
    getDict(DictIdEnum.PORT_TYPE);
    getDict(DictIdEnum.PHOTOELECTRIC_PROPERTIES);
    getDict(DictIdEnum.PORT_SPEED);
    getDict(DictIdEnum.PORT_STATUS);
  }

  componentDidUpdate(prevProps, prevState) {
    const { activeKey } = this.props;
    // 资源统计页面的Tab切换
    if (activeKey !== prevProps.activeKey && activeKey === 'port') {
      this.getAllData();
    }

    const { radioValue, typeValue, oeValue, tableSorter } = this.state;
    if (
      radioValue !== prevState.radioValue ||
      typeValue !== prevState.typeValue ||
      oeValue !== prevState.oeValue
    ) {
      this.getStatusAndProvince();
    }

    if (!_.isEqual(tableSorter, prevState.tableSorter)) {
      this.getPortList();
    }
  }

  statisticSiteFilter = {
    TYPE: 'TYPE',
    OE: 'OE'
  };

  getFilter = () => {
    const { date, province } = this.state;
    return {
      province: province || null,
      timeRange: {
        until: removeHms(date).valueOf()
      }
    };
  };

  /**
   * 生成查询条件.
   * @param {boolean} withMore 是否包含更多信息
   */
  getFilterParams = withMore => {
    const { radioValue, typeValue, oeValue } = this.state;
    const filter = this.getFilter();
    if (withMore) {
      const { TYPE, OE } = this.statisticSiteFilter;
      filter.more = {
        type: [TYPE, OE][radioValue - 2],
        value: [typeValue, oeValue][radioValue - 2]
      };
    }
    return filter;
  };

  getTableFilterParams = () => {
    const filter = this.getFilter();
    let {
      type,
      oe,
      rate,
      state,
      elementName,
      lineName,
      tableSorter: { order, field }
    } = this.state;
    filter.type = type;
    filter.oe = oe;
    filter.rate = rate;
    filter.state = state;
    filter.elementNameLike = elementName;
    filter.lineNameLike = lineName;
    if (field) {
      filter.orderBy = [
        { direction: sortMap[order], field: camel2Constant(field) }
      ];
    }
    return filter;
  };

  getProvinceItemName = () => {
    const { radioValue, typeValue, oeValue } = this.state;
    switch (radioValue) {
    case 2:
      return getNameByDictKey(DictIdEnum.PORT_TYPE, typeValue);
    case 3:
      return getNameByDictKey(DictIdEnum.PHOTOELECTRIC_PROPERTIES, oeValue);
    default:
      return '';
    }
  };

  onRadioChange = e => this.setState({ radioValue: e.target.value });

  onDateChange = (date, dateString) => this.setState({ date: date });

  onTimeAndRegionFilterReset = () =>
    this.setState({ date: moment(), province: '' });

  onInputChange = name => e => this.setState({ [name]: e.target.value });

  onSelectChange = name => value => this.setState({ [name]: value });

  getAllData = () => {
    this.getType();
    this.getOe();
    this.getRate();
    this.getStatusAndProvince();
    this.getPortList(1);
  };

  // 端口状态分布、分省情况
  getStatusAndProvince = () => {
    this.getStatus();
    this.getProvince();
  };

  // 端口类型分布
  getType = () => {
    postAxios(
      'api/network/ports/stats/num/type',
      this.getFilterParams(),
      data => this.setState({ typeArr: objectEchartsArray(data.values) })
    );
  };

  getPortCount = () => this.state.typeArr.reduce((p, c) => p + c.value, 0);

  // 光电属性分布
  getOe = () => {
    postAxios('api/network/ports/stats/num/oe', this.getFilterParams(), data =>
      this.setState({ oeArr: objectEchartsArray(data.values) })
    );
  };

  // 端口速率分布
  getRate = () => {
    postAxios(
      'api/network/ports/stats/num/speed',
      this.getFilterParams(),
      data => this.setState({ rateArr: objectEchartsArray(data.values) })
    );
  };

  // 端口状态分布
  getStatus = () => {
    postAxios(
      'api/network/ports/stats/num/state',
      this.getFilterParams(true),
      data => this.setState({ statusArr: objectEchartsArray(data.values) })
    );
  };
  // 端口分省统计
  getProvince = () => {
    postAxios(
      'api/network/ports/stats/num/location',
      this.getFilterParams(true),
      data => this.setState({ provinceArr: objectEchartsArray(data.values) })
    );
  };

  onTableFilterReset = () => {
    this.setState({
      type: '',
      oe: '',
      rate: '',
      state: '',
      elementName: '',
      lineName: ''
    });
  };

  onTableChange = (pagination, filters, sorter) => {
    this.setState({ tableSorter: sorter });
  };

  // 端口列表
  getPortList = (
    pageNum = this.state.pageNum,
    pageSize = this.state.pageSize
  ) => {
    postAxiosBodyAndQuery(
      'api/network/ports',
      this.getTableFilterParams(),
      { currentPage: pageNum - 1, pageSize: pageSize },
      ({ results = [], totalElements }) =>
        this.setState({
          portList: results,
          totalCount: totalElements,
          pageSize,
          pageNum
        })
    );
  };

  render() {
    const {
      date,
      province,

      typeArr,
      oeArr,
      rateArr,

      radioValue,
      typeValue,
      oeValue,
      statusArr,
      provinceArr,

      type,
      oe,
      rate,
      state,
      elementName,
      lineName,

      pageNum,
      pageSize,
      totalCount,
      portList
    } = this.state;

    const RadioGroup = Radio.Group;

    const portTypeOptions = getDictOptions(
      this.props.dict[DictIdEnum.PORT_TYPE]
    );
    const photoelectricPropertiesOptions = getDictOptions(
      this.props.dict[DictIdEnum.PHOTOELECTRIC_PROPERTIES]
    );
    const portSpeedOptions = getDictOptions(
      this.props.dict[DictIdEnum.PORT_SPEED]
    );
    const portStatusOptions = getDictOptions(
      this.props.dict[DictIdEnum.PORT_STATUS]
    );

    return (
      <div>
        <TimeAndRegionFilter
          date={date}
          province={province}
          onDateChange={this.onDateChange}
          onProvinceChange={this.onSelectChange('province')}
          onSubmit={this.getAllData}
          onReset={this.onTimeAndRegionFilterReset}
        />
        <div className="site-content clearfix">
          <span className="site-span">统计信息</span>
          <div className="port-statistic-info clearfix">
            <div className="total-port">
              <span>端口总数</span>
              <span>{formatNumber(this.getPortCount())}</span>
            </div>
            <div className="port-type">
              <div className="type-title">端口类型分布</div>
              <StatisticInfo siteType={typeArr} />
            </div>
            <div className="photoelectric-pro">
              <div className="type-title">光电属性分布</div>
              <StatisticInfo siteType={oeArr} />
            </div>
            <div className="port-rate site-type-two">
              <div className="type-title">端口速率分布</div>
              <StatisticInfo siteType={rateArr} />
            </div>
          </div>
          <div className="statistic-info-bar clearfix">
            <div className="bar-header">
              <RadioGroup onChange={this.onRadioChange} value={radioValue}>
                <Radio value={1}>全部端口</Radio>
                <Radio value={2}>按端口类型</Radio>
                <Radio value={3}>按光电属性</Radio>
              </RadioGroup>
              {radioValue !== 1 ? (
                radioValue === 2 ? (
                  <Select
                    onChange={this.onSelectChange('typeValue')}
                    value={typeValue}
                  >
                    {portTypeOptions}
                  </Select>
                ) : (
                  <Select
                    onChange={this.onSelectChange('oeValue')}
                    value={oeValue}
                  >
                    {photoelectricPropertiesOptions}
                  </Select>
                )
              ) : null}
            </div>
            <div className="total-site">
              <span>端口状态分布</span>
              <div>
                {statusArr.map((item, index) => (
                  <span key={index}>
                    {item.name || '--'}
                    <span className="site-status">
                      {formatNumber(item.value)}
                    </span>
                  </span>
                ))}
              </div>
            </div>
            <div className="province-situation">
              <div className="chart-export clearfix">
                <span>分省情况</span>
                <span
                  onClick={this.downloadRecordExcel}
                  className="download-excel"
                >
                  <Icon type="download" style={{ fontSize: '18px' }} />
                  导出
                </span>
              </div>
              <AnalysisBarChart
                itemName={typeValue}
                dataArr={provinceArr}
                needDataZone={true}
                className="province-echart"
              />
            </div>
          </div>
        </div>
        <div className="site-list-content">
          <span className="list-title">端口列表</span>
          <div className="list-header table-header clearfix">
            <div className="filter-wrap table-filter">
              <span className="filter-item">
                <span className="label">端口类型：</span>
                <Select onChange={this.onPortTypeSelect} value={type}>
                  {portTypeOptions}
                </Select>
              </span>
              <span className="filter-item">
                <span className="label">光电属性：</span>
                <Select onChange={this.onPhotoelectricSelect} value={oe}>
                  {photoelectricPropertiesOptions}
                </Select>
              </span>
              <span className="filter-item">
                <span className="label">所属网元名称：</span>
                <Input
                  placeholder="支持模糊搜索"
                  onChange={this.onInputChange('elementName')}
                  value={elementName}
                />
              </span>
              <div className="new-line">
                <span className="filter-item">
                  <span className="label">端口速率：</span>
                  <Select onChange={this.onPortRateSelect} value={rate}>
                    {portSpeedOptions}
                  </Select>
                </span>
                <span className="filter-item">
                  <span className="label">端口状态：</span>
                  <Select onChange={this.onPortStaSelect} value={state}>
                    {portStatusOptions}
                  </Select>
                </span>
                <span className="filter-item">
                  <span className="label">所属专线名称：</span>
                  <Input
                    placeholder="支持模糊搜索"
                    onChange={this.onInputChange('lineName')}
                    value={lineName}
                  />
                </span>
              </div>
              <span className="right-btn">
                <Button type="primary" onClick={() => this.getPortList(1)}>
                  筛选
                </Button>
                <Button onClick={this.onTableFilterReset}>重置</Button>
              </span>
            </div>
          </div>
          <div className="table-download clearfix">
            <span className="record-text">
              共
              <span className="record-number">{formatNumber(totalCount)}</span>
              条记录
            </span>
            <span onClick={this.downloadListTable} className="download-excel">
              <Icon type="download" style={{ fontSize: '18px' }} />
              导出
            </span>
          </div>
          <Table
            columns={portColumns}
            dataSource={portList}
            onChange={this.onTableChange}
            scroll={{ x: '90rem' }}
            rowKey={record => record.id}
            pagination={false}
          />
          <TablePagination
            pageNumber={pageNum}
            pageSize={pageSize}
            total={totalCount}
            preventDefaultLoad={true}
            handlePageChange={this.getPortList}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  business: state.business,
  dict: state.dict
});

export default connect(mapStateToProps)(SourcePort);
