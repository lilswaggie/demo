import React from 'react';
import TimeRanger from './component/timeRanger';

export default class OpticalCable extends React.Component {
  state = {};

  componentWillReceiveProps(nextProps) {
    if (
      this.props.activeKey !== nextProps.activeKey &&
      nextProps.activeKey === 'opticalCable'
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
