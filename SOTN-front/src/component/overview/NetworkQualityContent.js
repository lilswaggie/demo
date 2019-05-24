import React, { Component } from 'react';

import _ from 'lodash';
import styled from 'styled-components';

import { postAxios, AxiosRequest, getAxios } from '../../axios/mainAxios';

import { Row, Col, Icon, Modal, Tooltip } from 'antd';
import Performance from './work-order/Performance';
import PerformanceLineChart from './network-quality/PerformanceLineChart';
import PerformanceBarChart from './network-quality/PerformanceBarChart';
import WarnCount from './network-quality/WarnCount';
import WarnChartWrap from './network-quality/WarnChartWrap';
import WarnFirstTop5Province from './network-quality/WarnFirstTop5Province';
import WarnTrendLineChart from './network-quality/WarnTrendLineChart';

import { formatNumber } from '../../util/CommonUtils';
import { px2rem } from '../../util/StyleUtils';

import {
  timeGranularity,
  formatTimeByGranularity,
  getUntilByTime,
  makeTimeFilterByBeforeDays
} from '../../util/TimeUtils';
import { PerformanceUnit } from '../../util/PerformanceUtils';

const StyledPerformance = styled(Performance)`
  border: 1px solid #e5e5e5;
`;

const StyledPerformanceLineChart = styled(PerformanceLineChart)`
  height: ${px2rem(60)} !important;
`;

const StyledPerformanceBarChart = styled(PerformanceBarChart)`
  height: ${px2rem(60)} !important;
`;

const WarnCol = styled(Col)`
  margin: 14px 10px 0 10px;
  padding: 10px 20px;
  border: 1px solid #e5e5e5;
`;

const WarnTitle = styled.div`
  text-align: left;
  font-family: PingFangSC-Medium;
  font-size: 14px;
`;

const WarnWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${px2rem(200)};
`;

const WarnChartWrapTrend = styled(WarnChartWrap)`
  height: 100%;
  width: ${px2rem(580)};
`;

const WarnChartWrapProvince = styled(WarnChartWrap)`
  height: 100%;
  width: ${px2rem(480)};
`;

const EllipsisIcon = styled(Icon)`
  font-size: 18px;
  color: #000;
  cursor: pointer;
`;

const TrendModalWrap = styled.div`
  height: 280px;
