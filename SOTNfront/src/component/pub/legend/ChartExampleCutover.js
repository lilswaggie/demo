import React, { Component } from 'react';

import '../../../assets/css/pub/chart-example.scss';
import PropTypes from 'prop-types';

export default class ChartExampleCutover extends Component {
  static propTypes = {
    style: PropTypes.object
  };

  static defaultProps = {
    style: {}
  };

  render() {
    return (
      <div className="chart-example" style={this.props.style}>
        <div className="item">
          <span className="color-icon normal" />
          <span className="color-description">未完成</span>
        </div>
        <div className="item">
          <span className="color-icon finish" />
          <span className="color-description">已完成</span>
        </div>
        <div className="item">
          <span className="color-icon error" />
          <span className="color-description">已取消</span>
        </div>
      </div>
    );
  }
}
