import React from 'react';
import { Select, Icon } from 'antd';
import moment from 'moment';

import ChinaAreaMap from '../echart/ChinaAreaMap';
import SiteType from '../resource-manage/components/site-type';

import { getAxios, postAxios } from '../../axios/mainAxios';

import { formatNumber, objectEchartsArray } from '../../util/CommonUtils';
import { gotoPathWithState } from '../../util/ReduxUtil';

const option = [
  <Select.Option value="网元数" key="1">
    网元数
  </Select.Option>,
  <Select.Option value="端口总数" key="2">
    端口总数
  </Select.Option>,
  <Select.Option value="端口利用率" key="3">
    端口利用率
  </Select.Option>,
  <Select.Option value="一干光缆长度" key="4">
    一干光缆长度
  </Select.Option>,
  <Select.Option value="纤芯利用率" key="5">
    纤芯利用率
  </Select.Option>
];
export default class Tab2 extends React.Component {
  state = {
    itemName: '网元数',
    location: '全国', // 分时统计折线图加入省份参数
    net: true,
    mapChart: [],
    portSum: 0,
    portRatio: 0,
    netElement: {
      sum: 0,
      ratio: 0
    },
    netValues: {},
    netValuesArr: [],
    cableElement: {
      sum: 0,
      ratio: 0
    },
    cableValues: {},
    fiberRatio: 0,
    netDate: '',
    cableDate: ''
  };

  componentDidMount() {
    this.getMapDataOnPost('api/network/elements/stats/num/location');
    this.getNetData();
  }

  componentWillReceiveProps(next) {
    if (this.props.activeKey !== next.activeKey && next.activeKey === '2') {
      this.getMapDataOnPost('api/network/elements/stats/num/location');
      this.getNetData();
    }
  }
  // 改变省份参数
  changeLoc = loc =>
    this.setState(
      { location: loc }
      // () => {
      //     // 更新网元和光缆数据
      //     this.getNetData();
      //     this.getCableData();
      // }
    );
  // 选择框改变时再请求数据绘制地图
  changeSelect = value => {
    this.setState({
      itemName: value
    });
    if (value === '网元数') {
      this.getMapDataOnPost('api/network/elements/stats/num/location');
    } else if (value === '端口总数') {
      this.getMapData('api/network/stats/port/location');
    } else if (value === '端口利用率') {
      this.getMapData('api/network/stats/port_usage/location');
    } else if (value === '一干光缆长度') {
      this.getMapData('api/network/stats/optical_cable_length/location');
    } else if (value === '纤芯利用率') {
      this.getMapDataOnPost('api/network/stats/fiber_usage/location');
    }
  };
  // 切换网元和光缆
  handleNet = () => {
    // 先判断要选择的是网元还是光缆
    if (this.state.net) {
      //要切换到光缆
      this.getCableData();
    } else {
      // 更新网元数据
      this.getNetData();
    }
    this.setState({
      net: !this.state.net
    });
  };
  // 请求左侧地图数据
  getMapData = url =>
    getAxios(url, data =>
      this.setState({ mapChart: objectEchartsArray(data.values) })
    );
  getMapDataOnPost = url =>
    postAxios(url, data =>
      this.setState({ mapChart: objectEchartsArray(data.values) })
    );

