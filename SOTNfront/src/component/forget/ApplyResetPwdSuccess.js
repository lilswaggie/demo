import React, { Component } from 'react';

import { toLogin } from '../../util/ReduxUtil';

export default class ApplyResetPwdSuccess extends Component {
  render() {
    return (
      <div className="success-container">
        <p class="success-tips">重设密码的邮件已发送到邮箱</p>
        <p class="email">{this.props.email}</p>
        <p className="success-tips">请按邮件中的操作提示完成身份验证。</p>
        <p className="to-login-right" onClick={toLogin}>
          打开登录页面&nbsp;&gt;&gt;
        </p>
      </div>
    );
  }
}
