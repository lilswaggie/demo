import React, { Component } from 'react';

import styled from 'styled-components';
import classnames from 'classnames';

import Performance from './work-order/Performance';
import LineTrend from './business-quality/LineTrend';
import LineTrendChart from './business-quality/LineTrendChart';
import PortUsedTooltip, {
  getPortUsedColor
} from './network-scala/PortUsedTooltip';

import { px2rem } from '../../util/StyleUtils';
import PerformanceValue from './work-order/PerformanceValue';
import {
  PerformanceUnit,
  getXYDataByGranularity
} from '../../util/PerformanceUtils';
import {
  timeGranularity,
  getGranularityByTime,
  ms2UnitTime,
  formatTimeByGranularity,
  getUntilByTime,
  makeTimeFilterByBeforeDays
} from '../../util/TimeUtils';
import { AxiosRequest, getAxios, postAxios } from '../../axios/mainAxios';

const NetworkScalaWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const StyledPerformance = styled(Performance)`
  width: ${px2rem(203)};
  background-color: #f7f8fa;
  cursor: pointer;
  transition: all 0.3s;

  &.active {
    border: 1px solid #2c9cfa;
    background-color: #fff;
  }

  &:nth-child(4) {
    width: ${px2rem(283)};
  }

  &:nth-child(5) {
    width: ${px2rem(163)};
  }
  &:nth-child(6) {
    width: ${px2rem(187)};
  }
`;

const LineTrendWrap = styled.div`
  margin-top: 10px;
  width: 100%;
`;

export default class NetworkScalaContent extends Component {
  state = {
    selected: 0,
    performanceDataArr: [{}, {}, {}, {}, {}, {}],
    trendChartData: {}
  };

  performanceList = [
    {
      title: '站点总数',
      unit: PerformanceUnit.ONE,
      granularity: timeGranularity.MONTH
    },
    {
      title: '网元总数',
      unit: PerformanceUnit.ONE,
      granularity: timeGranularity.MONTH
    },
    {
      title: '端口总数',
      unit: PerformanceUnit.ONE,
      granularity: timeGranularity.MONTH
    },
    {
      title: '一干光缆总长度',
      unit: PerformanceUnit.KM,
      granularity: timeGranularity.MONTH
    },
    {
      title: '纤芯利用率',
      unit: PerformanceUnit.PERCENT,
      granularity: timeGranularity.MONTH
    },
    {
      title: '端口利用率',
      unit: PerformanceUnit.PERCENT,
      granularity: timeGranularity.MONTH,
      performance: (value, unit) => (
        <PerformanceValue
          value={value}
          unit={unit}
          color={getPortUsedColor(value)}
          tooltip={<PortUsedTooltip />}
          tooltipBackgroundColor="#FFFFFF"
        />
      )
    }
  ];

  apis = [
    { url: 'api/network/stats/site/timed', method: AxiosRequest.POST },
    {
      url: 'api/network/elements/stats/num/timed',
      method: AxiosRequest.POST
    },
    { url: 'api/network/ports/stats/num/timed', method: AxiosRequest.POST },
    {
      url: 'api/network/stats/optical_cable_length/timed',
      method: AxiosRequest.POST
    },
    {
      url: 'api/network/stats/fiber_usage/timed',
      method: AxiosRequest.POST
    },
    {
      url: 'api/network/stats/port_usage/timed',
      method: AxiosRequest.POST
    }
  ];

  performanceDataKeyArr = [
    'site_num',
    'elements',
    'port_num',
    'optical_cable_length',
    'fiber_usage_ratio',
    'port_usage_ratio'
  ];

  granularityDateRangeMap = {
    [timeGranularity.DAY]: '30天',
    [timeGranularity.MONTH]: '12个月'
  };

  componentDidMount() {
    this.getPerformanceData();
    this.getTrendData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selected !== prevState.selected) {
      this.getTrendData();
    }
  }

  getPerformanceData = () => {
    postAxios('api/network/stats/current/net_scale/detail', ({ values }) => {
      this.performanceDataKeyArr.map((key, i) => {
        let { time, current, ringRatio } = values[key];
        const performance = this.performanceList[i];
        const granularity =
          getGranularityByTime(time) || performance.granularity;
        const { unit, value } = ms2UnitTime(current, performance.unit, 2);
        return {
          granularity,
          date: formatTimeByGranularity(getUntilByTime(time), granularity),
          value,
          unit,
          ringRatio
        };
      });
    });
  };

  getTrendData = () => {
    const { selected } = this.state;
    const api = this.apis[selected];
    const axios = api.method === AxiosRequest.GET ? getAxios : postAxios;
    const performance = this.performanceList[selected];
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

  getTooltip = () => {
    return this.performanceList[this.state.selected].title;
  };

  getTitle = () => {
    const { selected } = this.state;
    let { title, granularity, unit } = {
      ...this.performanceList[selected],
      ...this.state.performanceDataArr[selected]
    };
    return `${title}近${
      this.granularityDateRangeMap[granularity]
    }趋势（${unit}）`;
  };

  onSelect = selected => () => this.setState({ selected });

  render() {
    const { selected, performanceDataArr, trendChartData } = this.state;
    const title = this.getTitle();

    return (
      <NetworkScalaWrap>
        {this.performanceList.map((item, index) => (
          <StyledPerformance
            key={index}
            {...item}
            {...performanceDataArr[index]}
            className={classnames({ active: selected === index })}
            showChart={false}
            showDivider={false}
            onClick={this.onSelect(index)}
          />
        ))}
        <LineTrendWrap>
          <LineTrend title={title}>
            <LineTrendChart
              title={this.getTooltip()}
              color="#6496FE"
              topColor="rgba(100, 150, 254, 0.3)"
              bottomColor="rgba(100, 150, 254, 0)"
              markValue={selected === 5 ? 5 : 0}
              {...trendChartData}
            />
          </LineTrend>
        </LineTrendWrap>
      </NetworkScalaWrap>
    );
  }
}
