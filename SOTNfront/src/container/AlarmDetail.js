import React, { Component } from 'react';

import { Tabs, Divider } from 'antd';

import classNames from 'classnames';

import { gotoPath, goBack } from '../util/ReduxUtil';
import { getAxios } from '../axios/mainAxios';

import '../assets/css/alarmdetail/alarmdetail.scss';

export default class AlarmDetail extends Component {
  state = {
    tagDataList: []
  };

  componentDidMount = () => {
    const { state } = this.props.location;
    if (!state || !state.alarm || !state.alarm.id) {
      gotoPath('/main/home');
    } else {
      getAxios(`api/alarms/${state.alarm.id}/detail`, result =>
        this.setState({ tagDataList: result.tags })
      );
    }
  };

  render() {
    const { tagDataList } = this.state;
    return (
      <div className="alarmdetail">
        <div className="title">
          <span className="back" onClick={goBack}>
            &lt; 返回
          </span>
          <span className="line-divider">
            <Divider type="vertical" />
          </span>
          <span className="item1">告警详情</span>
        </div>
        <div className="content">
          {!!tagDataList && !!tagDataList.length && (
            <Tabs tabPosition="left">
              {tagDataList.map((tag, idx) => (
                <Tabs.TabPane tab={tag.label} key={idx}>
                  <div className="alarm-tab">
                    {tag.items.map((item, i) => {
                      let cls = classNames({
                        item: !0,
                        'top-border': i < 2,
                        'right-border': i % 2 === 1
                      });
                      return (
                        <div className={cls} key={i}>
                          <div className="left">{item.label}：</div>
                          <div className="right">{item.value}</div>
                        </div>
                      );
                    })}
                  </div>
                </Tabs.TabPane>
              ))}
            </Tabs>
          )}
        </div>
      </div>
    );
  }
}
