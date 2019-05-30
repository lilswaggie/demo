import React from 'react';
import { Select } from 'antd';
import echarts from 'echarts/lib/echarts';
import ReactEcharts from 'echarts-for-react';
import 'echarts/lib/chart/map';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/line';
import ChinaAreaMap from '../echart/ChinaAreaMap';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/visualMap';
import 'echarts/map/js/china';
import { Icon } from 'antd';
import {
  formatNumber,
  msToHour,
  objectEchartsArray,
  objectEchartsHourArray,
  objectLineArray,
  objectLineHoutArray,
  objectLineXArray,
  timestampToTime
} from '../../util/CommonUtils';
import { message } from 'antd/lib/index';
import { getAxios, postAxios } from '../../axios/mainAxios';

const option = [
  <Select.Option value="专线可用率" key="1">
    专线可用率
  </Select.Option>,
  <Select.Option value="专线中断时长" key="2">
    专线中断时长
  </Select.Option>,
  <Select.Option value="专线时延" key="3">
    专线时延
  </Select.Option>,
  <Select.Option value="专线故障次数" key="4">
    专线故障次数
  </Select.Option>,
  <Select.Option value="专线投诉次数" key="5">
    专线投诉次数
  </Select.Option>,
  <Select.Option value="专线倒换次数" key="6">
    专线倒换次数
  </Select.Option>
];
//时间粒度数据对应
const timeGranularity = {
  MONTH: '月',
  WEEK: '周',
  DAY: '天',
  TIME: '时'
};
export default class Tab5 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemName: '专线可用率',
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
      }
    };
  }
  componentDidMount() {
    // 默认请求一次数据
    this.getMapDataOnPost('api/leased_lines/stats/usable/location');
    this.getRightData();
  }
  componentWillReceiveProps(next) {
    if (this.props.activeKey !== next.activeKey && next.activeKey === '5') {
      this.getMapDataOnPost('api/leased_lines/stats/usable/location');
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
        // this.getRightData();
      }
    );
  };
  // 选择框改变时再请求数据绘制地图
  changeSelect = value => {
    this.setState({
      itemName: value
    });
    if (value === '专线可用率') {
      this.getMapDataOnPost('api/leased_lines/stats/usable/location');
    } else if (value === '专线中断时长') {
      this.getMapDataOnPost('api/leased_lines/stats/interrupted/location');
    } else if (value === '专线时延') {
      this.getMapDataOnPost('api/leased_lines/stats/delay/location');
    } else if (value === '专线故障次数') {
      this.getMapDataOnPost('api/leased_lines/stats/fault/frequency/location');
    } else if (value === '专线投诉次数') {
      this.getMapDataOnPost('api/leased_lines/stats/complaint/location');
    } else if (value === '专线倒换次数') {
      this.getMapDataOnPost('api/leased_lines/stats/circuit_switch/location');
    }
  };
  // 请求左侧地图数据
  getMapData = url => {
    getAxios(
      url,
      data => {
        if (url === 'api/leased_lines/stats/interrupted/location') {
          this.setState({
            mapChart: objectEchartsHourArray(data.values)
          });
        } else {
          this.setState({
            mapChart: objectEchartsArray(data.values)
          });
        }
      },
      data => {
        message.error(data.message);
      }
    );
  };
  getMapDataOnPost = url => {
    postAxios(
      url,
      data => {
        if (url === 'api/leased_lines/stats/interrupted/location') {
          this.setState({
            mapChart: objectEchartsHourArray(data.values)
          });
        } else {
          this.setState({
            mapChart: objectEchartsArray(data.values)
          });
        }
      },
      data => {
        message.error(data.message);
      }
    );
  };
  // 请求右侧需要数据
  getRightData = () => {
    // 专线可用率的分时统计
    postAxios(
      'api/leased_lines/stats/usable/timed',
      data => {
        this.setState({
          showData1: {
            // average:data.average,
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
        });
      },
      data => {
        message.error(data.message);
      }
    );
    // 专线中断时长的分时统计
    postAxios(
      'api/leased_lines/stats/interrupted/timed',
      data => {
        this.setState({
          showData2: {
            //average:data.average,
            current: msToHour(data.current),
            ratio: data.ringRatio === null ? 0 : data.ringRatio,
            date: timestampToTime(
              data.time.timeGranularity,
              data.time.timeRange.until
            ),
            timeGranularity: timeGranularity[data.time.timeGranularity]
          },
          chart2X: objectLineXArray(data.values),
          chart2: objectLineHoutArray(data.values)
        });
      },
      data => {
        message.error(data.message);
      }
    );
    // 平均延时的分时统计
    getAxios(
      'api/leased_lines/stats/delay/timed',
      data => {
        this.setState({
          showData3: {
            // average:data.average,
            current: data.current,
            ratio: data.ringRatio === null ? 0 : data.ringRatio,
            date: timestampToTime(
              data.time.timeGranularity,
              data.time.timeRange.until
            ),
            timeGranularity: timeGranularity[data.time.timeGranularity]
          },
          chart3X: objectLineXArray(data.values),
          chart3: objectLineArray(data.values)
        });
      },
      data => {
        message.error(data.message);
      }
    );
    // 故障专线（故障专线数）的分时统计
    postAxios(
      'api/leased_lines/stats/fault/timed',
      data => {
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
        });
      },
      data => {
        message.error(data.message);
      }
    );
    // 专线投诉数的分时统计
    postAxios(
      'api/leased_lines/stats/complaint/timed',
      data => {
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
        });
      },
      data => {
        message.error(data.message);
      }
    );
    // 电路倒换次数的分时统计
    postAxios(
      'api/leased_lines/stats/circuit_switch/timed',
      data => {
        this.setState({
          showData6: {
            average: data.average,
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
        });
      },
      data => {
        message.error(data.message);
      }
    );
  };
  // 绘制右侧折线图
  getLine = () => {
    const options = [];
    const option1 = {
      tooltip: {
        trigger: 'axis'
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
          name: '专线可用率',
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
          name: '专线中断时长',
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
          name: '专线时延',
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
        trigger: 'axis'
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
          name: '专线故障次数',
          type: 'line',
          symbolSize: '6',
          sampling: 'average',
          itemStyle: {
            color: '#F65F7B'
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
                color: '#FFDFDC' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#FFF' // 100% 处的颜色
              }
            ])
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
          name: '专线投诉次数',
          type: 'line',
          symbolSize: '6',
          sampling: 'average',
          itemStyle: {
            color: '#FEA53D'
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
          name: '专线倒换次数',
          type: 'line',
          symbolSize: '6',
          sampling: 'average',
          itemStyle: {
            color: '#2C9CFA'
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
                color: '#BDE3FC' // 0% 处的颜色
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
    options.push(option1);
    options.push(option2);
    options.push(option3);
    options.push(option4);
    options.push(option5);
    options.push(option6);
    return options;
  };
  render() {
    const {
      showData1,
      showData2,
      showData3,
      showData4,
      showData5,
      showData6
    } = this.state;
    return (
      <div className="tab5">
        <div className="tab5Left">
          <Select defaultValue="专线可用率" onChange={this.changeSelect}>
            {option}
          </Select>
          <ChinaAreaMap
            dataArr={this.state.mapChart}
            className="map"
            itemName={this.state.itemName}
            changeLoc={this.changeLoc}
          />
        </div>
        <div className="tab5Right">
          <div className="item">
            <div className="info">
              <div className="line1">
                <span>专线可用率(%)/{showData1.timeGranularity}</span>
                <span>{showData1.date}</span>
              </div>
              <div className="line2">
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
              </div>
            </div>
            <div className="chart">
              <ReactEcharts
                option={this.getLine()[0]}
                notMerge={true}
                style={{ height: '100%' }}
              />
            </div>
          </div>
          <div className="item">
            <div className="info">
              <div className="line1">
                <span>专线中断时长(h)/{showData2.timeGranularity}</span>
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
              </div>
            </div>
            <div className="chart">
              <ReactEcharts
                option={this.getLine()[1]}
                notMerge={true}
                style={{ height: '100%' }}
              />
            </div>
          </div>
          <div className="item">
            <div className="info">
              <div className="line1">
                <span>专线时延(ms)/{showData3.timeGranularity}</span>
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
            <div className="chart">
              <ReactEcharts
                option={this.getLine()[2]}
                notMerge={true}
                style={{ height: '100%' }}
              />
            </div>
          </div>
          <div className="item">
            <div className="info">
              <div className="line1">
                <span>专线故障次数(次)/{showData4.timeGranularity}</span>
                <span>{showData4.date}</span>
              </div>
              <div className="line2">
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
            <div className="chart">
              <ReactEcharts
                option={this.getLine()[3]}
                notMerge={true}
                style={{ height: '100%' }}
              />
            </div>
          </div>
          <div className="item">
            <div className="info">
              <div className="line1">
                <span>专线投诉次数(次)/{showData5.timeGranularity}</span>
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
            <div className="chart">
              <ReactEcharts
                option={this.getLine()[4]}
                notMerge={true}
                style={{ height: '100%' }}
              />
            </div>
          </div>
          <div className="item">
            <div className="info">
              <div className="line1">
                <span>专线倒换次数(次)/{showData6.timeGranularity}</span>
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
                <span className="dayAver">日均:{showData6.average}</span>
              </div>
            </div>
            <div className="chart">
              <ReactEcharts
                option={this.getLine()[5]}
                notMerge={true}
                style={{ height: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
