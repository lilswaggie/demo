import React, { Component } from 'react';

import ApplyResetPwd from '../component/forget/ApplyResetPwd';
import ApplyResetPwdSuccess from '../component/forget/ApplyResetPwdSuccess';

import '../assets/css/forget/forget.scss';
import { emailPatternRegex } from '../util/CommonUtils';

export default class ApplyResetPwdPage extends Component {
  state = {
    email: '',
    captcha: '',
    success: false
  };

  onFormChange = propName => e => {
    this.setState({ [propName]: e.target.value });
  };

  resetPwd = () => {
    // 提交数据
    if (emailPatternRegex.test(this.state.email) && this.state.captcha) {
      this.setState({ success: true });
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
            <span className="text">忘记密码</span>
          </div>
          <div className="line" />
          {!this.state.success ? (
            <ApplyResetPwd
              email={this.state.email}
              captcha={this.state.captcha}
              onEmailChange={this.onFormChange('email')}
              onCaptchaChange={this.onFormChange('captcha')}
              onResetPwd={this.resetPwd}
            />
          ) : (
            <ApplyResetPwdSuccess email={this.state.email} />
          )}
        </div>
        <div className="forget-footer">
          Copyright &copyright; 20xx-20xx 中国移动通信集团有限公司 版权所有
        </div>
      </div>
    );
  }
}
