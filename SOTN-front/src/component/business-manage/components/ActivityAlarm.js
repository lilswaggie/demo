import React from 'react';

import { formatNumber } from '../../../util/CommonUtils';

class ActivityAlarm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { activityAlarm, sendAlready } = this.props;
    const send = sendAlready[0];
    // const send = sendAlready[5] + sendAlready[6];
    return (
      <div className="alarm-count-wrapper">
        {/* {
          activityAlarm.map((item, index) => {
            const alarmTip = ['alarm-tip1', 'alarm-tip2', 'alarm-tip3', 'alarm-tip4'];
            return (
              <div key={index}>
                <div className="alarm-count">{activityAlarmIdx[item.performance].name}</div>
                <div className={alarmTip[index]}>
                  {
                    item.performance === 'alarmRate' ?
                      `${item.number}%`
                      :
                      formatNumber(item.number)
                  }
                </div>
              </div>
            )
          })
        } */}
        <div>
          <div className="alarm-count">一级告警数量</div>
          <div className="alarm-tip1">
            {/* {
              formatNumber(activityAlarm.alarm['一级']) || 0
            } */}
            {formatNumber(activityAlarm.alarm[1]) || 0}
          </div>
        </div>
        <div>
          <div className="alarm-count">告警总数</div>
          <div className="alarm-tip2">
            {formatNumber(activityAlarm.summary) || 0}
          </div>
        </div>
        <div>
          <div className="alarm-count">已派单</div>
          <div className="alarm-tip3">{formatNumber(send) || 0}</div>
        </div>
        {/* <div>
          <div className="alarm-count">告警处理及时率</div>
          <div className="alarm-tip4">
            {`${sendAlready.dealRate}%` || 0}
          </div>
        </div> */}
      </div>
    );
  }
}
export default ActivityAlarm;
