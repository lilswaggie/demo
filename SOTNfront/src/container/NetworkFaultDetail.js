import React, { Component } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import Iframe from './Iframe';
import WarnModal from '../component/pub/modal/WarnModal';
import ChartExampleHomeChina from '../component/pub/legend/ChartExampleHomeChina';
import WarnLineArea from '../component/network-fault/WarnLineArea';
import CutoverLine from '../component/cutover-overview/components/CutoverLine';
import PageTitle from './../component/pub/page/PageTitle';
import { getAxios } from '../axios/mainAxios';
import { baseStaticUrl } from '../util/CommonUtils';
import { goBack } from '../util/ReduxUtil';
import '../assets/css/network-fault/network-fault.scss';
import { Icon } from '../../node_modules/antd/lib/index';

const LineTitle = styled.i`
  font-style: normal;
  color: rgb(44, 156, 250);
  cursor: pointer;
`;

const getOtn = props => {
  let { state } = props.location;
  if (state && state.otn) {
    return { otnId: state.otn.id, otnName: state.otn.name };
  }
  return { otnId: '', otnName: '' };
};

class NetworkFault extends Component {
  state = {
    // gis地图点击otn设备筛选
    otnId: getOtn(this.props).otnId,
    otnName: getOtn(this.props).otnName,

    lineContentVisible: true,

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

    levelFirstTimedWarnData: {},
    levelAllTimedWarnData: {}
  };

  componentDidMount() {
    this.setData();
  }

  // componentDidUpdate = (prevProps, prevState) => {
  //   if (prevProps.business.type !== this.props.business.type) {
  //     this.setState({ otnId: '', otnName: '' }, this.setData);
  //   }
  // };

  onIframeLoaded = () => {
    // TODO:gis加载完成的时候，告诉gis初始化的设备信息
  };

  setData = () => {
    this.setWarnCount();
    this.setSecurityLevelLines();
    this.setLineList();
    this.setLevelWarnTimedData();
    this.setLevelWarnTimedData(1);
    this.setWarnList();
  };

  setOtnData = () => {
    this.setWarnCount();
    this.setSecurityLevelLines();
    this.setLineList();
    this.setLevelWarnTimedData();
    this.setLevelWarnTimedData(1);
    this.setWarnList();
  };

  getFaultParams = () => {
    const params = {
      elementId: this.state.otnId
    };
    !params.elementId && delete params.elementId;
    return params;
  };

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

  setLevelWarnTimedData = (level = 0) => {
    const params = this.getFaultParams();
    // recentlyHour = 6
    !!level && (params.severity = level);
    getAxios('api/alarms/stats/num/timed', params, ({ values }) =>
      this.setState({
        [level ? 'levelFirstTimedWarnData' : 'levelAllTimedWarnData']: values
      })
    );
  };

  setWarnOtnNetworkFault = (otnId, otnName) => {
    otnId && otnName && this.setState({ otnId, otnName }, this.setOtnData);
  };

  clearWarnOtnNetworkFault = () => {
    this.setState({ otnId: '', otnName: '' }, this.setOtnData);
  };

  getLineTitle = () => {
    const { lineContentVisible: visible } = this.state;
    return (
      <LineTitle
        onClick={() => this.setState({ lineContentVisible: !visible })}
      >
        故障影响的专线
        <Icon type={visible ? 'up' : 'down'} />
      </LineTitle>
    );
  };

  render() {
    const {
      lineContentVisible,
      otnName,
      warnSummary,
      warnCountValues,
      securityLevelLines,
      securityLevelTime,
      lineList,
      levelFirstTimedWarnData,
      levelAllTimedWarnData,
      warnList
    } = this.state;
    const device = otnName ? '-' + otnName : '';

    return (
      <div className="network-fault-wrap busifault">
        <PageTitle showBack={true} title="故障详情" onBackClick={goBack} />
        <div className="content">
          <div className="block2">
            <div className="left">
              <ChartExampleHomeChina />
              <Iframe
                // url={`${baseStaticUrl}gis/gis3/networkFault/${'world' : 'china'}.html`}
                url={`${baseStaticUrl}gis/gis3/networkFault/china.html`}
                events={{
                  setWarnOtnNetworkFault: this.setWarnOtnNetworkFault,
                  clearWarnOtnNetworkFault: this.clearWarnOtnNetworkFault
                }}
                onLoaded={this.onIframeLoaded}
              />
              <div className="warn-effected-lines">
                <CutoverLine
                  title={this.getLineTitle()}
                  contentVisible={lineContentVisible}
                  businessTypeVisible={false}
                  aaaLine={securityLevelLines['AAA'] || 0}
                  aaLine={securityLevelLines['AA'] || 0}
                  aLine={securityLevelLines['A'] || 0}
                  normalLine={securityLevelLines['common'] || 0}
                  time={securityLevelTime}
                  fromNetworkFault={true}
                  scrollY={'10rem'}
                  lineList={lineList}
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
                  data={levelFirstTimedWarnData}
                />
              </div>
              <div className="line-trend-container">
                <div className="line-title">告警总数（条）</div>
                <WarnLineArea
                  className="warn-line-chart"
                  lineColor="#FFBB44"
                  yColor="#FFF2DE"
                  y2Color="#FFF2DC"
                  data={levelAllTimedWarnData}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NetworkFault;
