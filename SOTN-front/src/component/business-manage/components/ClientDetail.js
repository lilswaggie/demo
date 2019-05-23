import React from 'react';
import { Link } from 'react-router-dom';
import { Progress, Select, Table, message, Spin } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import TablePagination from '../../pub/TablePagination';
import Iframe from '../../../container/Iframe';
import ChartExampleHomeChina from '../../pub/ChartExampleHomeChina';
import AlarmList from './AlarmList';
import ActivityAlarm from './ActivityAlarm';
import FunctionIndex from './FunctionIndex';
import Linechart from '../card/LineEchart.js';
import NameLike from '../../cutover-overview/components/SearchInput';
import {
  obj2Arr,
  objectMomentLine,
  baseStaticUrl
} from '../../../util/CommonUtils';
import { functionIdx } from './constant';
import { getAxios, postMockAxios } from '../../../axios/mainAxios';
import { gotoPathWithState, gotoPath } from '../../../util/ReduxUtil';
import { processIframeMethod } from '../../../util/IframeUtils';
import './client-detail.scss';

class ClientDetail extends React.Component {
  constructor(props) {
    super(props);
    const { state } = this.props.location;
    const { clientInfo, businessType } = state;
    const disabled = businessType !== 0 ? true : false;
    this.state = {
      businessType: businessType || 0,
      selectDisabled: disabled,
      // businessType: '0',
      customerName: clientInfo.id || '',
      lineID: clientInfo.id || null,
      lineList: [],
      faultLine: {
        falut: 0,
        total: 0
      },
      activityAlarm: {
        summary: 0,
        alarm: {}
      },
      severityTime: '',
      sendAlready: {},
      cutNumber: {
        today: { total: 0, finished: 0, unfinished: 0 },
        tomorrow: { total: 0, finished: 0, unfinished: 0 },
        yestoday: { total: 0, finished: 0, unfinished: 0 }
      },
      alarmList: [],
      rateNameArr: [],
      lineData: [],
      rateIdx: 0,
      // rateActivedArr: ['active', '', '', ],
      rate: 'ser',
      rateText: '误码率(%)',
      isFetching: false,
      // 选中的专线索引
      selectedLineIndex: null,
      pageNo: 1,
      pageSize: 7,
      totalPage: 0
    };
  }
  static propTypes = {
    clientInfo: PropTypes.array,
    businessType: PropTypes.string
  };

  componentDidMount = () => {
    const { state } = this.props.location;
    if (!state || !state.clientInfo || !state.clientInfo.id) {
      gotoPath('/main/home');
    } else {
      this.getClientData();
      this.getCutNumber();
      this.pageChange();
    }
  };
  // rateNameArr = ['bitErrorRate', 'secondErrorRate', 'uplinkBroadbandRate', 'downlinkBroadbandRate'];
  selectRate = idx => () => {
    const { rateNameArr } = this.state;
    this.setState(
      {
        rateIdx: idx,
        rate: rateNameArr[idx].performance,
        rateText: functionIdx[rateNameArr[idx].performance].name
      },
      () => {
        const { businessType, customerName, rate } = this.state;
        // const type = Number(businessType);
        const url = `api/efficiency/stats/${rate}/timed`;
        if (businessType === 0) {
          this.getFunctionIndex(customerName, url);
        } else {
          this.getFunctionIndex(customerName, url);
        }
      }
    );
  };
  businessSelect = value => {
    this.setState({ businessType: value }, () => {
      this.pageChange(1);
    });
  };
  search = searchKey => {
    this.pageChange(1, this.state.pageSize, searchKey);
  };

