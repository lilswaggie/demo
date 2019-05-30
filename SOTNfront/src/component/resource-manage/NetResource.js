import React from 'react';
import { Button, Row, Col } from 'antd';
import moment from 'moment';
import ChinaAreaMap from '../echart/ChinaAreaMap';
import SpaceResource from './components/space-resource';
import InnerResource from './components/inner-resource';
import StatisticIndicator from './components/statistic-indicator';
import {
  obj2Arr,
  objectEchartsArray,
  objectLine,
  objectMomentLine
} from '../../util/CommonUtils';
import BarChart from '../pub/chart/BarChart';
import SiteType from './components/site-type';
import RoomType from './components/room-type';
import BayType from './components/bay-type';
import LineEchart from './components/lineEchart';
import TransNetwork from './components/trans-network';
import { getAxios, postAxios } from '../../axios/mainAxios';
import {
  resourceIdx,
  spaceResourceIdx,
  innerResourceIdx,
  statsIndicator
} from '../business-manage/components/constant';

import './net-resource.scss';

// 空间、外线、内线、统计指标四个分类
const resourceArr = ['space', 'inner_line', 'outer_line', 'other_statistics'];

class NetResource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // business: [true, false, false, false],
      // radioValue: 'day',
      resource: 'space',
      rateIdx: 0,
      spaceIdx: 0,
      spaceResource: '',
      spaceResourceArr: [],
      innerIdx: 0,
      innerResource: '',
      innerResourceArr: [],
      statisticIdx: 0,
      statisticIndicator: '',
      statisticArr: [],
      mapChart: [],
      itemName: '站点数',
      barData: [],
      resourceTrend: [],
      lineTrend: []
    };
  }
  componentDidMount = () => {
    this.getNetworkResourceIdx();
  };
  selectRate = idx => () => {
    this.setState(
      {
        rateIdx: idx,
        resource: resourceArr[idx]
      },
      () => {
        const {
          resource,
          spaceResource,
          innerResource,
          statisticIndicator
          // spaceResourceArr,
          // innerResourceArr,
          // statisticArr,
        } = this.state;
        if (resource === 'space') {
          this.setState(
            {
              itemName: spaceResourceIdx[spaceResource].name
            },
            () => {
              const mapUrl = `/api/network/stats/${spaceResource}/location`;
              const typeUrl = `/api/network/stats/${spaceResource}/type`;
              // this.getSpaceResource();
              this.getMapOnPost(mapUrl);
              this.getTypeOnPost(typeUrl);
            }
          );
        } else if (resource === 'inner_line') {
          this.setState(
            {
              itemName: innerResourceIdx[innerResource].name
            },
            () => {
              const mapUrl = `/api/network/${innerResource.replace(
                /_/g,
                '/stats/'
              )}/location`;
              const trendUrl = `/api/network/${innerResource.replace(
                /_/g,
                '/stats/'
              )}/timed`;
              // this.getInnerResource();
              this.getMapOnPost(mapUrl);
              this.getTrendOnPost(trendUrl);
            }
          );
        } else if (resource === 'other_statistics') {
          this.setState(
            {
              itemName: statsIndicator[statisticIndicator].name
            },
            () => {
              const mapUrl = `/api/network/${statisticIndicator}/stats/num/location`;
              // const typeUrl = `/api/network/${statisticIndicator}/stats/num/type`;
              const trendUrl = `/api/network/${statisticIndicator}/stats/num/timed`;
              // this.getStatisticResource();
              if (statisticIndicator === 'element') {
                this.getMapOnPost('/api/network/elements/stats/num/location');
              } else {
                this.getMapOnPost(mapUrl);
              }
              if (statisticIndicator === 'element') {
                this.getTypeOnPost(
                  '/api/network/elements/stats/num/service_level'
                );
              } else {
                this.getTrendOnPost(trendUrl);
              }
            }
          );
        } else {
          this.setState(
            {
              itemName: '纤芯利用率'
            },
            () => {
              const mapUrl = 'api/network/stats/fiber_usage/location';
              const trendUrl = 'api/network/stats/fiber_usage/timed';
              this.getMapOnPost(mapUrl);
              this.getTrendOnPost(trendUrl);
            }
          );
        }
      }
    );
  };
  selectSpace = idx => () => {
    const { spaceResourceArr } = this.state;
    this.setState(
      {
        spaceIdx: idx,
        spaceResource: spaceResourceArr[idx].performance,
        itemName: spaceResourceIdx[spaceResourceArr[idx].performance].name
      },
      () => {
        const { spaceResource } = this.state;
        const mapUrl = `/api/network/stats/${spaceResource}/location`;
        const typeUrl = `/api/network/stats/${spaceResource}/type`;
        this.getMapOnPost(mapUrl);
        this.getTypeOnPost(typeUrl);
      }
    );
  };
  selectInner = idx => () => {
    const { innerResourceArr } = this.state;
    this.setState(
      {
        innerIdx: idx,
        innerResource: innerResourceArr[idx].performance,
        itemName: innerResourceIdx[innerResourceArr[idx].performance].name
      },
      () => {
        const { innerResource } = this.state;
        const mapUrl = `/api/network/${innerResource.replace(
          /_/g,
          '/stats/'
        )}/location`;
        const trendUrl = `/api/network/${innerResource.replace(
          /_/g,
          '/stats/'
        )}/timed`;
        this.getMapOnPost(mapUrl);
        this.getTrendOnPost(trendUrl);
      }
    );
  };
  selectStatistic = idx => () => {
    const { statisticArr } = this.state;
    this.setState(
      {
        statisticIdx: idx,
        statisticIndicator: statisticArr[idx].performance,
        itemName: statsIndicator[statisticArr[idx].performance].name
      },
      () => {
        const { statisticIndicator } = this.state;
        const mapUrl = `/api/network/stats/${statisticIndicator}/location`;
        //   const typeUrl = `/api/network/stats/${statisticIndicator}/type`;
        const trendUrl = `/api/network/stats/${statisticIndicator}/timed`;
        if (statisticIndicator === 'element') {
          this.getMapOnPost('/api/network/elements/stats/num/location');
        } else {
          this.getMapOnPost(mapUrl);
        }
        if (statisticIndicator === 'element') {
          this.getTypeOnPost('/api/network/elements/stats/num/service_level');
        } else {
          this.getTrendOnPost(trendUrl);
        }
      }
    );
  };

  // 空间资源
  getSpaceResource = () => {
    getAxios('api/network/stats/current/space', data =>
      this.setState(
        {
          spaceResourceArr: obj2Arr(data.values)
        },
        () => {
          const { spaceResourceArr } = this.state;
          this.setState({
            spaceResource: spaceResourceArr[0].performance
          });
        }
      )
    );
  };
  // 内线资源
  getInnerResource = () => {
    getAxios('api/network/stats/current/inner_line', data =>
      this.setState(
        {
          innerResourceArr: obj2Arr(data.values)
        },
        () => {
          const { innerResourceArr } = this.state;
          this.setState({
            innerResource: innerResourceArr[0].performance
          });
        }
      )
    );
  };
  // 统计指标
  getStatisticResource = () => {
    getAxios('/api/network/stats/current/other_statistics', data =>
      this.setState({ statisticArr: obj2Arr(data.values) }, () => {
        const { statisticArr } = this.state;
        this.setState({
          statisticIndicator: statisticArr[0].performance
        });
      })
    );
  };
  // 分省统计
  getMapOnPost = url => {
    postAxios(url, data =>
      this.setState({
        mapChart: objectEchartsArray(data.values),
        barData: objectLine(data.values)
      })
    );
  };
  // 类型分布
  getTypeOnPost = url => {
    postAxios(url, data =>
      this.setState({ resourceTrend: objectEchartsArray(data.values) })
    );
  };
  getTrendOnPost = url => {
    postAxios(url, data =>
      this.setState({ lineTrend: objectMomentLine(data.values) })
    );
  };
  getNetworkResourceIdx = () => {
    const mapUrl = '/api/network/stats/site/location';
    const typeUrl = '/api/network/stats/site/type';
    this.getSpaceResource();
    this.getInnerResource();
    this.getStatisticResource();
    this.getMapOnPost(mapUrl);
    this.getTypeOnPost(typeUrl);
  };

  render() {
    const {
      rateIdx,
      resource,
      spaceIdx,
      spaceResource,
      spaceResourceArr,
      statisticArr,
      innerResource,
      innerResourceArr,
      mapChart,
      itemName,
      innerIdx,
      statisticIdx,
      barData,
      statisticIndicator,
      resourceTrend,
      lineTrend
    } = this.state;
    // const RadioGroup = Radio.Group;
    const dataTime = moment().format('YYYY-MM-DD');
    const barAxis = barData[0] || [];
    const barValue = barData[1] || [];
    const color = ['#FFBB44'];
    const xData = lineTrend[0] || [''];
    // const indexData= [820, 932, 901, 400, 500, 1000, 1320];
    const indexData = lineTrend[1] || [];
    return (
      <div className="net-resource">
        <div className="resource-header">
          <span className="text">网络资源</span>
          <div className="data-time clearfix">
            {/* <div className="data-radio">
              <span>粒度：</span>
              <RadioGroup onChange={this.onRadioChange} value={this.state.radioValue}>
                <Radio value='day'>天</Radio>
                <Radio value='month'>月</Radio>
              </RadioGroup>
            </div> */}
            <div className="data-text">数据时间：{dataTime}</div>
          </div>
          <div className="btnGroup">
            {resourceArr.map((item, index) => {
              return (
                <Button
                  className={rateIdx === index ? 'btnActive' : ''}
                  onClick={this.selectRate(index)}
                  key={index}
                >
                  {resourceIdx[item]}
                </Button>
              );
            })}
          </div>
        </div>
        <div className="resource-content">
          {resource === 'space' ? (
            <SpaceResource
              {...{
                spaceResourceArr: spaceResourceArr,
                spaceIdx: spaceIdx,
                selectSpace: this.selectSpace
              }}
            />
          ) : resource === 'inner_line' ? (
            <InnerResource
              {...{
                innerResourceArr: innerResourceArr,
                innerIdx: innerIdx,
                selectInner: this.selectInner
              }}
            />
          ) : resource === 'other_statistics' ? (
            <StatisticIndicator
              {...{
                statisticArr: statisticArr,
                statisticIdx: statisticIdx,
                selectStatistic: this.selectStatistic
              }}
            />
          ) : (
            ''
          )}
          <div className="content-body">
            <Row>
              <Col span={14}>
                <div className="province-statistic">
                  {resource === 'outer_line' ? (
                    <div className="total-outer">
                      <div className="total-cutover">
                        纤芯使用率(%)
                        <span>0</span>
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                  {resource === 'space' ? (
                    <ChinaAreaMap
                      dataArr={mapChart}
                      itemName={itemName}
                      needPercent={false}
                    />
                  ) : resource === 'other_statistics' ? (
                    statisticIndicator === 'element' ? (
                      <ChinaAreaMap
                        dataArr={mapChart}
                        itemName={itemName}
                        needPercent={false}
                      />
                    ) : (
                      <ChinaAreaMap
                        dataArr={mapChart}
                        itemName={itemName}
                        needPercent={true}
                      />
                    )
                  ) : resource === 'inner_line' ? (
                    innerResource === 'oms_num' ||
                    innerResource === 'ots_num' ? (
                        <ChinaAreaMap
                          dataArr={mapChart}
                          itemName={itemName}
                          needPercent={false}
                        />
                      ) : (
                        <ChinaAreaMap
                          dataArr={mapChart}
                          itemName={itemName}
                          needPercent={true}
                        />
                      )
                  ) : (
                    <ChinaAreaMap
                      dataArr={mapChart}
                      itemName={itemName}
                      needPercent={true}
                    />
                  )}
                  {/* <ChinaAreaMap
                    dataArr={mapChart}
                    itemName={itemName}
                  /> */}
                </div>
              </Col>
              <Col span={10}>
                <div className="resource-chart">
                  <div className="chart-top">
                    <div className="title clearfix">
                      <span>
                        {resource === 'space'
                          ? spaceResource === 'room'
                            ? `${itemName}级别分布`
                            : `${itemName}类型分布`
                          : resource === 'other_statistics'
                            ? statisticIndicator === 'element'
                              ? `${itemName}类型分布`
                              : `近30天${itemName}变化趋势`
                            : `近30天${itemName}变化趋势`}
                      </span>
                    </div>
                    {resource === 'space' ? (
                      spaceResource === 'site' ? (
                        <SiteType siteType={resourceTrend} />
                      ) : spaceResource === 'room' ? (
                        <RoomType roomType={resourceTrend} />
                      ) : (
                        <BayType bayType={resourceTrend} />
                      )
                    ) : resource === 'other_statistics' ? (
                      statisticIndicator === 'element' ? (
                        <TransNetwork transNetwork={resourceTrend} />
                      ) : (
                        <LineEchart
                          {...{
                            lineColor: color,
                            lineData: indexData,
                            aAxis: xData,
                            rateText: itemName,
                            yName: '%',
                            needPercent: true
                          }}
                        />
                      )
                    ) : resource === 'inner_line' ? (
                      innerResource === 'oms_num' ||
                      innerResource === 'ots_num' ? (
                          <LineEchart
                            {...{
                              lineColor: color,
                              lineData: indexData,
                              aAxis: xData,
                              rateText: itemName,
                              yName: ''
                            }}
                          />
                        ) : (
                          <LineEchart
                            {...{
                              lineColor: color,
                              lineData: indexData,
                              aAxis: xData,
                              rateText: itemName,
                              yName: '%',
                              needPercent: true
                            }}
                          />
                        )
                    ) : (
                      <LineEchart
                        {...{
                          lineColor: color,
                          lineData: indexData,
                          aAxis: xData,
                          rateText: itemName,
                          yName: '%',
                          needPercent: true
                        }}
                      />
                    )}
                  </div>
                  <div className="chart-bottom">
                    <div className="title clearfix">
                      <span>{`${itemName}分省情况`}</span>
                    </div>
                    {resource === 'space' ? (
                      <BarChart
                        barAxis={barAxis}
                        barValue={barValue}
                        itemName={itemName}
                      />
                    ) : resource === 'other_statistics' ? (
                      statisticIndicator === 'element' ? (
                        <BarChart
                          barAxis={barAxis}
                          barValue={barValue}
                          itemName={itemName}
                        />
                      ) : (
                        <BarChart
                          barAxis={barAxis}
                          barValue={barValue}
                          itemName={itemName}
                          needPercent={true}
                        />
                      )
                    ) : resource === 'inner_line' ? (
                      innerResource === 'oms_num' ||
                      innerResource === 'ots_num' ? (
                          <BarChart
                            barAxis={barAxis}
                            barValue={barValue}
                            itemName={itemName}
                          />
                        ) : (
                          <BarChart
                            barAxis={barAxis}
                            barValue={barValue}
                            itemName={itemName}
                            needPercent={true}
                          />
                        )
                    ) : (
                      <BarChart
                        barAxis={barAxis}
                        barValue={barValue}
                        itemName={itemName}
                        needPercent={true}
                      />
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

export default NetResource;
