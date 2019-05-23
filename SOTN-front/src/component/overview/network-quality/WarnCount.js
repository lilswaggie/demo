import React, { Component } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

import { formatNumber } from '../../../util/CommonUtils';
import { px2rem } from '../../../util/StyleUtils';

const WarnCountWrap = styled.div`
  width: ${px2rem(106)};

  .warn-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: ${px2rem(60)};
    border-radius: 4px;
    color: #ffffff;
    text-align: center;
    .number {
      font-size: 20px;
    }

    .name {
      font-size: 12px;
    }

    &.all {
      background-color: #6496fe;
    }

    &.first {
      margin-top: ${px2rem(26)};
      background-color: #f65f7b;
    }
  }
`;

export default class WarnCount extends Component {
  static propTypes = {
    warnCount: PropTypes.number,
    firstWarnCount: PropTypes.number
  };

  static defaultProps = {
    warnCount: 0,
    firstWarnCount: 0
  };

  render() {
    return (
      <WarnCountWrap>
        <div className="warn-item all">
          <div className="number">{formatNumber(this.props.warnCount)}</div>
          <div className="name">活动告警</div>
        </div>
        <div className="warn-item first">
          <div className="number">
            {formatNumber(this.props.firstWarnCount)}
          </div>
          <div className="name">一级告警</div>
        </div>
      </WarnCountWrap>
    );
  }
}
