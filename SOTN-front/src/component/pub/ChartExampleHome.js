import React, { Component } from 'react';

import '../../assets/css/pub/chart-example-home.scss';
import PropTypes from 'prop-types';

export default class ChartExampleHome extends Component {
  static propTypes = {
    style: PropTypes.object
  };

  static defaultProps = {
    style: {}
  };

  render() {
    return (
      <div className="chart-example-home" style={this.props.style}>
        <div className="item">
          <p className="title">在建海缆</p>
          <div className="color-item-wrap">
            <div className="color-item">
              <span
                className="color-icon"
                style={{ backgroundColor: '#979797' }}
              />
              <span className="color-description">NCP</span>
            </div>
          </div>
        </div>
        <div className="item">
          <p className="title">已建海缆</p>
          <div className="color-item-wrap">
            <div className="color-item">
              <span
                className="color-icon"
                style={{ backgroundColor: '#F6B251' }}
              />
              <span className="color-description">夏金</span>
            </div>
            <div className="color-item">
              <span
                className="color-icon"
                style={{ backgroundColor: '#855512' }}
              />
              <span className="color-description">福淡</span>
            </div>
            <div className="color-item">
              <span
                className="color-icon"
                style={{ backgroundColor: '#72FAEF' }}
              />
              <span className="color-description">SJC</span>
            </div>
            <div className="color-item">
              <span
                className="color-icon"
                style={{ backgroundColor: '#BE2DDC' }}
              />
              <span className="color-description">FASTER</span>
            </div>
            <div className="color-item">
              <span
                className="color-icon"
                style={{ backgroundColor: '#3FF658' }}
              />
              <span className="color-description">APG</span>
            </div>
            <div className="color-item">
              <span
                className="color-icon"
                style={{ backgroundColor: '#2AC4F4' }}
              />
              <span className="color-description">SWM5</span>
            </div>
          </div>
        </div>
        <div className="item">
          <p className="title">在建陆缆</p>
          <div className="color-item-wrap">
            <div className="color-item">
              <span
                className="color-icon"
                style={{ backgroundColor: '#F8FF67' }}
              />
              <span className="color-description">ERA</span>
            </div>
            <div className="color-item">
              <span
                className="color-icon"
                style={{ backgroundColor: '#FFFFFF' }}
              />
              <span className="color-description">ERMC </span>
            </div>
            <div className="color-item">
              <span
                className="color-icon"
                style={{ backgroundColor: '#FFFFFF' }}
              />
              <span className="color-description">DREAM </span>
            </div>
          </div>
        </div>
        <div className="item">
          <p className="title">租用海缆</p>
          <div className="color-item-wrap">
            <div className="color-item">
              <span
                className="color-icon"
                style={{ backgroundColor: '#F84848' }}
              />
              <span className="color-description">APCN2</span>
            </div>
            <div className="color-item">
              <span
                className="color-icon"
                style={{ backgroundColor: '#FFFFFF' }}
              />
              <span className="color-description">ASE</span>
            </div>
            <div className="color-item">
              <span
                className="color-icon"
                style={{ backgroundColor: '#FFFFFF' }}
              />
              <span className="color-description">UNITY</span>
            </div>
            <div className="color-item">
              <span
                className="color-icon"
                style={{ backgroundColor: '#FFFFFF' }}
              />
              <span className="color-description">TPE</span>
            </div>
            <div className="color-item">
              <span
                className="color-icon"
                style={{ backgroundColor: '#FFFFFF' }}
              />
              <span className="color-description">JUS</span>
            </div>
            <div className="color-item">
              <span
                className="color-icon"
                style={{ backgroundColor: '#FFFFFF' }}
              />
              <span className="color-description">PC-1</span>
            </div>
            <div className="color-item">
              <span
                className="color-icon"
                style={{ backgroundColor: '#FFFFFF' }}
              />
              <span className="color-description">AAG</span>
            </div>
            <div className="color-item">
              <span
                className="color-icon"
                style={{ backgroundColor: '#FFFFFF' }}
              />
              <span className="color-description">BBG+EIG</span>
            </div>
            <div className="color-item">
              <span
                className="color-icon"
                style={{ backgroundColor: '#FFFFFF' }}
              />
              <span className="color-description">SMW4+APCN2</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
