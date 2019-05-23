import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Layout, Menu, Dropdown, Icon, Divider, Tooltip, Popover } from 'antd';

import classNames from 'classnames';

import { AxiosRequest, postAxios, getAxios } from '../../axios/mainAxios';
import { getUserAction } from '../../redux/loginRedux';

import { toLogin, isAdmin } from '../../util/ReduxUtil';
import { baseStaticUrl } from '../../util/CommonUtils';

import { showBusinessTypeAction } from '../../redux/businessRedux';
import { businessTypeArr } from '../../container/SelectBusinessPopupPage';

import '../../assets/css/pub/header.scss';

class MainHeader extends Component {
  componentDidMount = () => {
    const requestConfig = {
      method: AxiosRequest.GET,
      url: '/api/user/me'
    };
    this.props.dispatch(getUserAction(requestConfig));
  };

  pathMap = {
    source: [
      { path: 'network', name: '网络资源' },
      { path: 'business', name: '业务资源' }
    ],
    fault: [
      { path: 'network', name: '网络故障' },
      { path: 'business', name: '业务故障' },
      { path: 'cutover', name: '割接概览' }
    ],
    analysis: [
      { path: 'source', name: '资源统计' },
      { path: 'business-support', name: '业务支撑分析' },
      { path: 'network-quality', name: '网络质量分析' },
      { path: 'business-quality', name: '业务质量分析' },
      { path: 'service-quality', name: '服务质量分析' }
      // { path: 'warn-cutover', name: '告警及割接分析' }
    ]
  };

  menuNameMap = {
    overview: '概览',
    source: '资源管理',
    business: '业务管理',
    fault: '故障管理',
    analysis: '统计分析'
    // search: '一键搜索',
  };

  getPopMenu = type => (
    <Menu className="popup-link">
      {this.pathMap[type].map((item, idx) => (
        <Menu.Item key={idx}>
          <NavLink
            to={`/main/${type}/${item.path}`}
            activeClassName="active"
            isActive={(match, location) =>
              this.props.location.pathname.startsWith(
                `/main/${type}/${item.path}`
              )
            }
          >
            {item.name}
          </NavLink>
        </Menu.Item>
      ))}
    </Menu>
  );

  // <Menu.Item key="1">
  //     <a href="/main/userinfo">基本信息</a>
  // </Menu.Item>
  userNamePopMenu = (
    <Menu className="popup-link user-dropdown">
      <Menu.Item key="2">
        {
          // eslint-disable-next-line
          <a href="javascript:;" onClick={this.logout}>
            退出
          </a>
        }
      </Menu.Item>
    </Menu>
  );

  noticePopMenu = (
    <Menu className="popup-link notice-dropdown">
      <Menu.Item key="1">
        {isAdmin() && <Link to="/main/notice">公告管理</Link>}
        <Link to="/main/data-check">数据校验</Link>
      </Menu.Item>
    </Menu>
  );

  systemArr = [
    { name: '资源', className: 'info', id: 'XZYGLXT' },
    { name: '故障', className: 'fault', id: 'ZBGZGL' },
    { name: '性能', className: 'eoms', id: 'ZBXNGL' },
    { name: 'EOMS', className: 'property', id: 'PASM' }
  ];

  gotoSystem = id => () => {
    getAxios(`api/tickets/${id}`, ({ link }) => window.open(link));
  };

  subSystemPopMenu = (
    <div className="sub-system">
      {this.systemArr.map((system, idx) => (
        <div key={idx} className="system" onClick={this.gotoSystem(system.id)}>
          <span className={`icon ${system.className}`} />
          <span className="name">{system.name}</span>
        </div>
      ))}
    </div>
  );

  getMenuDropdown = type => {
    return type === 'source' || type === 'fault' || type === 'analysis' ? (
      <Dropdown key={type} overlay={this.getPopMenu(type)}>
        {
          // eslint-disable-next-line
          <a
            className={classNames({
              nav: true,
              [type]: true,
              active: this.props.location.pathname.startsWith(`/main/${type}`)
            })}
            href="javascript:;" // eslint-disable-line
          >
            {this.menuNameMap[type]}
            <Icon type="caret-down" theme="filled" />
          </a>
        }
      </Dropdown>
    ) : (
      <NavLink
        key={type}
        className={classNames({ nav: true, [type]: true })}
        exact={true}
        to={`/main/${type}`}
        activeClassName="active"
        isActive={(match, location) =>
          this.props.location.pathname.startsWith(`/main/${type}`)
        }
      >
        {this.menuNameMap[type]}
      </NavLink>
    );
  };

  logout = () => {
    postAxios('api/logout', toLogin);
  };

  toBigScreen = () => {
    window.open(`${baseStaticUrl}big-screen`);
  };

  /**
   * 废弃，点击跳转到首页，新增选择框切换业务类型.
   * @deprecated
   */
  showBusinessSelect = () => {
    this.props.dispatch(showBusinessTypeAction(true, true));
    // gotoPath('/main/home');
  };

  getBusinessName = () => {
    const type = this.props.business.type;
    const obj = businessTypeArr.find(b => b.type === type);
    return obj ? obj.name : '';
  };

  render() {
    return (
      <Layout.Header className="main-container-header">
        <span className="system-logo" />
        <Link to="/main/home">
          <span className="system-name">中国移动国际及政企专网系统</span>
        </Link>
        <span className="business-name" onClick={this.showBusinessSelect}>
          {this.getBusinessName()}
        </span>
        {Object.keys(this.menuNameMap).map(key => this.getMenuDropdown(key))}
        <span className="right-btns">
          <Popover
            onVisibleChange={this.onVisibleChange}
            overlayClassName="sub-system-popover"
            content={this.subSystemPopMenu}
            trigger="hover"
            placement="bottom"
          >
            <span className="icon menu" />
          </Popover>
          <Divider type="vertical" />
          <Tooltip placement="bottom" title={'工作台'}>
            <Link to="/main/work-platform">
              <span className="icon workbench" />
            </Link>
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip placement="bottom" title={'大屏'}>
            <span className="icon big-screen" onClick={this.toBigScreen} />
          </Tooltip>
          <Divider type="vertical" />
          <Dropdown overlay={this.noticePopMenu}>
            <span className="icon setting" />
          </Dropdown>
          <Divider type="vertical" />
          <Dropdown overlay={this.userNamePopMenu}>
            <span className="user-name">
              {this.props.user.userId}
              <Icon type="caret-down" theme="filled" />
            </span>
          </Dropdown>
        </span>
      </Layout.Header>
    );
  }
}

const mapState2Props = state => ({
  location: state.routing.location,
  user: state.user,
  business: state.business
});

export default connect(mapState2Props)(MainHeader);
