import React from 'react';
import { connect } from 'react-redux';
import { Radio, Select, Button, Icon, Table } from 'antd';

import _ from 'lodash';
import moment from 'moment';

import TimeAndRegionFilter from './component/TimeAndRegionFilter';
import StatisticInfo from './component/StatisticInfo';
import AnalysisBarChart from '../../pub/chart/AnalysisBarChart';
import TablePagination from '../../pub/TablePagination';

import { postAxios, postAxiosBodyAndQuery } from '../../../axios/mainAxios';
import { DictIdEnum } from '../../../redux/dictRedux';

import {
  formatNumber,
  splitArr,
  objectEchartsArray,
  camel2Constant
} from '../../../util/CommonUtils';
import { getDict, getNameByDictKey } from '../../../util/ReduxUtil';
import {
  getDictOptions,
  siteColumns,
  removeHms,
  sortMap
} from '../../../util/AnalysisUtils';

import FileApi, { FileDownloadType } from './../../../api/fileApi';

import './stylesheets/site.scss';

class SourceSite extends React.Component {
  state = {
    // 全局过滤条件
    date: moment(),
    province: '',

    // 统计信息
    siteTypeArr: [],
    siteTransLevelArr: [],

    // 1：全部站点，2：按站点类型，3：按传输业务级别
    radioValue: 2,
    // 站点类型选择框值
    siteFilterType: '',
    // 传输业务级别选择框值
    transferLevelFilterType: '',

    // 站点状态分布统计
    siteStatusArr: [],
    // 站点分省统计
    siteProvinceArr: [],

    // 站点列表过滤条件
    siteSelectValue: '',
    transferSelectValue: '',
    siteStatusSelectValue: '',

    // 表格排序字段
    tableSorter: {},

    pageNum: 1,
    pageSize: 10,
    totalCount: 0,
    siteList: []
  };

  statisticSiteFilter = {
    TYPE: 'TYPE',
    SERVICE_LEVEL: 'SERVICE_LEVEL'
  };

  componentDidMount() {
    this.getAllData();
    getDict(DictIdEnum.SITE_TYPE);
    getDict(DictIdEnum.SERVICE_LEVEL);
    getDict(DictIdEnum.SITE_CONDITION);
  }

