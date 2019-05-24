import React, { Component } from 'react';

import styled from 'styled-components';

import { px2rem } from '../../util/StyleUtils';
import PerformanceRingRatio from './work-order/PerformanceRingRatio';
import QuestionIconTooltip from './work-order/QuestionIconTooltip';
import RadiusPieChart from './business-scala/RadiusPieChart';
import Top5Industry from './business-scala/Top5Industry';
import PercentChart from './work-order/PercentChart';

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
  render() {
    return (
      <BusinessScala>
        <ScalaItem>
          <ScalaTitle>
            <TitleLeft>
              <Name>客户总数</Name>
              <Value>40</Value>
              <StyledPerformanceRingRatio value={-1.2} />
            </TitleLeft>
            <TitleRight>
              <QuestionIconTooltip title={'2019-05-22'} />
            </TitleRight>
          </ScalaTitle>
          <ScalaContent>
            <StyledRadiusPieChart
              title="客户数"
              centerText="客户等级"
              dataArr={[
                { name: '金牌', value: 15 },
                { name: '银牌', value: 15 },
                { name: '铜牌', value: 15 },
                { name: '标准', value: 15 }
              ]}
            />
            <Top5Industry
              title="客户数"
              dataArr={[
                { name: '金融服务', count: 100 },
                { name: '工业制造', count: 90 },
                { name: '能源电力', count: 80 },
                { name: '教育行业', count: 70 },
                { name: '金融服务', count: 60 }
              ]}
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
        <ScalaItem>
          <ScalaTitle>
            <TitleLeft>
              <Name>专线总数</Name>
              <Value>120</Value>
              <StyledPerformanceRingRatio value={-1.2} />
            </TitleLeft>
            <TitleRight>
              <QuestionIconTooltip title={'2019-05-22'} />
            </TitleRight>
          </ScalaTitle>
          <ScalaContent>
            <StyledRadiusPieChart
              title="专线数"
              centerText="专线级别"
              dataArr={[
                { name: 'AAA', value: 15 },
                { name: 'AA', value: 15 },
                { name: 'A', value: 15 },
                { name: '普通', value: 15 }
              ]}
            />
            <Top5Industry
              title="专线数"
              dataArr={[
                { name: '金融服务', count: 100 },
                { name: '工业制造', count: 90 },
                { name: '能源电力', count: 80 },
                { name: '教育行业', count: 70 },
                { name: '金融服务', count: 60 }
              ]}
              percentChartRender={percent => (
                <PercentChart
                  percent={percent}
                  startColor="rgb(118, 222, 184)"
                  endColor="rgb(112, 204, 252)"
                />
              )}
            />
          </ScalaContent>
        </ScalaItem>
      </BusinessScala>
    );
  }
}
