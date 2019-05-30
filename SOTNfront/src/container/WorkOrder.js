import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs, Select } from 'antd';

import WorkTab from '../component/work-order/WorkOrderTab';

import '../assets/css/workorder/workorder.scss';

const Option = Select.Option;

export default class WorkOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: this.props.location.state.choose,
      changeBtn: this.props.location.state.changeBtn,
      changeStatus: this.props.location.state.changeStatus
    };
  }
  // tab选择改变时触发
  handleTabChange = key => {
    this.setState({
      activeKey: key
    });
  };
  // 点击变更工单切换时触发
  handleChange = (bool1, bool2, bool3, bool4) => {
    this.setState({
      changeBtn: [bool1, bool2, bool3, bool4]
    });
    // 改变变更工单状态时重新请求接口得到新数据
    if (bool1) {
      this.setState({
        changeStatus: '变更勘查'
      });
    } else if (bool2) {
      this.setState({
        changeStatus: '停机'
      });
    } else if (bool3) {
      this.setState({
        changeStatus: '复机'
      });
    } else if (bool4) {
      this.setState({
        changeStatus: '变更开通'
      });
    }
  };
  render() {
    const { state } = this.props.location;
    const { orderclass, timelineArr } = state;
    const { changeBtn, changeStatus } = this.state;
    const tabItem = [];
    const option = [];
    if (timelineArr.length !== 0) {
      timelineArr.forEach((item, index) => {
        option.push(
          <Option value={item.name} key={index} title={item.name}>
            {item.name}
          </Option>
        );
      });
    }
    if (timelineArr.length !== 0) {
      timelineArr.forEach(item => {
        tabItem.push(
          <Tabs.TabPane tab={item.name} key={item.name}>
            <WorkTab
              orderclass={orderclass === '变更' ? changeStatus : orderclass}
              activeKey={this.state.activeKey}
              name={item.name}
            />
          </Tabs.TabPane>
        );
      });
    }
    return (
      <div className="work-order">
        <div className="title">
          <Link to="/main/source/business" classnmae="item1">
            &lt; 返回
          </Link>
          <div className="line" />
          <span className="item2">{orderclass}工单</span>
          <div
            className="item3"
            style={
              orderclass === '变更'
                ? { display: 'inline-block' }
                : { display: 'none' }
            }
          >
            <span
              className={
                orderclass === '变更' && changeBtn[0] ? 'active' : 'noneact'
              }
              onClick={() => this.handleChange(true, false, false, false)}
            >
              变更勘查
            </span>
            <span
              className={
                orderclass === '变更' && changeBtn[1] ? 'active' : 'noneact'
              }
              onClick={() => this.handleChange(false, true, false, false)}
            >
              停机
            </span>
            <span
              className={
                orderclass === '变更' && changeBtn[2] ? 'active' : 'noneact'
              }
              onClick={() => this.handleChange(false, false, true, false)}
            >
              复机
            </span>
            <span
              className={
                orderclass === '变更' && changeBtn[3] ? 'active' : 'noneact'
              }
              onClick={() => this.handleChange(false, false, false, true)}
            >
              变更开通
            </span>
          </div>
        </div>
        <div className="content">
          <Tabs
            activeKey={this.state.activeKey}
            onChange={this.handleTabChange}
          >
            {tabItem}
          </Tabs>
        </div>
      </div>
    );
  }
}
