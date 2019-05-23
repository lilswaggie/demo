import React, { Component } from 'react';

import PropTypes from 'prop-types';
// import _ from 'lodash';

import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';

import { formatNumber } from '../../util/CommonUtils';

import '../../assets/css/pub/bar-chart.scss';
import slider from '../../assets/css/pub/slider-hover.svg';

export default class AnalysisBarChart extends Component {
  static propTypes = {
    // [{name: '安徽', value: 100}]
    dataArr: PropTypes.array,
    className: PropTypes.string,
    itemName: PropTypes.string,
    needPercent: PropTypes.bool,
    needDataZone: PropTypes.bool,
    showProvince: PropTypes.bool
  };

  static defaultProps = {
    dataArr: [],
    needPercent: false,
    needDataZone: true
  };

  getProvince = (name, dataArr) => {
    let province = '';
    dataArr.forEach(d => {
      d.name === name && (province = d.province);
    });
    return province;
  };

  getOption = () => {
    const {
      dataArr,
      itemName,
      needPercent,
      needDataZone,
      showProvince
    } = this.props;
    const option = {
      tooltip: {
        padding: 10,
        enterable: true,
        transitionDuration: 1,
        backgroundColor: '#FFFFFF',
        extraCssText: 'box-shadow:0px 2px 4px 0px rgba(0,0,0,0.2);',
        formatter: params => {
          let value = `${formatNumber(params.value)}${needPercent ? '%' : ''}`;
          return `
                        <p>
                            <span style="color: #000;">
                                ${
                                  showProvince
                                    ? `【${this.getProvince(
                                      params.name,
                                      dataArr
                                    )}】`
                                    : ''
                                }
                                ${params.name}
                            </span>
                        </p>
                        <p>
                            ${itemName}:
                            <span style="color: #2AA8FF;">${value || 0}</span>
                        </p>
                    `;
        },
        textStyle: {
          color: '#3C3E4A',
          decoration: 'none',
          fontSize: 14
        }
      },
      dataZoom: {
        start: 0,
        end: 30,
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
          type: 'bar',
          // barCategoryGap: '20',
          barWidth: '10',
          // name: '站点数',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#6DCBFA' },
                { offset: 1, color: '#7EDFBD' }
              ])
            },
            emphasis: {
              color: '#7CC7FF'
            }
          },
          data: dataArr.map(d => d.value)
        }
      ]
    };

    if (!needDataZone) {
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
