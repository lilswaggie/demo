import React, { Component } from 'react';

import { Tabs, Icon, Button, Select, Table } from 'antd';

import moment from 'moment';

import DateSelect from '../../pub/select/DateSelect';
import RegionSelect from '../../pub/select/RegionSelect';
import AnalysisBarChart from '../../pub/chart/AnalysisBarChart';
import TablePagination from '../../pub/TablePagination';

import { ProvinceChartData, Top10FaultData } from '../../../util/DataUtils';
import { formatNumber, splitArr } from '../../../util/CommonUtils';

const countArr = [
  { name: '2.5G', value: 1000 },
  { name: '2M', value: 2094 },
  { name: '45M', value: 12000 },
  { name: '10G', value: 8023 },
  { name: '45M', value: 12204 },
  { name: '10G', value: 45906 },
  { name: 'FG', value: 254 },
  { name: 'GE', value: 500 },
  { name: '34M', value: 400 },
  { name: '155M', value: 0 },
  { name: '34M', value: 0 },
  { name: '155M', value: 0 }
];

export default class DeviceFault extends Component {
  state = {
    // 0：光功率不合格，1：误码率不合格
    activeTab: 0,

    startDate: [moment().day(-30), moment().day(-30)],
    endDate: [moment(), moment()],
    region: ['', ''],

    // table
    pageSize: 10,
    pageNum: 1,
    wyTableData: [],
    totalCount: 0
  };

  onActiveTabChange = activeTab => this.setState({ activeTab: activeTab - 0 });

  handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter);
  };

  handlePageChange = (
    pageNum = this.state.pageNum,
    pageSize = this.state.pageSize
  ) => {};

  render() {
    const TabPane = Tabs.TabPane;

    const tableColumn = [
      {
        key: '1',
        title: '时间',
        dataIndex: 'time',
        width: '10rem',
        sorter: true,
        fixed: 'left'
      },
      {
        key: '2',
        title: '省份',
        dataIndex: 'province',
        width: '5rem'
      },
      {
        key: '3',
        title: '专线ID',
        dataIndex: 'lineId',
        width: '10.625rem'
      },
      {
        key: '4',
        title: '客户名称',
        dataIndex: 'customerName',
        width: '10.25rem'
      },
      {
        key: '5',
        title: '业务标识',
        dataIndex: 'faultCount',
        width: '10rem'
      },
      {
        key: '6',
        title: '电路名称',
        dataIndex: 'routerName',
        width: '10rem'
      },
      {
        key: '7',
        title: 'A端',
        width: '36.875rem',
        children: [
          {
            key: '71',
            title: '传输网元名称',
            dataIndex: 'aName',
            width: '8.75rem'
          },
          {
            key: '72',
            title: '端口名称',
            dataIndex: 'aPort',
            width: '8.75rem'
          },
          {
            key: '73',
            title: '输入光功率(dBm)',
            dataIndex: 'aw',
            width: '8.125rem',
            sort: true
          }
        ]
      },
      {
        key: '8',
        title: 'Z端',
        width: '36.875rem',
        children: [
          {
            key: '81',
            title: '传输网元名称',
            dataIndex: 'zName',
            width: '8.75rem'
          },
          {
            key: '82',
            title: '端口名称',
            dataIndex: 'zPort',
            width: '8.75rem'
          },
          {
            key: '83',
            title: '输入光功率(dBm)',
            dataIndex: 'zw',
            width: '8.125rem',
            sort: true
          }
        ]
      }
    ];

    const tabArr = [
      {
        name: '光功率',
        // 需要根据筛选条件合成
        provinceChartName: '物理端口光功率不合格次数',
        tableData: []
      },
      {
        name: '误码率',
        provinceChartName: '物理端口误码率不合格次数',
        tableData: []
      }
    ];

    const { activeTab: tab } = this.state;
    const tabObj = tabArr[tab];
    const name = tabObj.name;

    return (
      <div
        className="analysis-body"
        style={{ display: this.props.type === 2 ? '' : 'none' }}
      >
        <Tabs activeKey={tab + ''} onChange={this.onActiveTabChange}>
          <TabPane tab="光功率不合格" key={'0'} />
          <TabPane tab="误码率不合格" key={'1'} />
        </Tabs>
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
              startDate={this.state.startDate[tab]}
              endDate={this.state.endDate[tab]}
              // onStartChange={this.onDateChange('startDate')}
              // onEndChange={this.onDateChange('endDate')}
            />
          </span>
          <span className="filter-item">
            <span className="label">区域：</span>
            <RegionSelect
              value={this.state.region[tab]}
              // onChange={this.onRegionChange}
            />
          </span>
          <span className="right-btn">
            <Button type="primary">查询</Button>
            <Button>重置</Button>
          </span>
        </div>
        <section>
          <p className="title">统计信息</p>
          <div className="statistic-info">
            <span className="left-item">
              <p className="info-name">端口{name}不合格次数</p>
              <p className="info-value">{formatNumber(21890)}</p>
            </span>
            <span className="right-items">
              <p className="info-name info-title">不同速率端口不合格次数</p>
              {splitArr(countArr, 6).map((a, i) => (
                <div key={i}>
                  {a.map((item, idx) => (
                    <span key={idx} className="right-item port">
                      {item.name}：
                      <span className="info-value port">
                        {formatNumber(item.value)}
                      </span>
                    </span>
                  ))}
                </div>
              ))}
            </span>
          </div>
          <div className="province-info">
            <div className="echart-wrap">
              <p className="echart-title">
                <span className="text">分省情况</span>
                <span className="export">
                  <Icon type="download" />
                  导出
                </span>
              </p>
              <AnalysisBarChart
                className="province-echart"
                itemName={tabObj.provinceChartName}
                dataArr={ProvinceChartData}
                needDataZone={false}
              />
            </div>
            <div className="echart-wrap">
              <p className="echart-title">
                <span className="text">{name}不合格次数TOP10端口</span>
                <span className="export">
                  <Icon type="download" />
                  导出
                </span>
              </p>
              <AnalysisBarChart
                className="province-echart"
                itemName="故障次数"
                dataArr={Top10FaultData}
                needDataZone={false}
                showProvince={true}
              />
            </div>
          </div>

          <p className="title table-title">{name}不合格端口列表</p>
          <div className="filter-wrap table-filter">
            <span className="filter-item">
              <span className="label">端口类型：</span>
              <Select />
            </span>
            <span className="filter-item">
              <span className="label">光电属性：</span>
              <Select />
            </span>
            <span className="right-btn">
              <Button type="primary">筛选</Button>
              <Button>重置</Button>
            </span>
          </div>
          <p className="echart-title">
            <span className="text">
              共<span className="num">{formatNumber(32890)}</span>条记录
            </span>
            <span className="export">
              <Icon type="download" />
              导出
            </span>
          </p>
          <Table
            className="fixed-subtitle-table"
            bordered={true}
            columns={tableColumn}
            dataSource={tabObj.tableData}
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
        </section>
      </div>
    );
  }
}
