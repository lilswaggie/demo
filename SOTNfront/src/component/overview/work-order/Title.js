import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from 'antd';
import { gotoPath } from '../../../util/ReduxUtil';
import { px2rem } from '../../../util/StyleUtils';

const TitleWrap = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
    height: ${px2rem(24)};
    width: 100%;
    /* line-height: ${px2rem(24)}; */
    background-color: rgba(240, 243, 247, 1);
    font-size: 14px;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
        color: rgb(44, 156, 250);

        /* TitleWrap hover的时候，子元素hover样式 */
        /* .ellipsis-icon {
            color: rgb(44, 156, 250);
        } */
    }
`;

const EllipsisIcon = styled(Icon)`
  font-size: 18px;
  color: #000;

  /*
    TitleWrap hover的时候，子元素hover样式.
    上面class的写法也可以，这样实现更优雅.
  */
  div${TitleWrap}:hover & {
    color: rgb(44, 156, 250);
  }
`;

export default class Title extends Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    // 组件点击事件，若存在点击触发；
    onClick: PropTypes.func,
    /*
      若存在，组件点击时：
      1.有点击事件时，会先触发点击事件后再跳转到该路径
      2.没有点击事件时，跳转到该路径
    */
    path: PropTypes.string
  };

  onClick = () => {
    const { onClick, path } = this.props;
    if (onClick) {
      onClick();
    }
    if (path) {
      gotoPath(path);
    }
  }

  render() {
    const { className, title, children } = this.props;
    return (
      <TitleWrap className={className} onClick={this.onClick}>
        <span>{children || title}</span>
        <EllipsisIcon
          type="ellipsis"
          /*className="ellipsis-icon" */
        />
      </TitleWrap>
    );
  }
}
