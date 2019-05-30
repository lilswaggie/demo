import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

class AlarmList extends React.Component {
  static propTypes = {
    isFetching: PropTypes.bool,
    alarmList: PropTypes.array
  };
  static defaultProps = {
    isFetching: false,
    alarmList: []
  };
  render() {
    const { alarmList, isFetching } = this.props;
    return alarmList.length === 0 ? (
      <div className={`alarm-none ${isFetching === true ? 'no-alarms' : ''}`}>
        暂无告警...
      </div>
    ) : (
      <div className="alarm-object">
        {alarmList.map((item, index) => {
          const alarmTime = moment(Number(item.alarmedAt)).format(
            'YYYY-MM-DD HH:mm'
          );
          let statusTag;
          switch (Number(item.severity)) {
            case 1:
              statusTag = 'status-tag-first';
              break;
            case 2:
              statusTag = 'status-tag-second';
              break;
            case 3:
              statusTag = 'status-tag-third';
              break;
            case 4:
              statusTag = 'status-tag-fouth';
              break;
            default:
              statusTag = '';
          }
          return (
            <div className={statusTag} key={index}>
              <div className="alarm-card-name-time clearfix">
                <span className="alarm-card-title">{item.elementName}</span>
                <span className="alarm-card-time">{alarmTime}</span>
              </div>
              <div className="alarm-card-name">{item.standardName}</div>
            </div>
          );
        })}
      </div>
    );
  }
}
export default AlarmList;
