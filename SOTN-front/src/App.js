import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';

import { Spin, message } from 'antd';

import PropTypes from 'prop-types';
import qs from 'qs';

import { AxiosRequest } from './axios/mainAxios';
import { loginAction } from './redux/loginRedux';

import LoginPage from './container/LoginPage';
import ApplyResetPwdPage from './container/ApplyResetPwdPage';
import ResetPwdPage from './container/ResetPwdPage';
import MainPage from './container/MainPage';
import BigScreenPage from './container/BigScreenPage';
import SelectBusinessPopupPage from './container/SelectBusinessPopupPage';
import SelectBusinessPage from './container/SelectBusinessPage';
import LineCustomerModal from './component/pub/LineCustomerModal';
import KeySearch from './container/KeySearch';

import { getToken } from './util/ReduxUtil';

import './App.scss';

// 动画效果库，备用
// import 'animate.css';

class App extends Component {
  static propTypes = {
    location: PropTypes.object
  };

  componentWillReceiveProps(nextProps) {
    const routerLocation = this.props.location || { pathname: '' };
    const nextRouterLocation = nextProps.location || { pathname: '' };

    if (routerLocation.pathname !== nextRouterLocation.pathname) {
      window.onresize();
      window.scrollTo(0, 0);
    }
  }

  componentDidMount = () => {
    window.onresize();
    const search = this.props.location ? this.props.location.search : '';
    let params;
    if (search) {
      params = qs.parse(search.replace('?', ''));
      if (params.iamcaspticket) {
        try {
          const requestParams = {
            iamcaspticket: params.iamcaspticket.replace(/ /g, '+')
          };
          const requestConfig = {
            baseURL: 'http://10.24.44.17:8080/sotn/api/',
            method: AxiosRequest.GET,
            url: 'tickets/auth4aTicket',
            params: requestParams,
            successCallback: () =>
              this.props.dispatch(
                replace(!this.props.business.type ? '/business' : '/main/home')
              ),
            failureCallback: errMsg => {
              errMsg && message.error(errMsg);
            }
          };
          this.props.dispatch(loginAction(requestConfig));
        } catch (e) {
          console.log('...');
        }
      }
    } else {
      let token = getToken();
      if (token) {
        if (this.props.location.pathname === '/') {
          this.props.dispatch(
            replace(!this.props.business.type ? '/business' : '/main/home')
          );
        }
      } else {
        // TODO: go back to 4A ...
      }
    }
  };

  onClick = () => {
    // console.log('window click .');
  };

  render() {
    const search = this.props.location ? this.props.location.search : '';
    let params;
    if (search) {
      params = qs.parse(search.replace('?', ''));
      if (params.iamcaspticket) {
        return (
          <div className="full-screen-div">
            <Spin
              delay={100}
              size="large"
              spinning={true}
              tip="正在接入中，请稍等..."
            />
          </div>
        );
      }
    }
    return (
      <div className="app" onClick={this.onClick}>
        <SelectBusinessPopupPage />
        <LineCustomerModal />
        <Route path="/login" component={LoginPage} />
        <Route path="/apply-reset-password" component={ApplyResetPwdPage} />
        <Route path="/reset-password" component={ResetPwdPage} />
        <Route path="/business" component={SelectBusinessPage} />
        <Route path="/main" component={MainPage} />
        <Route path="/big-screen" component={BigScreenPage} />
        <Route path="/search" component = {KeySearch} />
      </div>
    );
  }
}

const mapState2Props = state => ({
  location: state.routing.location,
  business: state.business
});

export default connect(mapState2Props)(App);
