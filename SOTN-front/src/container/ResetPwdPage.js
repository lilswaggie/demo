import React, { Component } from 'react';

import { Input } from 'antd';

import '../assets/css/forget/forget.scss';

export default class ApplyResetPwdPage extends Component {
  state = {
    password: '',
    confirmPassword: ''
  };

  onFormChange = propName => e => {
    this.setState({ [propName]: e.target.value });
  };

  resetPwd = () => {
    // 提交数据
    const { password, confirmPassword } = this.state;
    if (password && confirmPassword && password === confirmPassword) {
      // TODO: 提示成功或者失败
      // 成功：跳转到登录页面
      // 失败：给你错误信息提示、留在当前页面
    }
  };

  render() {
    return (
      <div className="forget-container">
        <div className="forget-header">
          <span className="china-mobile-icon" />
          <span className="system-name" />
        </div>
        <div className="forget-body">
          <div className="header">
            <span className="password-icon" />
            <span className="text">重置您的密码</span>
          </div>
          <div className="line" />
          <p className="tip-message">请输入新的密码</p>
          <div className="form-box">
            <div className="form-item">
              <p>新密码</p>
              <Input
                value={this.state.password}
                onChange={this.onFormChange('password')}
                className="password"
                placeholder="请输入"
              />
            </div>
            <div className="form-item">
              <p>确认新密码</p>
              <Input
                value={this.state.confirmPassword}
                onChange={this.onFormChange('confirmPassword')}
                className="confirm-password"
                placeholder="请输入"
              />
            </div>
            <div className="submit-btn" onClick={this.props.onResetPwd}>
              重置
            </div>
          </div>
        </div>
        <div className="forget-footer">
          Copyright &copyright; 20xx-20xx 中国移动通信集团有限公司 版权所有
        </div>
      </div>
    );
  }
}
