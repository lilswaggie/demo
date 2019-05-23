import React, { Component } from 'react';

import PropTypes from 'prop-types';

import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

export default class WarnTrendLineChart extends Component {
  static propTypes = {
    className: PropTypes.string,
    xDataArr: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
    firstWarnDataArr: PropTypes.arrayOf(PropTypes.number),
    warnDataArr: PropTypes.arrayOf(PropTypes.number)
  };

  static defaultProps = {
    xDataArr: [],
    firstWarnDataArr: [],
    warnDataArr: []
  };

  getOption = () => {
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: this.props.xDataArr,
        // boundaryGap: [10, 10],
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#72758C'
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#DDDDDD'
          }
        },
        axisLabel: {
          color: '#72758C'
        }
      },
      grid: {
        top: 20,
        right: 0,
        bottom: 20,
        containLabel: false
      },
      series: [
        {
          name: '一级告警',
          type: 'line',
          smooth: false,
          showSymbol: false,
          sampling: 'average',
          itemStyle: {
            color: '#F65F7B'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(246,95,123, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(246,95,123, 0)'
              }
            ])
          },
          data: this.props.firstWarnDataArr
        },
        {
          name: '活动告警',
          type: 'line',
          smooth: false,
          showSymbol: false,
          sampling: 'average',
          itemStyle: {
            color: '#6496FE'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(100,150,254, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(100,150,254, 0)'
              }
            ])
          },
          data: this.props.warnDataArr
        }
      ]
    };
    return option;
  };

  render() {
    return (
      <ReactEcharts
        className={this.props.className}
        option={this.getOption()}
        notMerge={true}
        style={{ height: '100%' }}
      />
    );
  }
}
