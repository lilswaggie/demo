import React, { Component } from 'react';

import styled from 'styled-components';
import PropTypes from 'prop-types';

import NestPie from './NestPie';
import PieExample from './PieExample';

import { px2rem } from '../../../util/StyleUtils';

const TypeWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 5px 10px;
  height: ${px2rem(158)};
  border: 1px solid #e5e5e5;
`;

const NestPieWrap = styled(NestPie)`
  height: 100% !important;
  width: ${px2rem(256)};
`;

const PieExampleWrap = styled(PieExample)`
  height: ${px2rem(100)};
  width: ${px2rem(120)};
`;

export const TypeDataKey = {
  HANDLING_TIME: 'handling_time',
  HANDLING_TIMELY_RATE: 'handling_timely_rate',
  NORMAL_ONGOING_NUM: 'normal_ongoing_num',
  EXPIRED_NUM: 'expired_num',
  EXPIRING_NUM: 'expiring_num',
  TOTAL_NUM: 'total_num',
  FINISHED_NUM: 'finished_num',
  ONGOING_NUM: 'ongoing_num'
};

export const TypeDataKeyNameMap = {
  handling_time: '处理时长',
  handling_timely_rate: '处理及时率',
  normal_ongoing_num: '正常在途',
  expiring_num: '即将超时',
  expired_num: '超时未完成',
  total_num: '总数',
  finished_num: '已归档',
  ongoing_num: '在途'
};

export default class Type extends Component {
  static propTypes = {
    // styled this component will receive className
    // or passed props 'classNames'
    className: PropTypes.string,
    title: PropTypes.string,
    data: PropTypes.object
  };

  static defaultProps = {
    title: '',
    data: {}
  };

  inDataKeyArr = [
    TypeDataKey.FINISHED_NUM,
    TypeDataKey.ONGOING_NUM
  ];

  outDataKeyArr = [
    TypeDataKey.NORMAL_ONGOING_NUM,
    TypeDataKey.EXPIRED_NUM,
    TypeDataKey.EXPIRING_NUM
  ];

  exampleDataKeyArr = [
    TypeDataKey.TOTAL_NUM,
    ...this.inDataKeyArr
  ];

  getDataArr = (keyArr = []) => {
    const arr = [];
    keyArr.forEach(key => {
      arr.push({
        name: TypeDataKeyNameMap[key],
        value: this.props.data[key] || 0,
        selected: key === TypeDataKey.ONGOING_NUM
      });
    });
    return arr;
  }

  getExampleData = () => {
    const data = {};
    this.exampleDataKeyArr.forEach(key => {
      data[key] = this.props.data[key] || 0;
    });
    return data;
  }

  render() {
    const { className, title } = this.props;
    return (
      <TypeWrap className={className}>
        <NestPieWrap
          title={title}
          inDataArr={this.getDataArr(this.inDataKeyArr)}
          outDataArr={this.getDataArr(this.outDataKeyArr)}
        />
        <PieExampleWrap
          data={this.getExampleData()}
        />
      </TypeWrap>
    );
  }
}
