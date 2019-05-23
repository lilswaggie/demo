import React, { Component } from 'react';

import styled from 'styled-components';

import { postAxios } from '../../axios/mainAxios';

import { Row, Col } from 'antd';
import Title from './work-order/Title';
import Type from './work-order/Type';
import Performance from './work-order/Performance';
import PercentChart from './work-order/PercentChart';

import { px2rem } from '../../util/StyleUtils';

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
    surveyData: {},
    openData: {},
  };

  workOrderType = {
    SURVEY: 'SURVEY',
    OPENING: 'OPENING'
  };

  workOrderTypeDataMap = {
    SURVEY: 'surveyData',
    OPENING: 'openData'
  };

  componentDidMount() {
    this.getSurveyOrOpenData(this.workOrderType.SURVEY);
    this.getSurveyOrOpenData(this.workOrderType.OPENING);
  }

  /**
   * 获取勘查或开通工单的统计信息.
   * @param {string} 工单类型，SURVEY：勘查；OPENING：开通
   */
  getSurveyOrOpenData = type => {
    postAxios(
      'api/flows/stats/current',
      { type },
      data => this.setState({ [this.workOrderTypeDataMap[type]]: data })
    );
  }

  render() {
    const { surveyData } = this.state;
    return (
      <Row align="top" gutter={20} justify="space-between" type="flex">
        <Col span={8}>
          <Title>售前-勘查工单</Title>
          <StyledType
            title="勘查工单"
            data={surveyData.values}
          />
          <Row align="top" gutter={10} justify="space-between" type="flex">
            <Col span={12}>
              <StyledPerformance
                title="勘查及时率"
                granularity="MONTH"
                date="2019-05"
                unit="%"
                value={89.89}
                ringRatio={1.2}
              >
                <PercentChart percent={89.89}/>
              </StyledPerformance>
            </Col>
            <Col span={12}>
              <StyledPerformance
                title="勘查时长"
                granularity="MONTH"
                date="2019-05"
                unit="工作日"
                value={1.3}
                ringRatio={-1.2}
              />
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Title>售中-开通工单</Title>
          <StyledType
            title="开通工单"
            data={this.state.openData}
          />
          <Row align="top" gutter={10} justify="space-between" type="flex">
            <Col span={12}>
              <StyledPerformance
                title="开通及时率"
                granularity="MONTH"
                date="2019-05"
                unit="%"
                value={89.89}
                ringRatio={1.2}
              >
                <PercentChart percent={89.89}/>
              </StyledPerformance>
            </Col>
            <Col span={12}>
              <StyledPerformance
                title="开通时长"
                granularity="MONTH"
                date="2019-05"
                unit="工作日"
                value={1.3}
                ringRatio={-1.2}
              />
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Title>售后-故障处理</Title>
          <Row align="top" gutter={10} justify="space-between" type="flex">
            <Col span={12}>
              <StyledPerformance
                title="故障处理及时率"
                granularity="MONTH"
                date="2019-05"
                unit="%"
                value={89.89}
                ringRatio={1.2}
              >
                <PercentChart percent={89.89}/>
              </StyledPerformance>
            </Col>
            <Col span={12}>
              <StyledPerformance
                title="故障处理时长"
                granularity="MONTH"
                date="2019-05"
                unit="工作日"
                value={1.3}
                ringRatio={-1.2}
              />
            </Col>
          </Row>
          <ComplaintTitle>售后-投诉处理</ComplaintTitle>
          <Row align="top" gutter={10} justify="space-between" type="flex">
            <Col span={12}>
              <StyledPerformance
                title="投诉处理及时率"
                granularity="MONTH"
                date="2019-05"
                unit="%"
                value={89.89}
                ringRatio={1.2}
              >
                <PercentChart percent={89.89}/>
              </StyledPerformance>
            </Col>
            <Col span={12}>
              <StyledPerformance
                title="投诉处理时长"
                granularity="MONTH"
                date="2019-05"
                unit="h"
                value={1.3}
                ringRatio={-1.2}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
