import React, { Component } from 'react';

import _ from 'lodash';

import { Icon, Tabs, Select } from 'antd';

import echarts from 'echarts/lib/echarts';
import ReactEcharts from 'echarts-for-react';

import ClientListTab from '../component/business-manage/ClientListTab';
import LineListTab from '../component/business-manage/LineListTab';

import { getAxios } from '../axios/mainAxios';

import {
  formatNumber,
  objectEchartsArray,
  objectBarArray,
  makeLineFeedFormatFun
} from '../util/CommonUtils';

import '../assets/css/busimanage/busimange.scss';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

class BusinessManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey:
        this.props.location.state === undefined
          ? '1'
          : this.props.location.state.activeKey,
      clientElement: {
        sum: 0,
        ratio: 0
      },
      clientFault: 0,
      clientChart: [],
      lineElement: {
        sum: 0,
        ratio: 0
      },
      lineFault: 0,
      lineChart: [],
      clientBar: [],
      clientBarAxis: [],
      lineBar: [],
      lineBarAxis: [],
      allIndustry: []
    };
  }

  componentDidMount() {
    // 首次不传参数请求并展示数据
    this.getTopData();
    // 获得全部行业的数据
    this.getIndustry();
  }

  // 获得客户数,专线数，客户数TOP10,专线数Top10四块数据数据
  getTopData = () => {
    // 查询客户的分不同服务等级的统计
    getAxios('api/customers/stats/num/level', {}, data => {
      this.setState({
        clientElement: {
          sum: data.summary,
          ratio: data.ringRatio === null ? 0 : data.ringRatio
        },
        clientChart: objectEchartsArray(data.values)
      });
    });
    // 故障客户数统计
    getAxios('api/customers/stats/num/fault', {}, data => {
      this.setState({
        clientFault: data.fault
      });
    });
    // 专线总数的业务保障等级统计
    getAxios(
      'api/leased_lines/stats/num/security_level',
      {},
      data => {
        this.setState({
          lineElement: {
            sum: data.summary,
            ratio: data.ringRatio === null ? 0 : data.ringRatio
          },
          lineChart: objectEchartsArray(data.values)
        });
      }
    );
    // 故障专线数量的统计
    getAxios('api/leased_lines/stats/num/fault', {}, data => {
      this.setState({
        lineFault: data.fault
      });
    });
    // 客户的行业TopN统计
    getAxios('api/customers/stats/top_industry', {}, data => {
      this.setState({
        clientBar: objectBarArray(data.values).data,
        clientBarAxis: objectBarArray(data.values).axis
      });
    });
    // 专线的行业TopN统计
    getAxios('api/leased_lines/stats/top_industry', {}, data => {
      this.setState({
        lineBar: objectBarArray(data.values).data,
        lineBarAxis: objectBarArray(data.values).axis
      });
    });
  };
  getIndustry = () => {
    getAxios('api/customers/industry', data =>
      this.setState({ allIndustry: data })
    );
  };

  // 切换客户列表和专线列表tab
  handleTab = key => this.setState({ activeKey: key});

  getClientPie = () => {
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
          text: '服务等级',
          textAlign: 'center',
          fill: '#72758C',
          font: '400 14px PingFangSC-Regular'
        }
      },
      series: [
        {
          name: '客户数',
          type: 'pie',
          radius: ['40%', '60%'],
          center: ['50%', '50%'],
          roseType: 'radius',
          data: this.state.clientChart,
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
  // 专线数饼状图
  getLinePie = () => {
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
          text: '保障等级',
          textAlign: 'center',
          fill: '#72758C',
          font: '400 14px PingFangSC-Regular'
        }
      },
      series: [
        {
          name: '专线数',
          type: 'pie',
          radius: ['40%', '60%'],
          center: ['50%', '50%'],
          roseType: 'radius',
          data: this.state.lineChart,
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

  getBarOption = (dataArr = [], axisDataArr = [], colorStart, colorEnd) => {
    const isShowAxis = _.isEmpty(dataArr);
    let option = {
      grid: {
        top: 10,
        bottom: 40,
        right: 0
      },
      xAxis: {
        data: axisDataArr,
        axisLabel: {
          textStyle: {
            color: '#72758C'
          },
          // rotate:30
          formatter: makeLineFeedFormatFun(6)
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: isShowAxis,
          lineStyle: {
            color: '#e8e8e8'
          }
        }
      },
      yAxis: {
        min: 0,
        max: Math.max.apply(null, dataArr),
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#F4F4F4'],
            width: 1,
            type: 'dashed'
          }
        },
        axisLine: {
          show: isShowAxis,
          lineStyle: {
            color: '#e8e8e8'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#72758C'
          }
        }
      },
      series: [
        {
          type: 'bar',
          barWidth: '14px',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colorStart },
                { offset: 1, color: colorEnd }
              ])
            }
          },
          data: dataArr
        }
      ]
    };
    return option;
  };

  // 客户数柱状图
  getClientBar = () => {
    const { clientBar, clientBarAxis } = this.state;
    return this.getBarOption(clientBar, clientBarAxis, '#7FD1FC', '#679BF4');
  };

  // 专线柱状图
  getLineBar = () => {
    const { lineBar, lineBarAxis } = this.state;
    return this.getBarOption(lineBar, lineBarAxis, '#6DCBFA', '#7EDFBD');
  };

  render() {
    const {
      clientElement,
      clientFault,
      lineElement,
      lineFault,
      allIndustry
    } = this.state;
    const industryOption = [];
    if (allIndustry.length !== 0) {
      industryOption.push(
        <Option value="全部" key="全部">
          全部
        </Option>
      );
      allIndustry.forEach((item, index) => {
        industryOption.push(
          <Option value={item} key={index}>
            {item}
          </Option>
        );
      });
    }
    return (
      <div className="busimanage">
        <div className="title">
          <div className="item1">客户及业务概览</div>
        </div>
        <div className="content">
          <div className="block1">
            <div className="item">
              <div className="item-title">客户数</div>
              <div className="item-content">
                <div className="left">
                  <div className="top">
                    <div className="line1">客户总数（个）</div>
                    <div style={{ overflow: 'hidden' }}>
                      <div className="line2">
                        <span>{formatNumber(clientElement.sum)}</span>
                      </div>
                      <div className="line3">
                        <span style={{ marginRight: '0.3rem' }}>
                          {Math.abs(clientElement.ratio)}%
                        </span>
                        <Icon
                          type="arrow-up"
                          theme="outlined"
                          style={
                            clientElement.ratio > 0
                              ? { display: 'inline' }
                              : { display: 'none' }
                          }
                        />
                        <Icon
                          type="arrow-down"
                          theme="outlined"
                          style={
                            clientElement.ratio < 0
                              ? { display: 'inline' }
                              : { display: 'none' }
                          }
                        />
                        <span
                          style={
                            clientElement.ratio === 0
                              ? { display: 'inline' }
                              : { display: 'none' }
                          }
                        >
                          —
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bottom">
                    <div className="line1">故障客户数（个）</div>
                    <div style={{ overflow: 'hidden' }}>
                      <div className="line2 problem">
                        <span>{formatNumber(clientFault)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="right">
                  <ReactEcharts
                    option={this.getClientPie()}
                    notMerge={true}
                    style={{ height: '100%' }}
                  />
                </div>
              </div>
            </div>
            <div className="item">
              <div className="item-title">专线数</div>
              <div className="item-content">
                <div className="left">
                  <div className="top">
                    <div className="line1">专线总数（条）</div>
                    <div style={{ overflow: 'hidden' }}>
                      <div className="line2">
                        <span>
                          {lineElement.sum === null
                            ? 0
                            : formatNumber(lineElement.sum)}
                        </span>
                      </div>
                      <div className="line3">
                        <span style={{ marginRight: '0.3rem' }}>
                          {Math.abs(lineElement.ratio)}%
                        </span>
                        <Icon
                          type="arrow-up"
                          theme="outlined"
                          style={
                            lineElement.ratio > 0
                              ? { display: 'inline' }
                              : { display: 'none' }
                          }
                        />
                        <Icon
                          type="arrow-down"
                          theme="outlined"
                          style={
                            lineElement.ratio < 0
                              ? { display: 'inline' }
                              : { display: 'none' }
                          }
                        />
                        <span
                          style={
                            lineElement.ratio === 0
                              ? { display: 'inline' }
                              : { display: 'none' }
                          }
                        >
                          —
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bottom">
                    <div className="line1">故障专线数（条）</div>
                    <div style={{ overflow: 'hidden' }}>
                      <div className="line2 problem">
                        <span>{formatNumber(lineFault)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="right">
                  <ReactEcharts
                    option={this.getLinePie()}
                    notMerge={true}
                    style={{ height: '100%' }}
                  />
                </div>
              </div>
            </div>
            <div className="item">
              <div className="item-title">客户数TOP10的行业</div>
              <ReactEcharts
                option={this.getClientBar()}
                notMerge={true}
                style={{ height: '12.5rem' }}
              />
            </div>
            <div className="item">
              <div className="item-title">专线数TOP10的行业</div>
              <ReactEcharts
                option={this.getLineBar()}
                notMerge={true}
                style={{ height: '12.5rem' }}
              />
            </div>
          </div>
          <div className="block2">
            <Tabs activeKey={this.state.activeKey} onChange={this.handleTab}>
              <TabPane tab="客户列表" key="1">
                <ClientListTab
                  activeKey={this.state.activeKey}
                  industryOption={industryOption}
                />
              </TabPane>
              <TabPane tab="专线列表" key="2">
                <LineListTab
                  activeKey={this.state.activeKey}
                  industryOption={industryOption}
                />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

export default BusinessManage;
