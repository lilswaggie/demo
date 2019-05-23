import React, { Component } from 'react';

import styled from 'styled-components';
import classnames from 'classnames';

import { Row, Col } from 'antd';

import Performance from './work-order/Performance';

import { timeGranularity } from '../../util/TimeUtils';
import LineTrend from './business-quality/LineTrend';
import LineTrendChart from './business-quality/LineTrendChart';

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
    trendDataArr: []
  };

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {}

  performanceList = [
    {
      title: '专线可用率',
      granularity: timeGranularity.MONTH,
      date: '2019-04',
      value: 89.89,
      unit: '%',
      ringRatio: -1.2
    },
    {
      title: '专线中断时长',
      granularity: timeGranularity.MONTH,
      date: '2019-04',
      value: 1.2,
      unit: 'h',
      ringRatio: 1.2
    },
    {
      title: '专线时延',
      granularity: timeGranularity.MONTH,
      date: '2019-04',
      value: 120,
      unit: 'ms',
      ringRatio: -1.2
    },
    {
      title: '专线故障次数',
      granularity: timeGranularity.DAY,
      date: '2019-05-21',
      value: 90,
      unit: '次',
      ringRatio: -1.2
    },
    {
      title: '专线投诉次数',
      granularity: timeGranularity.DAY,
      date: '2019-05-21',
      value: 120,
      unit: '次',
      ringRatio: -1.2
    },
    {
      title: '专线倒换次数',
      granularity: timeGranularity.DAY,
      date: '2019-05-21',
      value: 145,
      unit: '次',
      ringRatio: -1.2
    }
  ];

  apis = [
    'leased_lines/stats/usable/timed',
    'leased_lines/stats/interrupted/timed',
    'leased_lines/stats/delay/timed',
    'leased_lines/stats/fault/timed',
    'leased_lines/stats/complaint/timed',
    'leased_lines/stats/circuit_switch/timed'
  ];

  getPerformanceListWithData = () => {
    //
  };

  getTooltip = () => {
    return this.performanceList[this.state.selected].title;
  };

  granularityDateRangeMap = {
    [timeGranularity.DAY]: '30天',
    [timeGranularity.MONTH]: '12个月'
  };

  getTitle = () => {
    const { selected } = this.state;
    const { title, granularity, unit } = this.performanceList[selected];
    return `${title}近${
      this.granularityDateRangeMap[granularity]
    }趋势（${unit}）`;
  };

  onSelect = selected => () => this.setState({ selected });

  render() {
    const { selected } = this.state;
    const title = this.getTitle();

    return (
      <Row align="top" gutter={10} justify="space-between" type="flex">
        {this.performanceList.map((item, index) => (
          <Col span={4} key={index}>
            <StyledPerformance
              {...item}
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
              xDataArr={[1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7]}
              yDataArr={[1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7]}
            />
          </LineTrend>
        </LineTrendCol>
      </Row>
    );
  }
}
