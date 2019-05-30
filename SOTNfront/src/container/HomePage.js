import React, { Component } from 'react';
import styled from 'styled-components';
import { Carousel } from 'antd';
import ChartExampleHomeDark from '../component/pub/legend/ChartExampleHomeDark';
import Performance from '../component/home/Performance';
import Gis from '../component/home/Gis';
import { PerformanceUnit } from '../util/PerformanceUtils';
import Iframe from './Iframe';
import { baseStaticUrl } from '../util/CommonUtils';

const HomeWrap = styled.div`
  height: ${props => props.height + 'px'};
  .ant-carousel .slick-vertical .slick-slide {
    border: none;
  }
  .ant-carousel-vertical .slick-dots-right {
    right: 26px;
  }
  .ant-carousel-vertical .slick-dots li button {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
`;

const TitleWrap = styled.div`
  position: absolute;
  top: 50px;
  left: 20px;
  color: #ffffff;
  text-align: left;
`;

const FirstTitle = styled.div`
  font-size: 24px;
  font-family: 'PingFangSC-Regular', 'PingFang SC';
`;

const SecondTitle = styled.div`
  margin-top: 10px;
  font-size: 16px;
  font-family: 'PingFangSC-Light', 'PingFang SC Light', 'PingFang SC';

  em {
    color: #2c9cfa;
    font-style: normal;
  }
`;

const StyledPerformance = styled(Performance)`
  position: absolute;
  top: 100px;
  right: 50px;
  height: 100%;
  justify-content: flex-start;
  height: calc(100% - 100px);
`;

const Location = styled.div`
  display: flex;
  align-items:center;
  position: absolute;
  top: 80px;
  right: 45px;
  width: 140px;

  .icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-image: url('${require('../assets/image/home/location.png')}');
    background-size: cover;
  }
  .all {
    margin-left: 3px;
    line-height: 20px;
    font-size: 12px;
    color: #FFFFFF;
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      color: rgb(44, 156, 250);
    }
  }
  .result {
    font-size: 12px;
    color: #FFFFFF;
    line-height: 20px;
  }
`;

export default class HomePage extends Component {
  getWindowHeight = () => {
    return document.compatMode === 'CSS1Compat'
      ? document.documentElement.clientHeight
      : document.body.clientHeight;
  };

  state = {
    height: this.getWindowHeight() - 48
  };

  performanceArr = [
    { name: '客户数', value: 3 },
    { name: '专线数', value: 3 },
    { name: '站点数', value: 3323 },
    { name: '专线数', value: 4708 },
    { name: '一干光缆长度', value: 88818 }
  ];

  linePerformanceArr = [
    { name: '全网专线可用率', value: 99.92, unit: PerformanceUnit.PERCENT },
    { name: '全网专线时延/月', value: 23.5, unit: PerformanceUnit.MS },
    { name: '全网专线中断时长/月', value: 2.0, unit: PerformanceUnit.HOUR },
    { name: '全网专线故障次数/天', value: 12, unit: PerformanceUnit.TIME },
    { name: '全网专线投诉次数/天', value: 12, unit: PerformanceUnit.TIME },
    { name: '全网专线倒换次数/天', value: 12, unit: PerformanceUnit.TIME }
  ];

  setHeight = () => this.setState({ height: this.getWindowHeight() - 96 });

  componentDidMount() {
    window.addEventListener('resize', this.setHeight);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setHeight);
  }

  // 覆盖范围广，过去切换时，更新数据
  // 过去时间的指标不可点击弹窗
  setPerformance = arr => {};

  // 业务品质高，点击某条专线时，告诉当前页面是否进行某条专线的筛选
  setLinePerformance = arr => {};

  render() {
    const { height } = this.state;
    return (
      <HomeWrap height={height}>
        <Carousel autoplay={false} dots={true} dotPosition="right">
          <Gis>
            <Iframe
              name="home-gis-cover"
              url={`${baseStaticUrl}/gis/gis3/index/scope.html`}
            />
            <ChartExampleHomeDark style={{ bottom: '50px' }} />
            <TitleWrap>
              <FirstTitle>覆盖范围广</FirstTitle>
              <SecondTitle>
                覆盖<em>31省94市</em>、通达全球<em>7大区域</em>
                的精品专线专用网络
              </SecondTitle>
            </TitleWrap>
            <StyledPerformance dataArr={this.performanceArr} />
          </Gis>
          <Gis>
            <Iframe
              name="home-gis-cover"
              url={`${baseStaticUrl}/gis/gis3/index/business.html`}
            />
            <TitleWrap>
              <FirstTitle>业务品质高</FirstTitle>
              <SecondTitle>
                超低时延，最短路径直达；超高可靠，可用率<em>99.99%</em>
              </SecondTitle>
            </TitleWrap>
            <Location>
              <span className="icon" />
              <span className="all">全网拓扑</span>
              <span className="result">
                &nbsp;&nbsp;&gt;&nbsp;&nbsp;查询结果
              </span>
            </Location>
            <StyledPerformance dataArr={this.linePerformanceArr} />
          </Gis>
        </Carousel>
      </HomeWrap>
    );
  }
}
