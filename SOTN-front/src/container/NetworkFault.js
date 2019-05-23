import React, { Component } from 'react';
import { connect } from 'react-redux';

import moment from 'moment';

import Iframe from './Iframe';

import WarnModal from '../component/pub/WarnModal';
import ChartExampleHomeChina from '../component/pub/ChartExampleHomeChina';
import WarnLineArea from '../component/network-fault/WarnLineArea';
import CutoverLine from '../component/cutover-overview/components/CutoverLine';

import { getAxios } from '../axios/mainAxios';

import { formatNumber, baseStaticUrl, msToHour } from '../util/CommonUtils';

import '../assets/css/network-fault/network-fault.scss';

class NetworkFault extends Component {
  state = {
    // gis地图点击otn设备筛选
    otnId: '',
    otnName: '',

    weekTime: 0,
    monthTime: 0,
    weekSeg: 0,
    monthSeg: 0,

    // 故障专线总数
    faultLineCount: 0,

    // 告警总数
    warnSummary: 0,
    // 告警分类统计
    warnCountValues: {},

    securityLevelLines: {},
    securityLevelTime: '',

    // 告警影响的专线列表
    linePageNum: 1,
    linePageSize: 10,
    lineTotalCount: 0,
    lineList: [],

    // 活动告警列表
    pageNum: 1,
    pageSize: 10,
    warnTotalCount: 0,
    warnList: [],

    levelFirstTimedWarnArr: {},
    levelAllTimedWarnArr: {}
  };

  handlingTimeStateMap = {
    WEEK: 'weekTime',
    MONTH: 'monthTime'
  };

  handlingSegStateMap = {
    WEEK: 'weekSeg',
    MONTH: 'monthSeg'
  };

