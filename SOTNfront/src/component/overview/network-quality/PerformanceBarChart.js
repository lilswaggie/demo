import React, { Component } from 'react';

import PropTypes from 'prop-types';

import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

export default class PerformanceBarChart extends Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    xDataArr: PropTypes.array,
    yDataArr: PropTypes.arrayOf(PropTypes.number),
    topColor: PropTypes.string.isRequired,
    bottomColor: PropTypes.string.isRequired,
    showAxis: PropTypes.bool
  };

  static defaultProps = {
    title: '',
    showAxis: false
  };

  getOption = () => {
    const {
      title,
      xDataArr,
      yDataArr,
      topColor,
      bottomColor,
      showAxis
    } = this.props;
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        top: 0,
        bottom: 0,
        left: -15,
        right: -15,
        containLabel: false
      },
      xAxis: {
        show: showAxis,
        type: 'category',
        data: xDataArr,
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
        show: showAxis,
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
      series: [
        {
          name: title,
          type: 'bar',
          barWidth: 10,
          xAxisIndex: 0,
          yAxisIndex: 0,
          itemStyle: {
            normal: {
              barBorderRadius: [10, 10, 0, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: topColor
                },
                {
                  offset: 1,
                  color: bottomColor
                }
              ])
            }
          },
          data: yDataArr
        }
      ]
    };
    if (showAxis) {
      delete option.grid;
    }
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
