import React from 'react';
import { Select, Icon } from 'antd';

import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import ChinaAreaMap from '../echart/ChinaAreaMap';

import { getAxios, postAxios } from '../../axios/mainAxios';

import {
  formatNumber,
  objectEchartsArray,
  objectLineArray,
  timestampToTime,
  objectLineXArray,
  msToHour,
  objectLineHoutArray,
  objectEchartsHourArray
} from '../../util/CommonUtils';

const option = [
  <Select.Option value="光缆故障次数" key="1">
    光缆故障次数
  </Select.Option>,
  <Select.Option value="光功率不合格端口数" key="2">
    光功率不合格端口数
  </Select.Option>,
  <Select.Option value="网络故障处理时长" key="3">
    网络故障处理时长
  </Select.Option>,
  <Select.Option value="设备故障次数" key="4">
    设备故障次数
  </Select.Option>,
  <Select.Option value="误码率不合格端口数" key="5">
    误码率不合格端口数
  </Select.Option>,
  <Select.Option value="网络故障处理及时率" key="6">
    网络故障处理及时率
  </Select.Option>,
  <Select.Option value="电路可用率" key="7">
    电路可用率
  </Select.Option>,
  <Select.Option value="电路中断时长" key="8">
    电路中断时长
  </Select.Option>
];
//时间粒度数据对应
const timeGranularity = {
  MONTH: '月',
  WEEK: '周',
  DAY: '天',
  TIME: '时'
};

export default class Tab4 extends React.Component {
  state = {
    itemName: '光缆故障次数',
    location: '全国', // 分时统计折线图加入省份参数
    net: true,
    mapChart: [],
    chart1X: [],
    chart1: [],
    showData1: {
      average: 0,
      current: 0,
      ratio: 0,
      date: 0,
      timeGranularity: ''
    },
    chart2X: [],
    chart2: [],
    showData2: {
      average: 0,
      current: 0,
      ratio: 0,
      date: 0,
      timeGranularity: ''
    },
    chart3X: [],
    chart3: [],
    showData3: {
      average: 0,
      current: 0,
      ratio: 0,
      date: 0,
      timeGranularity: ''
    },
    chart4X: [],
    chart4: [],
    showData4: {
      average: 0,
      current: 0,
      ratio: 0,
      date: 0,
      timeGranularity: ''
    },
    chart5X: [],
    chart5: [],
    showData5: {
      average: 0,
      current: 0,
      ratio: 0,
      date: 0,
      timeGranularity: ''
    },
    chart6X: [],
    chart6: [],
    showData6: {
      average: 0,
      current: 0,
      ratio: 0,
      date: 0,
      timeGranularity: ''
    },
    chart7X: [],
    chart7: [],
    showData7: {
      average: 0,
      current: 0,
      ratio: 0,
      date: 0,
      timeGranularity: ''
    },
    chart8X: [],
    chart8: [],
    showData8: {
      average: 0,
      current: 0,
      ratio: 0,
      date: 0,
      timeGranularity: ''
    }
  };

  componentDidMount() {
    this.getMapData('api/network/stats/optical_cable_fault/location');
    this.getRightData();
  }

