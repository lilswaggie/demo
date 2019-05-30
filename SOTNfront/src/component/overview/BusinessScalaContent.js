import React, { Component } from 'react';

import _ from 'lodash';
import styled from 'styled-components';

import { px2rem } from '../../util/StyleUtils';
import PerformanceRingRatio from './work-order/PerformanceRingRatio';
import QuestionIconTooltip from './work-order/QuestionIconTooltip';
import RadiusPieChart from './business-scala/RadiusPieChart';
import Top5Industry from './business-scala/Top5Industry';
import PercentChart from './work-order/PercentChart';
import { getAxios } from '../../axios/mainAxios';
import { objectEchartsArray } from '../../util/CommonUtils';

import {
  getUntilByTime,
  formatTimeByGranularity,
  timeGranularity
} from '../../util/TimeUtils';

const BusinessScala = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ScalaItem = styled.div`
  width: ${px2rem(633)};
  border: 1px solid #e5e5e5;
`;

const ScalaTitle = styled.div`
  display: flex;
  align-items: center;
  padding: 0 18px;
  height: 50px;
  background-color: #f0f3f7;
`;

const TitleLeft = styled.div`
  display: flex;
  width: 50%;
  justify-content: flex-start;
  align-items: center;
`;

const TitleRight = styled(TitleLeft)`
  justify-content: flex-end;
`;

const Name = styled.div`
  font-size: 14px;
  color: #72758c;
`;

const Value = styled.div`
  margin-left: 10px;
  font-size: 28px;
  font-weight: 600;
  color: #3c3e4a;
`;

const StyledPerformanceRingRatio = styled(PerformanceRingRatio)`
  margin-left: 35px;
`;

const ScalaContent = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
`;

const StyledRadiusPieChart = styled(RadiusPieChart)`
  height: ${px2rem(180)} !important;
  width: ${px2rem(260)};
`;

export default class BusinessScalaContent extends Component {
  state = {
    // value, ringRatio, date, pieDataArr, top5DataArr
    dataArr: [
      {
        title: '客户总数',
        pieTitle: '客户数',
        pieCenterText: '客户等级'
      },
      {
        title: '专线总数',
        pieTitle: '专线数',
        pieCenterText: '专线级别'
      }
    ]
  };

  componentDidMount() {
    this.getData();
  }

  setData = (data, index) => {
    let dataArr = _.cloneDeep(this.state.dataArr);
    dataArr[index] = {
      ...dataArr[index],
      ...data
    };
    this.setState({ dataArr });
  };

  getData = () => {
    [
      'api/customers/stats/num/level',
      'api/leased_lines/stats/num/security_level'
    ].forEach((api, index) => {
      getAxios(api, ({ ringRatio, summary, time, values }) =>
        this.setData(
          {
            value: summary,
            date: formatTimeByGranularity(
              getUntilByTime(time),
              timeGranularity.DAY
            ),
            ringRatio,
            pieDataArr: objectEchartsArray(values)
          },
          index
        )
      );
    });

    [
      'api/customers/stats/top_industry',
      'api/leased_lines/stats/top_industry'
    ].forEach((api, index) => {
      getAxios(api, { num: 5 }, ({ values }) =>
        this.setData({ top5DataArr: objectEchartsArray(values) }, index)
      );
    });
  };

  render() {
    return (
      <BusinessScala>
        {this.state.dataArr.map(
          (
            {
              title,
              value,
              ringRatio,
              date,
              pieTitle,
              pieCenterText,
              pieDataArr,
              top5DataArr
            },
            index
          ) => (
            <ScalaItem key={index}>
              <ScalaTitle>
                <TitleLeft>
                  <Name>{title}</Name>
                  <Value>{value}</Value>
                  <StyledPerformanceRingRatio value={ringRatio} />
                </TitleLeft>
                <TitleRight>
                  <QuestionIconTooltip title={date} />
                </TitleRight>
              </ScalaTitle>
              <ScalaContent>
                <StyledRadiusPieChart
                  title={pieTitle}
                  centerText={pieCenterText}
                  dataArr={pieDataArr}
                />
                <Top5Industry
                  title={pieTitle}
                  dataArr={top5DataArr}
                  percentChartRender={percent => (
                    <PercentChart
                      percent={percent}
                      startColor="rgb(105, 154, 244)"
                      endColor="rgb(112, 204, 252)"
                    />
                  )}
                />
              </ScalaContent>
            </ScalaItem>
          )
        )}
      </BusinessScala>
    );
  }
}
