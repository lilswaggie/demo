import React, { Component } from 'react';

import { getAxios } from '../../../axios/mainAxios';
import { baseStaticUrl, formatNumber } from '../../../util/CommonUtils';

export default class BusinessScale extends Component {
  state = {
    data: {}
  };
  loadData = () => {
    getAxios('/api/business/stats/current/business_scale', {}, data => {
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
      <div id="business-scale">
        <div id="header">业务规模</div>
        <video
          src={`${baseStaticUrl}mp4/ywgm.mp4`}
          autoPlay="autoplay"
          loop="loop"
        />
        <div id="container">
          <div
            className={['item', key === 'inter_customer' ? 'active' : ''].join(
              ' '
            )}
            onClick={() =>
              this.props.handlerNetworkItem(
                '国际客户数',
                'inter_customer',
                data.inter_customer
              )
            }
          >
            <div className="title">国际客户数</div>
            <div className="value digital">{data.inter_customer}</div>
            <div className="sub yinpai">{data.inter_customer_gold}</div>
          </div>
          <div
            className={[
              'item',
              key === 'inter_leased_line' ? 'active' : ''
            ].join(' ')}
            onClick={() =>
              this.props.handlerNetworkItem(
                '国际业务专线数',
                'inter_leased_line',
                data.inter_leased_line
              )
            }
          >
            <div className="title">国际业务专线数</div>
            <div className="value digital">{data.inter_leased_line}</div>
            <div className="sub">AAA:{data.inter_leased_line_aaa}</div>
          </div>
          <div
            className={[
              'item',
              key === 'national_customer' ? 'active' : ''
            ].join(' ')}
            onClick={() =>
              this.props.handlerNetworkItem(
                '国内客户数',
                'national_customer',
                data.national_customer
              )
            }
          >
            <div className="title">国内客户数</div>
            <div className="value digital">{data.national_customer}</div>
            <div className="sub yinpai">{data.national_customer_gold}</div>
          </div>
          <div
            className={[
              'item',
              key === 'gov_enter_leased_line' ? 'active' : ''
            ].join(' ')}
            onClick={() =>
              this.props.handlerNetworkItem(
                '政企业务专线数',
                'gov_enter_leased_line',
                data.gov_enter_leased_line
              )
            }
          >
            <div className="title">政企业务专线数</div>
            <div className="value digital">{data.gov_enter_leased_line}</div>
            <div className="sub">AAA:{data.gov_enter_leased_line_aaa}</div>
          </div>
        </div>
      </div>
    );
  }
}
