import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { Tooltip, Icon } from 'antd';
import styled from 'styled-components';

const QuestionIcon = styled(Icon)`
  margin-left: 10px;
  cursor: pointer;
`;

export default class QuestionIconTooltip extends Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.node
  };

  render() {
    const { className, title } = this.props;
    return title ? (
      <Tooltip overlayClassName={className} placement="top" title={title}>
        <QuestionIcon type="question-circle" />
      </Tooltip>
    ) : null;
  }
}
