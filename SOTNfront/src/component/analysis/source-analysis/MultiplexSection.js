import React from 'react';
import { Button, Icon, Table, Input } from 'antd';

import _ from 'lodash';
import moment from 'moment';

import TimeAndRegionFilter from './component/TimeAndRegionFilter';
import RegionSelect from '../../pub/select/RegionSelect';
import TablePagination from '../../pub/TablePagination';
import AnalysisBarChart from '../../pub/chart/AnalysisBarChart';
import FuUsage from './component/FuyongUsage';

import { multiplexPerformanceMap } from '../../business-manage/components/constant';
import { postAxios, postAxiosBodyAndQuery } from '../../../axios/mainAxios';

import {
  formatNumber,
  objectEchartsArray,
  camel2Constant
} from '../../../util/CommonUtils';
import {
  removeHms,
  multiplexSectionColumns,
  SortEnum,
  sortMap
} from '../../../util/AnalysisUtils';

import './stylesheets/multiplexSection.scss';

export default class SourceMS extends React.Component {
  state = {
    // 全局过滤条件
    date: moment(),
    province: '',

    // 统计信息
    performanceIdx: 0,
    // num, distance, hop_num
    performance: {},
    // 分省统计
    provinceArr: [],
    // 复用段利用率最低TOP10
    top10Arr: [],

    // 复用段table筛选条件
    aProvince: '',
    zProvince: '',
    aName: '',
    zName: '',

    // 表格排序字段
    tableSorter: {},

    pageNum: 1,
    pageSize: 10,
    totalCount: 0,
    multiplexList: []
  };

  componentDidMount() {
    this.getAllData();
  }

  componentDidUpdate(prevProps, prevState) {
    const { activeKey } = this.props;
    if (activeKey !== prevProps.activeKey && activeKey === 'multiplexSection') {
      this.getAllData();
    }

    const { performanceIdx: idx, tableSorter } = this.state;
    if (idx !== prevState.performanceIdx) {
      this.getProvinceAndTop10();
    }
    if (!_.isEqual(tableSorter, prevState.tableSorter)) {
      this.getMultiplexList();
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
      tableSorter: { order, field }
    } = this.state;
    filter.aProvince = aProvince;
    filter.zProvince = zProvince;
    filter.aElementNameLike = aName;
    filter.zElementNameLike = zName;
    if (field) {
      filter.orderBy = [
        { direction: sortMap[order], field: camel2Constant(field) }
      ];
    }
    return filter;
  };

  getProvinceItemName = () => {
    const { performanceIdx: idx } = this.state;
    const key = Object.keys(multiplexPerformanceMap)[idx];
    return multiplexPerformanceMap[key].name;
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
    this.getMultiplexList(1);
  };

  getProvinceAndTop10 = () => {
    this.getProvince();
    this.getTop10();
  };

  urlMapArr = [
    'api/network/oms/stats/num/location',
    'api/network/oms/stats/distance/location',
    'api/network/oms/stats/hop_num/location'
  ];

  getPerformance = () => {
    postAxios(
      'api/network/oms/stats/current',
      this.getFilterParams(),
      ({ values = {} }) => this.setState({ performance: values })
    );
  };

  // 分省统计
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
      // 按照利用率升序排列，取前十条
      orderBy: [
        {
          direction: SortEnum.ASC,
          field: camel2Constant('bandwidthUsageRatio')
        }
      ]
    };
    postAxiosBodyAndQuery(
      'api/network/oms',
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
      zName: ''
    });
  };

  onTableChange = (pagination, filters, sorter) => {
    this.setState({ tableSorter: sorter });
  };

  getMultiplexList = (
    pageNum = this.state.pageNum,
    pageSize = this.state.pageSize
  ) => {
    postAxiosBodyAndQuery(
      'api/network/oms',
      this.getTableFilterParams(),
      { currentPage: pageNum - 1, pageSize: pageSize },
      ({ results = [], totalElements }) => {
        this.setState({
          multiplexList: results,
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

      multiplexList
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
            {Object.keys(multiplexPerformanceMap).map((pkey, idx) => {
              let item = multiplexPerformanceMap[pkey];
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
          <div
            style={{ height: '18.75rem' }}
            className="province-situation clearfix"
          >
            <div className="chart-export clearfix">
              <span>复用段利用率最低TOP10</span>
              <span
                onClick={this.downloadRecordExcel}
                className="download-excel"
              >
                <Icon type="download" style={{ fontSize: '18px' }} />
                导出
              </span>
            </div>
            <FuUsage
              title="[利用率最低1~5]"
              usageData={top10Arr.slice(0, 5)}
              className="first-rate"
            />
            <FuUsage
              title="[利用率最低6~10]"
              usageData={top10Arr.slice(5)}
              className="second-rate"
            />
          </div>
          <div className="fuYong-list-content">
            <span className="list-title">复用段列表</span>
            <div className="list-header clearfix">
              <span className="header-text">A端所属省：</span>
              <RegionSelect
                onChange={this.onSelectChange('aProvince')}
                value={aProvince}
              />
              <span className="header-text">Z端所属省：</span>
              <RegionSelect
                onChange={this.onSelectChange('zProvince')}
                value={zProvince}
              />
              <span className="header-text">A端网元：</span>
              <Input
                placeholder="支持模糊搜索"
                onChange={this.onInputChange('aName')}
                value={aName}
              />
              <span className="header-text">Z端网元：</span>
              <Input
                placeholder="支持模糊搜索"
                onChange={this.onInputChange('zName')}
                value={zName}
              />
              <div className="list-btn">
                <Button type="primary" onClick={() => this.getMultiplexList(1)}>
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
                <span className="record-number">
                  {formatNumber(this.state.totalCount)}
                </span>
                条记录
              </span>
              <span onClick={this.downloadListTable} className="download-excel">
                <Icon type="download" style={{ fontSize: '18px' }} />
                导出
              </span>
            </div>
            <Table
              columns={multiplexSectionColumns}
              dataSource={multiplexList}
              onChange={this.onTableChange}
              scroll={{ x: '106rem' }}
              rowKey={record => record.id}
              pagination={false}
            />
            <TablePagination
              pageNumber={this.state.pageNum}
              pageSize={this.state.pageSize}
              total={this.state.totalCount}
              preventDefaultLoad={true}
              handlePageChange={this.getMultiplexList}
            />
          </div>
        </div>
      </div>
    );
  }
}
