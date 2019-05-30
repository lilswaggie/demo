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
  makeTimeFilterByBeforeDays,
  getGranularityByTime
} from '../../util/TimeUtils';
import {
  PerformanceUnit,
  getXYDataByGranularity
} from '../../util/PerformanceUtils';

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
    top5WarnProvinceArr: [],
    // { date, value, ringRatio, granularity }
    performanceDataArr: [{}, {}, {}, {}],
    // { xDataArr, yDataArr }
    chartDataArr: [{}, {}, {}, {}],

    trendModalIndex: 0,
    trendModalTitle: '',
    trendModalVisible: false,
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
    this.getTop5Province();
  }

  setPerformanceItemData = ({ current, ringRatio, time, values }, i) => {
    let performanceDataArr = _.cloneDeep(this.state.performanceDataArr);
    let chartDataArr = _.cloneDeep(this.state.chartDataArr);

    const granularity = getGranularityByTime(time) || timeGranularity.MONTH;
    performanceDataArr[i] = {
      // date, value, ringRatio, granularity
      date: formatTimeByGranularity(getUntilByTime(time), granularity),
      value: current,
      ringRatio,
      granularity
    };

    chartDataArr[i] = getXYDataByGranularity(values, granularity);
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
        warnCount: formatNumber(summary),
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
          : 'levelAllTimedWarnData']: getXYDataByGranularity(
          values,
          timeGranularity.TIME
        )
      })
    );
  };

  getTop5Province = () => {
    getAxios('api/alarms/stats/num/sum/location', (data = []) => {
      this.setState({
        top5WarnProvinceArr: data.slice(0, 5).map(item => ({
          province: item.provinceName,
          warnCount: item.totalNum,
          firstLevelWarnCount: item.firstLevelNum
        }))
      });
    });
  };

  onMoreClick = index => () => {
    this.setState({
      trendModalIndex: index,
      trendModalVisible: true,
      trendModalTitle: this.performanceArr[index].title
    });
    const api = this.performanceApis[index];
    const axios = api.method === AxiosRequest.GET ? getAxios : postAxios;
    const performance = this.performanceArr[index];
    axios(
      api.url,
      makeTimeFilterByBeforeDays(performance.granularity),
      ({ values, time }) =>
        this.setState({
          trendChartData: getXYDataByGranularity(
            values,
            getGranularityByTime(time) || performance.granularity
          )
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
              chartRender={() =>
                this.chartComponent[i]({
                  ...this.chartArr[i],
                  ...chartDataArr[i]
                })
              }
            />
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
              showAxis: true
            })}
          </TrendModalWrap>
        </Modal>
      </Row>
    );
  }
}
