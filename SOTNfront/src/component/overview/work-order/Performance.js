import React, { Component } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Divider } from 'antd';
import PerformanceTitle from './PerformanceTitle';
import PerformanceValue from './PerformanceValue';
import PerformanceRingRatio from './PerformanceRingRatio';

import { px2rem } from '../../../util/StyleUtils';

const PerformanceWrap = styled.div`
  padding: 12px;
  text-align: left;
`;

const StyledPerformanceValue = styled(PerformanceValue)`
  margin: 8px 0;
`;

const StyledDivider = styled(Divider)`
  margin: 6px 0;
  background-color: #e5e5e5;
`;

const PerformanceChartWrap = styled.div`
  margin: 10px 0;
  min-height: ${px2rem(6)};
  width: 100%;
`;

const StyledPerformanceRingRatio = styled(PerformanceRingRatio)`
  margin-top: ${props => props.marginTop}px;
`;

export default class Performance extends Component {
  static propTypes = {
    className: PropTypes.string,
    // styled的组件，点击事件传递
    onClick: PropTypes.func,

    // 标题栏↓
    title: PropTypes.string,
    granularity: PropTypes.string,
    // 标题栏？显示的时间
    date: PropTypes.string,
    // 标题栏↑

    // 指标↓
    // 传递value和unit生成指标组件
    value: PropTypes.number,
    unit: PropTypes.string,
    // 或者传递自定义渲染的组件
    performance: PropTypes.func,
    // 指标↑

    // 较现网环比值
    ringRatio: PropTypes.number,
    showChart: PropTypes.bool,
    chartRender: PropTypes.func,
    showDivider: PropTypes.bool,
    // 更多按钮组件
    moreRender: PropTypes.func
  };

  static defaultProps = {
    showChart: true,
    chartRender: () => {},
    showDivider: true
  };

  render() {
    const {
      className,
      onClick,
      title,
      granularity,
      date,
      value,
      unit,
      performance,
      ringRatio,
      showChart,
      chartRender,
      showDivider,
      moreRender
    } = this.props;
    return (
      <PerformanceWrap className={className} onClick={onClick}>
        <PerformanceTitle
          title={title}
          granularity={granularity}
          date={date}
          moreRender={moreRender}
        />
        {performance ? (
          performance(value, unit)
        ) : (
          <StyledPerformanceValue value={value} unit={unit} />
        )}
        {showChart && (
          <PerformanceChartWrap>{chartRender()}</PerformanceChartWrap>
        )}
        {showDivider && <StyledDivider />}
        <StyledPerformanceRingRatio
          value={ringRatio}
          marginTop={showDivider ? 0 : 6}
        />
      </PerformanceWrap>
    );
  }
}
