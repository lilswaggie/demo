import React, { Component } from 'react';

import PropTypes from 'prop-types';

import '../../assets/css/pub/chart-example.scss';

export default class ChartExample extends Component {
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
          <span className="color-description">正常</span>
        </div>
        <div className="item">
          <span className="color-icon error" />
          <span className="color-description">故障</span>
        </div>
      </div>
    );
  }
}