  pageChange = (
    pageNo = this.state.pageNo,
    pageSize = this.state.pageSize,
    searchKey
  ) => {
    this.setState({ pageNo, pageSize }, () => {
      const { pageNo, pageSize, businessType, customerName } = this.state;
      if (businessType === 0) {
        this.getLineList(null, customerName, pageNo, pageSize, searchKey);
      } else {
        this.getLineList(
          businessType,
          customerName,
          pageNo,
          pageSize,
          searchKey
        );
      }
    });
  };
  // 专线列表
  getLineList = (businessType, customer, currentPage, pageSize, nameLike) => {
    getAxios(
      'api/leased_lines',
      {
        currentPage: currentPage - 1,
        pageSize,
        businessType,
        customer,
        nameLike
      },
      data => {
        this.setState({
          lineList: data.results,
          totalPage: data.totalElements
        });
      }
    );
  };
  // 故障专线数量(businessType：业务类型,customerName：客户名称,nameLike:专线名称 )
  getFaultLine = (businessType, customer) => {
    getAxios(
      'api/leased_lines/stats/num/fault',
      { businessType, customer },
      data => {
        this.setState({
          faultLine: {
            ...data
          }
        });
      }
    );
  };
  // 活动告警
  getAlarmActivity = (businessType, customer) => {
    // 查询告警信息的按告警级别
    getAxios(
      'api/alarms/stats/num/severity',
      { businessType, customer },
      data => {
        this.setState({
          activityAlarm: {
            summary: data.summary,
            alarm: data.values
          },
          severityTime: data.time.timeRange.until
        });
      }
    );
    // 已派单
    getAxios('api/alarms/stats/num/sheet_send_status', { customer }, data => {
      this.setState({
        sendAlready: {
          ...data.values
        }
      });
    });
  };
  // 告警列表
  getAlarmList = (businessType, customer) => {
    this.setState({ isFetching: true });
    getAxios(
      'api/alarms',
      { businessType, customer },
      data => {
        this.setState(
          {
            alarmList: data.results
          },
          () => {
            this.setState({ isFetching: false });
          }
        );
      },
      data => {
        this.setState({ isFetching: false });
        message.error(data.message);
      }
    );
  };
  // 四个性能指标
  getEchartLine = customer => {
    getAxios('api/efficiency/stats/current', { customer }, data => {
      this.setState({
        rateNameArr: obj2Arr(data.values)
      });
    });
  };
  // 性能指标echarts折线图（根据客户名称及性能指标查询）
  getFunctionIndex = (customer, url) => {
    getAxios(url, { customer }, data => {
      this.setState({
        lineData: objectMomentLine(data.values)
      });
    });
  };
  getClientData = () => {
    const { businessType, customerName } = this.state;
    // const type = Number(businessType);
    const url = 'api/efficiency/stats/ser/timed';
    // businessType = '0'为全部业务，请求数据时不传递该参数
    if (businessType === 0) {
      // this.getLineList(null, customerName);
      this.getFaultLine(null, customerName);
      this.getAlarmActivity(null, customerName);
      this.getAlarmList(null, customerName);
      this.getEchartLine(customerName);
      this.getFunctionIndex(customerName, url);
    } else {
      // this.getLineList(businessType, customerName);
      this.getFaultLine(businessType, customerName);
      this.getAlarmActivity(businessType, customerName);
      this.getAlarmList(businessType, customerName);
      this.getEchartLine(customerName);
      this.getFunctionIndex(customerName, url);
    }
  };
  // 统计昨天、今天、明天的信息
  getCutNumber = () => {
    postMockAxios(
      'api/cutover/stats/num/date',
      // {  },
      data => {
        this.setState({
          cutNumber: data.values
        });
      }
    );
  };

  worldIframeName = 'iframe-client-detail-world';

  clearSelectedLine = () => {
    this.setState({ selectedLineIndex: null });
  };

  getLineRowClass = (record, index) => {
    return index === this.state.selectedLineIndex ? 'line-selected' : '';
  };

  onLineRow = (record, selectedLineIndex) => ({
    onClick: () => {
      this.setState({ selectedLineIndex });
      processIframeMethod('renderTopoLink', this.worldIframeName)(record);
    }
  });

  gotoLineDetail = (lineInfo, businessType) => e => {
    e.stopPropagation();
    // e.nativeEvent.stopImmediatePropagation();
    gotoPathWithState('/main/business/line-detail', { lineInfo, businessType });
  };

