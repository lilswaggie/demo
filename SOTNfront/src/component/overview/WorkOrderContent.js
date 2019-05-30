import React, { Component } from 'react';

import styled from 'styled-components';

import { postAxios } from '../../axios/mainAxios';

import { Row, Col } from 'antd';
import Title from './work-order/Title';
import Type from './work-order/Type';
import Performance from './work-order/Performance';
import PercentChart from './work-order/PercentChart';

import { px2rem } from '../../util/StyleUtils';
import { FlowStat, TypeDataPropType } from '../../util/FlowUtils';
import {
  formatTimeByGranularity,
  getUntilByTime,
  ms2UnitTime,
  TimeUnit,
  getGranularityByTime,
  timeGranularity
} from '../../util/TimeUtils';
import { PerformanceUnit } from '../../util/PerformanceUtils';
import { gotoPathWithState } from '../../util/ReduxUtil';

const StyledType = styled(Type)`
  margin-top: 5px;
`;

const StyledPerformance = styled(Performance)`
  margin-top: 10px;
  height: ${px2rem(120)};
  width: ${px2rem(200)};
  border: 1px solid #e5e5e5;
`;

const ComplaintTitle = styled(Title)`
  margin-top: ${px2rem(9)};
`;

export default class WorkOrderContent extends Component {
  state = {
    surveyTypeData: {},
    openTypeData: {},
    surveyPerformance: [{}, {}],
    openPerformance: [{}, {}],
    faultPerformance: [{}, {}],
    complaintPerformance: [{}, {}]
  };

  type = {
    SURVEY: 'SURVEY',
    OPENING: 'OPENING',
    FAULT: 'FAULT',
    COMPLAINT: 'COMPLAINT'
  };

  typeKeyMap = {
    SURVEY: 'surveyTypeData',
    OPENING: 'openTypeData'
  };

  typeNameMap = {
    SURVEY: '勘查',
    OPENING: '开通',
    FAULT: '故障处理',
    COMPLAINT: '投诉处理'
  };

  performanceKeyMap = {
    SURVEY: 'surveyPerformance',
    OPENING: 'openPerformance',
    FAULT: 'faultPerformance',
    COMPLAINT: 'complaintPerformance'
  }

  componentDidMount() {
    this.getSurveyOrOpenData(this.type.SURVEY);
    this.getSurveyOrOpenData(this.type.OPENING);
    this.getFaultAndComplaintData();
  }

  setTypeData = (type, values) => {
    let data = {};
    Object.keys(TypeDataPropType).forEach(key => (data[key] = values[key]));
    this.setState({ [this.typeKeyMap[type]]: data });
  };

  setPerformance = (type, time, values) => {
    const granularity = getGranularityByTime(time) || timeGranularity.MONTH;
    const date = formatTimeByGranularity(getUntilByTime(time), granularity);
    const title = this.typeNameMap[type];
    let data1 = {
      title: `${title}及时率`,
      unit: PerformanceUnit.PERCENT,
      granularity,
      date,
      value: values[FlowStat.HANDLING_TIMELY_RATE],
      ringRatio: values[FlowStat.HANDLING_TIMELY_RATE_RING_RATE],
      chartRender: () => (
        <PercentChart percent={values[FlowStat.HANDLING_TIME]} />
      )
    };

    const { unit, value } = ms2UnitTime(
      values[FlowStat.HANDLING_TIME],
      TimeUnit.DAY,
      2
    );
    let data2 = {
      title: `${title}时长`,
      unit,
      granularity,
      date,
      value,
      ringRatio: values[FlowStat.HANDLING_TIME_RING_RATE]
    };

    this.setState({ [this.performanceKeyMap[type]]: [data1, data2] });
  };

  /**
   * 获取勘查或开通工单的统计信息.
   * @param {string} 工单类型，SURVEY：勘查；OPENING：开通
   */
  getSurveyOrOpenData = type => {
    postAxios('api/flows/stats/current', { type }, ({ time, values }) => {
      this.setTypeData(type, values);
      this.setPerformance(type, time, values);
    });
  };

  getFaultAndComplaintData = () => {
    [
      { type: this.type.FAULT, api: 'api/flows/stats/net_fault/current' },
      { type: this.type.COMPLAINT, api: 'api/flows/stats/complaint/current' }
    ].forEach(({ type, api }) =>
      postAxios(api, ({ time, values }) =>
        this.setPerformance(type, time, values)
      )
    );
  };

  renderPerformance = pArr => (
    <Row align="top" gutter={10} justify="space-between" type="flex">
      {pArr.map((p, i) => (
        <Col span={12} key={i}>
          <StyledPerformance {...p} />
        </Col>
      ))}
    </Row>
  );

  gotoPath = (path, state) => () => gotoPathWithState(path, state)

  gotoBusiness = tab => this.gotoPath('/main/analysis/business-support', { tab })

  gotoService = tab => this.gotoPath('/main/analysis/service-quality', { tab })

  render() {
    const {
      surveyTypeData,
      openTypeData,
      surveyPerformance,
      openPerformance,
      faultPerformance,
      complaintPerformance
    } = this.state;
    return (
      <Row align="top" gutter={20} justify="space-between" type="flex">
        <Col span={8}>
          <Title onClick={this.gotoBusiness(0)}>售前-勘查工单</Title>
          <StyledType title="勘查工单" data={surveyTypeData} />
          {this.renderPerformance(surveyPerformance)}
        </Col>
        <Col span={8}>
          <Title onClick={this.gotoBusiness(1)}>售中-开通工单</Title>
          <StyledType title="开通工单" data={openTypeData} />
          {this.renderPerformance(openPerformance)}
        </Col>
        <Col span={8}>
          <Title onClick={this.gotoService(0)}>售后-故障处理</Title>
          {this.renderPerformance(faultPerformance)}
          <ComplaintTitle onClick={this.gotoService(1)}>售后-投诉处理</ComplaintTitle>
          {this.renderPerformance(complaintPerformance)}
        </Col>
      </Row>
    );
  }
}
