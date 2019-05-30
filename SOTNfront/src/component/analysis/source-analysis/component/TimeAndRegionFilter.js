import React, { Component } from 'react';
import { DatePicker, Button, Icon, Tooltip } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import RegionSelect from '../../../pub/select/RegionSelect';
import { DateStyle } from '../../../pub/select/DateSelect';

export default class TimeRanger extends Component {
  static propTypes = {
    date: PropTypes.object,
    province: PropTypes.string,
    onDateChange: PropTypes.func,
    onProvinceChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onReset: PropTypes.func
  };

  static defaultProps = {
    date: moment(),
    province: '',
    onDateChange: () => {},
    onProvinceChange: () => {},
    onSubmit: () => {},
    onReset: () => {}
  };

  disabledDate = current => {
    const disabledStartDate =
      current <
      moment()
        .endOf('day')
        .subtract(15, 'days');
    const disabledEndDate = current > moment();
    return disabledStartDate || disabledEndDate;
  };

  render() {
    const { date, province } = this.props;

    return (
      <div className="time-picker clearfix">
        <span>
          日期
          <Tooltip title="目前仅支持查询15天" placement="topLeft">
            <Icon
              style={{ color: '#CBCBCB', margin: '5px' }}
              type="question-circle"
            />
          </Tooltip>
          ：
        </span>
        <DatePicker
          onChange={this.props.onDateChange}
          value={date}
          disabledDate={this.disabledDate}
          format={DateStyle.YMD}
        />
        <span>
          <span>区域：</span>
          <RegionSelect onChange={this.onProvinceChange} value={province} />
        </span>
        <div className="source-btn">
          <Button type="primary" onClick={this.props.onSubmit}>
            查询
          </Button>
          <Button type="primary" ghost onClick={this.props.onReset}>
            重置
          </Button>
        </div>
      </div>
    );
  }
}
