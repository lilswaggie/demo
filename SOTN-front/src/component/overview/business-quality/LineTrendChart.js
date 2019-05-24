import React, { Component } from 'react';

import PropTypes from 'prop-types';

import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

export default class LineTrendChart extends Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    color: PropTypes.string.isRequired,
    topColor: PropTypes.string.isRequired,
    bottomColor: PropTypes.string.isRequired,
    xDataArr: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
    yDataArr: PropTypes.arrayOf(PropTypes.number),
    markValue: PropTypes.number
  };

  static defaultProps = {
    title: '',
    xDataArr: [],
    yDataArr: []
  };

  getDataArr = () => {
    const { yDataArr, markValue } = this.props;
    const dataArr = yDataArr.map(v => {
      if (!markValue || v <= markValue) {
        return { value: v };
      }
      return {
        value: v,
        symbol: 'circle',
        symbolSize: 12,
        itemStyle: {
          color: '#FF0033'
        }
      };
    });
    return dataArr;
  };

  getMarkDataArr = () => {
    return Array.from({ length: this.props.xDataArr.length }).map(
      i => this.props.markValue
    );
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
        left: 50,
        right: 0,
        bottom: 20,
        containLabel: false
      },
      series: [
        {
          name: this.props.title,
          type: 'line',
          smooth: false,
          showSymbol: true,
          symbolSize: 9,
          sampling: 'average',
          itemStyle: {
            color: this.props.color
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: this.props.topColor
              },
              {
                offset: 1,
                color: this.props.bottomColor
              }
            ])
          },
          data: this.getDataArr()
        },
        {
          name: '预警值',
          type: 'line',
          showSymbol: false,
          lineStyle: {
            type: 'dashed',
            color: '#FF0033',
            width: 1
          },
          data: this.getMarkDataArr()
        }
      ]
    };
    if (!this.props.markValue) {
      delete option.series[1];
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
