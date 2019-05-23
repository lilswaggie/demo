import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Input, Table, AutoComplete, Icon } from 'antd';

import moment from 'moment';

import Iframe from './Iframe';
import TablePagination from '../component/pub/TablePagination';
import ChartExample from '../component/pub/ChartExample';

import { getAxios } from '../axios/mainAxios';

import { processIframeMethod } from '../util/IframeUtils';
import { gotoPathWithState } from '../util/ReduxUtil';
import { formatNumber, baseStaticUrl, msToHour } from '../util/CommonUtils';

import '../assets/css/busifault/busifault.scss';

// 告警级别中文对应名称
const alarmCh = [
  {
    name: '一级告警',
    color: '#FF6464'
  },
  {
    name: '二级告警',
    color: '#FFEC6F'
  },
  {
    name: '三级告警',
    color: '#FFA85A'
  },
  {
    name: '四级告警',
    color: '#8BBCFE'
  }
];
class BusinessFault extends Component {
  state = {
    lineTimeWeek: 0,
    lineTimeMonth: 0,
    lineUseWeek: 0,
    lineUseMonth: 0,
    faultLine: 0,
    alarmLevel: {},
    alarmSum: 0,
    lineList: [],
    tableData: [],
    pageNo: 1,
    pageSize: 10,
    total: 0,
    nameLike: '',
    linePageNo: 1,
    linePageSize: 8,
    lineTotal: 0,
    selectedLineIndex: null
  };

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.business.type !== this.props.business.type) {
      this.getData();
    }
  };

  getData = () => {
    this.getFistData(this.props.business.type);
    this.getListData(
      this.props.business.type,
      this.state.linePageNo - 1,
      this.state.linePageSize,
      this.state.nameLike
    );
    this.getTableData(
      this.state.pageNo - 1,
      this.state.pageSize,
      this.props.business.type
    );
  };

  // 请求平均专线中断时长和专线可用率,故障专线，一级告警数和告警数量的展示数据
  getFistData = businessType => {
    // 平均专线中断时长(周)
    getAxios(
      'api/leased_lines/stats/interrupted/time_seg',
      { businessType, timeSeg: 'WEEK' },
      data => {
        this.setState({
          lineTimeWeek: msToHour(data)
        });
      }
    );
    // 平均专线中断时长(月)
    getAxios(
      'api/leased_lines/stats/interrupted/time_seg',
      { businessType, timeSeg: 'MONTH' },
      data => {
        this.setState({
          lineTimeMonth: msToHour(data)
        });
      }
    );
    // 专线可用率(周)
    getAxios(
      'api/leased_lines/stats/usable/time_seg',
      { businessType, timeSeg: 'WEEK' },
      data => {
        this.setState({
          lineUseWeek: data
        });
      }
    );
    // 专线可用率(月)
    getAxios(
      'api/leased_lines/stats/usable/time_seg',
      { businessType, timeSeg: 'MONTH' },
      data => {
        this.setState({
          lineUseMonth: data
        });
      }
    );
    // 故障专线数量的统计
    getAxios('api/leased_lines/stats/num/fault', { businessType }, data => {
      this.setState({
        faultLine: data.fault
      });
    });
    // 查询告警信息的按告警级别（1, 2, 3, 4）统计结果，同时查询告警总数。查询实时的统计结果
    getAxios('api/alarms/stats/num/severity', { businessType }, data => {
      this.setState({
        alarmSum: data.summary,
        alarmLevel: data.values
      });
    });
  };
  // 请求右侧专线列表
  getListData = (businessType, currentPage, pageSize, nameLike) => {
    getAxios(
      'api/leased_lines',
      {
        businessType,
        currentPage,
        pageSize,
        nameLike,
        faultOnly: true,
        alarmOnly: true
      },
      data => {
        this.setState({
          lineList: data.results,
          lineTotal: data.totalElements
        });
      }
    );
  };
  // 请求下侧告警表格
  getTableData = (currentPage, pageSize, businessType) => {
    getAxios(
      'api/alarms/business',
      { currentPage, pageSize, businessType },
      data => {
        const arr = [];
        data.results.map((item, index) => {
          item.id = index;
          arr.push(item);
          return arr;
        });
        this.setState({
          total: data.totalElements,
          tableData: arr
        });
      }
    );
  };

  // 分页器改变时触发（活动告警表）
  onPageChange = (pageNo, pageSize) => {
    this.setState({ pageNo, pageSize }, () => {
      this.getTableData(
        this.state.pageNo - 1,
        this.state.pageSize,
        this.props.business.type
      );
    });
  };

  // 分页器改变时触发（故障专线列表）
  onLinePageChange = (linePageNo, linePageSize) => {
    this.setState({ linePageNo, linePageSize }, () => {
      this.getListData(
        this.props.business.type,
        this.state.linePageNo - 1,
        this.state.linePageSize,
        this.state.nameLike
      );
    });
  };

  // 搜索专线名称后触发
  handleSearch = value => {
    this.setState(
      {
        nameLike: value,
        linePageNo: 1,
        linePageSize: 8
      },
      () => {
        this.getListData(
          this.props.business.type,
          this.state.linePageNo - 1,
          this.state.linePageSize,
          this.state.nameLike
        );
      }
    );
  };

  businessFaultIframeName = 'iframe-business-fault-world';

  clearSelectedLine = () => {
    this.setState({ selectedLineIndex: null });
  };

  getLineRowClass = (record, index) => {
    return index === this.state.selectedLineIndex ? 'line-selected' : '';
  };

  onLineRow = (record, selectedLineIndex) => ({
    onClick: () => {
      this.setState({ selectedLineIndex });
      processIframeMethod('renderLine', this.businessFaultIframeName)(record);
    }
  });

  gotoLineDetail = (record, from) => e => {
    e.stopPropagation();
    // e.nativeEvent.stopImmediatePropagation();
    gotoPathWithState('/main/fault/business/line-detail', { record, from });
  };

  render() {
    const {
      lineList,
      tableData,
      lineTimeWeek,
      lineTimeMonth,
      lineUseWeek,
      lineUseMonth,
      faultLine,
      alarmLevel,
      alarmSum,
      total,
      pageNo,
      pageSize,
      linePageNo,
      linePageSize,
      lineTotal
    } = this.state;
    const time = moment().format('HH:mm');
    // 取专线名称的数组用于输入联想
    const lineName = [];
    if (lineList.length !== 0) {
      lineList.forEach(item => {
        lineName.push(item.name);
      });
    }
    // 表格列
    const columns = [
      {
        title: '告警级别',
        render: (text, record) => (
          <div
            className="alarm"
            style={{ backgroundColor: `${alarmCh[record.severity - 1].color}` }}
          >
            {alarmCh[record.severity - 1].name}
          </div>
        ),
        width: '15%',
        align: 'center',
        key: 1
      },
      {
        title: '专线名称',
        dataIndex: 'leasedLine',
        align: 'left',
        width: '25%',
        className: 'control-line',
        key: 2
      },
      {
        title: '客户名称',
        dataIndex: 'customerName',
        align: 'left',
        width: '15%',
        className: 'control-line',
        key: 3
      },
      {
        title: '告警标题',
        dataIndex: 'title',
        align: 'left',
        width: '15%',
        className: 'control-line',
        key: 4
      },
      {
        title: '告警发生时间',
        render: (text, record) => (
          <div>
            {moment(parseInt(record.alarmedAt)).format('YYYY-MM-DD hh:mm:ss')}
          </div>
        ),
        align: 'left',
        width: '20%',
        className: 'control-line',
        key: 5
      }
    ];
    // 专线列表
    const columsLine = [
      {
        title: '专线名称',
        render: (text, record, index) => {
          return (
            <div className="line" title={record.name}>
              <span
                className="key"
                style={{ backgroundColor: index > 2 ? '#BFCFD7' : '#F65F7B' }}
              >
                {index + 1}
              </span>
              <span>
                [
                {record.securityLevel === 'common'
                  ? '普通'
                  : record.securityLevel}
                ]{record.name}
              </span>
            </div>
          );
        },
        width: '50%',
        align: 'left',
        key: 1
      },
      {
        title: '一级告警',
        render: (text, record) => (
          <div className="alarm">{record.firstLevelAlarmNum}</div>
        ),
        width: '25%',
        align: 'left',
        key: 2
      },
      {
        title: '操作',
        render: (text, record) => (
          <div className="detail">
            <span onClick={this.gotoLineDetail(record, 'business')}>详情</span>
          </div>
        ),
        width: '25%',
        align: 'left',
        key: 3
      }
    ];
    return (
      <div className="busifault">
        <div className="title">
          <div className="item1">业务故障</div>
        </div>
        <div className="content">
          <div className="block1">
            <div className="left">
              <span>平均专线中断时长</span>
              <span>上一周：</span>
              <span>{lineTimeWeek}h</span>
              <span>上个月：</span>
              <span>{lineTimeMonth}h</span>
            </div>
            <div className="left">
              <span>专线可用率</span>
              <span>上一周：</span>
              <span>{lineUseWeek}%</span>
              <span>上个月：</span>
              <span>{lineUseMonth}%</span>
            </div>
          </div>
          <div className="block2">
            <div className="left1">
              <div
                style={{
                  overflow: 'hidden',
                  position: 'absolute',
                  left: '1.56rem',
                  top: '1.4rem'
                }}
              >
                <div className="showdata">
                  <p>故障专线</p>
                  <p>{faultLine}</p>
                </div>
                <div className="showdata">
                  <p>一级告警数量</p>
                  <p style={{ color: '#F35B5B' }}>
                    {formatNumber(alarmLevel['1'])}
                  </p>
                </div>
                <div className="showdata">
                  <p>告警总数</p>
                  <p>{formatNumber(alarmSum)}</p>
                </div>
              </div>
              <div style={{ height: '100%' }}>
                <Iframe
                  name={this.businessFaultIframeName}
                  url={`${baseStaticUrl}gis/gis3/businessFault/${
                    this.props.business.type === 1 ? 'world' : 'china'
                  }.html`}
                  events={{ clearSelectedLine: this.clearSelectedLine }}
                />
              </div>
              <ChartExample />
            </div>
            <div className="right1">
              <div className="line1">
                <span>故障专线列表</span>
                <span style={{ float: 'right' }}>{time}</span>
                <AutoComplete
                  style={{ width: '100%', marginTop: '0.625rem' }}
                  dataSource={lineName}
                  onChange={this.handleSearch}
                  placeholder="按专线名称搜索"
                  filterOption={(inputValue, option) =>
                    option.props.children
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                >
                  <Input
                    suffix={
                      <Icon type="search" className="certain-category-icon" />
                    }
                  />
                </AutoComplete>
              </div>
              <Table
                columns={columsLine}
                dataSource={lineList}
                className="line-list"
                rowKey={record => record.id}
                rowClassName={this.getLineRowClass}
                onRow={this.onLineRow}
                pagination={false}
              />
              <TablePagination
                {...{
                  className: 'lineTable',
                  total: lineTotal,
                  pageSize: linePageSize,
                  pageNumber: linePageNo,
                  handlePageChange: this.onLinePageChange,
                  preventDefaultLoad: true
                }}
              />
            </div>
          </div>
          <div className="block3">
            <div className="tableChoose">
              <div className="line1">
                <p>活动告警</p>
                <div className="circle">
                  <div className="item">
                    <div className="comm">
                      <div className="top" />
                      <div className="right" />
                      <div className="bottom" />
                      <div className="left" />
                    </div>
                    <span>{formatNumber(alarmSum)}</span>
                  </div>
                  {[
                    { key: '1', color: '#FF6464' },
                    { key: '2', color: '#FFA85A' },
                    { key: '3', color: '#FFEC6F' },
                    { key: '4', color: '#8BBCFE' }
                  ].map((item, idx) => (
                    <div className="item" key={idx}>
                      <div
                        style={{ backgroundColor: `${item.color}` }}
                        className="comm"
                      />
                      <span>{formatNumber(alarmLevel[item.key])}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Table
                columns={columns}
                dataSource={tableData}
                className="busifault-table"
                rowKey={record => record.id}
                pagination={false}
              />
              <TablePagination
                {...{
                  total: total,
                  pageSize: pageSize,
                  pageNumber: pageNo,
                  handlePageChange: this.onPageChange,
                  preventDefaultLoad: true
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  business: state.business
});

export default connect(mapStateToProps)(BusinessFault);
