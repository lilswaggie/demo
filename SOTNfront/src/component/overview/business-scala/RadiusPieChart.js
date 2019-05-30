import React, { Component } from 'react';

import PropTypes from 'prop-types';

import ReactEcharts from 'echarts-for-react';
import { formatNumber } from '../../../util/CommonUtils';

export default class RadiusPieChart extends Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    centerText: PropTypes.string,
    dataArr: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number
    }))
  };

  static defaultProps = {
    title: '',
    centerText: ''
  };

  getOption = () => {
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
          text: this.props.centerText,
          textAlign: 'center',
          fill: '#72758C',
          font: '400 14px PingFangSC-Regular'
        }
      },
      series: [
        {
          name: this.props.title,
          type: 'pie',
          radius: ['40%', '60%'],
          center: ['50%', '50%'],
          roseType: 'radius',
          data: this.props.dataArr,
          itemStyle: {
            normal: {
              label: {
                show: true,
                formatter: function(params) {
                  return params.name + ':\n' + formatNumber(params.data.value);
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
      />
    );
  }
}