  onIframeLoaded = () => {
    const { state } = this.props.location;
    if (state) {
      const { clientInfo } = state;
      if (clientInfo) {
        processIframeMethod('renderCustomerLines', this.worldIframeName)(
          clientInfo
        );
      }
    }
  };

  goBackLink = () => {
    let backToHome;
    const { state } = this.props.location;
    if (state) {
      const { gotoHome } = state;
      if (gotoHome) {
        backToHome = gotoHome;
      }
    }

    return !backToHome
      ? '/main/business'
      : {
        pathname: '/main/home',
        state: { tab: '3' }
      };
  };

  render() {
    const { Option } = Select;
    const {
      lineList,
      faultLine,
      activityAlarm,
      severityTime,
      sendAlready,
      alarmList,
      rateIdx,
      rateText,
      businessType,
      selectDisabled,
      rateNameArr,
      lineData,
      isFetching
    } = this.state;
    const formalLine = faultLine.total - faultLine.fault || 0;
    const problemLine = faultLine.fault || 0;
    const cutoverTime = moment(Number(severityTime)).format('HH:mm');
    const startTime = moment().valueOf();
    const cutoverToday = 0;
    const complished = 0;
    const uncomplished = 0;
    const canceled = 0;
    const complishedRate = 0;
    const uncomplishedRate = 0;
    // const cutoverToday = cutNumber.today.total || 0;
    // const complished = cutNumber.today.finished || 0;
    // const uncomplished = cutNumber.today.unfinished;
    // const canceled = cutoverToday - complished - uncomplished || 0;
    // const complishedRate = parseInt(((complished / cutoverToday) * 100).toFixed(2), 10) || 0;
    // const uncomplishedRate = parseInt((((complished + canceled) / cutoverToday) * 100).toFixed(2), 10) || 0;
    const color = ['#FFBB44'];
    const xData = lineData[0] || [];
    const indexData = lineData[1] || [];
    // 表格列
    const columns = [
      {
        title: '专线名称',
        render: (text, record) => (
          <div className="line-name">
            <span
              style={
                record.faultState
                  ? { backgroundColor: '#F65F7B' }
                  : { backgroundColor: '#5DB3FB' }
              }
            />
            <span title={record.name}>{record.name}</span>
          </div>
        ),
        dataIndex: 'name',
        align: 'left',
        width: '28%',
        key: 1
      },
      {
        title: 'A端',
        render: (text, record) => (
          <div className="record-name">
            <span title={record.aacsRoomEqName}>{record.aacsRoomEqName}</span>
          </div>
        ),
        dataIndex: 'aacsRoomEqName',
        align: 'left',
        width: '22%',
        key: 2
      },
      {
        title: 'Z端',
        render: (text, record) => (
          <div className="record-name">
            <span title={record.zacsRoomEqName}>{record.zacsRoomEqName}</span>
          </div>
        ),
        dataIndex: 'zacsRoomEqName',
        align: 'left',
        width: '20%',
        key: 3
      },
      {
        title: '速率',
        render: (text, record) => (
          <div className="my-name">
            <span title={record.businessBandwidth}>
              {record.businessBandwidth}
            </span>
          </div>
        ),
        dataIndex: 'businessBandwidth',
        align: 'left',
        width: '15%',
        key: 4
      },
      {
        title: '操作',
        render: (text, record) => (
          <div style={{ color: '#2C9CFA' }} className="detail-name">
            <span onClick={this.gotoLineDetail(record, businessType)}>
              详情
            </span>
          </div>
        ),
        align: 'left',
        width: '15%',
        key: 5
      }
    ];

    return (
      <div className="business-detail">
        <div className="detail-header">
          <div>
            <Link to={this.goBackLink()}>{'<'}返回</Link>
            <span>客户详情</span>
          </div>
        </div>
        <div className="detail-content clearfix">
          <div className="content-header">
            <div className="header-left">
              <Iframe
                name={this.worldIframeName}
                url={`${baseStaticUrl}gis/gis3/consumerLine/china.html`}
                events={{ clearSelectedLine: this.clearSelectedLine }}
                onLoaded={this.onIframeLoaded}
              />
              <ChartExampleHomeChina />
            </div>
            <div className="header-right clearfix">
              <div className="title clearfix">
                <span>专线列表</span>
                <div className="select-business">
                  <Select
                    value={businessType}
                    placeholder="请选择"
                    onChange={this.businessSelect}
                    disabled={selectDisabled}
                  >
                    <Option value={0}>全部业务</Option>
                    <Option value={1}>国际业务</Option>
                    <Option value={2}>政企业务</Option>
                  </Select>
                </div>
              </div>
              <div className="end-time">
                <div />
                <div>正常专线:&nbsp;</div>
                <div>{formalLine}</div>
              </div>
              <div className="start-time">
                <div />
                <div>故障专线:&nbsp;</div>
                <div>{problemLine}</div>
              </div>
              <div className="search-wrap clearfix">
                <NameLike placeholder="按专线名称搜索" search={this.search} />
              </div>
              <div className="table-lineList">
                <Table
                  columns={columns}
                  dataSource={lineList}
                  className="busimanage-table"
                  rowKey={record => record.id}
                  rowClassName={this.getLineRowClass}
                  onRow={this.onLineRow}
                  pagination={false}
                />
                <TablePagination
                  pageNumber={this.state.pageNo}
                  pageSize={this.state.pageSize}
                  total={this.state.totalPage}
                  preventDefaultLoad={true}
                  handlePageChange={this.pageChange}
                  hidePageSize={true}
                  hidePageJump={true}
                />
              </div>
            </div>
          </div>
          <div className="content-body">
            <div className="body-left">
              <div className="title clearfix">
                <span>网络割接</span>
                <Link
                  className="link"
                  to={{
                    pathname: '/main/fault/cutover',
                    state: {
                      cutTime: startTime
                    }
                  }}
                >
                  详情>>
                </Link>
                <span className="detail">{cutoverTime}</span>
              </div>
              <div className="cutover-today">
                <div className="total-cutover">
                  当前割接:<span>{cutoverToday}</span>
                </div>
                <div className="unfinished-cutover">
                  <Progress
                    percent={uncomplishedRate}
                    successPercent={complishedRate}
                    strokeWidth={12}
                    showInfo={false}
                    className={uncomplished === 0 ? 'no-data' : ''}
                  />
                  <div className="start-time clearfix">
                    <div />
                    <div>已完成:&nbsp;</div>
                    <div>{complished}</div>
                  </div>
                  <div className="end-time clearfix">
                    <div />
                    <div>已取消:&nbsp;</div>
                    <div>{canceled}</div>
                  </div>
                  <div className="uncomplished clearfix">
                    <div />
                    <div>未完成:&nbsp;</div>
                    <div>{uncomplished}</div>
                  </div>
                </div>
                <div className="finished-cutover">
                  完成率<span>{'--'}</span>
                </div>
                {/* <div className="finished-cutover">完成率<span>{`${complishedRate}%`}</span></div> */}
              </div>
            </div>
            <div className="body-right">
              <div className="title clearfix">
                <span>活动告警</span>
                <span className="detail">{cutoverTime}</span>
              </div>
              <ActivityAlarm
                {...{
                  activityAlarm: activityAlarm,
                  sendAlready: sendAlready
                }}
              />
            </div>
          </div>
          <div className="content-footer">
            <div className="footer-left">
              <div className="title">
                <span>性能指标</span>
              </div>
              <FunctionIndex
                {...{
                  rateNameArr: rateNameArr,
                  rateIdx: rateIdx,
                  selectRate: this.selectRate
                }}
              />
              <div className="footer-bar">
                {indexData.length === 0 ? (
                  <div className="zanwu">暂无数据...</div>
                ) : (
                  <div className="line-chart">
                    <Linechart
                      {...{
                        lineColor: color,
                        lineData: indexData,
                        aAxis: xData,
                        rateText: rateText
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="footer-right clearfix">
              <div className="title">
                <span>告警</span>
              </div>
              <Spin spinning={isFetching} tip="加载中..." />
              <AlarmList
                {...{
                  alarmList: alarmList,
                  isFetching: isFetching
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ClientDetail;
