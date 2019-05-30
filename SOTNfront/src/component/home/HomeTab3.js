import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import moment from 'moment/moment';

import { Select, Icon } from 'antd';

import ReactEcharts from 'echarts-for-react';
import ChinaAreaMap from '../echart/ChinaAreaMap';

import { getAxios } from '../../axios/mainAxios';
import { formatNumber, objectEchartsArray } from '../../util/CommonUtils';

const option = [
  <Select.Option value="客户数" key="1">
    客户数
  </Select.Option>,
  <Select.Option value="故障客户数" key="2">
    故障客户数
  </Select.Option>,
  <Select.Option value="专线数" key="3">
    专线数
  </Select.Option>,
  <Select.Option value="故障专线数" key="4">
    故障专线数
  </Select.Option>
];

class Tab3 extends React.Component {
  state = {
    itemName: '客户数',
    location: '全国', // 分时统计折线图加入省份参数
    net: true,
    mapChart: [],
    clientElement: {
      sum: 0,
      ratio: 0
    },
    faultClient: 0,
    clientChart: [],
    lineElement: {
      sum: 0,
      ratio: 0
    },
    faultLine: 0,
    lineChart: [],
    clientDate: '',
    lineDate: '',

    // 地图飞线数据
    lineList: []
  };

  componentDidMount() {
    this.getAllData();
  }

  componentDidUpdate(prevProps, prevState) {
    const { activeKey } = this.props;
    if (activeKey !== prevProps.activeKey && activeKey === '3') {
      this.getAllData();
    }
    const { itemName } = this.state;
    if (itemName !== prevState.itemName) {
      this.getMapData();
    }
  }

  // 改变省份参数 TODO: 重新加载右侧数据
  changeLoc = loc => this.setState({ location: loc });

  // 选择框改变时再请求数据绘制地图
  onSelectChange = value => this.setState({ itemName: value });

  getAllData = () => {
    this.getMapData();
    this.getRightData();
    this.getLineList();
  };

  itemApiMap = {
    客户数: 'api/customers/stats/num/location',
    故障客户数: 'api/customers/stats/fault/location',
    专线数: 'api/leased_lines/stats/num/location',
    故障专线数: 'api/leased_lines/stats/fault/num/location'
  };

  // 请求左侧地图数据
  getMapData = () => {
    getAxios(
      this.itemApiMap[this.state.itemName],
      { businessType: this.props.business.type },
      data => this.setState({ mapChart: objectEchartsArray(data.values) })
    );
  };

  // 获取左侧地图飞线数据
  getLineList = () => {
    getAxios('api/leased_lines', ({ results }) =>
      this.setState({ lineList: results })
    );
  };

  // 请求右侧客户和专线数据
  getRightData = () => {
    const query = { businessType: this.props.business.type };
    // 查询客户的分不同服务等级的统计信息
    getAxios('api/customers/stats/num/level', query, data =>
      this.setState({
        clientElement: {
          sum: data.summary,
          ratio: data.ringRatio === null ? 0 : data.ringRatio
        },
        clientChart: objectEchartsArray(data.values),
        clientDate: moment(data.time.timeRange.until - 0).format('MM-DD')
      })
    );
    // 故障客户数的分省统计信息
    getAxios('api/customers/stats/fault/location', query, data =>
      this.setState({ faultClient: data.summary })
    );
    // 专线总数的业务保障等级统计
    getAxios('api/leased_lines/stats/num/security_level', query, data =>
      this.setState({
        lineElement: {
          sum: data.summary,
          ratio: data.ringRatio === null ? 0 : data.ringRatio
        },
        lineChart: objectEchartsArray(data.values),
        lineDate:
          data.time === null
            ? ''
            : moment(data.time.timeRange.until - 0).format('MM-DD')
      })
    );
    // 故障专线（专线故障次数）的分省统计信息
    getAxios('api/leased_lines/stats/fault/num/location', query, data =>
      this.setState({ faultLine: data.summary })
    );
  };
  // 客户数饼状图
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
  render() {
    const {
      clientElement,
      faultClient,
      lineElement,
      faultLine,
      clientDate,
      lineDate
    } = this.state;
    return (
      <div className="tab3">
        <div className="tab3Left">
          <Select defaultValue="客户数" onChange={this.onSelectChange}>
            {option}
          </Select>
          <ChinaAreaMap
            dataArr={this.state.mapChart}
            className="map"
            itemName={this.state.itemName}
            showLines={true}
            lineList={this.state.lineList}
            changeLoc={this.changeLoc}
          />
        </div>
        <div className="tab3Right">
          <div className="item">
            <div className="item-title">
              <Link
                to={{ pathname: '/main/business', state: { activeKey: '1' } }}
              >
                客户数
              </Link>
              <span>{clientDate}</span>
            </div>
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
                      <span>{formatNumber(faultClient)}</span>
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
            <div className="item-title">
              <Link
                to={{ pathname: '/main/business', state: { activeKey: '2' } }}
              >
                专线数
              </Link>
              <span>{lineDate}</span>
            </div>
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
                      <span>
                        {faultLine === null ? 0 : formatNumber(faultLine)}
                      </span>
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
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  business: state.business
});

export default connect(mapStateToProps)(Tab3);
