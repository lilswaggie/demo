import React, { Component } from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';

import { Icon, Divider } from 'antd';

import {
  setBusinessTypeAction,
  showBusinessTypeAction
} from '../redux/businessRedux';

import '../assets/css/select-business.scss';

export const businessTypeArr = [
  {
    type: 1,
    name: '国际'
  },
  {
    type: 2,
    name: '政企'
  }
];

class SelectBusiness extends Component {
  makeBusinessSelectOptions = () => {
    return businessTypeArr.map(option => {
      const cls = classNames(
        'wrap',
        option.type === 1 ? 'word-wrap' : 'china-wrap',
        { active: this.props.business.type === option.type }
      );
      return (
        <div
          key={option.type}
          className={cls}
          onClick={this.select(option.type)}
        >
          <span className="icon" />
          <Divider />
          <p className="text">{option.name}</p>
        </div>
      );
    });
  };

  select = type => () => {
    this.props.dispatch(setBusinessTypeAction(type));
    this.props.dispatch(showBusinessTypeAction(false));
  };

  close = () => {
    this.props.dispatch(showBusinessTypeAction(false, false));
  };

  render() {
    return (
      <div
        className="business-select-wrap"
        style={{ display: this.props.business.visible ? 'block' : 'none' }}
      >
        <div className="business-select-box">
          {this.props.business.closable && (
            <span className="close" onClick={this.close}>
              <Icon type="close" />
            </span>
          )}
          {this.makeBusinessSelectOptions()}
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  business: state.business
});

export default connect(mapStateToProps)(SelectBusiness);
