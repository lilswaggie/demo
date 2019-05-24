import React from 'react';
import TimeRanger from './component/timeRanger';

export default class SourceChannel extends React.Component {
  state = {};

  componentWillReceiveProps(nextProps) {
    if (
      this.props.activeKey !== nextProps.activeKey &&
      nextProps.activeKey === 'channel'
    ) {
      this.getSourceData();
    }
  }

  getSourceData = (date, provinceName) => {
    // 请求数据
  };

  render() {
    return (
      <div>
        <TimeRanger getSourceData={this.getSourceData} />
      </div>
    );
  }
}
