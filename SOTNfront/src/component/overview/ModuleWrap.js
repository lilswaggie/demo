import React, { Component } from 'react';

import { Button } from 'antd';

import PropTypes from 'prop-types';

import '../../assets/css/overview/module-wrap.scss';

export default class ModuleWrap extends Component {
  static propTypes = {
    // 模块在页面的位置索引
    index: PropTypes.number.isRequired,
    // 模块名称
    title: PropTypes.string.isRequired,
    // 分省情况点击事件
    onProvinceClick: PropTypes.func.isRequired,
    // 置顶按钮
    topButtonVisible: PropTypes.bool,
    onTopButtonClick: PropTypes.func,
    // 移除按钮
    removeButtonVisible: PropTypes.bool,
    onRemoveButtonClick: PropTypes.func,
    // 详情按钮
    detailButtonVisible: PropTypes.bool,
    onDetailButtonClick: PropTypes.func
  };

  static defaultProps = {
    topButtonVisible: true,
    onTopButtonClick: () => {},
    removeButtonVisible: true,
    onRemoveButtonClick: () => {},
    detailButtonVisible: true,
    onDetailButtonClick: () => {}
  };

  render() {
    const {
      title,
      onProvinceClick,
      topButtonVisible,
      onTopButtonClick,
      removeButtonVisible,
      onRemoveButtonClick,
      detailButtonVisible,
      onDetailButtonClick
    } = this.props;
    return (
      <div className="overview-module-wrap">
        <div className="overview-module-header">
          <div className="left">
            <span className="title">{title}</span>
            <span className="province" onClick={onProvinceClick}>
              分省情况&gt;&gt;
            </span>
          </div>
          <div className="right">
            {topButtonVisible && (
              <Button size="small" onClick={onTopButtonClick}>
                置顶
              </Button>
            )}
            {removeButtonVisible && (
              <Button size="small" type="dashed" onClick={onRemoveButtonClick}>
                移除
              </Button>
            )}
            {detailButtonVisible && (
              <Button size="small" type="primary" onClick={onDetailButtonClick}>
                详情
              </Button>
            )}
          </div>
        </div>
        <div className="overview-module-content">{this.props.children}</div>
      </div>
    );
  }
}