  componentDidMount() {
    this.setData();
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.business.type !== this.props.business.type) {
      this.setState({ otnId: '', otnName: '' }, this.setData);
    }
  };

  setData = () => {
    this.setFaultHandlingTime('WEEK');
    this.setFaultHandlingTime('MONTH');
    this.setFaultHandlingSeg('WEEK');
    this.setFaultHandlingSeg('MONTH');
    // this.setFaultLineCount();
    this.setWarnCount();
    this.setSecurityLevelLines();
    this.setLineList();
    this.setLevelWarnTimedArr();
    this.setLevelWarnTimedArr(1);
    this.setWarnList();
  };

  setOtnData = () => {
    // this.setFaultLineCount();
    this.setWarnCount();
    this.setSecurityLevelLines();
    this.setLineList();
    this.setLevelWarnTimedArr();
    this.setLevelWarnTimedArr(1);
    this.setWarnList();
  };

  getHandleTimeParams = timeSeg => ({
    timeSeg
    // businessType: this.props.business.type,
  });

  getFaultParams = () => {
    const params = {
      // businessType: this.props.business.type,
      elementId: this.state.otnId
    };
    !params.elementId && delete params.elementId;
    return params;
  };

  setFaultHandlingTime = type => {
    getAxios(
      'api/network/stats/fault_handling_time/time_seg',
      this.getHandleTimeParams(type),
      data =>
        this.setState({ [this.handlingTimeStateMap[type]]: msToHour(data) })
    );
  };

  setFaultHandlingSeg = type => {
    getAxios(
      'api/network/stats/fault_handling_seg/time_seg',
      this.getHandleTimeParams(type),
      data => this.setState({ [this.handlingSegStateMap[type]]: data })
    );
  };

  // setFaultLineCount = () => {
  //     getAxios(
  //         'api/leased_lines/stats/num/fault',
  //         this.getFaultParams(),
  //         ({ fault }) => this.setState({ faultLineCount: fault })
  //     );
  // }

  setWarnCount = () => {
    getAxios(
      'api/alarms/stats/num/severity',
      this.getFaultParams(),
      ({ summary, values }) =>
        this.setState({ warnSummary: summary, warnCountValues: values })
    );
  };

  setSecurityLevelLines = () => {
    getAxios(
      'api/leased_lines/stats/security_level',
      { ...this.getFaultParams(), alarmOnly: true },
      ({ values, time }) => {
        const status = { securityLevelLines: values };
        time &&
          time.timeRange &&
          time.timeRange.until &&
          (status.securityLevelTime = moment(time.timeRange.until).format(
            'HH:mm'
          ));
        this.setState(status);
      }
    );
  };

  setLineList = (
    linePageNum = this.state.linePageNum,
    linePageSize = this.state.linePageSize
  ) => {
    getAxios(
      'api/leased_lines',
      // 选择故障otn的时候，faultOnly字段为false，否则为true
      {
        ...this.getFaultParams(),
        alarmOnly: true,
        currentPage: linePageNum - 1,
        pageSize: linePageSize
      },
      ({ results, totalElements }) =>
        this.setState({
          lineList: results,
          lineTotalCount: totalElements,
          linePageNum,
          linePageSize
        })
    );
  };

  setWarnList = (
    pageNum = this.state.pageNum,
    pageSize = this.state.pageSize
  ) => {
    getAxios(
      'api/alarms',
      {
        ...this.getFaultParams(),
        currentPage: pageNum - 1,
        pageSize: pageSize
      },
      ({ results, totalElements }) =>
        this.setState({
          warnList: results,
          warnTotalCount: totalElements,
          pageSize,
          pageNum
        })
    );
  };

  setLevelWarnTimedArr = (level = 0) => {
    const params = this.getFaultParams();
    // recentlyHour = 6
    !!level && (params.severity = level);
    getAxios('api/alarms/stats/num/timed', params, ({ values }) =>
      this.setState({
        [level ? 'levelFirstTimedWarnArr' : 'levelAllTimedWarnArr']: values
      })
    );
  };

  setWarnOtnNetworkFault = (otnId, otnName) => {
    otnId && otnName && this.setState({ otnId, otnName }, this.setOtnData);
  };

  clearWarnOtnNetworkFault = () => {
    this.setState({ otnId: '', otnName: '' }, this.setOtnData);
  };

  render() {
    const {
      otnName,
      weekTime,
      monthTime,
      weekSeg,
      monthSeg,
      warnSummary,
      warnCountValues,
      securityLevelLines,
      securityLevelTime,
      lineList,
      levelFirstTimedWarnArr,
      levelAllTimedWarnArr,
      warnList
    } = this.state;
    const device = otnName ? '-' + otnName : '';

    return (
      <div className="network-fault-wrap busifault">
        <div className="title">
          <div className="item1">网络故障</div>
        </div>
        <div className="content">
          <div className="block1">
            <div className="left">
              <span>故障处理时长</span>
              <span>上一周：</span>
              <span>{weekTime}h</span>
              <span>上个月：</span>
              <span>{monthTime}h</span>
            </div>
            <div className="left">
              <span>故障处理及时率</span>
              <span>上一周：</span>
              <span>{weekSeg}%</span>
              <span>上个月：</span>
              <span>{monthSeg}%</span>
            </div>
          </div>
          <div className="block2">
            <div className="left">
              <ChartExampleHomeChina />
              <Iframe
                // url={`${baseStaticUrl}gis/gis3/networkFault/${this.props.business.type === 1 ? 'world' : 'china'}.html`}
                url={`${baseStaticUrl}gis/gis3/networkFault/china.html`}
                events={{
                  setWarnOtnNetworkFault: this.setWarnOtnNetworkFault,
                  clearWarnOtnNetworkFault: this.clearWarnOtnNetworkFault
                }}
              />
            </div>
            <div className="right">
              <div className="total-count">
                <span className="item">
                  <p className="name">受影响专线</p>
                  <p className="count">
                    {formatNumber(this.state.lineTotalCount)}
                  </p>
                </span>
                <span className="item">
                  <p className="name">一级告警数量</p>
                  <p className="count red">
                    {formatNumber(warnCountValues['1'])}
                  </p>
                </span>
                <span className="item">
                  <p className="name">告警总数</p>
                  <p className="count">{formatNumber(warnSummary)}</p>
                </span>
              </div>
              <div className="warn-effected-lines">
                <CutoverLine
                  title={`告警影响的专线${device}`}
                  isShowBusinessType={false}
                  aaaLine={securityLevelLines['AAA'] || 0}
                  aaLine={securityLevelLines['AA'] || 0}
                  aLine={securityLevelLines['A'] || 0}
                  normalLine={securityLevelLines['common'] || 0}
                  cutoverTime={securityLevelTime}
                  businessType={this.props.business.type}
                  scrollY={'10rem'}
                  lineData={lineList}
                  pageNum={this.state.linePageNum}
                  pageSize={this.state.linePageSize}
                  totalCount={this.state.lineTotalCount}
                  onPageChange={this.setLineList}
                />
              </div>
            </div>
          </div>
          <div className="block3">
            <div className="left-content">
              <WarnModal
                title={`活动告警${device}`}
                pathName="network"
                warnSummary={warnSummary}
                warnCountValues={warnCountValues}
                warnList={warnList}
                pageNum={this.state.pageNum}
                pageSize={this.state.pageSize}
                totalCount={this.state.warnTotalCount}
                onPageChange={this.setWarnList}
              />
            </div>
            <div className="right-content">
              <div className="header">告警数量近6小时趋势{`${device}`}</div>
              <div className="line-trend-container">
                <div className="line-title">一级告警数量（条）</div>
                <WarnLineArea
                  className="warn-line-chart"
                  lineColor="#F65F7B"
                  yColor="#FFDFDC"
                  y2Color="#FFDEDE"
                  dataList={levelFirstTimedWarnArr}
                />
              </div>
              <div className="line-trend-container">
                <div className="line-title">告警总数（条）</div>
                <WarnLineArea
                  className="warn-line-chart"
                  lineColor="#FFBB44"
                  yColor="#FFF2DE"
                  y2Color="#FFF2DC"
                  dataList={levelAllTimedWarnArr}
                />
              </div>
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

export default connect(mapStateToProps)(NetworkFault);
