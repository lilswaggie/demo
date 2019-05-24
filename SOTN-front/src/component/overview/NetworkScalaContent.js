import React, { Component } from 'react';

import styled from 'styled-components';
import classnames from 'classnames';

import Performance from './work-order/Performance';

import LineTrend from './business-quality/LineTrend';
import LineTrendChart from './business-quality/LineTrendChart';
import PortUsedTooltip, { getPortUsedColor } from './network-scala/PortUsedTooltip';

import { px2rem } from '../../util/StyleUtils';
import PerformanceValue from './work-order/PerformanceValue';

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
    trendDataArr: []
  };

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {}

  makePortPerformance = value => (value, unit) => (
    <PerformanceValue
      value={value}
      unit={unit}
      color={getPortUsedColor(value)}
      tooltip={<PortUsedTooltip/>}
      tooltipBackgroundColor="#FFFFFF"
    />
  );

  performanceList = [
    {
      title: '站点总数',
      date: '2019-04',
      value: 3890,
      unit: '个',
      ringRatio: -1.2
    },
    {
      title: '网元总数',
      date: '2019-04',
      value: 123890,
      unit: '个',
      ringRatio: 1.2
    },
    {
      title: '端口总数',
      date: '2019-04',
      value: 1323890,
      unit: '个',
      ringRatio: -1.2
    },
    {
      title: '一干光缆总长度',
      date: '2019-05',
      value: 1234582,
      unit: '皮长公里',
      ringRatio: -1.2
    },
    {
      title: '纤芯利用率',
      date: '2019-05',
      value: 89.90,
      unit: '%',
      ringRatio: -1.2
    },
    {
      title: '端口利用率',
      date: '2019-05',
      value: 52.90,
      unit: '%',
      ringRatio: -1.2,
      performance: this.makePortPerformance(52.90)
    }
  ];

  apis = [];

  getPerformanceListWithData = () => {
    //
  };

  getTooltip = () => {
    return this.performanceList[this.state.selected].title;
  }

  getTitle = () => {
    const { selected } = this.state;
    const { title, unit } = this.performanceList[selected];
    return `${title}近12个月趋势（${unit}）`;
  };

  onSelect = selected => () => this.setState({ selected });

  render() {
    const { selected } = this.state;
    const title = this.getTitle();

    return (
      <NetworkScalaWrap>
        {this.performanceList.map((item, index) => (
          <StyledPerformance
            key={index}
            {...item}
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
              xDataArr={[1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7]}
              yDataArr={[1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7]}
              markValue={selected === 5 ? 5 : 0}
            />
          </LineTrend>
        </LineTrendWrap>
      </NetworkScalaWrap>
    );
  }
}
