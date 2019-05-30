import React, { Component } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

import QuestionIconTooltip from '../work-order/QuestionIconTooltip';

import { px2rem } from '../../../util/StyleUtils';
import { formatNumber } from '../../../util/CommonUtils';

const Content = styled.div`
  height: ${px2rem(28)};
  line-height: ${px2rem(28)};

  & > span {
    display: inline-block;
    vertical-align: middle;
  }
  .value {
    font-size: 24px;
    color: ${props => props.color || '#3c3e4a'};
    font-weight: 600;
  }

  .unit {
    margin-left: 3px;
    font-size: 14px;
    color: ${props => props.color || '#72758c'};
  }
`;

const StyledQuestionIconTooltip = styled(QuestionIconTooltip)`
  .ant-tooltip-arrow {
    border-top-color: ${props => props.color || 'rgba(0, 0, 0, 0.75)'};
  }
  .ant-tooltip-inner {
    background-color: ${props => props.color || 'rgba(0, 0, 0, 0.75)'};
  }
`;

export class PerformanceValue extends Component {
  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.number.isRequired,
    unit: PropTypes.string,
    color: PropTypes.string,
    tooltip: PropTypes.node,
    tooltipBackgroundColor: PropTypes.string
  };

  static defaultProps = {
    value: 0
  };

  render() {
    const { className, color, value, unit, tooltip, tooltipBackgroundColor } = this.props;
    return (
      <Content className={className} color={color}>
        {<span className="value">{formatNumber(value)}</span>}
        {unit && <span className="unit">{unit}</span>}
        {tooltip && (
          <StyledQuestionIconTooltip title={tooltip} color={tooltipBackgroundColor} />
        )}
      </Content>
    );
  }
}

export default PerformanceValue;
