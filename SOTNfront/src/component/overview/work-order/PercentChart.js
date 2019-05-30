import React, { Component } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

import { px2rem } from '../../../util/StyleUtils';

const PercentWrap = styled.div`
  width: 100%;
  height: ${px2rem(6)};
  border-radius: ${px2rem(3)};
  background-color: rgba(241, 244, 249, 1);
`;

const Percent = styled.div`
  height: 100%;
  width: ${props => props.value}%;
  border-radius: ${px2rem(3)};
  background: linear-gradient(
    90deg,
    ${props => props.startColor || 'rgba(39, 193, 193, 1)'} 0%,
    ${props => props.endColor || 'rgba(100, 150, 254, 1)'} 100%
  );
`;

export default class PercentChart extends Component {
  static propTypes = {
    className: PropTypes.string,
    percent: PropTypes.number.isRequired,
    startColor: PropTypes.string,
    endColor: PropTypes.string
  };

  render() {
    const { className, percent, startColor, endColor } = this.props;
    return (
      <PercentWrap className={className}>
        <Percent
          value={percent > 100 ? 100 : percent}
          startColor={startColor}
          endColor={endColor}
        />
      </PercentWrap>
    );
  }
}
