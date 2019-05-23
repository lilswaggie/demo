import React, { Component } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';
import { px2rem } from '../../../util/StyleUtils';

const LineTrendWrap = styled.div`
  padding: 10px 20px;
  border: 1px solid #E5E5E5;
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${px2rem(20)};
`;

const Content = styled.div`
  margin-top: ${px2rem(10)};
  height: ${px2rem(180)};
`;

export default class LineTrend extends Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    control: PropTypes.node
  };

  render() {
    const { className, title } = this.props;
    return (
      <LineTrendWrap className={className}>
        <Title>
          <div>{title}</div>
          <div>{this.props.control}</div>
        </Title>
        <Content>
          {this.props.children}
        </Content>
      </LineTrendWrap>
    );
  }
}
