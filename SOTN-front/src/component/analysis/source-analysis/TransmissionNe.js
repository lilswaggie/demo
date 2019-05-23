import React from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';
import moment from 'moment';

import { Radio, Select, Button, Icon, Table, Input } from 'antd';

import TimeAndRegionFilter from './component/TimeAndRegionFilter';
import TablePagination from '../../pub/TablePagination';
import StatisticInfo from './component/StatisticInfo';
import AnalysisBarChart from '../../pub/AnalysisBarChart';

import {
  formatNumber,
  objectEchartsArray,
  camel2Constant
} from '../../../util/CommonUtils';
import { postAxios, postAxiosBodyAndQuery } from '../../../axios/mainAxios';
import {
  getDictOptions,
  removeHms,
  sortMap,
  transmissionColumns
} from '../../../util/AnalysisUtils';
import { getDict, getNameByDictKey } from '../../../util/ReduxUtil';
import { DictIdEnum } from '../../../redux/dictRedux';

import './stylesheets/site.scss';

class TransNe extends React.Component {
  state = {
    // 全局过滤条件
    date: moment(),
    province: '',

    // 统计信息
    levelArr: [],

    // 按省或状态分布
    radioValue: 1,
    serviceLevelValue: '',

    statusArr: [],
    provinceArr: [],

    // 列表过滤条件
    serviceLevel: '',
    state: '',
    site: '',
    ems: '',

    // 表格排序字段
    tableSorter: {},

    pageNum: 1,
    pageSize: 10,
    totalCount: 0,
    transNetList: []
  };

  componentDidMount() {
    this.getAllData();
    getDict(DictIdEnum.SERVICE_LEVEL);
    getDict(DictIdEnum.ELEMENT_STATE);
  }

