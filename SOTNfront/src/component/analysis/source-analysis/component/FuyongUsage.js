import React, { Component } from 'react';
import { Tooltip, Progress } from 'antd';
import PropTypes from 'prop-types';

export default class FuUsage extends Component {
  static propTypes = {
    title: PropTypes.string,
    usageData: PropTypes.array
  };
  static defaultProps = {
    title: '',
    usageData: []
  };

  render() {
    const { title, usageData } = this.props;
    return (
      <div className={`usageRate-low ${this.props.className}`}>
        <div className="usage-title">{title}</div>
        {usageData.map((item, index) => {
          const contemtDetail = (
            <div className="content-detail clearfix">
              <div>
                <span>{`所属省份：${item.province}` || '--'}</span>
              </div>
              <div
                style={{
                  float: 'left',
                  height: 10,
                  width: 10,
                  background: '#2C9CFA',
                  borderRadius: 5,
                  border: '1px solid #2C9CFA',
                  marginTop: 5,
                  marginRight: 3
                }}
              />
              <div style={{ float: 'left' }}>
                {`复用段利用率：${item.value}%` || 0}
              </div>
              <br />
              <div style={{ marginLeft: 13 }}>
                {`已利用带宽：${item.bandwidthUsed}%` || 0}
              </div>
              <div style={{ marginLeft: 13 }}>
                {`已配置波道总带宽：${item.bandwidthConf}%` || 0}
              </div>
            </div>
          );
          return (
            <div key={index} className={'usage-content clearfix'}>
              <div className="content-name">
                <span title={item.name || '--'}>{item.name || '--'}</span>
              </div>
              <Tooltip title={contemtDetail}>
                <Progress percent={item.value} />
              </Tooltip>
            </div>
          );
        })}
      </div>
    );
  }
}
