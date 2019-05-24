import React, { Component } from 'react';

import { getAxios } from '../../../axios/mainAxios';
import { baseStaticUrl, formatNumber } from '../../../util/CommonUtils';

export default class NetworkQuality extends Component {
  state = {
    data: {}
  };
  loadData = () => {
    getAxios('/api/network/stats/current/net_quality', {}, data => {
      for (let index in data.values) {
        data.values[index] = formatNumber(data.values[index]);
      }
      this.setState({ data: data.values });
    });
  };
  componentDidMount() {
    this.loadData();
  }
  render() {
    let { data } = this.state;
    let { key } = this.props.activeItem;
    return (
      <div id="network-quality">
        <div id="header">网络质量</div>
        <video
          src={`${baseStaticUrl}mp4/wlzl.mp4`}
          autoPlay="autoplay"
          loop="loop"
        />
        <div id="body">
          <div className="item">
            <div className="header">告警</div>
            <div
              className={['body', 'up', key === 'alarm' ? 'active' : ''].join(
                ' '
              )}
              onClick={() =>
                this.props.handlerNetworkItem(
                  '告警条数（条）',
                  'alarm',
                  data.alarm
                )
              }
            >
              <div className="title">告警条数（条）</div>
              <div className="value digital">{data.alarm}</div>
            </div>
            <div
              className={[
                'body',
                'down',
                key === 'first_level_alarm' ? 'active' : ''
              ].join(' ')}
              onClick={() =>
                this.props.handlerNetworkItem(
                  '一级警告条数',
                  'first_level_alarm',
                  data.first_level_alarm
                )
              }
            >
              <div className="title">一级警告条数</div>
              <div className="value  digital">{data.first_level_alarm}</div>
            </div>
          </div>
          <div className="item">
            <div className="header">故障</div>
            <div
              className={[
                'body',
                'up',
                key === 'optical_cable_fault' ? 'active' : ''
              ].join(' ')}
              onClick={() =>
                this.props.handlerNetworkItem(
                  '光缆故障次数（次）',
                  'optical_cable_fault',
                  data.optical_cable_fault
                )
              }
            >
              <div className="title">光缆故障次数（次）</div>
              <div className="value digital">{data.optical_cable_fault}</div>
            </div>
            <div
              className={[
                'body',
                'down',
                key === 'element_fault' ? 'active' : ''
              ].join(' ')}
              onClick={() =>
                this.props.handlerNetworkItem(
                  '设备故障次数(次)',
                  'element_fault',
                  data.element_fault
                )
              }
            >
              <div className="title">设备故障次数(次)</div>
              <div className="value digital">{data.element_fault}</div>
            </div>
          </div>
          <div className="item">
            <div className="header">性能</div>
            <div
              className={[
                'body',
                'up',
                key === 'port_fault' ? 'active' : ''
              ].join(' ')}
              onClick={() =>
                this.props.handlerNetworkItem(
                  '光功率不合格端口数(个)',
                  'port_fault',
                  data.port_fault
                )
              }
            >
              <div className="title">光功率不合格端口数(个)</div>
              <div className="value digital">{data.port_fault}</div>
            </div>
            <div
              className={[
                'body',
                'down',
                key === 'wave_fault' ? 'active' : ''
              ].join(' ')}
              onClick={() =>
                this.props.handlerNetworkItem(
                  '误码率不合格端口数(个)',
                  'wave_fault',
                  data.wave_fault
                )
              }
            >
              <div className="title">误码率不合格端口数(个)</div>
              <div className="value digital">{data.wave_fault}</div>
            </div>
          </div>
          <div className="item">
            <div className="header">故障处理</div>
            <div
              className={[
                'body',
                'up',
                key === 'fault_handling_time' ? 'active' : ''
              ].join(' ')}
              onClick={() =>
                this.props.handlerNetworkItem(
                  '网络故障处理时长(h)',
                  'fault_handling_time',
                  data.fault_handling_time
                )
              }
            >
              <div className="title">网络故障处理时长(h)</div>
              <div className="value digital">{data.fault_handling_time}</div>
            </div>
            <div
              className={[
                'body',
                'down',
                key === 'faultHandlingRate' ? 'active' : ''
              ].join(' ')}
              onClick={() =>
                this.props.handlerNetworkItem(
                  '网络故障处理及时率(%)',
                  'faultHandlingRate',
                  data.faultHandlingRate
                )
              }
            >
              <div className="title">网络故障处理及时率(%)</div>
              <div className="value digital">{data.faultHandlingRate}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
