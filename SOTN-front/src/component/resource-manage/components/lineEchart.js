import React from 'react';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import { formatNumber, midArr } from '../../../util/CommonUtils';
import './lineChart.scss';

// 绘制折线图
const getOption = (lineData, lineColor, aAxis, rateText, yName, needPercent) => ({
  tooltip: {
    formatter: params => {
      let value = `${formatNumber(params.value)}${needPercent ? '%' : ''}`;
      return `
        <p>
          ${rateText}
        </p>
        <p>
          <span style="color: #FFBB44;">${value || 0}</span>
        </p>
      `;
    },
  },
  xAxis: {
    type: 'category',
    // data: [aAxis[0], aAxis[parseInt(aAxis.length / 2)], aAxis[aAxis.length - 1]],
    data: midArr(aAxis),
    show: true,
    axisLabel: {
      // inside: false,
      interval: 0,
      rotate: 30,
    },
    axisLine: {
      show: false,
      fontFamily: 'PingFang SC Regular',
      lineStyle: {
        color: '#72758C',
      },
      fontWeight: 400,
    },
    axisTick: {
      show: false,
    }
  },
  yAxis: {
    type: 'value',
    name: yName,
    // nameGap: 20,
    nameTextStyle: {
      padding: [0, 20, 0, 0],
    },
    axisLabel: {
      show: true,
      // formatter: '{value} %',
    },
    axisLine: {
      show: false,
      fontFamily: 'PingFang SC Regular',
      // color: '#F1F4F9',
      lineStyle: {
        color: '#72758C',
      },
      fontWeight: 400,
    },
    axisTick: {
      show: false,
    },
    splitLine: {
      lineStyle: {
        color: '#F1F4F9',
        type: 'dotted',
      }
    }
  },
  grid: {
    top: 35,
    bottom: 35,
    left: 40,
    right: 0,
  },
  series: [
    {
      type: 'line',
      // symbol: 'circle',
      symbolSize: 1,
      sampling: 'average',
      itemStyle: {
        color: lineColor,
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0, color: '#FFF2DC' // 0% 处的颜色
        }, {
          offset: 1, color: '#FFF' // 100% 处的颜色
        }]
        ),
      },
      data: lineData,
    }
  ],
});

class PieEchart extends React.Component {
  constructor(props) {
    super(props);

    this.resizePie = this.resizeMap.bind(this);
    this.mountPie = this.mountMap.bind(this);
  }

  static propTypes = {
    lineData: PropTypes.array,
    lineColor: PropTypes.array,
    aAxis: PropTypes.array,
    rateText: PropTypes.string,
    yName: PropTypes.string,
    needPercent: PropTypes.bool,
  }
  static defaultProps = {
    needPercent: false,
  }

  componentDidMount() {
    this.mountMap(this.node);
    window.addEventListener('resize', this.resizePie);
  }

  componentWillReceiveProps(coming) {
    if (coming && coming.lineData &&
      coming.lineData !== this.props.lineData) {
      const option = getOption(coming.lineData, coming.lineColor, coming.aAxis, coming.rateText, coming.yName, coming.needPercent);
      this.pie.setOption(option);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizePie);
  }

  mountMap(node) {
    const option = getOption(this.props.lineData, this.props.lineColor, this.props.aAxis, this.props.rateText, this.props.yName, this.props.needPercent);
    this.pie = echarts.init(node);
    this.pie.setOption(option);
  }

  resizeMap() {
    if (this.pie) {
      this.pie.resize();
    }
  }

  pie = undefined;
  node = undefined;

  render() {
    return (
      <div className="trend-wrapper">
        <div className="trend-number" ref={(pie) => { this.node = pie; }} />
      </div>
    );
  }
}

export default PieEchart;