  componentDidUpdate(prevProps, prevState) {
    const { activeKey } = this.props;
    // 资源统计页面的Tab切换
    if (activeKey !== prevProps.activeKey && activeKey === 'site') {
      this.getAllData();
    }

    const {
      radioValue,
      siteFilterType,
      transferLevelFilterType,
      tableSorter
    } = this.state;
    if (
      radioValue !== prevState.radioValue ||
      siteFilterType !== prevState.siteFilterType ||
      transferLevelFilterType !== prevState.transferLevelFilterType
    ) {
      this.getStatusAndProvince();
    }

    if (!_.isEqual(tableSorter, prevState.tableSorter)) {
      this.getSiteList();
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
    const { radioValue, siteFilterType, transferLevelFilterType } = this.state;
    const filter = this.getFilter();
    if (withMore) {
      const { TYPE, SERVICE_LEVEL } = this.statisticSiteFilter;
      filter.more = {
        type: [TYPE, SERVICE_LEVEL][radioValue - 2],
        value: [siteFilterType, transferLevelFilterType][radioValue - 2]
      };
    }
    return filter;
  };

  getTableFilterParams = () => {
    const filter = this.getFilter();
    let {
      siteSelectValue,
      transferSelectValue,
      siteStatusSelectValue,
      tableSorter: { order, field }
    } = this.state;
    filter.type = siteSelectValue;
    filter.serviceLevel = transferSelectValue;
    filter.status = siteStatusSelectValue;
    if (field) {
      filter.orderBy = [
        { direction: sortMap[order], field: camel2Constant(field) }
      ];
    }
    return filter;
  };

  getProvinceItemName = () => {
    const { radioValue, siteFilterType, transferLevelFilterType } = this.state;
    switch (radioValue) {
      case 2:
        return getNameByDictKey(DictIdEnum.SITE_TYPE, siteFilterType);
      case 3:
        return getNameByDictKey(
          DictIdEnum.SERVICE_LEVEL,
          transferLevelFilterType
        );
      default:
        return '';
    }
  };

  onRadioChange = e => this.setState({ radioValue: e.target.value });

  onDateChange = (date, dateString) => this.setState({ date: date });

  onTimeAndRegionFilterReset = () =>
    this.setState({ date: moment(), province: '' });

  onSelectChange = name => value => this.setState({ [name]: value });

  getAllData = () => {
    this.getType();
    this.getTransLevel();
    this.getStatusAndProvince();
    this.getSiteList(1);
  };

  // 站点状态分布、分省情况
  getStatusAndProvince = () => {
    this.getStatus();
    this.getProvince();
  };

  // 站点类型分布
  getType = () => {
    postAxios('api/network/stats/site/type', this.getFilterParams(), data =>
      this.setState({ siteTypeArr: objectEchartsArray(data.values) })
    );
  };

  getSiteCount = () => this.state.siteTypeArr.reduce((p, c) => p + c.value, 0);

  // 站点按传输业务级别统计
  getTransLevel = () => {
    postAxios(
      'api/network/stats/site/service_level',
      this.getFilterParams(),
      data =>
        this.setState({ siteTransLevelArr: objectEchartsArray(data.values) })
    );
  };

  // 站点按状态统计
  getStatus = () => {
    postAxios(
      'api/network/stats/site/state',
      this.getFilterParams(true),
      data => this.setState({ siteStatusArr: objectEchartsArray(data.values) })
    );
  };

  // 站点数的分省统计
  getProvince = () => {
    postAxios(
      'api/network/stats/site/location',
      this.getFilterParams(true),
      data =>
        this.setState({ siteProvinceArr: objectEchartsArray(data.values) })
    );
  };

  onTableFilterReset = () => {
    this.setState({
      siteSelectValue: '',
      transferSelectValue: '',
      siteStatusSelectValue: ''
    });
  };

  onTableChange = (pagination, filters, sorter) => {
    this.setState({ tableSorter: sorter });
  };

  // 获取站点列表
  getSiteList = (
    pageNum = this.state.pageNum,
    pageSize = this.state.pageSize
  ) => {
    postAxiosBodyAndQuery(
      'api/network/sites',
      this.getTableFilterParams(),
      { currentPage: pageNum - 1, pageSize },
      ({ results = [], totalElements }) => {
        this.setState({
          siteList: results,
          totalCount: totalElements,
          pageSize,
          pageNum
        });
      }
    );
  };

  downloadProvince = () =>
    FileApi.downloadFile(
      FileDownloadType.SITE_PROVINCE,
      this.getFilterParams(true)
    );

  downloadTable = () =>
    FileApi.downloadFile(FileDownloadType.SITE, this.getTableFilterParams());

  render() {
    const {
      date,
      province,

      siteTypeArr,
      siteTransLevelArr,

      radioValue,
      siteFilterType,
      transferLevelFilterType,
      siteStatusArr,
      siteProvinceArr,

      siteSelectValue,
      transferSelectValue,
      siteStatusSelectValue,

      pageNum,
      pageSize,
      totalCount,
      siteList
    } = this.state;

    const RadioGroup = Radio.Group;

    const serviceLevelOptions = getDictOptions(
      this.props.dict[DictIdEnum.SERVICE_LEVEL]
    );
    const siteTypeOptions = getDictOptions(
      this.props.dict[DictIdEnum.SITE_TYPE]
    );
    const siteStatusOptions = getDictOptions(
      this.props.dict[DictIdEnum.SITE_CONDITION]
    );
    // 表格列
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
          <div className="statistic-info clearfix">
            <div className="total-site">
              <span>站点总数</span>
              <span>{formatNumber(this.getSiteCount())}</span>
            </div>
            <div className="site-type">
              <div className="type-title">站点类型分布</div>
              <StatisticInfo
                siteType={splitArr(siteTypeArr, 4)}
                className="site-distribute"
              />
            </div>
            <div className="site-type site-type-two">
              <div className="type-title">传输业务级别分布</div>
              <StatisticInfo siteType={splitArr(siteTransLevelArr, 4)} />
            </div>
          </div>
          <div className="statistic-info-bar clearfix">
            <div className="bar-header">
              <RadioGroup onChange={this.onRadioChange} value={radioValue}>
                <Radio value={1}>全部站点</Radio>
                <Radio value={2}>按站点类型</Radio>
                <Radio value={3}>按传输业务级别</Radio>
              </RadioGroup>
              {radioValue !== 1 ? (
                radioValue === 2 ? (
                  <Select
                    onChange={this.onSelectChange('siteFilterType')}
                    value={siteFilterType}
                  >
                    {siteTypeOptions}
                  </Select>
                ) : (
                  <Select
                    onChange={this.onSelectChange('transferLevelFilterType')}
                    value={transferLevelFilterType}
                  >
                    {serviceLevelOptions}
                  </Select>
                )
              ) : null}
            </div>
            <div className="total-site">
              <span>站点状态分布</span>
              <div>
                {siteStatusArr.map((item, index) => (
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
                  onClick={this.downloadProvince}
                  className="download-excel"
                >
                  <Icon type="download" style={{ fontSize: '18px' }} />
                  导出
                </span>
              </div>
              <AnalysisBarChart
                itemName={this.getProvinceItemName()}
                dataArr={siteProvinceArr}
                needDataZone={true}
                className="province-echart"
              />
            </div>
          </div>
        </div>
        <div className="site-list-content">
          <span className="list-title">站点列表</span>
          <div className="list-header clearfix">
            <span>站点类型：</span>
            <Select
              onChange={this.onSelectChange('siteSelectValue')}
              value={siteSelectValue}
            >
              {siteTypeOptions}
            </Select>
            <span>传输业务级别：</span>
            <Select
              onChange={this.onSelectChange('transferSelectValue')}
              value={transferSelectValue}
            >
              {serviceLevelOptions}
            </Select>
            <span>状态：</span>
            <Select
              onChange={this.onSelectChange('siteStatusSelectValue')}
              value={siteStatusSelectValue}
            >
              {siteStatusOptions}
            </Select>
            <div className="list-btn">
              <Button type="primary" onClick={() => this.getSiteList(1)}>
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
            <span onClick={this.downloadTable} className="download-excel">
              <Icon type="download" style={{ fontSize: '18px' }} />
              导出
            </span>
          </div>
          <Table
            columns={siteColumns}
            dataSource={siteList}
            rowKey={record => record.id}
            onChange={this.onTableChange}
            pagination={false}
          />
          <TablePagination
            pageNumber={pageNum}
            pageSize={pageSize}
            total={totalCount}
            preventDefaultLoad={true}
            hideTotal={true}
            handlePageChange={this.getSiteList}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  dict: state.dict
});

export default connect(mapStateToProps)(SourceSite);
