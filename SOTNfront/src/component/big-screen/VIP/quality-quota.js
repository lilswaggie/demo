import React, { Component } from 'react';

import { getAxios } from '../../../axios/mainAxios';
import { baseStaticUrl } from '../../../util/CommonUtils';

export default class QualityQuota extends Component {
  state = {
    value: {},
    lineNum: {}
  };

  loadData(params) {
    if (params.sceneId || params.customer) {
      let requestParams = { ...params };
      requestParams.customer && delete requestParams.sceneId;
      !requestParams.businessType && delete requestParams.businessType;
      getAxios(
        '/api/business/stats/current/business_quality/vip',
        requestParams,
        data => {
          this.setState({ value: data.values });
        }
      );
    }
  }

  loadLineNum = (nextProps = this.props) => {
    if (nextProps.sceneId || nextProps.customer) {
      let requestParams = { ...nextProps };
      requestParams.customer && delete requestParams.sceneId;
      !requestParams.customer && delete requestParams.customer;
      !requestParams.businessType && delete requestParams.businessType;
      getAxios('/api/leased_lines/stats/num/fault', requestParams, data =>
        this.setState({ lineNum: data })
      );
    }
  };
  componentWillReceiveProps(nextProps) {
    let { customerId, customer, sceneId, businessType } = nextProps;
    let {
      customerId: self_customerId,
      customer: self_customer,
      sceneId: self_sceneId,
      businessType: self_businessType
    } = this.props;
    if (
      customerId === self_customerId &&
      customer === self_customer &&
      sceneId === self_sceneId &&
      businessType === self_businessType
    ) {
      return;
    }
    this.loadData({ customerId, sceneId, businessType });
    this.loadLineNum({ customer: customerId, sceneId, businessType });
  }
  componentDidMount() {
    let { customerId, sceneId, businessType, customer } = this.props;
    this.loadData({ customerId, sceneId, businessType });
    this.loadLineNum({ customer, sceneId, businessType });
  }
  render() {
    let { value, lineNum } = this.state;
    return (
      <div id="quality-quota">
        <div className="content-title">质量指标</div>
        <video
          src={`${baseStaticUrl}mp4/zlzb.mp4`}
          autoPlay="autoplay"
          loop="loop"
        />
        <div id="zxkyl" className="circle">
          <span className="value digital">{value.leased_line_usable_rate}</span>
          <span className="title">专线可用率(%)</span>
        </div>
        <div id="zxzdsc" className="circle">
          <span className="value digital">
            {value.leased_line_interrupt_time}
          </span>
          <span className="title">专线中断时长(h)</span>
        </div>
        <div id="zxtscljsl" className="circle">
          <span className="value digital">
            {value.leased_line_complaint_timely_rate}
          </span>
          <span className="title">专线投诉处理及时率(%)</span>
        </div>
        <div id="zxgzclsc" className="circle">
          <span className="value digital">
            {value.leased_line_fault_handling_time}
          </span>
          <span className="title">专线故障处理时长(h)</span>
        </div>
        <div id="zxgzcljsl" className="circle">
          <span className="value digital">
            {value.leased_line_fault_handling_timely_rate}
          </span>
          <span className="title">专线故障处理及时率(%)</span>
        </div>
        <div id="zxtswcls" className="circle">
          <span className="value digital">
            {value.leased_line_complaint_ongoing_num}
          </span>
          <span className="title">专线投诉未处理数(次)</span>
        </div>
        <div id="center">
          <span className="digital">{lineNum.total}</span>
          <span className="title">专线总数</span>
        </div>
      </div>
    );
  }
}
