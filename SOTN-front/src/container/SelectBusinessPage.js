import React, { Component } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import { Divider } from 'antd';

import { setBusinessTypeAction } from '../redux/businessRedux';

import '../assets/css/business.scss';

class SelectBusinessPage extends Component {
  select = type => () => {
    this.props.dispatch(setBusinessTypeAction(type));
    this.props.dispatch(replace('/main/home'));
  };

  render() {
    return (
      <div className="business-container">
        <div className="business-header">
          <span className="china-mobile-icon" />
          <span className="system-name" />
        </div>
        <div className="business-body">
          <div className="wrap word-wrap" onClick={this.select(1)}>
            <span className="icon" />
            <Divider />
            <p className="text">国际</p>
          </div>
          <div className="wrap china-wrap" onClick={this.select(2)}>
            <span className="icon" />
            <Divider />
            <p className="text">政企</p>
          </div>
        </div>
        <div className="business-footer">
          Copyright &copyright; 20xx-20xx 中国移动通信集团有限公司 版权所有
        </div>
      </div>
    );
  }
}

const mapState2Props = state => ({ business: state.business });

export default connect(mapState2Props)(SelectBusinessPage);
