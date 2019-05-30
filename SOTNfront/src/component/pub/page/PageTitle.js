import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon, Divider } from 'antd';
import { gotoPath } from '../../../util/ReduxUtil';

const PageTitleWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  height: 40px;
  width: 100%;
  background-color: #fff;
`;

const Back = styled.span`
  font-size: 14px;
  color: #2c9cfa;
  cursor: pointer;
`;

const Title = styled.span`
  font-size: 14px;
  font-weight: 700;
`;

const Left = styled.div``;
const Middle = styled.div``;
const Right = styled.div``;

export default class PageTitle extends Component {
  static propTypes = {
    title: PropTypes.node,
    showBack: PropTypes.bool,
    backTitle: PropTypes.node,
    /*
      若存在，组件点击时：
      1.有onBackClick时，会先触发onBackClick后再跳转到该路径
      2.没有onBackClick时，跳转到该路径
    */
    backPath: PropTypes.string,
    onBackClick: PropTypes.func,
    // string|ReactNode
    middle: PropTypes.node
  };

  static defaultProps = {
    showBack: false,
    backTitle: '返回',
    title: ''
  };

  onBackClick = () => {
    const { onBackClick, path } = this.props;
    onBackClick && onBackClick();
    path && gotoPath(path);
  };

  render() {
    const { showBack, backTitle, title, onBackClick, middle, right } = this.props;
    return (
      <PageTitleWrap>
        <Left>
          {showBack && (
            <Fragment>
              <Back onClick={onBackClick}>
                <Icon type="left" />
                <span>{backTitle}</span>
              </Back>
              <Divider type="vertical" />
            </Fragment>
          )}
          <Title>{title}</Title>
        </Left>
        <Middle>{middle}</Middle>
        <Right>{right}</Right>
      </PageTitleWrap>
    );
  }
}
