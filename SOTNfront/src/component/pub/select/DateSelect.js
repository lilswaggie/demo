import * as React from 'react';

import moment from 'moment';

import PropTypes from 'prop-types';

import { DatePicker } from 'antd';

export const DateStyle = {
  YMD: 'YYYY-MM-DD',
  YMDHM: 'YYYY-MM-DD HH:mm',
  YMDHMS: 'YYYY-MM-DD HH:mm:ss',
  HM: 'HH:mm',
  MD: 'MM-DD',
  YM: 'YYYY-MM'
};

class DateSelect extends React.Component {
  static propTypes = {
    timeStyle: PropTypes.string,
    onStartChange: PropTypes.func,
    onEndChange: PropTypes.func,
    disabledStartDate: PropTypes.func,
    disabledEndDate: PropTypes.func,
    startDate: PropTypes.object,
    endDate: PropTypes.object,
    showEnd: PropTypes.bool
  };

  static defaultProps = {
    timeStyle: DateStyle.YMD,
    startDate: moment().day(-30),
    endDate: moment()
  };

  state = {
    endOpen: false
  };

  disabledStartDate = startDate => {
    if (
      !startDate ||
      Math.abs(startDate.diff(moment(), 'days')) > 90 ||
      startDate.isAfter(moment())
    ) {
      return true;
    }
    return false;
  };

  disabledEndDate = endDate => {
    const { startDate } = this.props;
    if (
      !endDate ||
      Math.abs(endDate.diff(moment(), 'days')) > 90 ||
      endDate.isAfter(moment()) ||
      !startDate ||
      startDate.isAfter(endDate)
    ) {
      return true;
    }
    return endDate.format(DateStyle.YMD) < startDate;
  };

  onStartChange = (startDate, value) => {
    this.props.onStartChange(startDate, value);
    const { endDate } = this.props;
    if (startDate.isAfter(endDate)) {
      this.onEndChange(startDate, value);
    }
  };

  onEndChange = (endDate, value) => {
    this.props.onEndChange(endDate, value);
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };

  render() {
    const { endOpen } = this.state;

    return (
      <span>
        <DatePicker
          value={this.props.startDate ? this.props.startDate : undefined}
          format={this.props.timeStyle}
          placeholder="起始时间"
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
          disabledDate={this.props.disabledStartDate || this.disabledStartDate}
          style={{ width: '128px' }}
        />
        {<span>&nbsp;-&nbsp;</span>}
        <DatePicker
          value={this.props.endDate ? this.props.endDate : undefined}
          format={this.props.timeStyle}
          placeholder="结束时间"
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
          disabledDate={this.props.disabledEndDate || this.disabledEndDate}
          style={{ width: '128px' }}
        />
      </span>
    );
  }
}

export default DateSelect;
