import React, { Component } from 'react';

import PropTypes from 'prop-types';
// import _ from 'lodash';

// import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

import slider from '../../../assets/css/pub/slider-hover.svg';

export default class AnalysisLineChart extends Component {
  static propTypes = {
    // [{name: '2018-12-12', value: 100}]
    dataArr: PropTypes.array,
    className: PropTypes.string,
    // itemName: PropTypes.string,
    // needPercent: PropTypes.bool,
    needDataZone: PropTypes.bool,
    dataZonePercent: PropTypes.number
  };

  static defaultProps = {
    dataArr: [],
    needPercent: false,
    needDataZone: true,
    dataZonePercent: 50
  };

  getProvince = (name, dataArr) => {
    let province = '';
    dataArr.forEach(d => {
      d.name === name && (province = d.province);
    });
    return province;
  };

  getOption = () => {
    const { dataArr, needDataZone, dataZonePercent } = this.props;
    const option = {
      dataZoom: {
        start: 0,
        end: dataZonePercent,
        zoomLock: true,
        bottom: 3,
        height: 8,
        showDetail: false,
        backgroundColor: '#D8D8D8',
        fillerColor: '#50AFFF',
        handleIcon: `image://${slider}`,
        handleSize: '200%',
        showDataShadow: false,
        borderColor: 'transparent'
      },
      xAxis: {
        type: 'category',
        data: dataArr.map(d => d.name),
        axisLabel: {
          // inside: false,
          interval: 0,
          rotate: 0
        },
        axisLine: {
          show: false,
          fontFamily: 'PingFang SC Regular',
          lineStyle: {
            color: '#72758C'
          },
          fontWeight: 400
        },
        z: 10,
        axisTick: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          show: true
        },
        axisLine: {
          show: false,
          fontFamily: 'PingFang SC Regular',
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
            type: 'dotted'
          }
        }
      },
      grid: {
        top: 10,
        bottom: 40,
        left: 45,
        right: 0
      },
      series: [
        {
          type: 'line',
          lineStyle: {
            width: 2,
            color: '#FFBB44'
          },
          itemStyle: {
            color: '#FFBB44'
          },
          data: dataArr.map(d => d.value)
        }
      ]
    };

    if (!needDataZone || dataArr.length <= 30) {
      delete option.dataZoom;
    }

    return option;
  };

  render() {
    return (
      <ReactEcharts
        className={this.props.className}
        option={this.getOption()}
        notMerge={true}
        // style={{height: '100%'}}
      />
    );
  }
}
