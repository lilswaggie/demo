import React, { Component } from 'react';

import PropTypes from 'prop-types';

import '../../../assets/css/pub/chart-example-home-china.scss';

export default class ChartExampleHomeChina extends Component {
  static propTypes = {
    style: PropTypes.object
  };

  static defaultProps = {
    style: {}
  };

  render() {
    return (
      <div className="chart-example-home-china" style={this.props.style}>
        <div className="item">
          <span className="color-icon normal-otm" />
          <span className="color-description">OTM</span>
        </div>
        <div className="item">
          <span className="color-icon normal-cpe" />
          <span className="color-description">CPE</span>
        </div>
        <div className="item">
          <span className="color-icon normal-oa" />
          <span className="color-description">OA</span>
        </div>
      </div>
    );
  }
}
