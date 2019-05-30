import React from 'react';
import PropTypes from 'prop-types';

import echarts from 'echarts';

import { formatNumber } from '../../../util/CommonUtils';

import '../../../assets/css/pub/bar-chart.scss';

import SliderHoverSvg from '../../../assets/css/pub/slider-hover.svg';

// 绘制柱状图
const getOption = (barValue, barAxis, itemName, needPercent, yName) => ({
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
          <span style="color: #000;">${params.name}</span>
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
    bottom: 8,
    height: 8,
    showDetail: false,
    backgroundColor: '#D8D8D8',
    fillerColor: '#50AFFF',
    handleIcon: `image://${SliderHoverSvg}`,
    handleSize: '200%',
    showDataShadow: false,
    borderColor: 'transparent'
  },
  xAxis: {
    type: 'category',
    // data: barAxis || barValue.map(d => d.name),
    data: barAxis,
    axisLabel: {
      // inside: false,
      interval: 0,
      rotate: 10
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
    name: yName,
    nameTextStyle: {
      padding: [0, 20, 0, 0]
    },
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
    top: 35,
    bottom: 35,
    left: 45,
    right: 0
  },
  series: [
    {
      type: 'bar',
      barCategoryGap: '20',
      barWidth: '10',
      // name: '站点数',
      itemStyle: {
        normal: {
          color: '#32A2F7'
        },
        emphasis: {
          color: '#7CC7FF'
        }
      },
      data: barValue
    }
  ]
});

class BarEchart extends React.Component {
  constructor(props) {
    super(props);

    this.resizePie = this.resizeMap.bind(this);
    this.mountPie = this.mountMap.bind(this);
  }

  static propTypes = {
    barValue: PropTypes.array,
    barAxis: PropTypes.array,
    itemName: PropTypes.string,
    needPercent: PropTypes.bool,
    yName: PropTypes.string
  };
  static defaultProps = {
    needPercent: false
  };

  componentDidMount() {
    this.mountMap(this.node);
    window.addEventListener('resize', this.resizePie);
  }

  componentWillReceiveProps(coming) {
    if (coming && coming.barValue && coming.barValue !== this.props.barValue) {
      const option = getOption(
        coming.barValue,
        coming.barAxis,
        coming.itemName,
        coming.needPercent,
        coming.yName
      );
      this.pie.setOption(option);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizePie);
  }

  mountMap(node) {
    const option = getOption(
      this.props.barValue,
      this.props.barAxis,
      this.props.itemName,
      this.props.needPercent,
      this.props.yName
    );
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
      <div className="network-wrapper">
        <div
          className="network"
          ref={pie => {
            this.node = pie;
          }}
        />
      </div>
    );
  }
}

export default BarEchart;
