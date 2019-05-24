import React, { Component } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';
import { px2rem } from '../../../util/StyleUtils';

const IndustryWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: ${px2rem(180)};
  width: ${px2rem(350)};
  text-align: left;
`;

const Title = styled.div`
  font-size: 14px;
  color: #72758C;
`;

const Content = styled.div`
  height: ${px2rem(150)};
  font-size: 12px;
  color: #666666;
`;

const IndustryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 20%;
  width: 100%;
`;

const IndustryName = styled.div`
  width: ${px2rem(80)};
`;

const PercentChart = styled.div`
  width: ${px2rem(180)};
`;

const Count = styled.div`
  width: ${px2rem(60)};
`;

export default class Top5Industry extends Component {
  static propTypes = {
    name: PropTypes.string,
    dataArr: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      count: PropTypes.number
    })),
    // 百分比渲染函数
    percentChartRender: PropTypes.func
  };

  static defaultProps = {
    name: '',
    dataArr: []
  };

  getMax = () => {
    let arr = this.props.dataArr.map(item => item.count);
    if (!arr || !arr.length) {
      return 1;
    }
    return Math.max.apply(null, arr) || 1;
  }

  getPercent = value => value * 100 / this.getMax()

  render() {
    return (
      <IndustryWrap>
        <Title>{this.props.title}TOP5行业</Title>
        <Content>
          {
            this.props.dataArr.map((item, index) => (
              <IndustryItem key={index}>
                <IndustryName>{item.name}</IndustryName>
                <PercentChart>
                  {this.props.percentChartRender(this.getPercent(item.count))}
                </PercentChart>
                <Count>{item.count}</Count>
              </IndustryItem>
            ))
          }
        </Content>
      </IndustryWrap>
    );
  }
}
