import React, { Component } from 'react';

import PropTypes from 'prop-types';

import ReactEcharts from 'echarts-for-react';

export const getPieDataPropType = () => PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    selected: PropTypes.boolean,
  })
);

export default class NestPie extends Component {

  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    inDataArr: getPieDataPropType(),
    outDataArr: getPieDataPropType()
  };

  static defaultProps = {
    title: '',
    inDataArr: [],
    outDataArr: []
  }

  getOption = () => {
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      series: [
        {
          name: this.props.title,
          type: 'pie',
          selectedMode: 'single',
          radius: [0, '30%'],
          color: ['#6496FE', '#71CA41'],
          label: {
            show: false,
          },
          data: this.props.inDataArr
        },
        {
          name: this.props.title,
          type: 'pie',
          radius: ['55%', '75%'],
          color: ['#31c1c1', '#f45f7c', '#f0b151'],
          label: {
            normal: {
              formatter: '{b}\n{c}',
              color: '#72758C'
            }
          },
          data: this.props.outDataArr
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
