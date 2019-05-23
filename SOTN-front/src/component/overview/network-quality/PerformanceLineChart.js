import React, { Component } from 'react';

import PropTypes from 'prop-types';

import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

export default class PerformanceLineCharts extends Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    xDataArr: PropTypes.array,
    yDataArr: PropTypes.arrayOf(PropTypes.number),
    color: PropTypes.string.isRequired,
    topColor: PropTypes.string.isRequired,
    bottomColor: PropTypes.string.isRequired,
    showAxios: PropTypes.bool
  };

  static defaultProps = {
    title: '',
    showAxios: false
  };

  getOption = () => {
    const {
      title,
      xDataArr,
      yDataArr,
      color,
      topColor,
      bottomColor,
      showAxios
    } = this.props;
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: xDataArr,
        show: showAxios,
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
        show: showAxios,
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
        top: 0,
        bottom: 0,
        left: -15,
        right: -15,
        containLabel: false
      },
      series: [
        {
          name: title,
          type: 'line',
          smooth: true,
          symbolSize: '6',
          sampling: 'average',
          itemStyle: {
            color: color
          },
          //   markLine: {
          //     label: {
          //       position: 'middle',
          //       formatter: '日均'
          //     },
          //     lineStyle: {
          //       width: 1,
          //       type: 'dashed',
          //       color: '#2C9CFA '
          //     },
          //     symbol: 'none',
          //     data: [{ type: 'average', name: '平均值' }]
          //   },
          areaStyle: {
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
          },
          data: yDataArr
        }
      ]
    };
    if (showAxios) {
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
