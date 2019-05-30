import React from 'react';
import echarts from 'echarts';
import { formatNumber } from '../../../util/CommonUtils';
import '../stylesheets/piechart.scss';

// 绘制饼图
const getOption = (pieData, pieColor, graphicText, seriesName) => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)',
    textStyle: {
      fontSize: 14
    }
  },
  graphic: {
    type: 'text',
    left: 'center',
    top: 'center',
    style: {
      text: graphicText,
      textAlign: 'center',
      fill: '#72758C',
      width: 30,
      height: 30,
      font: '400 14px PingFangSC-Regular'
    }
  },
  series: [
    {
      name: seriesName,
      type: 'pie',
      radius: [55, 75],
      center: ['50%', '50%'],
      roseType: 'radius',
      // color: ['#71CA41', '#8776EF', '#F65F7B', '#F0B34A'],
      color: pieColor,
      data: pieData,
      itemStyle: {
        normal: {
          label: {
            show: true,
            formatter: function(params) {
              return params.name + ':\n' + formatNumber(params.value);
            },
            color: '#72758C',
            fontSize: 14
          },
          labelLine: { show: true }
        }
      }
    },
    {
      name: '',
      type: 'pie',
      radius: [85, 87],
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
    if (coming && coming.pieData && coming.pieData !== this.props.pieData) {
      const option = getOption(
        coming.pieData,
        this.props.pieColor,
        this.props.graphicText,
        this.props.seriesName
      );
      this.pie.setOption(option);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizePie);
  }

  mountMap(node) {
    const option = getOption(
      this.props.pieData,
      this.props.pieColor,
      this.props.graphicText,
      this.props.seriesName
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
    // const { alarmTotal } = this.props;
    return (
      <div className="client-number-wrapper">
        <div
          className="client-number"
          ref={pie => {
            this.node = pie;
          }}
        />
        {/* <div className="alarm-total">{`${alarmTotal}条`}</div> */}
      </div>
    );
  }
}

export default PieEchart;
