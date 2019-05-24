import React from 'react';
import echarts from 'echarts';
import './lineChart.scss';

// 绘制饼图
const getOption = (lineData, lineColor, aAxis, rateText) => ({
  tooltip: {
    // trigger:'axis',
    // axisPointer: {
    //   type: 'cross',
    //   label: {
    //     backgroundColor: '#6a7985'
    //   }
    // }
  },
  xAxis: {
    type: 'category',
    data: aAxis,
    // show: false,
    axisLabel: {
      show: true,
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
    name: '%',
    // nameGap: 20,
    nameTextStyle: {
      // align: 'left',
      padding: [0, 20, 0, 0],
    },
    axisLabel: {
      show: true,
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
      name: rateText,
      type: 'line',
      // symbol: 'line',
      symbolSize: 8,
      sampling: 'average',
      label: {
        show: true,
      },
      itemStyle: {
        color: lineColor,
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1,[{
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

  componentDidMount() {
    this.mountMap(this.node);
    window.addEventListener('resize', this.resizePie);
  }

  componentWillReceiveProps(coming) {
    if (coming && coming.lineData &&
      coming.lineData !== this.props.lineData) {
      const option = getOption(coming.lineData, coming.lineColor, coming.aAxis, coming.rateText);
      this.pie.setOption(option);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizePie);
  }

  mountMap(node) {
    const option = getOption(this.props.lineData, this.props.lineColor, this.props.aAxis, this.props.rateText);
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
    // const { alarmTotal } = this.props;
    return (
      <div className="client-number-wrapper">
        <div className="client-number" ref={(pie) => { this.node = pie; }} />
        {/* <div className="alarm-total">{`${alarmTotal}条`}</div> */}
      </div>
    );
  }
}

export default PieEchart;
