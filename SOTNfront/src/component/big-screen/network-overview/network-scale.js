import React, { Component } from 'react';
import { baseStaticUrl, formatNumber } from '../../../util/CommonUtils';
import { getAxios } from '../../../axios/mainAxios';
import { message } from 'antd';

const quotaMap = {
  element: '网元总数（个）',
  optical_cable_length: '一干光缆总长度(万皮长公里)',
  bandwidth: '接入带宽(TB)',
  coverage_area: '覆盖范围(个)'
};
export default class NetworkScale extends Component {
  state = {
    data: []
  };
  loadData = () => {
    getAxios(
      '/api/network/stats/current/net_scale',
      {},
      data => {
        let values = [];
        for (let index in quotaMap) {
          let obj = {};
          obj['key'] = index;
          obj['name'] = quotaMap[index];
          let value = data.values[index] || 0;
          index === 'optical_cable_length' && (value = parseInt(value / 10000));
          obj['value'] = formatNumber(value);
          values.push(obj);
        }

        this.props.handlerNetworkItem(
          values[0].name,
          values[0].key,
          values[0].value
        );
        this.setState({ data: values });
      },
      data => {
        message.error(data.message);
      }
    );
  };
  componentDidMount() {
    this.loadData();
  }
  render() {
    let { data } = this.state;
    let { key } = this.props.activeItem;
    return (
      <div id="network-scale">
        <div id="header">网络规模</div>
        <video
          src={`${baseStaticUrl}mp4/wlgm.mp4`}
          autoPlay="autoplay"
          loop="loop"
        />
        <div id="container">
          {data.map((item, index) => {
            return (
              <div
                key={index}
                className={['item', key === item.key ? 'active' : ''].join(' ')}
                onClick={() =>
                  this.props.handlerNetworkItem(item.name, item.key, item.value)
                }
              >
                <div className="title">{item.name}</div>
                <div className="value digital">{item.value}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
