import React, { Component } from 'react';
import styled from 'styled-components';
import { AutoComplete } from 'antd';
import PageTitle from '../component/pub/page/PageTitle';
import PageContent from '../component/pub/page/PageContent';
import PageModule from './../component/pub/page/PageModule';
import AutoCompleteSelect from './../component/pub/select/AutoCompleteSelect';
import { getAxios, postAxiosBodyAndQuery } from '../axios/mainAxios';
import {
  msToHour,
  formatNumber,
  objectEchartsArray
} from '../util/CommonUtils';
import { px2rem } from './../util/StyleUtils';
import CombineLabelCount from '../component/network-fault/CombineLabelCount';
import Count from '../component/network-fault/Count';
import WarnLineArea from '../component/network-fault/WarnLineArea';
import WarnModal from '../component/pub/modal/WarnModal';
import LinePieChart from './../component/network-fault/LinePieChart';
import LineTable from '../component/cutover-overview/components/LineTable';
import { gotoPath, gotoPathWithState } from '../util/ReduxUtil';
const Option = AutoComplete.Option;

const NetworkFaultWrap = styled.div``;

const StyledPageContent = styled(PageContent)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const FaultModule = styled(PageModule)`
  margin-top: 20px;
  width: 100%;
`;

const FaultCountWrap = styled.div`
  display: flex;
  justify-content: space-around;
`;

const WarnModule = styled(FaultModule)`
  width: ${px2rem(860)};
`;

const WarnContentWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const WarnLineTrendWrap = styled.div`
  padding: 10px;
  width: ${px2rem(412)};
  height: ${px2rem(250)};
  border: 1px solid rgb(229, 229, 229);

  .title {
    line-height: 20px;
    font-size: 14px;
    color: #72758c;
  }
`;

const StyledWarnLineArea = styled(WarnLineArea)`
  margin-top: 10px;
  height: calc(100% - 10px - 20px - 10px) !important;
  width: 100%;
`;

const StyledWarnModal = styled(WarnModal)`
  margin-top: 10px;
  width: 100%;

  .ant-table-scroll table {
    width: 100%;
  }
`;

const LineModule = styled(FaultModule)`
  width: ${px2rem(420)};
`;

const LineContentWrap = styled.div`
  /* display: flex; */
`;

const WarnLineLevelWrap = styled(WarnLineTrendWrap)`
  width: 100%;
  border: none;
`;

const WarnLineTableWrap = styled(WarnLineLevelWrap)`
  margin-top: 10px;
  height: auto;
`;

const StyledLineTable = styled(LineTable)`
  margin-top: 20px;
  .ant-table-row {
    &:nth-child(odd) {
      background-color: rgba(240, 243, 247, 0.39);
    }
  }
  .line {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    .key {
      display: inline-block;
      width: 1rem;
      height: 1rem;
      line-height: 1rem;
      border-radius: 0.125rem;
      color: #fff;
      text-align: center;
      margin-right: 0.5rem;
    }
  }
`;

const Red = styled.span`
  color: rgb(238, 96, 110);
`;

export default class NetworkFault extends Component {
  state = {
    // 搜索联想结果
    searchElementList: [],
    selectedElementId: '',

    // 实时故障统计数据 👇
    // 受影响专线
    faultLineCount: 0,
    // 故障处理时长
    weekTime: 0,
    monthTime: 0,
    // 故障处理及时率
    weekSeg: 0,
    monthSeg: 0,
    // 告警总数
    warnSummary: 0,
    // 告警分类统计
    firstWarnSummary: 0,
    // 实时故障统计数据 👆

    // 近6小时一级告警总数
    levelFirstTimedWarnData: {},
    // 近6小时告警总数
    levelAllTimedWarnData: {},

    // 活动告警列表
    pageNum: 1,
    pageSize: 10,
    warnTotalCount: 0,
    warnList: [],

    // 专线类型分布：[{name: '', value: 0}]
    levelLineArr: [],
    // 告警影响的专线列表
    linePageNum: 1,
    linePageSize: 10,
    lineTotalCount: 0,
    lineList: []
  };

  handlingTimeStateMap = {
    WEEK: 'weekTime',
    MONTH: 'monthTime'
  };

