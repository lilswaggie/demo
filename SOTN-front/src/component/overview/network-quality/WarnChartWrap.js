import React, { Component } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

import { px2rem } from '../../../util/StyleUtils';

const WarnChartWrap = styled.div`
`;

const Title = styled.div`
  display: flex;
  height: ${px2rem(20)};
  justify-content: space-between;
  align-items: center;
  text-align: left;

  .title {
    color: #72758C;
    font-size: 14px;
  }

  .example-item {
    margin-left: 10px;
    color: #666666;
    font-size: 12px;

    & > span {
      display: inline-block;
    }

    .icon {
      margin-right: 3px;
      height: 10px;
      width: 10px;
      border-radius: 5px;

      &.all {
        background-color: #6496FE;
      }

      &.first {
        background: linear-gradient(to bottom, #935DFE, #F65F7B)
      }
    }
  }
`;

const Context = styled.div`
  height: calc(100% - ${px2rem(20)});
`;

export default class WarnCount extends Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string
  };

  static defaultProps = {
    warnCount: 0,
    firstWarnCount: 0
  };

  render() {
    return (
      <WarnChartWrap className={this.props.className}>
        <Title>
          <div className="title">{this.props.title}</div>
          <div>
            <span className="example-item">
              <span className="icon first"></span>
              <span className="name">一级告警</span>
            </span>
            <span className="example-item">
              <span className="icon all"></span>
              <span className="name">活动告警</span>
            </span>
          </div>
        </Title>
        <Context>
          {this.props.children}
        </Context>
      </WarnChartWrap>
    );
  }
}
