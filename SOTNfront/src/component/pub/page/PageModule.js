import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const PageModuleWrap = styled.div`
  padding: 8px;
  background-color: #fff;
  text-align: left;
`;

const ModuleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);

  .left {
    /* height: 18px; */
    border-left: 3px solid #699af4;

    .title {
      line-height: 18px;
      margin-left: 10px;
      font-weight: 700;
    }
  }
  /* 右侧，备用 */
  .right {
  }
`;

const ModuleContent = styled.div`
  margin-top: 10px;
`;

export default class PageModule extends Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.node
  };

  render() {
    return (
      <PageModuleWrap className={this.props.className}>
        <ModuleHeader>
          <div className="left">
            <span className="title">{this.props.title}</span>
          </div>
          <div className="right" />
        </ModuleHeader>
        <ModuleContent>{this.props.children}</ModuleContent>
      </PageModuleWrap>
    );
  }
}
