import React, { Component } from 'react';
import { Radio } from 'antd';

import Iframe from '../../../container/Iframe';

import { getAxios } from '../../../axios/mainAxios';
import { baseStaticUrl } from '../../../util/CommonUtils';

export default class Area extends Component {
  state = {
    lineNum: {}
  };
  onChange = e => {
    this.props.chooseBusiness(e.target.value);
  };
  loadLineNum = ({ customer, sceneId, businessType }) => {
    if (sceneId || customer) {
      const requestParams = { customer, sceneId, businessType };
      !requestParams.businessType && delete requestParams.businessType;
      !requestParams.customer && delete requestParams.customer;

      getAxios('/api/leased_lines/stats/num/vip', requestParams, data =>
        this.setState({ lineNum: data.values })
      );
    }
  };
  componentWillReceiveProps(nextProps) {
    let { customer, sceneId, businessType } = nextProps;
    let {
      customer: self_customer,
      sceneId: self_sceneId,
      businessType: self_businessType
    } = this.props;
    if (
      customer !== self_customer ||
      sceneId !== self_sceneId ||
      businessType !== self_businessType
    ) {
      sceneId && this.loadLineNum(nextProps);
    }
  }
  componentDidMount() {
    this.loadLineNum(this.props);
  }
  render() {
    let { normal, faultNum, seriousFaultNum } = this.state.lineNum;
    return (
      <div id="area">
        <Iframe
          name="iframe-world-big-screen"
          url={`${baseStaticUrl}gis/gis3/consumerLine_3d/world.html`}
        />
        <div id="business-options">
          <Radio.Group
            value={this.props.businessType}
            buttonStyle="solid"
            onChange={this.onChange}
          >
            <Radio.Button value={0}>全部业务</Radio.Button>
            <Radio.Button value={1}>国际业务</Radio.Button>
            <Radio.Button value={2}>政企业务</Radio.Button>
          </Radio.Group>
        </div>
        <div id="line-status">
          <div id="normal" className="item">
            <div className="title">正常运行专线</div>
            <div className="value digital">{normal}</div>
          </div>
          <div id="disaster" className="item">
            <div className="title">重大故障专线</div>
            <div className="value digital">{seriousFaultNum}</div>
          </div>
          <div id="important" className="item">
            <div className="title">重要故障专线</div>
            <div className="value digital">{faultNum}</div>
          </div>
        </div>
      </div>
    );
  }
}
