import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Timeline } from 'antd';

import moment from 'moment';

import ReactEcharts from 'echarts-for-react';

import { getAxios } from '../axios/mainAxios';

import { msToHour, objectEchartsArray } from '../util/CommonUtils';

import '../assets/css/busiresoure/busiresource.scss';

export default class BusinessResource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prospect: {
        sum: 0,
        finish: 0,
        time: 0,
        rate: 0,
        timeline: [
          {
            name: '',
            value: 0
          }
        ]
      },
      open: {
        sum: 0,
        finish: 0,
        time: 0,
        rate: 0,
        timeline: [
          {
            name: '',
            value: 0
          }
        ]
      },
      change: {
        sum: 0,
        finish: 0,
        time: 0,
        rate: 0,
        timeline: [
          {
            name: '',
            value: 0
          }
        ]
      },
      change1: {
        sum: 0,
        finish: 0,
        time: 0,
        rate: 0,
        timeline: [
          {
            name: '',
            value: 0
          }
        ]
      },
      change2: {
        sum: 0,
        finish: 0,
        time: 0,
        rate: 0,
        timeline: [
          {
            name: '',
            value: 0
          }
        ]
      },
      change3: {
        sum: 0,
        finish: 0,
        time: 0,
        rate: 0,
        timeline: [
          {
            name: '',
            value: 0
          }
        ]
      },
      change4: {
        sum: 0,
        finish: 0,
        time: 0,
        rate: 0,
        timeline: [
          {
            name: '',
            value: 0
          }
        ]
      },
      close: {
        sum: 0,
        finish: 0,
        timeline: [
          {
            name: '',
            value: 0
          }
        ]
      },
      changeBtn: [true, false, false, false],
      changeStatus: '变更勘查'
    };
  }
  componentDidMount() {
    // 业务加载完成后请求接口数据(7类工单)
    this.getOrderData();
  }
  getOrderData = () => {
    // 获取资源工单各类型工单的统计信息
    getAxios('api/flows/stats', data => {
      data.forEach(item => {
        if (item.type === 'SURVEY') {
          this.setState({
            prospect: {
              sum: item.totalNum,
              finish: item.finishedNum,
              time: msToHour(item.processTime),
              rate: item.processRate,
              timeline: objectEchartsArray(item.statsOfChain.values)
            }
          });
        } else if (item.type === 'OPENING') {
          this.setState({
            open: {
              sum: item.totalNum,
              finish: item.finishedNum,
              time: msToHour(item.processTime),
              rate: item.processRate,
              timeline: objectEchartsArray(item.statsOfChain.values)
            }
          });
        } else if (item.type === 'SHUTDOWN') {
          this.setState({
            close: {
              sum: item.totalNum,
              finish: item.finishedNum,
              timeline: objectEchartsArray(item.statsOfChain.values)
            }
          });
        } else if (item.type === 'ALTER_SURVEY') {
          this.setState(
            {
              change1: {
                sum: item.totalNum,
                finish: item.finishedNum,
                timeline: objectEchartsArray(item.statsOfChain.values)
              }
            },
            () => {
              this.setState({
                change: this.state.change1
              });
            }
          );
        } else if (item.type === 'ALTER_STOPPING') {
          this.setState({
            change2: {
              sum: item.totalNum,
              finish: item.finishedNum,
              timeline: objectEchartsArray(item.statsOfChain.values)
            }
          });
        } else if (item.type === 'ALTER_RESETTING') {
          this.setState({
            change3: {
              sum: item.totalNum,
              finish: item.finishedNum,
              timeline: objectEchartsArray(item.statsOfChain.values)
            }
          });
        } else if (item.type === 'ALTER_OPENING') {
          this.setState({
            change4: {
              sum: item.totalNum,
              finish: item.finishedNum,
              timeline: objectEchartsArray(item.statsOfChain.values)
            }
          });
        }
      });
    });
  };
  // 业务资源仪表盘
  getGauge = orderClass => {
    const value = !orderClass.sum
      ? 0
      : Math.round((orderClass.finish / orderClass.sum) * 100);
    let option = {
      tooltip: {
        formatter: '{a} <br/>{b} : {c}%'
      },
      series: [
        {
          name: '勘查',
          type: 'gauge',
          center: ['50%', '50%'], // 默认全局居中
          radius: '100%',
          min: 0,
          max: 100,
          splitNumber: 10,
          axisLine: {
            // 坐标轴线
            lineStyle: {
              // 属性lineStyle控制线条样式
              color: [
                [value / 100, '#71CA41'], //根据实际数据动态改变
                [1, '#DCDDDD']
              ],
              width: 10, //半径
              shadowColor: '#fff', //默认透明
              shadowBlur: 5
            }
          },
          pointer: {
            show: true
          },
          itemStyle: {
            color: '#71CA41'
          },
          axisLabel: {
            // 坐标轴小标记
            textStyle: {
              // 属性lineStyle控制线条样式
              fontWeight: 'bolder',
              color: '#B0BCBC', //刻度数字颜色 隐藏
              shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          axisTick: {
            // 坐标轴小标记
            length: 5, // 属性length控制线长
            lineStyle: {
              // 属性lineStyle控制线条样式
              color: 'white', //坐标轴 小刻度线颜色
              shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          splitLine: {
            // 分隔线
            length: 10, // 属性length控制线长
            lineStyle: {
              // 属性lineStyle（详见lineStyle）控制线条样式
              width: 1,
              color: 'white', //分割线
              shadowColor: '#fff', //默认透明
              shadowBlur: 10
            }
          },
          title: {
            show: false
          },
          detail: {
            textStyle: {
              // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              fontSize: 14,
              color: '#71CA41'
            },
            formatter: '{value}%'
          },
          data: [{ value: value, name: '完成率' }]
        }
      ]
    };
    return option;
  };
  // 点击变更工单切换时触发
  handleChange = (bool1, bool2, bool3, bool4) => {
    this.setState({
      changeBtn: [bool1, bool2, bool3, bool4]
    });
    // 改变变更工单状态时重新请求接口得到新数据
    if (bool1) {
      this.setState({
        changeStatus: '变更勘查',
        change: this.state.change1
      });
    } else if (bool2) {
      this.setState({
        changeStatus: '停机',
        change: this.state.change2
      });
    } else if (bool3) {
      this.setState({
        changeStatus: '复机',
        change: this.state.change3
      });
    } else if (bool4) {
      this.setState({
        changeStatus: '变更开通',
        change: this.state.change4
      });
    }
  };
  render() {
    const {
      prospect,
      open,
      change,
      close,
      changeBtn,
      changeStatus
    } = this.state;
    const dataTime = moment().format('YYYY-MM-DD');
    // 勘查工单时间线
    const timeItem1 = [];
    if (prospect.timeline.length !== 0) {
      prospect.timeline.forEach((item, key) => {
        timeItem1.push(
          <Link
            key={key}
            to={{
              pathname: '/main/source/business/work-order',
              state: {
                orderclass: '勘查',
                choose: item.name,
                timelineArr: prospect.timeline
              }
            }}
          >
            <Timeline.Item key={key}>
              {item.name}
              <p>{item.value}</p>
            </Timeline.Item>
          </Link>
        );
      });
    }
    // 开通工单时间线
    const timeItem2 = [];
    if (open.timeline.length !== 0) {
      open.timeline.forEach((item, key) => {
        timeItem2.push(
          <Link
            key={key}
            to={{
              pathname: '/main/source/business/work-order',
              state: {
                orderclass: '开通',
                choose: item.name,
                timelineArr: open.timeline
              }
            }}
          >
            <Timeline.Item key={key}>
              {item.name}
              <p>{item.value}</p>
            </Timeline.Item>
          </Link>
        );
      });
    }
    // 变更工单时间线
    const timeItem3 = [];
    if (change.timeline.length !== 0) {
      change.timeline.forEach((item, key) => {
        timeItem3.push(
          <Link
            key={key}
            to={{
              pathname: '/main/source/business/work-order',
              state: {
                orderclass: '变更',
                changeBtn: changeBtn,
                changeStatus: changeStatus,
                choose: item.name,
                timelineArr: change.timeline
              }
            }}
          >
            <Timeline.Item key={key}>
              {item.name}
              <p>{item.value}</p>
            </Timeline.Item>
          </Link>
        );
      });
    }
    // 停闭工单时间线
    const timeItem4 = [];
    if (close.timeline.length !== 0) {
      close.timeline.forEach((item, key) => {
        timeItem4.push(
          <Link
            key={key}
            to={{
              pathname: '/main/source/business/work-order',
              state: {
                orderclass: '停闭',
                choose: item.name,
                timelineArr: close.timeline
              }
            }}
          >
            <Timeline.Item key={key}>
              {item.name}
              <p>{item.value}</p>
            </Timeline.Item>
          </Link>
        );
      });
    }
    return (
      <div className="busiresource">
        <div className="title">
          <div className="item1">业务资源</div>
          <div className="data-text">数据时间：{dataTime}</div>
        </div>
        <div className="content">
          <div className="block">
            <p className="tit">
              <Link
                to={{
                  pathname: '/main/source/business/work-order',
                  state: {
                    orderclass: '勘查',
                    choose: prospect.timeline[0].name,
                    timelineArr: prospect.timeline
                  }
                }}
              >
                勘查
              </Link>
            </p>
            <div className="cont">
              <div className="item1">
                <div className="chart">
                  <ReactEcharts
                    option={this.getGauge(prospect)}
                    notMerge={true}
                    style={{ height: '100%' }}
                  />
                </div>
                <div className="sum">
                  <div className="line1">
                    <span />
                    <span>总数</span>
                    <span>{prospect.sum}</span>
                  </div>
                  <div className="line2">
                    <span />
                    <span>已完成</span>
                    <span>{prospect.finish}</span>
                  </div>
                </div>
              </div>
              <div className="item2">
                <div>
                  <p>勘查处理时长</p>
                  <p>{prospect.time}h</p>
                </div>
                <div>
                  <p>勘查及时率</p>
                  <p>{prospect.rate}%</p>
                </div>
              </div>
              <div className="item3">
                <Timeline>{timeItem1}</Timeline>
              </div>
            </div>
          </div>
          <div className="block">
            <p className="tit">
              <Link
                to={{
                  pathname: '/main/source/business/work-order',
                  state: {
                    orderclass: '开通',
                    choose: open.timeline[0].name,
                    timelineArr: open.timeline
                  }
                }}
              >
                开通
              </Link>
            </p>
            <div className="cont">
              <div className="item1">
                <div className="chart">
                  <ReactEcharts
                    option={this.getGauge(open)}
                    notMerge={true}
                    style={{ height: '100%' }}
                  />
                </div>
                <div className="sum">
                  <div className="line1">
                    <span />
                    <span>总数</span>
                    <span>{open.sum}</span>
                  </div>
                  <div className="line2">
                    <span />
                    <span>已完成</span>
                    <span>{open.finish}</span>
                  </div>
                </div>
              </div>
              <div className="item2">
                <div>
                  <p>开通处理时长</p>
                  <p>{open.time}h</p>
                </div>
                <div>
                  <p>开通及时率</p>
                  <p>{open.rate}%</p>
                </div>
              </div>
              <div className="item3">
                <Timeline>{timeItem2}</Timeline>
              </div>
            </div>
          </div>
          <div className="block">
            <p className="tit">
              <Link
                to={{
                  pathname: '/main/source/business/work-order',
                  state: {
                    orderclass: '停闭',
                    choose: close.timeline[0].name,
                    timelineArr: close.timeline
                  }
                }}
              >
                停闭
              </Link>
            </p>
            <div className="cont">
              <div className="item1">
                <div className="chart">
                  <ReactEcharts
                    option={this.getGauge(close)}
                    notMerge={true}
                    style={{ height: '100%' }}
                  />
                </div>
                <div className="sum">
                  <div className="line1">
                    <span />
                    <span>总数</span>
                    <span>{close.sum}</span>
                  </div>
                  <div className="line2">
                    <span />
                    <span>已完成</span>
                    <span>{close.finish}</span>
                  </div>
                </div>
              </div>
              <div className="item3" style={{ height: '24rem' }}>
                <Timeline>{timeItem4}</Timeline>
              </div>
            </div>
          </div>
          <div className="block">
            <p className="tit">
              <Link
                to={{
                  pathname: '/main/source/business/work-order',
                  state: {
                    orderclass: '变更',
                    changeBtn: changeBtn,
                    changeStatus: changeStatus,
                    choose: change.timeline[0].name,
                    timelineArr: change.timeline
                  }
                }}
              >
                变更
              </Link>
              <span className="changeStatus">
                <button
                  className={changeBtn[0] ? 'active' : null}
                  onClick={() => this.handleChange(true, false, false, false)}
                >
                  变更勘查
                </button>
                <button
                  className={changeBtn[1] ? 'active' : null}
                  onClick={() => this.handleChange(false, true, false, false)}
                >
                  停机
                </button>
                <button
                  className={changeBtn[2] ? 'active' : null}
                  onClick={() => this.handleChange(false, false, true, false)}
                >
                  复机
                </button>
                <button
                  className={changeBtn[3] ? 'active' : null}
                  onClick={() => this.handleChange(false, false, false, true)}
                >
                  变更开通
                </button>
              </span>
            </p>
            <div className="cont">
              <div className="item1">
                <div className="chart">
                  <ReactEcharts
                    option={this.getGauge(change)}
                    notMerge={true}
                    style={{ height: '100%' }}
                  />
                </div>
                <div className="sum">
                  <div className="line1">
                    <span />
                    <span>总数</span>
                    <span>{change.sum}</span>
                  </div>
                  <div className="line2">
                    <span />
                    <span>已完成</span>
                    <span>{change.finish}</span>
                  </div>
                </div>
              </div>
              <div className="item2" style={{ display: 'none' }}>
                <div>
                  <p>变更处理时长</p>
                  <p>{change.time}h</p>
                </div>
                <div>
                  <p>变更及时率</p>
                  <p>{change.rate}%</p>
                </div>
              </div>
              <div className="item3" style={{ height: '24rem' }}>
                <Timeline>{timeItem3}</Timeline>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
