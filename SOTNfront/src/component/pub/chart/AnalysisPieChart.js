import React, { Component } from 'react';

import PropTypes from 'prop-types';

import ReactEcharts from 'echarts-for-react';

import { formatNumber } from '../../../util/CommonUtils';

export default class AnalysisBarChart extends Component {
  static propTypes = {
    className: PropTypes.string,
    text: PropTypes.string,
    // [{name: '一级告警', value: 100}]
    dataArr: PropTypes.array.isRequired
  };

  static defaultProps = {
    className: '',
    text: '',
    dataArr: []
  };

  getOption = () => {
    const { text, dataArr: data } = this.props;
    let option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      color: ['#8776EF', '#F65F7B', '#F0B34A', '#71CA41'],
      graphic: {
        type: 'text',
        left: 'center',
        top: 'center',
        style: {
          text: text,
          textAlign: 'center',
          fill: '#72758C',
          font: '400 14px PingFangSC-Regular'
        }
      },
      series: [
        {
          name: text,
          type: 'pie',
          radius: ['40%', '60%'],
          center: ['50%', '50%'],
          roseType: 'radius',
          data: data,
          itemStyle: {
            normal: {
              label: {
                show: true,
                formatter: function(params) {
                  return (
                    params.name + ':\n' + formatNumber(params.data['value'])
                  );
                },
                color: '#72758C',
                fontSize: '14px'
              },
              labelLine: { show: true }
            }
          }
        },
        {
          name: '',
          type: 'pie',
          radius: ['70%', '72%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          color: '#E6EDF8',
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [{ value: 1, name: '' }],
          tooltip: {
            show: false
          }
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
        // style={{height: '100%'}}
      />
    );
  }
}
