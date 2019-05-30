import React, { Component } from 'react';

import { Input } from 'antd';

import { toLogin } from '../../util/ReduxUtil';

export default class ApplyResetPwd extends Component {
  render() {
    return (
      <div>
        <p className="tip-message">请输入你的邮箱地址，以进行密码重置</p>
        <div className="form-box">
          <div className="form-item">
            <Input
              value={this.props.email}
              onChange={this.props.onEmailChange}
              className="email"
              placeholder="邮箱地址"
            />
          </div>
          <div className="form-item">
            <Input
              value={this.props.captcha}
              onChange={this.props.onCaptchaChange}
              className="captcha"
              placeholder="验证码"
            />
            <span className="captcha-img">
              <img
                src="https://yuqing.bigcloudsys.cn/apps/analysis/manage/getCaptcha"
                alt=""
              />
            </span>
          </div>
          <div className="submit-btn" onClick={this.props.onResetPwd}>
            下一步
          </div>
          <p className="to-login" onClick={toLogin}>
            &lt;&lt;&nbsp;返回登录页面
          </p>
        </div>
      </div>
    );
  }
}
