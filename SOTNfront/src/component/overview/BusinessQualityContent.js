import React, { Component } from 'react';

import styled from 'styled-components';
import classnames from 'classnames';

import { Row, Col } from 'antd';
import Performance from './work-order/Performance';
import LineTrend from './business-quality/LineTrend';
import LineTrendChart from './business-quality/LineTrendChart';

import { getAxios, postAxios, AxiosRequest } from '../../axios/mainAxios';

import {
  timeGranularity,
  getGranularityByTime,
  formatTimeByGranularity,
  getUntilByTime,
  ms2UnitTime,
  makeTimeFilterByBeforeDays
} from '../../util/TimeUtils';
import {
  PerformanceUnit,
  getXYDataByGranularity
} from '../../util/PerformanceUtils';

const StyledPerformance = styled(Performance)`
  background-color: #f7f8fa;
  cursor: pointer;
  transition: all 0.3s;

  &.active {
    border: 1px solid #2c9cfa;
    background-color: #fff;
  }
`;

const LineTrendCol = styled(Col)`
  margin-top: 10px;
`;

export default class BusinessQualityContent extends Component {
  state = {
    selected: 0,
    performanceDataArr: [{}, {}, {}, {}, {}, {}],
    trendChartData: {}
  };

  performanceList = [
    {
      title: '专线可用率',
      // unit可能会被覆盖
      unit: PerformanceUnit.PERCENT,
      granularity: timeGranularity.MONTH
    },
    {
      title: '专线中断时长',
      unit: PerformanceUnit.HOUR,
      granularity: timeGranularity.MONTH
    },
    {
      title: '专线时延',
      unit: PerformanceUnit.MS,
      granularity: timeGranularity.MONTH
    },
    {
      title: '专线故障次数',
      unit: PerformanceUnit.TIME,
      granularity: timeGranularity.DAY
    },
    {
      title: '专线投诉次数',
      unit: PerformanceUnit.TIME,
      granularity: timeGranularity.DAY
    },
    {
      title: '专线倒换次数',
      unit: PerformanceUnit.TIME,
      granularity: timeGranularity.DAY
    }
  ];

  apis = [
    { url: 'api/leased_lines/stats/usable/timed', method: AxiosRequest.POST },
    {
      url: 'api/leased_lines/stats/interrupted/timed',
      method: AxiosRequest.POST
    },
    { url: 'api/leased_lines/stats/delay/timed', method: AxiosRequest.GET },
    { url: 'api/leased_lines/stats/fault/timed', method: AxiosRequest.POST },
    {
      url: 'api/leased_lines/stats/complaint/timed',
      method: AxiosRequest.POST
    },
    {
      url: 'api/leased_lines/stats/circuit_switch/timed',
      method: AxiosRequest.POST
    }
  ];

  performanceDataKeyArr = [
    'leased_line_usable_rate',
    'leased_line_interrupt_time',
    'leased_line_delay_time',
    'leased_line_fault_num',
    'leased_line_complaint_num',
    'leased_line_switch_time'
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
    getAxios(
      'api/business/stats/current/business_quality/detail',
      ({ values }) => {
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
      }
    );
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
      <Row align="top" gutter={10} justify="space-between" type="flex">
        {this.performanceList.map((item, index) => (
          <Col span={4} key={index}>
            <StyledPerformance
              {...item}
              {...performanceDataArr[index]}
              className={classnames({ active: selected === index })}
              showChart={false}
              showDivider={false}
              onClick={this.onSelect(index)}
            />
          </Col>
        ))}
        <LineTrendCol span={24}>
          <LineTrend title={title}>
            <LineTrendChart
              title={this.getTooltip()}
              color="#6496FE"
              topColor="rgba(100, 150, 254, 0.3)"
              bottomColor="rgba(100, 150, 254, 0)"
              {...trendChartData}
            />
          </LineTrend>
        </LineTrendCol>
      </Row>
    );
  }
}
