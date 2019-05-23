import React, { Component } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

import QuestionIconTooltip from './QuestionIconTooltip';

import { px2rem } from '../../../util/StyleUtils';
import { timeGranularityMap } from '../../../util/TimeUtils';

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${px2rem(20)};
  line-height: ${px2rem(20)};
  font-size: 14px;
  color: #72758c;
`;

export default class PerformanceTitle extends Component {
  static propTypes = {
    title: PropTypes.string,
    granularity: PropTypes.string,
    // 标题栏？显示的时间
    date: PropTypes.string,
    // 自定义更多按钮组件
    moreRender: PropTypes.func
  };

  static defaultProps = {
  };

  onMoreClick = () => {
    this.props.onMoreClick && this.props.onMoreClick();
  };

  render() {
    const { title, granularity, date, moreRender } = this.props;
    return (
      <Title>
        <div>
          <span>
            {title}
            {granularity ? `/${timeGranularityMap[granularity]}` : null}
          </span>
          <QuestionIconTooltip title={date} />
        </div>
        <div>
          {moreRender && moreRender()}
        </div>
      </Title>
    );
  }
}
