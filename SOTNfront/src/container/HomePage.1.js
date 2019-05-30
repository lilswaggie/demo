import React, { Component } from 'react';
import { Tabs } from 'antd';

import Tab1 from '../component/home/HomeTab1';
import Tab2 from '../component/home/HomeTab2';
import Tab3 from '../component/home/HomeTab3';
import Tab4 from '../component/home/HomeTab4';
import Tab5 from '../component/home/HomeTab5';
import Tab6 from '../component/home/HomeTab6';

import { getAxios } from '../axios/mainAxios';

import '../assets/css/home/home.scss';

import infoSvg from '../assets/image/home/info.svg';
import faultSvg from '../assets/image/home/fault.png';
import emosSvg from '../assets/image/home/eoms.svg';
import propertySvg from '../assets/image/home/property.svg';

export default class HomePage extends Component {
  state = {
    tabActiveKey: '1'
  };

  tabKeyNameArr = [
    '网络拓扑',
    '网络规模',
    '业务规模',
    '网络质量',
    '业务质量',
    '服务质量'
  ];

  systemArr = [
    { name: '资源子系统', logo: infoSvg, id: 'XZYGLXT' },
    { name: '故障子系统', logo: faultSvg, id: 'ZBGZGL' },
    { name: '性能子系统', logo: propertySvg, id: 'ZBXNGL' },
    { name: 'EOMS工单', logo: emosSvg, id: 'PASM' }
  ];

  onTabChange = tabActiveKey => this.setState({ tabActiveKey });

  gotoSystem = id => () => {
    getAxios(`api/tickets/${id}`, ({ link }) => window.open(link));
  };

  render() {
    let { tabActiveKey } = this.state;
    const { state } = this.props.location;
    if (state) {
      const { tab } = state;
      if (tab) {
        tabActiveKey = tab;
      }
    }

    return (
      <div className="home">
        <div className="tab">
          <Tabs
            tabPosition="bottom"
            activeKey={tabActiveKey}
            onChange={this.onTabChange}
            // style={{padding: tabActiveKey === '1' ? 0 : '1.25rem .9375rem'}}
          >
            <Tabs.TabPane tab="网络拓扑" key="1" style={{ padding: 0 }}>
              <Tab1 activeKey={tabActiveKey} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="网络规模" key="2">
              <Tab2 activeKey={tabActiveKey} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="业务规模" key="3">
              <Tab3 activeKey={tabActiveKey} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="网络质量" key="4">
              <Tab4 activeKey={tabActiveKey} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="业务质量" key="5">
              <Tab5 activeKey={tabActiveKey} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="服务质量" key="6">
              <Tab6 activeKey={tabActiveKey} />
            </Tabs.TabPane>
          </Tabs>
        </div>
        <div className="sysMenu">
          {this.systemArr.map((system, idx) => (
            // eslint-disable-next-line
            <a
              key={idx}
              onClick={this.gotoSystem(system.id)}
              className="menuItem"
            >
              <img alt={system.name} src={system.logo} />
              <span>{system.name}</span>
            </a>
          ))}
        </div>
      </div>
    );
  }
}