`;

export default class NetworkQualityContent extends Component {
  state = {
    warnCount: 0,
    firstWarnCount: 0,
    levelFirstTimedWarnData: {},
    levelAllTimedWarnData: {},
    top5WarnProvinceArr: [
      { province: '广东', warnCount: 1000, firstLevelWarnCount: 100 },
      { province: '山西', warnCount: 800, firstLevelWarnCount: 80 },
      { province: '河北', warnCount: 780, firstLevelWarnCount: 60 },
      { province: '湖北', warnCount: 890, firstLevelWarnCount: 40 },
      { province: '浙江', warnCount: 720, firstLevelWarnCount: 30 }
    ],
    // { date, value, ringRatio, granularity }
    performanceDataArr: [{}, {}, {}, {}],
    // { xDataArr, yDataArr }
    chartDataArr: [{}, {}, {}, {}],

    trendModalIndex: 0,
    trendModalTitle: '',
    trendModalVisible: '',
    trendChartData: {}
  };

  performanceArr = [
    {
      title: '光缆故障次数',
      granularity: timeGranularity.DAY,
      unit: PerformanceUnit.TIME
    },
    {
      title: '网络故障次数',
      granularity: timeGranularity.DAY,
      unit: PerformanceUnit.TIME
    },
    {
      title: '光功率不合格端口数',
      granularity: timeGranularity.DAY,
      unit: PerformanceUnit.ONE
    },
    {
      title: '误码率不合格端口数',
      granularity: timeGranularity.DAY,
      unit: PerformanceUnit.ONE
    }
  ];

  chartArr = [
    {
      color: '#F65F7B',
      topColor: 'rgba(246, 95, 123, 1)',
      bottomColor: 'rgba(246, 95, 123, 0)'
    },
    {
      color: '#7D6DDD',
      topColor: 'rgba(125, 109, 221, 1)',
      bottomColor: 'rgba(125, 109, 221, 0)'
    },
    {
      topColor: 'rgba(112, 204, 252, 1)',
      bottomColor: 'rgba(100, 150, 254, 1)'
    },
    {
      topColor: 'rgba(112, 204, 252, 1)',
      bottomColor: 'rgba(100, 150, 254, 1)'
    }
  ];

  chartComponent = [
    props => <StyledPerformanceLineChart {...props} />,
    props => <StyledPerformanceLineChart {...props} />,
    props => <StyledPerformanceBarChart {...props} />,
    props => <StyledPerformanceBarChart {...props} />
  ];

  modalChartComponent = [
    props => <PerformanceLineChart {...props} />,
    props => <PerformanceLineChart {...props} />,
    props => <PerformanceBarChart {...props} />,
    props => <PerformanceBarChart {...props} />
  ];

  performanceApis = [
    {
      url: 'api/network/stats/optical_cable_fault/timed',
      method: AxiosRequest.GET
    },
    {
      url: 'api/network/elements/stats/fault_num/timed',
      method: AxiosRequest.POST
    },
    { url: 'api/network/stats/port_fault/timed', method: AxiosRequest.GET },
    { url: 'api/network/stats/wave_fault/timed', method: AxiosRequest.GET }
  ];

  componentDidMount() {
    this.getPerformanceData();
    this.getAlarmCount();
    this.getLevelWarnTimedArr();
    this.getLevelWarnTimedArr(1);
  }

  makeChartData = (values, granularity) => {
    return {
      xDataArr: Object.keys(values).map(v =>
        formatTimeByGranularity(v, granularity)
      ),
      yDataArr: Object.values(values)
    };
  };

  setPerformanceItemData = ({ current, ringRatio, time, values }, i) => {
    let performanceDataArr = _.cloneDeep(this.state.performanceDataArr);
    let chartDataArr = _.cloneDeep(this.state.chartDataArr);

    const granularity = time.timeGranularity;
    performanceDataArr[i] = {
      // date, value, ringRatio, granularity
      date: formatTimeByGranularity(getUntilByTime(time), granularity),
      value: current,
      ringRatio,
      granularity
    };

    chartDataArr[i] = this.makeChartData(values, granularity);
    this.setState({ performanceDataArr, chartDataArr });
  };

  getPerformanceData = () => {
    this.performanceApis.forEach((api, i) => {
      const axios = api.method === AxiosRequest.GET ? getAxios : postAxios;
      axios(api.url, data => this.setPerformanceItemData(data, i));
    });
  };

  getAlarmCount = () => {
    getAxios('api/alarms/stats/num/severity', ({ summary, values }) =>
      this.setState({
        warnCount: summary,
        firstWarnCount: formatNumber(values['1'])
      })
    );
  };

  getLevelWarnTimedArr = (level = 0) => {
    const params = {};
    !!level && (params.severity = level);
    getAxios('api/alarms/stats/num/timed', params, ({ values }) =>
      this.setState({
        [level
          ? 'levelFirstTimedWarnData'
          : 'levelAllTimedWarnData']: this.makeChartData(
          values,
          timeGranularity.TIME
        )
      })
    );
  };

  onMoreClick = index => () => {
    this.setState({
      trendModalIndex: index,
      trendModalVisible: true,
      trendModalTitle: this.performanceArr[index].title
    });
    const api = this.performanceApis[index];
    const axios = api.method === AxiosRequest.GET ? getAxios : postAxios;
    axios(api.url, makeTimeFilterByBeforeDays(30), ({ values, time }) =>
      this.setState({
        trendChartData: this.makeChartData(values, time.timeGranularity)
      })
    );
  };

  onModalCancel = () => this.setState({ trendModalVisible: false });

  render() {
    const {
      performanceDataArr,
      chartDataArr,
      warnCount,
      firstWarnCount,
      trendModalVisible,
      trendModalTitle,
      trendModalIndex,
      trendChartData,
      levelAllTimedWarnData,
      levelFirstTimedWarnData
    } = this.state;
    return (
      <Row align="top" gutter={20} justify="space-between" type="flex">
        {this.performanceArr.map((performance, i) => (
          <Col span={6} key={i}>
            <StyledPerformance
              {...performance}
              {...performanceDataArr[i]}
              moreRender={() => (
                <Tooltip placement="top" title={'趋势详情'}>
                  <EllipsisIcon type="ellipsis" onClick={this.onMoreClick(i)} />
                </Tooltip>
              )}
            >
              {this.chartComponent[i]({
                ...this.chartArr[i],
                ...chartDataArr[i]
              })}
            </StyledPerformance>
          </Col>
        ))}
        <WarnCol span={24}>
          <WarnTitle>告警统计</WarnTitle>
          <WarnWrap>
            <WarnCount warnCount={warnCount} firstWarnCount={firstWarnCount} />
            <WarnChartWrapTrend title="近6小时告警数量变化趋势">
              <WarnTrendLineChart
                {...levelAllTimedWarnData}
                {...levelFirstTimedWarnData}
              />
            </WarnChartWrapTrend>
            <WarnChartWrapProvince title="一级告警TOP5省份">
              <WarnFirstTop5Province dataArr={this.state.top5WarnProvinceArr} />
            </WarnChartWrapProvince>
          </WarnWrap>
        </WarnCol>
        <Modal
          width={900}
          title={`近30天${trendModalTitle}变化趋势`}
          visible={trendModalVisible}
          footer={null}
          onCancel={this.onModalCancel}
          style={{ top: 50 }}
        >
          <TrendModalWrap>
            {this.modalChartComponent[trendModalIndex]({
              ...this.chartArr[trendModalIndex],
              ...trendChartData,
              showAxios: true
            })}
          </TrendModalWrap>
        </Modal>
      </Row>
    );
  }
}