  componentWillReceiveProps(next) {
    if (this.props.activeKey !== next.activeKey && next.activeKey === '4') {
      this.getMapData('api/customers/stats/num/location');
      this.getRightData();
    }
  }
  // 改变省份参数
  changeLoc = loc => {
    this.setState(
      {
        location: loc
      },
      () => {
        this.getRightData();
      }
    );
  };
  // 选择框改变时再请求数据绘制地图
  changeSelect = value => {
    this.setState({
      itemName: value
    });
    if (value === '光缆故障次数') {
      this.getMapData('api/network/stats/optical_cable_fault/location');
    } else if (value === '光功率不合格端口数') {
      this.getMapData('api/network/stats/port_fault/location');
    } else if (value === '网络故障处理时长') {
      this.getMapDataOnPost('api/network/stats/fault_handling_time/location');
    } else if (value === '设备故障次数') {
      this.getMapDataOnPost('api/network/elements/stats/fault_num/location');
    } else if (value === '误码率不合格端口数') {
      this.getMapData('api/network/stats/wave_fault/location');
    } else if (value === '网络故障处理及时率') {
      this.getMapDataOnPost('api/network/stats/fault_handling_rate/location');
    } else if (value === '电路可用率') {
      this.getMapDataOnPost('api/network/stats/electric_usage/location');
    } else if (value === '电路中断时长') {
      this.getMapDataOnPost('api/network/stats/electric_interrupted/location');
    }
  };
  // 请求左侧地图数据
  getMapData = url => {
    getAxios(url, data => {
      if (
        url === 'api/network/stats/fault_handling_time/location' ||
        url === 'api/network/stats/electric_interrupted/location'
      ) {
        this.setState({
          mapChart: objectEchartsHourArray(data.values)
        });
      } else {
        this.setState({
          mapChart: objectEchartsArray(data.values)
        });
      }
    });
  };
  getMapDataOnPost = url => {
    postAxios(url, data => {
      if (
        url === 'api/network/stats/fault_handling_time/location' ||
        url === 'api/network/stats/electric_interrupted/location'
      ) {
        this.setState({
          mapChart: objectEchartsHourArray(data.values)
        });
      } else {
        this.setState({
          mapChart: objectEchartsArray(data.values)
        });
      }
    });
  };
  // 请求右侧需要数据
  getRightData = () => {
    // 光缆故障次数的分时统计
    getAxios('api/network/stats/optical_cable_fault/timed', data =>
      this.setState({
        showData1: {
          average: data.average,
          current: data.current,
          ratio: data.ringRatio === null ? 0 : data.ringRatio,
          date: timestampToTime(
            data.time.timeGranularity,
            data.time.timeRange.until
          ),
          timeGranularity: timeGranularity[data.time.timeGranularity]
        },
        chart1X: objectLineXArray(data.values),
        chart1: objectLineArray(data.values)
      })
    );
    // 光功率不合格端口数的分时统计
    getAxios('api/network/stats/port_fault/timed', data =>
      this.setState({
        showData2: {
          average: data.average,
          current: data.current,
          ratio: data.ringRatio === null ? 0 : data.ringRatio,
          date: timestampToTime(
            data.time.timeGranularity,
            data.time.timeRange.until
          ),
          timeGranularity: timeGranularity[data.time.timeGranularity]
        },
        chart2X: objectLineXArray(data.values),
        chart2: objectLineArray(data.values),
        timeGranularity: timeGranularity[data.time.timeGranularity]
      })
    );
    // 网络故障处理时长的分时统计
    postAxios('api/network/stats/fault_handling_time/timed', data => {
      this.setState({
        showData3: {
          // average:data.average,
          current: msToHour(data.current),
          ratio: data.ringRatio === null ? 0 : data.ringRatio,
          date: timestampToTime(
            data.time.timeGranularity,
            data.time.timeRange.until
          ),
          timeGranularity: timeGranularity[data.time.timeGranularity]
        },
        chart3X: objectLineXArray(data.values),
        chart3: objectLineHoutArray(data.values)
      });
    });
    // 网元故障次数的分时统计
    postAxios('api/network/elements/stats/fault_num/timed', data =>
      this.setState({
        showData4: {
          average: data.average,
          current: data.current,
          ratio: data.ringRatio === null ? 0 : data.ringRatio,
          date: timestampToTime(
            data.time.timeGranularity,
            data.time.timeRange.until
          ),
          timeGranularity: timeGranularity[data.time.timeGranularity]
        },
        chart4X: objectLineXArray(data.values),
        chart4: objectLineArray(data.values)
      })
    );
    // 不合格波道数的分时统计
    getAxios('api/network/stats/wave_fault/timed', data =>
      this.setState({
        showData5: {
          average: data.average,
          current: data.current,
          ratio: data.ringRatio === null ? 0 : data.ringRatio,
          date: timestampToTime(
            data.time.timeGranularity,
            data.time.timeRange.until
          ),
          timeGranularity: timeGranularity[data.time.timeGranularity]
        },
        chart5X: objectLineXArray(data.values),
        chart5: objectLineArray(data.values)
      })
    );
    // 网络故障处理及时率的分时统计
    postAxios('api/network/stats/fault_handling_rate/timed', data =>
      this.setState({
        showData6: {
          // average:data.average,
          current: data.current,
          ratio: data.ringRatio === null ? 0 : data.ringRatio,
          date: timestampToTime(
            data.time.timeGranularity,
            data.time.timeRange.until
          ),
          timeGranularity: timeGranularity[data.time.timeGranularity]
        },
        chart6X: objectLineXArray(data.values),
        chart6: objectLineArray(data.values)
      })
    );
    // 电路可用率的分时统计
    postAxios('api/network/stats/electric_usage/timed', data =>
      this.setState({
        showData7: {
          // average:data.average,
          current: data.current,
          ratio: data.ringRatio === null ? 0 : data.ringRatio,
          date: timestampToTime(
            data.time.timeGranularity,
            data.time.timeRange.until
          ),
          timeGranularity: timeGranularity[data.time.timeGranularity]
        },
        chart7X: objectLineXArray(data.values),
        chart7: objectLineArray(data.values)
      })
    );
    // 电路中断时长的分时统计
    postAxios('api/network/stats/electric_interrupted/timed', data =>
      this.setState({
        showData8: {
          // average:data.average,
          current: msToHour(data.current),
          ratio: data.ringRatio === null ? 0 : data.ringRatio,
          date: timestampToTime(
            data.time.timeGranularity,
            data.time.timeRange.until
          ),
          timeGranularity: timeGranularity[data.time.timeGranularity]
        },
        chart8X: objectLineXArray(data.values),
        chart8: objectLineHoutArray(data.values)
      })
    );
  };
  // 绘制右侧折线图
  getLine = () => {
    const options = [];
    const option1 = {
      tooltip: {
        trigger: 'axis',
        position: function(p) {
          return [p[0] + 30, p[1] - 80];
        }
      },
      xAxis: {
        type: 'category',
        data: this.state.chart1X,
        show: false
      },
      yAxis: {
        type: 'value',
        show: false
      },
      grid: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      },
      series: [
        {
          name: '光缆故障次数',
          type: 'line',
          symbolSize: '6',
          sampling: 'average',
          itemStyle: {
            color: '#FFBB44'
          },
          markLine: {
            label: {
              position: 'middle',
              formatter: '日均'
            },
            lineStyle: {
              width: 1,
              type: 'dashed',
              color: '#2C9CFA '
            },
            symbol: 'none',
            data: [{ type: 'average', name: '平均值' }]
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#FFF2DC' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#FFF' // 100% 处的颜色
              }
            ])
          },
          data: this.state.chart1
        }
      ]
    };
    const option2 = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: this.state.chart2X,
        show: false
      },
      yAxis: {
        type: 'value',
        show: false
      },
      grid: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      },
      series: [
        {
          name: '光功率不合格端口数',
          type: 'line',
          symbolSize: '6',
          sampling: 'average',
          itemStyle: {
            color: '#8372EF'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#E2E1F7' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#FFF' // 100% 处的颜色
              }
            ])
          },
          markLine: {
            label: {
              position: 'middle',
              formatter: '日均'
            },
            lineStyle: {
              width: 1,
              type: 'dashed',
              color: '#2C9CFA '
            },
            symbol: 'none',
            data: [{ type: 'average', name: '平均值' }]
          },
          data: this.state.chart2
        }
      ]
    };
    const option3 = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: this.state.chart3X,
        show: false
      },
      yAxis: {
        type: 'value',
        show: false
      },
      grid: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      },
      series: [
        {
          name: '网络故障处理时长',
          type: 'line',
          symbolSize: '6',
          sampling: 'average',
          itemStyle: {
            color: '#72CC43'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#DEFFCC' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#FFF' // 100% 处的颜色
              }
            ])
          },
          data: this.state.chart3
        }
      ]
    };
    const option4 = {
      tooltip: {
        trigger: 'axis',
        position: function(p) {
          return [p[0] + 30, p[1] - 80];
        }
      },
      xAxis: {
        type: 'category',
        data: this.state.chart4X,
        show: false
      },
      yAxis: {
        type: 'value',
        show: false
      },
      grid: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      },
      series: [
        {
          name: '设备故障次数',
          type: 'line',
          symbolSize: '6',
          sampling: 'average',
          itemStyle: {
            color: '#FFBB44'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#FFF2DC' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#FFF' // 100% 处的颜色
              }
            ])
          },
          markLine: {
            label: {
              position: 'middle',
              formatter: '日均'
            },
            lineStyle: {
              width: 1,
              type: 'dashed',
              color: '#2C9CFA '
            },
            symbol: 'none',
            data: [{ type: 'average', name: '平均值' }]
          },
          data: this.state.chart4
        }
      ]
    };
    const option5 = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: this.state.chart5X,
        show: false
      },
      yAxis: {
        type: 'value',
        show: false
      },
      grid: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      },
      series: [
        {
          name: '误码率不合格端口数',
          type: 'line',
          symbolSize: '6',
          sampling: 'average',
          itemStyle: {
            color: '#8372EF'
          },
          markLine: {
            label: {
              position: 'middle',
              formatter: '日均'
            },
            lineStyle: {
              width: 1,
              type: 'dashed',
              color: '#2C9CFA '
            },
            symbol: 'none',
            data: [{ type: 'average', name: '平均值' }]
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#E2E1F7' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#FFF' // 100% 处的颜色
              }
            ])
          },
          data: this.state.chart5
        }
      ]
    };
    const option6 = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: this.state.chart6X,
        show: false
      },
      yAxis: {
        type: 'value',
        show: false
      },
      grid: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      },
      series: [
        {
          name: '网络故障处理时长',
          type: 'line',
          symbolSize: '6',
          sampling: 'average',
          itemStyle: {
            color: '#72CC43'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#DEFFCC' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#FFF' // 100% 处的颜色
              }
            ])
          },
          data: this.state.chart6
        }
      ]
    };
    const option7 = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: this.state.chart7X,
        show: false
      },
      yAxis: {
        type: 'value',
        show: false
      },
      grid: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      },
      series: [
        {
          name: '电路可用率',
          type: 'line',
          symbolSize: '6',
          sampling: 'average',
          itemStyle: {
            color: '#8372EF'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#E2E1F7' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#FFF' // 100% 处的颜色
              }
            ])
          },
          data: this.state.chart7
        }
      ]
    };
    const option8 = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: this.state.chart8X,
        show: false
      },
      yAxis: {
        type: 'value',
        show: false
      },
      grid: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      },
      series: [
        {
          name: '电路中断时长',
          type: 'line',
          symbolSize: '6',
          sampling: 'average',
          itemStyle: {
            color: '#FFBB44'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#FFF2DC' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#FFF' // 100% 处的颜色
              }
            ])
          },
          data: this.state.chart8
        }
      ]
    };
    options.push(option1);
    options.push(option2);
    options.push(option3);
    options.push(option4);
    options.push(option5);
    options.push(option6);
    options.push(option7);
    options.push(option8);
    return options;
  };
  render() {
    const {
      showData1,
      showData2,
      showData3,
      showData4,
      showData5,
      showData6,
      showData7,
      showData8
    } = this.state;
    return (
      <div className="tab4">
        <div className="tab4Left">
          <Select defaultValue="光缆故障次数" onChange={this.changeSelect}>
            {option}
          </Select>
          <ChinaAreaMap
            dataArr={this.state.mapChart}
            className="map"
            itemName={this.state.itemName}
            changeLoc={this.changeLoc}
          />
        </div>
        <div className="tab4Right">
          <div className="item">
            <div className="info">
              <div className="line1">
                <span>光缆故障次数(次)/{showData1.timeGranularity}</span>
                <span>{showData1.date}</span>
              </div>
              <div className="line2">
                当前
                <span className="big">{formatNumber(showData1.current)}</span>
                <span style={{ marginRight: '0.3rem' }}>
                  {Math.abs(showData1.ratio)}%
                </span>
                <Icon
                  type="arrow-up"
                  theme="outlined"
                  style={
                    showData1.ratio > 0
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                />
                <Icon
                  type="arrow-down"
                  theme="outlined"
                  style={
                    showData1.ratio < 0
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                />
                <span
                  style={
                    showData1.ratio === 0
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                >
                  —
                </span>
                <span className="dayAver">日均:{showData1.average}</span>
              </div>
            </div>
            <ReactEcharts
              option={this.getLine()[0]}
              notMerge={true}
              style={{ height: '60%' }}
            />
          </div>
          <div className="item">
            <div className="info">
              <div className="line1">
                <span>光功率不合格端口数(个)/{showData2.timeGranularity}</span>
                <span>{showData2.date}</span>
              </div>
              <div className="line2">
                <span className="big">{formatNumber(showData2.current)}</span>
                <span style={{ marginRight: '0.3rem' }}>
                  {Math.abs(showData2.ratio)}%
                </span>
                <Icon
                  type="arrow-up"
                  theme="outlined"
                  style={
                    showData2.ratio > 0
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                />
                <Icon
                  type="arrow-down"
                  theme="outlined"
                  style={
                    showData2.ratio < 0
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                />
                <span
                  style={
                    showData2.ratio === 0
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                >
                  —
                </span>
                <span className="dayAver">日均:{showData2.average}</span>
              </div>
            </div>
            <ReactEcharts
              option={this.getLine()[1]}
              notMerge={true}
              style={{ height: '60%' }}
            />
          </div>
          <div className="item">
            <div className="info">
              <div className="line1">
                <span>网络故障处理时长(h)/{showData3.timeGranularity}</span>
                <span>{showData3.date}</span>
              </div>
              <div className="line2">
                <span className="big">{formatNumber(showData3.current)}</span>
                <span style={{ marginRight: '0.3rem' }}>
                  {Math.abs(showData3.ratio)}%
                </span>
                <Icon
                  type="arrow-up"
                  theme="outlined"
                  style={
                    showData3.ratio > 0
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                />
                <Icon
                  type="arrow-down"
                  theme="outlined"
                  style={
                    showData3.ratio < 0
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                />
                <span
                  style={
                    showData3.ratio === 0
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                >
                  —
                </span>
              </div>
            </div>
            <ReactEcharts
              option={this.getLine()[2]}
              notMerge={true}
              style={{ height: '60%' }}
            />
          </div>
          <div className="item">
            <div className="info">
              <div className="line1">
                <span>设备故障次数(次)/{showData4.timeGranularity}</span>
                <span>{showData4.date}</span>
              </div>
              <div className="line2">
                当前
                <span className="big">{formatNumber(showData4.current)}</span>
                <span style={{ marginRight: '0.3rem' }}>
                  {Math.abs(showData4.ratio)}%
                </span>
                <Icon
                  type="arrow-up"
                  theme="outlined"
                  style={
                    showData4.ratio > 0
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                />
                <Icon
                  type="arrow-down"
                  theme="outlined"
                  style={
                    showData4.ratio < 0
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                />
                <span
                  style={
                    showData4.ratio === 0
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                >
                  —
                </span>
                <span className="dayAver">日均:{showData4.average}</span>
              </div>
            </div>
            <ReactEcharts
              option={this.getLine()[3]}
              notMerge={true}
              style={{ height: '60%' }}
            />
          </div>
          <div className="item">
            <div className="info">
              <div className="line1">
                <span>误码率不合格端口数(个)/{showData5.timeGranularity}</span>
                <span>{showData5.date}</span>
              </div>
              <div className="line2">
                <span className="big">{formatNumber(showData5.current)}</span>
                <span style={{ marginRight: '0.3rem' }}>
                  {Math.abs(showData5.ratio)}%
                </span>
                <Icon
                  type="arrow-up"
                  theme="outlined"
                  style={
                    showData5.ratio > 0
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                />
                <Icon
                  type="arrow-down"
                  theme="outlined"
                  style={
                    showData5.ratio < 0
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                />
                <span
                  style={
                    showData5.ratio === 0
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                >
                  —
                </span>
                <span className="dayAver">日均:{showData5.average}</span>
              </div>
            </div>
            <ReactEcharts
              option={this.getLine()[4]}
              notMerge={true}
              style={{ height: '60%' }}
            />
          </div>
          <div className="item" style={{ paddingRight: 2 }}>
            <div className="info">
              <div className="line1">
                <span>网络故障处理及时率(%)/{showData6.timeGranularity}</span>
                <span>{showData6.date}</span>
              </div>
              <div className="line2">
                <span className="big">{formatNumber(showData6.current)}</span>
                <span style={{ marginRight: '0.3rem' }}>
                  {Math.abs(showData6.ratio)}%
                </span>
                <Icon
                  type="arrow-up"
                  theme="outlined"
                  style={
                    showData6.ratio > 0
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                />
                <Icon
                  type="arrow-down"
                  theme="outlined"
                  style={
                    showData6.ratio < 0
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                />
                <span
                  style={
                    showData6.ratio === 0
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                >
                  —
                </span>
              </div>
            </div>
            <ReactEcharts
              option={this.getLine()[5]}
              notMerge={true}
              style={{ height: '60%' }}
            />
          </div>
          <div className="item" style={{ width: '49%' }}>
            <div className="info">
              <div className="line1">
                <span>电路可用率(%)/{showData7.timeGranularity}</span>
                <span>{showData7.date}</span>
              </div>
              <div className="line2">
                <span className="big">{formatNumber(showData7.current)}</span>
                <span style={{ marginRight: '0.3rem' }}>
                  {Math.abs(showData7.ratio)}%
                </span>
                <Icon
                  type="arrow-up"
                  theme="outlined"
                  style={
                    showData7.ratio > 0
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                />
                <Icon
                  type="arrow-down"
                  theme="outlined"
                  style={
                    showData7.ratio < 0
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                />
                <span
                  style={
                    showData7.ratio === 0
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                >
                  —
                </span>
              </div>
            </div>
            <ReactEcharts
              option={this.getLine()[6]}
              notMerge={true}
              style={{ height: '60%' }}
            />
          </div>
          <div className="item" style={{ width: '49%' }}>
            <div className="info">
              <div className="line1">
                <span>电路中断时长(h)/{showData8.timeGranularity}</span>
                <span>{showData8.date}</span>
              </div>
              <div className="line2">
                <span className="big">{formatNumber(showData8.current)}</span>
                <span style={{ marginRight: '0.3rem' }}>
                  {Math.abs(showData8.ratio)}%
                </span>
                <Icon
                  type="arrow-up"
                  theme="outlined"
                  style={
                    showData8.ratio > 0
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                />
                <Icon
                  type="arrow-down"
                  theme="outlined"
                  style={
                    showData8.ratio < 0
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                />
                <span
                  style={
                    showData7.ratio === 0
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                >
                  —
                </span>
              </div>
            </div>
            <ReactEcharts
              option={this.getLine()[7]}
              notMerge={true}
              style={{ height: '60%' }}
            />
          </div>
        </div>
      </div>
    );
  }
}
