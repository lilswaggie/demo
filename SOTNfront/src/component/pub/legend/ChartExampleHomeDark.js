import React, { Component } from 'react';

import PropTypes from 'prop-types';

import '../../../assets/css/pub/chart-example-home-china.scss';

export default class ChartExampleHomeDark extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    style: {}
  };

  render() {
    const { className } = this.props;
    return (
      <div
        className={`chart-example-home-china dark ${className}`}
        style={this.props.style}
      >
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
        <div className="item fault">
          <span className="normal">正常</span>
          <span className="error">故障</span>
        </div>
      </div>
    );
  }
}
