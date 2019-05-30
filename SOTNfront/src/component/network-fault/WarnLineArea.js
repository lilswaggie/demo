import React from 'react';

import PropTypes from 'prop-types';

import ReactEcharts from 'echarts-for-react';

import moment from 'moment';

class WarnLineArea extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    lineColor: PropTypes.string,
    yColor: PropTypes.string,
    y2Color: PropTypes.string,
    data: PropTypes.object
  };

  static defaultProps = {
    data: {}
  };

  getOption = data => {
    const { lineColor, yColor, y2Color, data: dataObj } = this.props;
    let timeArr = Object.keys(dataObj).map(t => moment(t - 0).format('HH:mm'));
    let dataArr = Object.values(dataObj);
    let max = Math.max.apply(null, dataArr);

    const option = {
      backgroundColor: '#fff',
      xAxis: {
        type: 'category',
        data: timeArr,
        boundaryGap: false,
        axisLabel: {
          show: true,
          padding: [0, 30, 0, 0]
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        name: '',
        min: 0,
        max: max,
        axisLabel: {
          show: true
        },
        axisLine: {
          show: false,
          fontFamily: 'PingFang SC Regular',
          // color: '#F1F4F9',
          lineStyle: {
            color: '#72758C'
          },
          fontWeight: 400
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#F1F4F9',
            type: 'solid'
          }
        }
      },
      grid: {
        top: 10,
        bottom: 30,
        left: 30,
        right: 0
      },
      series: [
        {
          name: '',
          type: 'line',
          // symbol: 'line',
          // sampling: 'average',
          showSymbol: false,
          label: {
            show: false
          },
          lineStyle: {
            color: lineColor,
            width: 2
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: yColor // 0% 处的颜色
                },
                {
                  offset: 0.21,
                  color: y2Color // 100% 处的颜色
                }
              ],
              globalCoord: false
            }
          },
          data: dataArr
        }
      ]
    };
    return option;
  };

  render() {
    // const { alarmTotal } = this.props;
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

export default WarnLineArea;
