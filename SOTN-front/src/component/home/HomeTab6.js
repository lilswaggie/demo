import React from 'react';
import { Select } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/map';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/line';
import ChinaAreaMap from '../echart/ChinaAreaMap';
import ReactEcharts from 'echarts-for-react';
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
  <Select.Option value="专线投诉处理个数" key="1">
    专线投诉处理个数
  </Select.Option>,
  <Select.Option value="专线投诉处理及时率" key="2">
    专线投诉处理及时率
  </Select.Option>,
  <Select.Option value="专线投诉处理时长" key="3">
    专线投诉处理时长
  </Select.Option>,
  <Select.Option value="专线故障处理及时率" key="4">
    专线故障处理及时率
  </Select.Option>,
  <Select.Option value="专线故障处理时长" key="5">
    专线故障处理时长
  </Select.Option>,
  <Select.Option value="勘查及时率" key="6">
    勘查及时率
  </Select.Option>,
  <Select.Option value="勘查处理时长" key="7">
    勘查处理时长
  </Select.Option>,
  <Select.Option value="开通及时率" key="8">
    开通及时率
  </Select.Option>,
  <Select.Option value="开通处理时长" key="9">
    开通处理时长
  </Select.Option>
];
//时间粒度数据对应
const timeGranularity = {
  MONTH: '月',
  WEEK: '周',
  DAY: '天',
  TIME: '时'
};
export default class Tab6 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemName: '专线投诉处理个数',
      net: true,
      location: '全国', // 分时统计折线图加入省份参数
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
      },
      chart9X: [],
      chart9: [],
      showData9: {
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
    this.getMapData('api/handling/stats/complaint_num/location');
    this.getRightData();
  }
  componentWillReceiveProps(next) {
    if (this.props.activeKey !== next.activeKey && next.activeKey === '6') {
      this.getMapData('api/handling/stats/complaint_num/location');
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
    if (value === '专线投诉处理个数') {
      this.getMapData('api/handling/stats/complaint_num/location');
    } else if (value === '专线投诉处理及时率') {
      this.getMapDataOnPost('api/handling/stats/complaint_rate/location');
    } else if (value === '专线投诉处理时长') {
      this.getMapDataOnPost('api/handling/stats/complaint_time/location');
    } else if (value === '专线故障处理及时率') {
      this.getMapData('api/handling/stats/leased_line_fault_rate/location');
    } else if (value === '专线故障处理时长') {
      this.getMapData('api/handling/stats/leased_line_fault_time/location');
    } else if (value === '勘查及时率') {
      this.getMapData('api/handling/stats/survey_rate/location', postAxios);
    } else if (value === '勘查处理时长') {
      this.getMapData('api/handling/stats/survey_time/location');
    } else if (value === '开通及时率') {
      this.getMapDataOnPost('api/handling/stats/open_up_rate/location');
    } else if (value === '开通处理时长') {
      this.getMapData('api/handling/stats/opening_handling_avg_time/location');
    }
  };
  // 请求左侧地图数据
  getMapData = (url, axiosMethod = getAxios) => {
    axiosMethod(url, data => {
      if (
        url === 'api/handling/stats/complaint_time/location' ||
        url === 'api/handling/stats/leased_line_fault_time/location' ||
        url === 'api/handling/stats/survey_time/location' ||
        url === 'api/handling/stats/opening_handling_avg_time/location'
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
        url === 'api/handling/stats/complaint_time/location' ||
        url === 'api/handling/stats/leased_line_fault_time/location' ||
        url === 'api/handling/stats/survey_time/location' ||
        url === 'api/handling/stats/opening_handling_avg_time/location'
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
    // 处理投诉次数的分时统计
    getAxios(
      'api/handling/stats/complaint_num/timed',
      data => {
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
        });
      },
      data => {
        message.error(data.message);
      }
    );
    // 投诉处理及时率的分时统计
    postAxios(
      'api/handling/stats/complaint_rate/timed',
      data => {
        this.setState({
          showData2: {
            // average:data.average,
            current: data.current,
            ratio: data.ringRatio === null ? 0 : data.ringRatio,
            date: timestampToTime(
              data.time.timeGranularity,
              data.time.timeRange.until
            ),
            timeGranularity: timeGranularity[data.time.timeGranularity]
          },
          chart2X: objectLineXArray(data.values),
          chart2: objectLineArray(data.values)
        });
      },
      data => {
        message.error(data.message);
      }
    );
    // 投诉处理时长的分时统计
    postAxios(
      'api/handling/stats/complaint_time/timed',
      data => {
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
      },
      data => {
        message.error(data.message);
      }
    );
    // 专线故障处理及时率的分时统计
    getAxios(
      'api/handling/stats/leased_line_fault_rate/timed',
      data => {
        this.setState({
          showData4: {
            // average:data.average,
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
    // 专线故障处理时长的分时统计
    getAxios(
      'api/handling/stats/leased_line_fault_time/timed',
      data => {
        this.setState({
          showData5: {
            // average:data.average,
            current: msToHour(data.current),
            ratio: data.ringRatio === null ? 0 : data.ringRatio,
            date: timestampToTime(
              data.time.timeGranularity,
              data.time.timeRange.until
            ),
            timeGranularity: timeGranularity[data.time.timeGranularity]
          },
          chart5X: objectLineXArray(data.values),
          chart5: objectLineHoutArray(data.values)
        });
      },
      data => {
        message.error(data.message);
      }
    );
    // 勘察及时率的分时统计
    getAxios(
      'api/handling/stats/survey_rate/timed',
      data => {
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
        });
      },
      data => {
        message.error(data.message);
      }
    );
    // 勘察平均时长的分时统计
    getAxios(
      'api/handling/stats/survey_time/timed',
      data => {
        this.setState({
          showData7: {
            // average:data.average,
            current: msToHour(data.current),
            ratio: data.ringRatio === null ? 0 : data.ringRatio,
            date: timestampToTime(
              data.time.timeGranularity,
              data.time.timeRange.until
            ),
            timeGranularity: timeGranularity[data.time.timeGranularity]
          },
          chart7X: objectLineXArray(data.values),
          chart7: objectLineHoutArray(data.values)
        });
      },
      data => {
        message.error(data.message);
      }
    );
    // 开通及时率的分时统计
    getAxios(
      'api/handling/stats/open_up_rate/timed',
      data => {
        this.setState({
          showData8: {
            // average:data.average,
            current: data.current,
            ratio: data.ringRatio === null ? 0 : data.ringRatio,
            date: timestampToTime(
              data.time.timeGranularity,
              data.time.timeRange.until
            ),
            timeGranularity: timeGranularity[data.time.timeGranularity]
          },
          chart8X: objectLineXArray(data.values),
          chart8: objectLineArray(data.values)
        });
      },
      data => {
        message.error(data.message);
      }
    );
    // 开通平均时长的分时统计
    getAxios(
      'api/handling/stats/opening_handling_avg_time/timed',
      data => {
        this.setState({
          showData9: {
            // average:data.average,
            current: msToHour(data.current),
            ratio: data.ringRatio === null ? 0 : data.ringRatio,
            date: timestampToTime(
              data.time.timeGranularity,
              data.time.timeRange.until
            ),
            timeGranularity: timeGranularity[data.time.timeGranularity]
          },
          chart9X: objectLineXArray(data.values),
          chart9: objectLineHoutArray(data.values)
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
          name: '专线投诉处理个数',
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
          name: '专线投诉处理及时率',
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
          name: '专线投诉处理时长',
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
          name: '专线故障处理及时率',
          type: 'line',
          symbolSize: '6',
          sampling: 'average',
          itemStyle: {
            color: '#F65F7B'
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
          name: '专线故障处理时长',
          type: 'line',
          symbolSize: '6',
          sampling: 'average',
          itemStyle: {
            color: '#2C9CFA'
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
          name: '勘查及时率',
          type: 'line',
          symbolSize: '6',
          sampling: 'average',
          itemStyle: {
            color: '#F65F7B'
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
          name: '勘查处理时长',
          type: 'line',
          symbolSize: '6',
          sampling: 'average',
          itemStyle: {
            color: '#2C9CFA'
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
          name: '开通及时率',
          type: 'line',
          symbolSize: '6',
          sampling: 'average',
          itemStyle: {
            color: '#F65F7B'
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
          data: this.state.chart8
        }
      ]
    };
    const option9 = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: this.state.chart9X,
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
          name: '开通处理时长',
          type: 'line',
          symbolSize: '6',
          sampling: 'average',
          itemStyle: {
            color: '#2C9CFA'
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
          data: this.state.chart9
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
    options.push(option9);
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
      showData8,
      showData9
    } = this.state;
    return (
      <div className="tab6">
        <div className="tab6Left">
          <Select defaultValue="专线投诉处理个数" onChange={this.changeSelect}>
            {option}
          </Select>
          <ChinaAreaMap
            dataArr={this.state.mapChart}
            className="map"
            itemName={this.state.itemName}
            changeLoc={this.changeLoc}
          />
        </div>
        <div className="tab6Right">
          <div className="item">
            <div className="info">
              <div className="line1">
                <span>专线投诉处理个数(个)/{showData1.timeGranularity}</span>
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
                <span className="dayAver">日均:{showData1.average}</span>
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
                <span>专线投诉处理及时率(%)/{showData2.timeGranularity}</span>
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
                <span>专线投诉处理时长(h)/{showData3.timeGranularity}</span>
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
          <div className="item" style={{ width: '49%' }}>
            <div className="info">
              <div className="line1">
                <span>专线故障处理及时率(%)/{showData4.timeGranularity}</span>
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
          <div className="item" style={{ width: '49%' }}>
            <div className="info">
              <div className="line1">
                <span>专线故障处理时长(h)/{showData5.timeGranularity}</span>
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
          <div className="item" style={{ width: '49%' }}>
            <div className="info">
              <div className="line1">
                <span>勘查及时率(%)/{showData6.timeGranularity}</span>
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
            <div className="chart">
              <ReactEcharts
                option={this.getLine()[5]}
                notMerge={true}
                style={{ height: '100%' }}
              />
            </div>
          </div>
          <div className="item" style={{ width: '49%' }}>
            <div className="info">
              <div className="line1">
                <span>勘查处理时长(h)/{showData7.timeGranularity}</span>
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
            <div className="chart">
              <ReactEcharts
                option={this.getLine()[6]}
                notMerge={true}
                style={{ height: '100%' }}
              />
            </div>
          </div>
          <div className="item" style={{ width: '49%' }}>
            <div className="info">
              <div className="line1">
                <span>开通及时率(%)/{showData8.timeGranularity}</span>
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
                    showData8.ratio === 0
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
                option={this.getLine()[7]}
                notMerge={true}
                style={{ height: '100%' }}
              />
            </div>
          </div>
          <div className="item" style={{ width: '49%' }}>
            <div className="info">
              <div className="line1">
                <span>开通处理时长(h)/{showData9.timeGranularity}</span>
                <span>{showData9.date}</span>
              </div>
              <div className="line2">
                <span className="big">{formatNumber(showData9.current)}</span>
                <span style={{ marginRight: '0.3rem' }}>
                  {Math.abs(showData9.ratio)}%
                </span>
                <Icon
                  type="arrow-up"
                  theme="outlined"
                  style={
                    showData9.ratio > 0
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                />
                <Icon
                  type="arrow-down"
                  theme="outlined"
                  style={
                    showData9.ratio < 0
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                />
                <span
                  style={
                    showData9.ratio === 0
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
                option={this.getLine()[8]}
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
