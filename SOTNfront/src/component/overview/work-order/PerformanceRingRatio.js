import React, { Component } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Icon } from 'antd';

const Content = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: ${props => props.color};
`;

const Name = styled.div`
  font-size: 12px;
  color: #525C66;
`;

const StyledIcon = styled(Icon)`
  margin: 0 3px;
  font-size: 12px;
`;

const Value = styled.div`
  font-size: 12px;
`;

export default class PerformanceRingRatio extends Component {
  static propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.number
  };

  static defaultProps = {
    name: '较现网',
    value: 0
  };

  getColor = value => {
    return value > 0 ? '#EC474A' : '#71CA41';
  }

  render() {
    const { className, name, value } = this.props;
    return (
      <Content className={className} color={this.getColor(value)}>
        <Name>{name}</Name>
        <StyledIcon type={value > 0 ? 'arrow-up' : 'arrow-down'}/>
        <Value>{Math.abs(value)}%</Value>
      </Content>
    );
  }
}
