import React from 'react';
import { Button, Icon, Table, Input } from 'antd';

import _ from 'lodash';
import moment from 'moment';

import TimeAndRegionFilter from './component/TimeAndRegionFilter';
import AnalysisBarChart from '../../pub/AnalysisBarChart';
import RegionSelect from '../../pub/RegionSelect';
import TablePagination from '../../pub/TablePagination';

import { lightPerformanceMap } from '../../business-manage/components/constant';
import { postAxios, postAxiosBodyAndQuery } from '../../../axios/mainAxios';

import {
  formatNumber,
  objectEchartsArray,
  camel2Constant
} from '../../../util/CommonUtils';
import {
  lightSectionColumns,
  removeHms,
  sortMap,
  SortEnum
} from '../../../util/AnalysisUtils';

import './stylesheets/multiplexSection.scss';

export default class SourceLS extends React.Component {
  state = {
    // 全局过滤条件
    date: moment(),
    province: '',

    // 统计信息
    performanceIdx: 0,
    // num, distance, attenuation
    performance: {},
    // 分省统计
    provinceArr: [],
    // 复用段利用率最低TOP10
    top10Arr: [],

    aProvinceValue: '',
    zProvinceValue: '',
    aName: '',
    zName: '',
    omsName: '',

    // 表格排序字段
    tableSorter: {},

    pageNum: 1,
    pageSize: 10,
    totalPage: 0,
    lightList: []
  };

  componentDidMount() {
    this.getAllData();
  }

  componentDidUpdate(prevProps, prevState) {
    const { activeKey } = this.props;
    if (activeKey !== prevProps.activeKey && activeKey === 'lightSection') {
      this.getAllData();
    }

    const { performanceIdx: idx, tableSorter } = this.state;
    if (idx !== prevState.performanceIdx) {
      this.getProvinceAndTop10();
    }
    if (!_.isEqual(tableSorter, prevState.tableSorter)) {
      this.getLightList();
    }
  }

  getFilterParams = () => {
    const { date, province } = this.state;
    return {
      province: province || null,
      timeRange: {
        until: removeHms(date).valueOf()
      }
    };
  };

  getTableFilterParams = () => {
    const filter = this.getFilterParams();
    let {
      aProvince,
      zProvince,
      aName,
      zName,
      omsName,
      tableSorter: { order, field }
    } = this.state;
    filter.aProvince = aProvince;
    filter.zProvince = zProvince;
    filter.aElementNameLike = aName;
    filter.zElementNameLike = zName;
    filter.omsNameLike = omsName;
    if (field) {
      filter.orderBy = [
        { direction: sortMap[order], field: camel2Constant(field) }
      ];
    }
    return filter;
  };

  getProvinceItemName = () => {
    const { performanceIdx: idx } = this.state;
    const key = Object.keys(lightPerformanceMap)[idx];
    return lightPerformanceMap[key].name;
  };

  onDateChange = (date, dateString) => this.setState({ date: date });

  onTimeAndRegionFilterReset = () =>
    this.setState({ date: moment(), province: '' });

  onSelectChange = name => value => this.setState({ [name]: value });

  onInputChange = name => e => this.setState({ [name]: e.target.value });

  onPerformanceClick = idx => e => this.setState({ performanceIdx: idx });

  getAllData = () => {
    this.getPerformance();
    this.getProvinceAndTop10();
    this.getLightList(1);
  };

  getProvinceAndTop10 = () => {
    this.getProvince();
    this.getTop10();
  };

  urlMapArr = [
    'api/network/ots/stats/num/location',
    'api/network/ots/stats/distance/location',
    'api/network/ots/stats/attenuation/location'
  ];

  getPerformance = () => {
    postAxios(
      'api/network/ots/stats/current',
      this.getFilterParams(),
      ({ values = {} }) => this.setState({ performance: values })
    );
  };

  getProvince = () => {
    postAxios(
      this.urlMapArr[this.state.performanceIdx],
      this.getFilterParams(),
      data => this.setState({ provinceArr: objectEchartsArray(data.values) })
    );
  };

  getTop10 = () => {
    const params = {
      ...this.getFilterParams(),
      // 按照衰耗率降序排列，取前十条 TODO:接口未找到衰耗率字段，已提jira
      orderBy: [{ direction: SortEnum.DESC, field: camel2Constant('distance') }]
    };
    postAxiosBodyAndQuery(
      'api/network/ots',
      params,
      { currentPage: 0, pageSize: 10 },
      ({ results = [] }) => this.setState({ top10Arr: results })
    );
  };

