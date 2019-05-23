import React, { Component } from 'react';

import Iframe from '../../../container/Iframe';
import { baseStaticUrl } from '../../../util/CommonUtils';

import '../../../assets/css/font.css';
import '../css/network-total.scss';
export default class NetworkTotal extends Component {
  render() {
    const { name, value } = this.props.activeItem;
    const numList = value ? value.replace(/,/g, '').split('') : [0];
    return (
      <div id="network-total">
        <div id="title">
          {name}
          {numList.map((item, index) => (
            <span key={index} className="digital">
              {item}
            </span>
          ))}
        </div>
        <div
          style={{
            position: 'absolute',
            top: '0px',
            left: '230px',
            height: '920px',
            width: '920px'
          }}
        >
          <Iframe
            name="iframe-3d-big-screen"
            url={`${baseStaticUrl}gis/gis3/3d/3d.html`}
          />
        </div>
        <div className="chart-example">
          <p className="item">
            <span className="otn" />
            <span className="text">站点</span>
          </p>
          <p className="item">
            <span className="zqwltp" />
            <span className="text">政企网络拓扑</span>
          </p>
          <p className="item">
            <span className="hlll" />
            <span className="text">海缆/陆缆</span>
          </p>
        </div>
      </div>
    );
  }
}
