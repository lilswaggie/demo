/**
 * @deprecated
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { Checkbox, message } from 'antd';

import classNames from 'classnames';
import Cookies from 'js-cookie';

import { postMockAxios } from '../axios/mainAxios';

import '../assets/css/login/login.scss';

class LoginPage extends Component {
  state = {
    username: '',
    password: '',
    checked: false
  };

  componentDidMount() {
    const cookieUser = Cookies.getJSON('SOTN_COOKIE_USER');
    if (cookieUser && cookieUser.username) {
      this.setState({
        username: cookieUser.username,
        password: cookieUser.password,
        checked: true
      });
    }
  }

  setFormData = propName => e => {
    this.setState({
      [propName]: propName === 'checked' ? e.target.checked : e.target.value
    });
  };

  getInputBeforeIcon = idx => {
    return (
      <span
        className={classNames({
          'input-before-icon': true,
          username: idx === 0,
          password: idx === 1
        })}
      />
    );
  };

  login = () => {
    const { username, password, checked } = this.state;
    postMockAxios(
      'login',
      { username, password },
      data => {
        // success
        if (checked) {
          Cookies.set(
            'SOTN_COOKIE_USER',
            { username, password },
            { expires: 720 }
          );
        }
        this.props.dispatch(push('/main/home'));
      },
      data => {
        // failed
        // { code: '', message: '', data: ...}
        message.error(data.message);
      }
    );
  };

  render() {
    return (
      <div className="login-container">
        <div className="login-box">
          <div className="login-body">
            <div className="login-header">
              <p>
                <span className="china-mobile-icon" />
              </p>
              <p>
                <span className="system-name" />
              </p>
            </div>
            <div className="input-item username">
              <input
                type="text"
                placeholder="用户名"
                value={this.state.username}
                onChange={this.setFormData('username')}
              />
            </div>
            <div className="input-item password">
              <input
                type="password"
                placeholder="密码"
                value={this.state.password}
                onChange={this.setFormData('password')}
              />
            </div>
            <div className="login-link clearfloat">
              <Checkbox
                className="member"
                checked={this.state.checked}
                onChange={this.setFormData('checked')}
              >
                记住用户名和密码
              </Checkbox>
              <Link to="apply-reset-password" className="forget-password">
                忘记密码
              </Link>
            </div>
            <div className="login-btn" onClick={this.login}>
              登&nbsp;录
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(LoginPage);
