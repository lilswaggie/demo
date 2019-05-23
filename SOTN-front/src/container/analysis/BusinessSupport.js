import React, { Component } from 'react';

import { Tabs } from 'antd';

import SupportContent from '../../component/analysis/business-support/SupportContent';

import '../../assets/css/analysis/bussiness-support/businesssupport.scss';

export default class BussinessSupport extends Component {
  state = {
    orderClass: '勘查',
    orderbutton: [true, false, false, false],
    activeKey: '变更勘查'
  };
  // 切换工单类型时触发
  handleChange = (bool1, bool2, bool3, bool4) => {
    this.setState({
      orderbutton: [bool1, bool2, bool3, bool4]
    });
    // 改变变更工单状态时重新请求接口得到新数据
    if (bool1) {
      this.setState({
        orderClass: '勘查'
      });
    } else if (bool2) {
      this.setState({
        orderClass: '开通'
      });
    } else if (bool3) {
      this.setState({
        orderClass: '停闭'
      });
    } else if (bool4) {
      this.setState({
        orderClass: '变更'
      });
    }
  };
  // 变更工单类型下切换activeKey
  handleActiveKey = key => {
    this.setState({
      activeKey: key
    });
  };
  render() {
    const { orderClass, orderbutton, activeKey } = this.state;
    return (
      <div className="busisupport">
        <div className="title">
          <div className="item1">业务支撑分析</div>
          <div className="item2">
            <span
              className={orderbutton[0] ? 'active' : 'noneact'}
              onClick={() => this.handleChange(true, false, false, false)}
            >
              勘查
            </span>
            <span
              className={orderbutton[1] ? 'active' : 'noneact'}
              onClick={() => this.handleChange(false, true, false, false)}
            >
              开通
            </span>
            <span
              className={orderbutton[2] ? 'active' : 'noneact'}
              onClick={() => this.handleChange(false, false, true, false)}
            >
              停闭
            </span>
            <span
              className={orderbutton[3] ? 'active' : 'noneact'}
              onClick={() => this.handleChange(false, false, false, true)}
            >
              变更
            </span>
          </div>
        </div>
        {orderClass !== '变更' ? (
          <SupportContent orderClass={orderClass} />
        ) : (
          <Tabs activeKey={activeKey} onChange={this.handleActiveKey}>
            {['变更勘查', '停机', '复机', '变更开通'].map(item => (
              <Tabs.TabPane tab={item} key={item}>
                <SupportContent
                  orderClass={orderClass}
                  activeKey={activeKey}
                  name={item}
                />
              </Tabs.TabPane>
            ))}
          </Tabs>
        )}
      </div>
    );
  }
}
