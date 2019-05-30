import React, { Component } from 'react';

import styled from 'styled-components';
import PropTypes from 'prop-types';

import NestPie from './NestPie';
import PieExample from './PieExample';

import { px2rem } from '../../../util/StyleUtils';
import { FlowStat, FlowStatNameMap, TypeDataPropType } from '../../../util/FlowUtils';

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



export default class Type extends Component {
  static propTypes = {
    // styled this component will receive className
    // or passed props 'classNames'
    className: PropTypes.string,
    title: PropTypes.string,
    data: PropTypes.shape(TypeDataPropType)
  };

  static defaultProps = {
    title: '',
    data: {}
  };

  inDataKeyArr = [FlowStat.FINISHED_NUM, FlowStat.ONGOING_NUM];

  outDataKeyArr = [
    FlowStat.NORMAL_ONGOING_NUM,
    FlowStat.EXPIRED_NUM,
    FlowStat.EXPIRING_NUM
  ];

  exampleDataKeyArr = [FlowStat.TOTAL_NUM, ...this.inDataKeyArr];

  getDataArr = (keyArr = []) => {
    const arr = [];
    keyArr.forEach(key => {
      arr.push({
        name: FlowStatNameMap[key],
        value: this.props.data[key] || 0,
        selected: key === FlowStat.ONGOING_NUM
      });
    });
    return arr;
  };

  getExampleData = () => {
    const data = {};
    this.exampleDataKeyArr.forEach(key => {
      data[key] = this.props.data[key] || 0;
    });
    return data;
  };

  render() {
    const { className, title } = this.props;
    return (
      <TypeWrap className={className}>
        <NestPieWrap
          title={title}
          inDataArr={this.getDataArr(this.inDataKeyArr)}
          outDataArr={this.getDataArr(this.outDataKeyArr)}
        />
        <PieExampleWrap data={this.getExampleData()} />
      </TypeWrap>
    );
  }
}