  // 请求右侧网元数据
  getNetData = () => {
    // 请求端口数分省统计接口-端口总数
    getAxios('api/network/stats/port/location', data =>
      this.setState({
        portSum: data.summary
      })
    );
    // 传输网元个数的分省统计- 网元总数和比例
    postAxios('api/network/elements/stats/num/location', data =>
      this.setState({
        netElement: {
          sum: data.summary,
          ratio: data.ringRatio === null ? 0 : data.ringRatio
        },
        netDate: moment(data.time.timeRange.until - 0).format('MM-DD')
      })
    );
    // 传输网元个数的分类型统计
    postAxios('api/network/elements/stats/num/service_level', data =>
      this.setState({
        netValues: data.values,
        netValuesArr: objectEchartsArray(data.values)
      })
    );
    // 请求端口利用率的分省统计-端口利用率
    getAxios('api/network/stats/port_usage/location', data =>
      this.setState({ portRatio: data.summary })
    );
  };
  // 请求右侧光缆数据
  getCableData = () => {
    //请求光缆长度的分省统计-光缆长度总值和比例
    getAxios('api/network/stats/optical_cable_length/location', data =>
      this.setState({
        cableElement: {
          sum: data.summary,
          ratio: data.ringRatio === null ? 0 : data.ringRatio
        },
        cableDate: moment(data.time.timeRange.until - 0).format('MM-DD')
      })
    );
    // 请求光缆长度分类型统计
    getAxios('api/network/stats/optical_cable/type', data =>
      this.setState({ cableValues: data.values })
    );
    //请求纤芯利用率的分省统计
    postAxios('api/network/stats/fiber_usage/location', data =>
      this.setState({ fiberRatio: data.summary })
    );
  };
  // 网元的指标卡展示
  netIndex = values => {
    const arr = [];
    Object.keys(values).forEach(key => {
      arr.push(
        <div key={key} className="net">
          <div className="line1">
            <span>{key}</span>
          </div>
          <div className="line2">
            <span>{formatNumber(values[key])}</span>
          </div>
        </div>
      );
    });
    return arr;
  };
  // 光缆的指标卡展示
  cableIndex = values => {
    const arr = [];
    const keys = Object.keys(values);
    arr.push(
      <div className="cable" key={1}>
        <div className="first">
          <div className="cab">
            <div className="line1">
              <span>{keys[0]}</span>
            </div>
            <div className="line2">
              <span>
                {values[keys[0]] === null ? 0 : formatNumber(values[keys[0]])}
              </span>
            </div>
          </div>
          <div className="cab">
            <div className="line1">
              <span>{keys[1]}</span>
            </div>
            <div className="line2">
              <span>
                {values[keys[1]] === null ? 0 : formatNumber(values[keys[1]])}
              </span>
            </div>
          </div>
        </div>
        <div className="second">
          <span>{keys[2]}</span>
          <span>
            {values[keys[2]] === null ? 0 : formatNumber(values[keys[2]])}
          </span>
        </div>
      </div>
    );
    return arr;
  };
  // 利用率小块宽度的百分比
  calWidth = ratio => {
    const num = (ratio % 10) * 10;
    return `${num}%`;
  };
  // 跳转至 统计分析 -- 资源统计
  goToSource = gotoHome => e => {
    e.stopPropagation();
    gotoPathWithState('/main/analysis/source', { gotoHome });
  };
  render() {
    const {
      mapChart,
      portSum,
      portRatio,
      netValuesArr,
      netElement,
      cableElement,
      cableValues,
      fiberRatio,
      netDate,
      cableDate
    } = this.state;

    // const net = this.netIndex(netValues);
    const cable = this.cableIndex(cableValues);
    return (
      <div className="tab2">
        <div className="tab2Left">
          <Select defaultValue="网元数" onChange={this.changeSelect}>
            {option}
          </Select>
          <ChinaAreaMap
            dataArr={mapChart}
            className="map"
            itemName={this.state.itemName}
            changeLoc={this.changeLoc}
          />
        </div>
        <div className="tab2Right">
          <div className="titleChoose">
            <span
              className={this.state.net ? 'active' : 'noneact'}
              onClick={this.handleNet}
            >
              网元及端口统计
            </span>
            <span
              className={this.state.net ? 'noneact' : 'active'}
              onClick={this.handleNet}
            >
              光缆及纤芯统计
            </span>
          </div>
          <div
            className="item"
            style={this.state.net ? { display: 'block' } : { display: 'none' }}
          >
            <div className="item-title">
              网元及端口<span>{netDate}</span>
            </div>
            <div className="item-content">
              <div className="block1">
                <div className="left">
                  {/* <div className="line1"><span>网元总数（个）</span></div> */}
                  <div className="line1">
                    <span onClick={this.goToSource(false)}>网元总数（个）</span>
                  </div>
                  <div className="line2">
                    <span>{formatNumber(netElement.sum)}</span>
                  </div>
                  <div className="line3">
                    <span style={{ marginRight: '0.3rem' }}>
                      {Math.abs(netElement.ratio)}%
                    </span>
                    <Icon
                      type="arrow-up"
                      theme="outlined"
                      style={
                        netElement.ratio > 0
                          ? { display: 'inline' }
                          : { display: 'none' }
                      }
                    />
                    <Icon
                      type="arrow-down"
                      theme="outlined"
                      style={
                        netElement.ratio < 0
                          ? { display: 'inline' }
                          : { display: 'none' }
                      }
                    />
                    <span
                      style={
                        netElement.ratio === 0
                          ? { display: 'inline' }
                          : { display: 'none' }
                      }
                    >
                      —
                    </span>
                  </div>
                </div>
                <div className="right">
                  <SiteType siteType={netValuesArr} />
                </div>
              </div>
              <div className="item1">
                <div className="line1">
                  <span>端口总数（个）</span>
                </div>
                <div className="line2">
                  <span>{formatNumber(portSum)}</span>
                </div>
              </div>
              <div className="item2">
                <div className="line1">
                  <span>端口利用率</span>
                </div>
                <div className="block">
                  <div>
                    <span
                      className="use-ratio"
                      style={
                        portRatio / 10 >= 1
                          ? { backgroundColor: '#F9DC55' }
                          : {
                            backgroundColor: '#F9DC55',
                            width: this.calWidth(portRatio)
                          }
                      }
                    />
                  </div>
                  <div
                    style={
                      portRatio <= 10
                        ? { display: 'none' }
                        : { display: 'inline-block' }
                    }
                  >
                    <span
                      className="use-ratio"
                      style={
                        portRatio / 10 >= 2
                          ? { backgroundColor: '#E7DB5E' }
                          : {
                            backgroundColor: '#E7DB5E',
                            width: this.calWidth(portRatio)
                          }
                      }
                    />
                  </div>
                  <div
                    style={
                      portRatio <= 20
                        ? { display: 'none' }
                        : { display: 'inline-block' }
                    }
                  >
                    <span
                      className="use-ratio"
                      style={
                        portRatio / 10 >= 3
                          ? { backgroundColor: '#DBDB64' }
                          : {
                            backgroundColor: '#DBDB64',
                            width: this.calWidth(portRatio)
                          }
                      }
                    />
                  </div>
                  <div
                    style={
                      portRatio <= 30
                        ? { display: 'none' }
                        : { display: 'inline-block' }
                    }
                  >
                    <span
                      className="use-ratio"
                      style={
                        portRatio / 10 >= 4
                          ? { backgroundColor: '#CBDB70' }
                          : {
                            backgroundColor: '#CBDB70',
                            width: this.calWidth(portRatio)
                          }
                      }
                    />
                  </div>
                  <div
                    style={
                      portRatio <= 40
                        ? { display: 'none' }
                        : { display: 'inline-block' }
                    }
                  >
                    <span
                      className="use-ratio"
                      style={
                        portRatio / 10 >= 5
                          ? { backgroundColor: '#BDDB78' }
                          : {
                            backgroundColor: '#BDDB78',
                            width: this.calWidth(portRatio)
                          }
                      }
                    />
                  </div>
                  <div
                    style={
                      portRatio <= 50
                        ? { display: 'none' }
                        : { display: 'inline-block' }
                    }
                  >
                    <span
                      className="use-ratio"
                      style={
                        portRatio / 10 >= 6
                          ? { backgroundColor: '#AFDB82' }
                          : {
                            backgroundColor: '#AFDB82',
                            width: this.calWidth(portRatio)
                          }
                      }
                    />
                  </div>
                  <div
                    style={
                      portRatio <= 60
                        ? { display: 'none' }
                        : { display: 'inline-block' }
                    }
                  >
                    <span
                      className="use-ratio"
                      style={
                        portRatio / 10 >= 7
                          ? { backgroundColor: '#A3DB8C' }
                          : {
                            backgroundColor: '#A3DB8C',
                            width: this.calWidth(portRatio)
                          }
                      }
                    />
                  </div>
                  <div
                    style={
                      portRatio <= 70
                        ? { display: 'none' }
                        : { display: 'inline-block' }
                    }
                  >
                    <span
                      className="use-ratio"
                      style={
                        portRatio / 10 >= 8
                          ? { backgroundColor: '#9ADB93' }
                          : {
                            backgroundColor: '#9ADB93',
                            width: this.calWidth(portRatio)
                          }
                      }
                    />
                  </div>
                  <div
                    style={
                      portRatio <= 80
                        ? { display: 'none' }
                        : { display: 'inline-block' }
                    }
                  >
                    <span
                      className="use-ratio"
                      style={
                        portRatio / 10 >= 9
                          ? { backgroundColor: '#8FDC9D' }
                          : {
                            backgroundColor: '#8FDC9D',
                            width: this.calWidth(portRatio)
                          }
                      }
                    />
                  </div>
                  <div
                    style={
                      portRatio <= 90
                        ? { display: 'none' }
                        : { display: 'inline-block' }
                    }
                  >
                    <span
                      className="use-ratio"
                      style={{
                        backgroundColor: '#86DCA6',
                        width: this.calWidth(portRatio)
                      }}
                    />
                  </div>
                  <span className="line2">{portRatio}%</span>
                </div>
              </div>
            </div>
          </div>
          <div
            className="item"
            style={this.state.net ? { display: 'none' } : { display: 'block' }}
          >
            <div className="item-title">
              光缆及纤芯<span>{cableDate}</span>
            </div>
            <div className="item-content">
              <div className="block1">
                <div className="left" style={{ width: '33%' }}>
                  <div className="line1">
                    <span>一干光缆总长度（万皮长公里）</span>
                  </div>
                  <div className="line2">
                    <span>
                      {formatNumber(parseInt((cableElement.sum || 0) / 10000))}
                    </span>
                  </div>
                  <div className="line3">
                    <span style={{ marginRight: '0.3rem' }}>
                      {Math.abs(cableElement.ratio)}%
                    </span>
                    <Icon
                      type="arrow-up"
                      theme="outlined"
                      style={
                        cableElement.ratio > 0
                          ? { display: 'inline' }
                          : { display: 'none' }
                      }
                    />
                    <Icon
                      type="arrow-down"
                      theme="outlined"
                      style={
                        cableElement.ratio < 0
                          ? { display: 'inline' }
                          : { display: 'none' }
                      }
                    />
                    <span
                      style={
                        cableElement.ratio === 0
                          ? { display: 'inline' }
                          : { display: 'none' }
                      }
                    >
                      —
                    </span>
                  </div>
                </div>
                <div className="right">{cable}</div>
              </div>
              <div className="item2" style={{ width: '100%' }}>
                <div className="line1">
                  <span>纤芯利用率</span>
                </div>
                <div className="block">
                  <div>
                    <span
                      className="use-ratio"
                      style={
                        fiberRatio / 10 >= 1
                          ? { backgroundColor: '#F9DC55' }
                          : {
                            backgroundColor: '#F9DC55',
                            width: this.calWidth(fiberRatio)
                          }
                      }
                    />
                  </div>
                  <div
                    style={
                      fiberRatio <= 10
                        ? { display: 'none' }
                        : { display: 'inline-block' }
                    }
                  >
                    <span
                      className="use-ratio"
                      style={
                        fiberRatio / 10 >= 2
                          ? { backgroundColor: '#E7DB5E' }
                          : {
                            backgroundColor: '#E7DB5E',
                            width: this.calWidth(fiberRatio)
                          }
                      }
                    />
                  </div>
                  <div
                    style={
                      fiberRatio <= 20
                        ? { display: 'none' }
                        : { display: 'inline-block' }
                    }
                  >
                    <span
                      className="use-ratio"
                      style={
                        fiberRatio / 10 >= 3
                          ? { backgroundColor: '#DBDB64' }
                          : {
                            backgroundColor: '#DBDB64',
                            width: this.calWidth(fiberRatio)
                          }
                      }
                    />
                  </div>
                  <div
                    style={
                      fiberRatio <= 30
                        ? { display: 'none' }
                        : { display: 'inline-block' }
                    }
                  >
                    <span
                      className="use-ratio"
                      style={
                        fiberRatio / 10 >= 4
                          ? { backgroundColor: '#CBDB70' }
                          : {
                            backgroundColor: '#CBDB70',
                            width: this.calWidth(fiberRatio)
                          }
                      }
                    />
                  </div>
                  <div
                    style={
                      fiberRatio <= 40
                        ? { display: 'none' }
                        : { display: 'inline-block' }
                    }
                  >
                    <span
                      className="use-ratio"
                      style={
                        fiberRatio / 10 >= 5
                          ? { backgroundColor: '#BDDB78' }
                          : {
                            backgroundColor: '#BDDB78',
                            width: this.calWidth(fiberRatio)
                          }
                      }
                    />
                  </div>
                  <div
                    style={
                      fiberRatio <= 50
                        ? { display: 'none' }
                        : { display: 'inline-block' }
                    }
                  >
                    <span
                      className="use-ratio"
                      style={
                        fiberRatio / 10 >= 6
                          ? { backgroundColor: '#AFDB82' }
                          : {
                            backgroundColor: '#AFDB82',
                            width: this.calWidth(fiberRatio)
                          }
                      }
                    />
                  </div>
                  <div
                    style={
                      fiberRatio <= 60
                        ? { display: 'none' }
                        : { display: 'inline-block' }
                    }
                  >
                    <span
                      className="use-ratio"
                      style={
                        fiberRatio / 10 >= 7
                          ? { backgroundColor: '#A3DB8C' }
                          : {
                            backgroundColor: '#A3DB8C',
                            width: this.calWidth(fiberRatio)
                          }
                      }
                    />
                  </div>
                  <div
                    style={
                      fiberRatio <= 70
                        ? { display: 'none' }
                        : { display: 'inline-block' }
                    }
                  >
                    <span
                      className="use-ratio"
                      style={
                        fiberRatio / 10 >= 8
                          ? { backgroundColor: '#9ADB93' }
                          : {
                            backgroundColor: '#9ADB93',
                            width: this.calWidth(fiberRatio)
                          }
                      }
                    />
                  </div>
                  <div
                    style={
                      fiberRatio <= 80
                        ? { display: 'none' }
                        : { display: 'inline-block' }
                    }
                  >
                    <span
                      className="use-ratio"
                      style={
                        fiberRatio / 10 >= 9
                          ? { backgroundColor: '#8FDC9D' }
                          : {
                            backgroundColor: '#8FDC9D',
                            width: this.calWidth(fiberRatio)
                          }
                      }
                    />
                  </div>
                  <div
                    style={
                      fiberRatio <= 90
                        ? { display: 'none' }
                        : { display: 'inline-block' }
                    }
                  >
                    <span
                      className="use-ratio"
                      style={{
                        backgroundColor: '#86DCA6',
                        width: this.calWidth(fiberRatio)
                      }}
                    />
                  </div>
                  <span className="line2">{fiberRatio}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