  onTableFilterReset = () => {
    this.setState({
      aProvince: '',
      zProvince: '',
      aName: '',
      zName: '',
      omsName: ''
    });
  };

  onTableChange = (pagination, filters, sorter) => {
    this.setState({ tableSorter: sorter });
  };

  getLightList = (
    pageNum = this.state.pageNum,
    pageSize = this.state.pageSize
  ) => {
    postAxiosBodyAndQuery(
      'api/network/ots',
      this.getTableFilterParams(),
      { currentPage: pageNum - 1, pageSize: pageSize },
      ({ results = [], totalElements }) => {
        this.setState({
          lightList: results,
          totalCount: totalElements,
          pageNum,
          pageSize
        });
      }
    );
  };

  render() {
    const {
      date,
      province,

      performanceIdx,
      performance,
      provinceArr,
      top10Arr,

      aProvince,
      zProvince,
      aName,
      zName,
      omsName,

      lightList
    } = this.state;

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
        <div className="fuYong-content clearfix">
          <span className="fuYong-span">统计信息</span>
          <div className="clearfix">
            {Object.keys(lightPerformanceMap).map((pkey, idx) => {
              let item = lightPerformanceMap[pkey];
              return (
                <Button
                  className={`fu-yong ${
                    performanceIdx === idx ? 'active' : ''
                  }`}
                  onClick={this.onPerformanceClick(idx)}
                  key={idx}
                >
                  <span>{`${item.name || '--'}(${item.unit})`}</span>
                  <span>{formatNumber(performance[pkey]) || 0}</span>
                </Button>
              );
            })}
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
              className="province-echart"
              itemName={this.getProvinceItemName()}
              dataArr={provinceArr}
              needDataZone={false}
            />
          </div>
          <div className="province-situation">
            <div className="chart-export clearfix">
              <span>光放段衰耗最高TOP10</span>
              <span
                onClick={this.downloadRecordExcel}
                className="download-excel"
              >
                <Icon type="download" style={{ fontSize: '18px' }} />
                导出
              </span>
            </div>
            <AnalysisBarChart
              className="province-echart"
              itemName="光放段衰耗"
              dataArr={top10Arr}
              needDataZone={false}
              showProvince={true}
            />
          </div>
          <div className="fuYong-list-content">
            <span className="list-title">光放段列表</span>
            <div className="table-header clearfix">
              <div className="filter-wrap table-filter">
                <span className="filter-item">
                  <span className="label">A端所属省：</span>
                  <RegionSelect
                    onChange={this.onSelectChange('aProvince')}
                    value={aProvince}
                  />
                </span>
                <span className="filter-item">
                  <span className="label">A端网元：</span>
                  <Input
                    placeholder="支持模糊搜索"
                    onChange={this.onInputChange('aName')}
                    value={aName}
                  />
                </span>
                <span className="filter-item">
                  <span className="label">Z端网元：</span>
                  <Input
                    placeholder="支持模糊搜索"
                    onChange={this.onInputChange('zName')}
                    value={zName}
                  />
                </span>
                <div className="new-line">
                  <span className="filter-item">
                    <span className="label">Z端所属省：</span>
                    <RegionSelect
                      onChange={this.onSelectChange('zProvince')}
                      value={zProvince}
                    />
                  </span>
                  <span className="filter-item">
                    <span className="label">所属复用段：</span>
                    <Input
                      placeholder="支持模糊搜索"
                      onChange={this.onInputChange('omsName')}
                      value={omsName}
                    />
                  </span>
                </div>
                <span className="right-btn">
                  <Button type="primary" onClick={() => this.getLightList(1)}>
                    筛选
                  </Button>
                  <Button onClick={this.onTableFilterReset}>重置</Button>
                </span>
              </div>
            </div>
            <div className="table-download clearfix">
              <span className="record-text">
                共
                <span className="record-number">
                  {formatNumber(this.state.totalPage)}
                </span>
                条记录
              </span>
              <span onClick={this.downloadListTable} className="download-excel">
                <Icon type="download" style={{ fontSize: '18px' }} />
                导出
              </span>
            </div>
            <Table
              columns={lightSectionColumns}
              dataSource={lightList}
              onChange={this.onTableChange}
              rowKey={record => record.id}
              pagination={false}
            />
            <TablePagination
              pageNumber={this.state.pageNum}
              pageSize={this.state.pageSize}
              total={this.state.totalPage}
              preventDefaultLoad={true}
              handlePageChange={this.getLightList}
            />
          </div>
        </div>
      </div>
    );
  }
}