  handlingSegStateMap = {
    WEEK: 'weekSeg',
    MONTH: 'monthSeg'
  };

  componentDidMount() {
    // 实时统计
    this.setFaultLineCount();
    this.setFaultHandlingTime('WEEK');
    this.setFaultHandlingTime('MONTH');
    this.setFaultHandlingSeg('WEEK');
    this.setFaultHandlingSeg('MONTH');
    this.setWarnCount();

    // 告警
    this.setLevelWarnTimedData();
    this.setLevelWarnTimedData(1);
    this.setWarnList();

    // 专线
    this.setLevelLines();
    this.setLineList();
  }

  getHandleTimeParams = timeSeg => ({ timeSeg });

  getFaultParams = () => ({});

  setFaultHandlingTime = type => {
    getAxios(
      'api/network/stats/fault_handling_time/time_seg',
      this.getHandleTimeParams(type),
      data =>
        this.setState({ [this.handlingTimeStateMap[type]]: msToHour(data) })
    );
  };

  setFaultHandlingSeg = type => {
    getAxios(
      'api/network/stats/fault_handling_seg/time_seg',
      this.getHandleTimeParams(type),
      data => this.setState({ [this.handlingSegStateMap[type]]: data })
    );
  };

  setWarnCount = () => {
    getAxios(
      'api/alarms/stats/num/severity',
      this.getFaultParams(),
      ({ summary = 0, values = {} }) =>
        this.setState({
          warnSummary: formatNumber(summary),
          firstWarnSummary: formatNumber(values['1'])
        })
    );
  };

  setFaultLineCount = () => {
    getAxios('api/leased_lines/stats/num/fault', ({ fault }) =>
      this.setState({ faultLineCount: formatNumber(fault) })
    );
  };

  setLevelWarnTimedData = (level = 0) => {
    const params = this.getFaultParams();
    !!level && (params.severity = level);
    getAxios('api/alarms/stats/num/timed', params, ({ values }) =>
      this.setState({
        [level ? 'levelFirstTimedWarnData' : 'levelAllTimedWarnData']: values
      })
    );
  };

  setLevelLines = () => {
    getAxios(
      'api/leased_lines/stats/security_level',
      { ...this.getFaultParams(), alarmOnly: true },
      ({ values }) =>
        this.setState({
          levelLineArr: objectEchartsArray(values).map(line => {
            if (line.name === 'common') {
              line.name = '标准';
            }
            return line;
          })
        })
    );
  };

  setWarnList = (
    pageNum = this.state.pageNum,
    pageSize = this.state.pageSize
  ) => {
    getAxios(
      'api/alarms',
      {
        ...this.getFaultParams(),
        currentPage: pageNum - 1,
        pageSize: pageSize
      },
      ({ results, totalElements }) =>
        this.setState({
          warnList: results,
          warnTotalCount: totalElements,
          pageSize,
          pageNum
        })
    );
  };

  setLineList = (
    linePageNum = this.state.linePageNum,
    linePageSize = this.state.linePageSize
  ) => {
    getAxios(
      'api/leased_lines',
      // 选择故障otn的时候，faultOnly字段为false，否则为true
      {
        ...this.getFaultParams(),
        alarmOnly: true,
        currentPage: linePageNum - 1,
        pageSize: linePageSize
      },
      ({ results, totalElements }) =>
        this.setState({
          lineList: results,
          lineTotalCount: totalElements,
          linePageNum,
          linePageSize
        })
    );
  };

  getLinePieCenter = () => {
    return `总数\n${this.state.levelLineArr
      .map(x => x.value)
      .reduce((a, b) => a.value + b.value, 0)}`;
  };

  renderSearchOption = (item, index) => {
    return (
      <Option key={item.id} name={item.name}>
        <div className="autocomplete-search-item">
          {item.name}
        </div>
      </Option>
    );
  };

  // 按照网元模糊搜索，取5条数据
  onSearch = value => {
    postAxiosBodyAndQuery(
      'api/network/elements',
      { nameLike: value },
      { currentPage: 0, pageSize: 5 },
      ({ results = [] }) =>
        this.setState({
          searchElementList: results
        })
    );
  };

  // 保存选中的搜索值，点击跳转时带上选中的网元
  onSelect = value => this.setState({selectedElementId: value});

