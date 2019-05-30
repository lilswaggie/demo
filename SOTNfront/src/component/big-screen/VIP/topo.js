import React, { Component } from 'react';
import { Icon } from 'antd';
import Iframe from '../../../container/Iframe';
import { baseStaticUrl } from '../../../util/CommonUtils';

export default class Topo extends Component {
  render() {
    let { lineInfo, back } = this.props;
    return (
      <div id="topo">
        <div
          className="iframe-topo"
          style={{
            position: 'absolute',
            top: '100px',
            left: 0,
            height: '420px',
            width: '1350px'
          }}
        >
          <Iframe
            name="ifame-topo-big-screen"
            url={`${baseStaticUrl}gis/gis3/topo/topo.html`}
          />
        </div>
        <div id="back" onClick={back}>
          <Icon type="left" />
          返回
        </div>
        <div id="alarm-num">
          <div id="one-level" className="item">
            <span>一级告警</span>
            <span className="digital value">{lineInfo.firstLevelAlarmNum}</span>
          </div>
          <div id="total-level" className="item">
            <span>告警总数</span>
            <span className="digital value">{lineInfo.firstLevelAlarmNum}</span>
          </div>
        </div>
        <div id="client-info">
          <div className="label">所属客户</div>
          <div className="value">{lineInfo.customerName}</div>
          <div className="label">业务类型</div>
          <div className="value">{lineInfo.businessType}</div>
          <div className="label">A-Z端省</div>
          <div className="value">
            {lineInfo.aprovince}-{lineInfo.zprovince}
          </div>
          <div className="label">带宽</div>
          <div className="value">{lineInfo.businessBandwidth}G</div>
        </div>
      </div>
    );
  }
}