  componentDidUpdate(prevProps, prevState) {
    const { activeKey } = this.props;
    // 资源统计页面的Tab切换
    if (activeKey !== prevProps.activeKey && activeKey === 'transmissionNe') {
      this.getAllData();
    }

    const { radioValue, serviceLevelValue, tableSorter } = this.state;
    if (
      radioValue !== prevState.radioValue ||
      serviceLevelValue !== prevState.serviceLevelValue
    ) {
      this.getStatusAndProvince();
    }

    if (!_.isEqual(tableSorter, prevState.tableSorter)) {
      this.getNetTranList();
    }
  }

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
    const { serviceLevelValue } = this.state;
    const filter = this.getFilter();
    if (withMore) {
      filter.serviceLevel = serviceLevelValue;
    }
    return filter;
  };

  getTableFilterParams = () => {
    const filter = this.getFilter();
    let {
      serviceLevel,
      state,
      site,
      ems,
      tableSorter: { order, field }
    } = this.state;
    filter.serviceLevel = serviceLevel;
    filter.state = state;
    filter.siteLike = site;
    filter.ems = ems;
    if (field) {
      filter.orderBy = [
        { direction: sortMap[order], field: camel2Constant(field) }
      ];
    }
    return filter;
  };

  getProvinceItemName = () => {
    const { radioValue, serviceLevelValue } = this.state;
    switch (radioValue) {
    case 2:
      return getNameByDictKey(DictIdEnum.SERVICE_LEVEL, serviceLevelValue);
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
    this.getLevel();
    this.getStatusAndProvince();
    this.getNetTranList(1);
  };

  getStatusAndProvince = () => {
    this.getStatus();
    this.getProvince();
  };

  // 网元按传输业务等级统计
  getLevel = () => {
    postAxios(
      'api/network/elements/stats/num/service_level',
      this.getFilterParams(),
      data => this.setState({ levelArr: objectEchartsArray(data.values) })
    );
  };

  getCount = () => this.state.levelArr.reduce((p, c) => p + c.value, 0);

  // 传输网元状态统计
  getStatus = () => {
    postAxios(
      'api/network/elements/stats/num/state',
      this.getFilterParams(true),
      data => this.setState({ statusArr: objectEchartsArray(data.values) })
    );
  };

  // 传输网元个数的分省统计
  getProvince = () => {
    postAxios(
      'api/network/elements/stats/num/location',
      this.getFilterParams(true),
      data => this.setState({ provinceArr: objectEchartsArray(data.values) })
    );
  };

  onTableFilterReset = () => {
    this.setState({
      serviceLevel: '',
      state: '',
      site: '',
      ems: ''
    });
  };

  onTableChange = (pagination, filters, sorter) => {
    this.setState({ tableSorter: sorter });
  };

  // 传输网元列表
  getNetTranList = (
    pageNum = this.state.pageNum,
    pageSize = this.state.pageSize
  ) => {
    postAxiosBodyAndQuery(
      'api/network/elements',
      this.getTableFilterParams(),
      { currentPage: pageNum - 1, pageSize: pageSize },
      ({ results = [], totalElements }) =>
        this.setState({
          transNetList: results,
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

      levelArr,

      radioValue,
      serviceLevelValue,

      statusArr,
      provinceArr,

      // 列表过滤条件
      serviceLevel,
      state,
      site,
      ems,

      pageNum,
      pageSize,
      totalCount,
      transNetList
    } = this.state;

    const RadioGroup = Radio.Group;

    const serviceLevelOptions = getDictOptions(
      this.props.dict[DictIdEnum.SERVICE_LEVEL]
    );
    const elementStateOptions = getDictOptions(
      this.props.dict[DictIdEnum.ELEMENT_STATE]
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
          <div className="trans-statistic-info clearfix">
            <div className="total-site total-trans-net">
              <span>传输网元总数</span>
              <span>{formatNumber(this.getCount())}</span>
            </div>
            <div className="trans-type">
              <div className="type-title">传输业务级别分布</div>
              <StatisticInfo siteType={levelArr} className="site-distribute" />
            </div>
          </div>
          <div className="statistic-info-bar clearfix">
            <div className="bar-header">
              <RadioGroup onChange={this.onRadioChange} value={radioValue}>
                <Radio value={1}>全部传输网元</Radio>
                <Radio value={2}>按传输业务级别</Radio>
              </RadioGroup>
              {radioValue !== 1 ? (
                <Select
                  onChange={this.onSelectChange('serviceLevelValue')}
                  value={serviceLevelValue}
                >
                  {serviceLevelOptions}
                </Select>
              ) : null}
            </div>
            <div className="total-trans">
              <span>传输网元状态分布</span>
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
            <div className="trans-province-situation">
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
                itemName={serviceLevelValue}
                dataArr={provinceArr}
                needDataZone={true}
                className="province-echart"
              />
            </div>
          </div>
        </div>
        <div className="site-list-content">
          <span className="list-title">传输网元列表</span>
          <div className="list-header clearfix">
            <span>传输业务级别：</span>
            <Select
              onChange={this.onSelectChange('serviceLevel')}
              value={serviceLevel}
            >
              {serviceLevelOptions}
            </Select>
            <span>状态：</span>
            <Select onChange={this.onTransStaSelect} value={state}>
              {elementStateOptions}
            </Select>
            <span className="header-text">所属站点：</span>
            <Input
              placeholder="支持模糊搜索"
              onChange={this.onInputChange('site')}
              value={site}
            />
            <span className="header-text">所属EMS：</span>
            <Input
              placeholder="支持模糊搜索"
              onChange={this.onInputChange('ems')}
              value={ems}
            />
            <div className="list-btn">
              <Button type="primary" onClick={() => this.getNetTranList(1)}>
                筛选
              </Button>
              <Button type="primary" ghost onClick={this.onTableFilterReset}>
                重置
              </Button>
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
            columns={transmissionColumns}
            dataSource={transNetList}
            onChange={this.onTableChange}
            rowKey={record => record.id}
            pagination={false}
          />
          <TablePagination
            pageNumber={pageNum}
            pageSize={pageSize}
            total={totalCount}
            preventDefaultLoad={true}
            handlePageChange={this.getNetTranList}
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

export default connect(mapStateToProps)(TransNe);