  getOtnData = id => {
    let element = this.state.searchElementList.find(item => item.id === id);
    return element ? { id: element.id, name: element.name } : {};
  }

  onSearchClick = () => {
    const { selectedElementId: id } = this.state;
    const path = '/main/fault/network/detail';
    if (id) {
      console.log(this.getOtnData(id));
      gotoPathWithState(path, {otn: this.getOtnData(id)});
    } else {
      gotoPath(path);
    }
  }

  render() {
    const {
      searchElementList,

      weekTime,
      monthTime,
      weekSeg,
      monthSeg,
      levelFirstTimedWarnData,
      levelAllTimedWarnData,

      warnList,
      warnTotalCount,
      pageSize,
      pageNum,

      levelLineArr,

      lineList,
      linePageNum,
      linePageSize,
      lineTotalCount
    } = this.state;

    const countArr = [
      { title: '受影响专线', content: this.state.faultLineCount },
      {
        title: '一级告警数量',
        content: <Red>{this.state.firstWarnSummary}</Red>
      },
      { title: '告警总数', content: this.state.warnSummary },
      {
        title: '故障处理时长',
        content: (
          <CombineLabelCount
            dataArr={[
              { label: '上一周', value: weekTime },
              { label: '上一月', value: monthTime }
            ]}
          />
        )
      },
      {
        title: '故障处理及时率',
        content: (
          <CombineLabelCount
            dataArr={[
              { label: '上一周', value: weekSeg },
              { label: '上一月', value: monthSeg }
            ]}
          />
        )
      }
    ];

    return (
      <NetworkFaultWrap>
        <PageTitle showBack={false} title="网络故障" />
        <StyledPageContent>
          <AutoCompleteSelect
            placeholder="请输入设备名称进行故障定位"
            optionLabelProp="name"
            dataSource={searchElementList.map(this.renderSearchOption)}
            onSearch={this.onSearch}
            onSelect={this.onSelect}
            onSearchClick={this.onSearchClick}
          />
          <FaultModule title="实时故障统计">
            <FaultCountWrap>
              {countArr.map(({ title, content }, index) => (
                <Count key={index} title={title}>
                  {content}
                </Count>
              ))}
            </FaultCountWrap>
          </FaultModule>
          <WarnModule title="告警相关统计">
            <WarnContentWrap>
              <WarnLineTrendWrap>
                <div className="title">近6小时一级告警数量趋势</div>
                <StyledWarnLineArea
                  lineColor="#F65F7B"
                  yColor="#FFDFDC"
                  y2Color="#FFDEDE"
                  data={levelFirstTimedWarnData}
                />
              </WarnLineTrendWrap>
              <WarnLineTrendWrap>
                <div className="title">近6小时告警总数取数</div>
                <StyledWarnLineArea
                  lineColor="#FFBB44"
                  yColor="#FFF2DE"
                  y2Color="#FFF2DC"
                  data={levelAllTimedWarnData}
                />
              </WarnLineTrendWrap>
              <StyledWarnModal
                title="实时告警列表"
                pathName="network"
                showCount={false}
                warnList={warnList}
                pageNum={pageNum}
                pageSize={pageSize}
                totalCount={warnTotalCount}
                onPageChange={this.setWarnList}
              />
            </WarnContentWrap>
          </WarnModule>
          <LineModule title="影响专线相关统计">
            <LineContentWrap>
              <WarnLineLevelWrap>
                <div className="title">专线类型分布</div>
                <StyledWarnLineArea
                  as={LinePieChart}
                  centerText={this.getLinePieCenter()}
                  dataArr={levelLineArr}
                />
              </WarnLineLevelWrap>
              <WarnLineTableWrap>
                <div className="title">专线列表</div>
                <StyledLineTable
                  businessTypeVisible={false}
                  fromNetworkFault={true}
                  showHeader={false}
                  scrollY={'31rem'}
                  pageNum={linePageNum}
                  pageSize={linePageSize}
                  totalCount={lineTotalCount}
                  lineList={lineList}
                  onPageChange={this.setLineList}
                />
              </WarnLineTableWrap>
            </LineContentWrap>
          </LineModule>
        </StyledPageContent>
      </NetworkFaultWrap>
    );
  }
}
