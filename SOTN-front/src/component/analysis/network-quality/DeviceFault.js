import React, { Component } from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';
import moment from 'moment';

import { Tabs, Icon, Button, Radio, Select, Input, Table } from 'antd';

import DateSelect from '../../pub/DateSelect';
import RegionSelect from '../../pub/RegionSelect';
import AnalysisBarChart from '../../pub/AnalysisBarChart';
import TablePagination from '../../pub/TablePagination';

import {
  elementColumns,
  cardColumns,
  removeHms,
  objectToDict,
  getDictOptions,
  sortMap,
  SortEnum
} from '../../../util/AnalysisUtils';
import { formatNumber, camel2Constant } from '../../../util/CommonUtils';
import { postAxios, postAxiosBodyAndQuery } from '../../../axios/mainAxios';
import { getDict } from '../../../util/ReduxUtil';
import { DictIdEnum } from '../../../redux/dictRedux';

class DeviceFault extends Component {
  state = {
    // 0：网元故障，1：板卡故障
    activeTab: 0,

    startDate: [moment().day(-30), moment().day(-30)],
    endDate: [moment(), moment()],
    region: ['', ''],

    elementStatisticArr: [],
    elementStatisticCount: 0,
    cardStatisticArr: [],
    cardStatisticCount: 0,

    // 0：故障总次数，1：传输业务级别、板卡型号
    elementProvinceFilterType: 0,
    cardProvinceFilterType: 0,
    // 传输业务级别
    serviceLevel: '',
    // 板卡型号
    model: '',
    elementProvinceData: [],
    elementTop10Data: [],
    cardProvinceData: [],
    cardTop10Data: [],

    // 故障网元列表筛选条件
    serviceLevel1: '',
    elementName: '',
    // 板卡故障列表筛选条件
    model1: '',
    elementName1: '',
    cardName: '',

    // table
    elementPageSize: 10,
    elementPageNum: 1,
    elementTableData: [],
    elementTotalCount: 0,
    cardPageSize: 10,
    cardPageNum: 1,
    cardTableData: [],
    cardTotalCount: 0,

    elementSorter: {},
    cardSorter: {}
  };

  componentDidMount() {
    this.getAllData();
    getDict(DictIdEnum.SERVICE_LEVEL);
    getDict(DictIdEnum.BOARD_TYPE);
  }

  componentDidUpdate(prevProps, prevState) {
    const { type } = this.props;
    const {
      elementProvinceFilterType,
      cardProvinceFilterType,
      serviceLevel,
      model,
      elementSorter,
      cardSorter
    } = this.state;
    if (prevProps.type !== type && type === 1) {
      this.getAllData();
    }
    if (
      (elementProvinceFilterType === prevState.elementProvinceFilterType &&
        serviceLevel !== prevState.serviceLevel) ||
      elementProvinceFilterType !== prevState.elementProvinceFilterType ||
      (cardProvinceFilterType === prevState.cardProvinceFilterType &&
        model !== prevState.model) ||
      cardProvinceFilterType !== prevState.cardProvinceFilterType
    ) {
      this.getProvinceData();
    }
    if (
      !_.isEqual(elementSorter, prevState.elementSorter) ||
      !_.isEqual(cardSorter, prevState.cardSorter)
    ) {
      this.getTableData();
    }
  }

  prefix = ['element', 'card'];

  onActiveTabChange = activeTab => this.setState({ activeTab: activeTab - 0 });

  // 时间选择改变
  onDateChange = name => (date, dateStr) => {
    const d = this.state[name];
    d[this.state.activeTab] = date;
    this.setState({ [name]: d });
  };

  // 区域选择改变
  onRegionChange = region => {
    const { region: r } = this.state;
    r[this.state.activeTab] = region;
    this.setState({ region: r });
  };

  onInputChange = name => e => this.setState({ [name]: e.target.value });

  onSelectChange = name => v => this.setState({ [name]: v });

  getStateName = (suffix = '') => this.prefix[this.state.activeTab] + suffix;

  onProvinceFilterTypeChange = e =>
    this.setState({
      [this.getStateName('ProvinceFilterType')]: e.target.value
    });

  resetAllFilter = () => {
    const { startDate, endDate, region } = this.state;
    const idx = this.state.activeTab;
    startDate[idx] = moment().day(-30);
    endDate[idx] = moment();
    region[idx] = '';
    this.setState({ startDate, endDate, region });
  };

  resetTableFilter = () => {
    this.setState(
      [
        { serviceLevel1: '', elementName: '' },
        { model1: '', elementName1: '', cardName: '' }
      ][this.state.activeTab]
    );
  };

  getFilterParams = () => {
    const { region, startDate, endDate, activeTab: idx } = this.state;
    return {
      province: region[idx] || null,
      timeRange: {
        since: removeHms(startDate[idx]).valueOf(),
        until: removeHms(endDate[idx]).valueOf()
      }
    };
  };

  getProvinceParams = () => {
    let filter = this.getFilterParams();
    const {
      elementProvinceFilterType,
      cardProvinceFilterType,
      serviceLevel,
      model,
      activeTab: idx
    } = this.state;
    if (idx === 0 && elementProvinceFilterType === 1) {
      filter.serviceLevel = serviceLevel;
    }
    if (idx === 1 && cardProvinceFilterType === 1) {
      filter.model = model;
    }
    return filter;
  };

  getTop10Params = () => {
    return {
      ...this.getFilterParams(),
      orderBy: [
        {
          direction: SortEnum.DESC,
          field: ['FAULT_FREQUENCY_NUM', 'FAULT_NUM'][this.state.activeTab]
        }
      ]
    };
  };

  statisticApi = [
    'api/network/elements/stats/fault_num/service_level',
    'api/network/cards/stats/fault_num/model'
  ];

  provinceApi = [
    'api/network/elements/stats/fault_num/location',
    'api/network/cards/stats/fault_num/location'
  ];

  tableApi = ['api/network/elements/fault', 'api/network/cards/fault'];

  getStatisticData = () => {
    postAxios(
      this.statisticApi[this.state.activeTab],
      this.getFilterParams(),
      ({ summary, values }) =>
        this.setState({
          [this.getStateName('StatisticCount')]: summary,
          [this.getStateName('StatisticArr')]: objectToDict(values)
        })
    );
  };

  getProvinceData = () => {
    postAxios(
      this.provinceApi[this.state.activeTab],
      this.getProvinceParams(),
      ({ values }) =>
        this.setState({
          [this.getStateName('ProvinceData')]: objectToDict(values)
        })
    );
  };

  getTop10Data = () => {
    postAxiosBodyAndQuery(
      this.tableApi[this.state.activeTab],
      this.getTop10Params(),
      { currentPage: 0, pageSize: 10 },
      ({ results }) =>
        this.setState({
          [this.getStateName('Top10Data')]: results.map(r => ({
            province: r.province.name,
            name: r.name,
            value: r.faultFrequencyNum
          }))
        })
    );
  };

  getElementList = (
    pageNum = this.state.elementPageNum,
    pageSize = this.state.elementPageSize
  ) => {
    let filter = this.getFilterParams();
    const {
      serviceLevel1,
      elementName,
      elementSorter: { order, field }
    } = this.state;
    filter.serviceLevel = serviceLevel1;
    filter.elementNameLike = elementName;
    if (field) {
      filter.orderBy = [
        { direction: sortMap[order], field: camel2Constant(field) }
      ];
    }
    postAxiosBodyAndQuery(
      'api/network/elements/fault',
      filter,
      { currentPage: pageNum - 1, pageSize },
      ({ results = [], totalElements }) => {
        results.forEach(record => (record.key = record.id));
        this.setState({
          elementTableData: results,
          elementTotalCount: totalElements,
          elementPageSize: pageSize,
          elementPageNum: pageNum
        });
      }
    );
  };

  getCardList = (
    pageNum = this.state.cardPageNum,
    pageSize = this.state.cardPageSize
  ) => {
    let filter = this.getFilterParams();
    const {
      model1,
      elementName1,
      cardName,
      cardSorter: { order, field }
    } = this.state;
    filter.model = model1;
    filter.elementNameLike = elementName1;
    filter.cardNameLike = cardName;
    if (field) {
      filter.orderBy = [
        { direction: sortMap[order], field: camel2Constant(field) }
      ];
    }
    postAxiosBodyAndQuery(
      'api/network/cards/fault',
      filter,
      { currentPage: pageNum - 1, pageSize },
      ({ results = [], totalElements }) => {
        results.forEach(record => (record.key = record.id));
        this.setState({
          cardTableData: results,
          cardTotalCount: totalElements,
          cardPageSize: pageSize,
          cardPageNum: pageNum
        });
      }
    );
  };

  getTableData = () =>
    [this.getElementList, this.getCardList][this.state.activeTab].call(this, 1);

  getAllData = () => {
    this.getStatisticData();
    this.getProvinceData();
    this.getTop10Data();
    this.getTableData();
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({ [this.getStateName('Sorter')]: sorter });
  };

  render() {
    const TabPane = Tabs.TabPane;
    const {
      elementStatisticArr,
      elementStatisticCount,
      cardStatisticArr,
      cardStatisticCount,

      elementProvinceFilterType,
      cardProvinceFilterType,
      serviceLevel,
      model,

      elementProvinceData,
      elementTop10Data,
      cardProvinceData,
      cardTop10Data,

      serviceLevel1,
      elementName,
      model1,
      elementName1,
      cardName,

      elementPageSize,
      elementPageNum,
      elementTableData,
      elementTotalCount,
      cardPageSize,
      cardPageNum,
      cardTableData,
      cardTotalCount
    } = this.state;

    const serviceLevelOptions = getDictOptions(
      this.props.dict[DictIdEnum.SERVICE_LEVEL]
    );
    const boardTypeOptions = getDictOptions(
      this.props.dict[DictIdEnum.BOARD_TYPE]
    );

    const tabArr = [
      {
        name: '网元',
        statisticTitle: '不同传输业务级别网元故障次数',
        statisticCount: elementStatisticCount,
        statisticArr: elementStatisticArr,
        // 需要根据筛选条件合成
        provinceChartName: '省际传输网元故障次数',
        provinceFilter: (
          <Radio.Group
            name="radio-group"
            value={elementProvinceFilterType}
            onChange={this.onProvinceFilterTypeChange}
          >
            <Radio value={0}>故障总次数</Radio>
            <Radio value={1}>
              按从传输业务级别
              <Select
                value={serviceLevel}
                onChange={this.onSelectChange('serviceLevel')}
              >
                {serviceLevelOptions}
              </Select>
            </Radio>
          </Radio.Group>
        ),
        showProvince: true,
        provinceData: elementProvinceData,
        top10Data: elementTop10Data,
        tableFilter: (
          <div className="filter-wrap table-filter">
            <span className="filter-item">
              <span className="label">传输业务级别：</span>
              <Select
                value={serviceLevel1}
                onChange={this.onSelectChange('serviceLevel1')}
              >
                {serviceLevelOptions}
              </Select>
            </span>
            <span className="filter-item">
              <span className="label">传输网元名称：</span>
              <Input
                placeholder="支持模糊搜索"
                value={elementName}
                onChange={this.onInputChange('elementName')}
              />
            </span>
            <span className="right-btn">
              <Button type="primary" onClick={() => this.getElementList(1)}>
                筛选
              </Button>
              <Button onClick={this.resetTableFilter}>重置</Button>
            </span>
          </div>
        ),
        tableColumn: elementColumns,
        pageSize: elementPageSize,
        pageNum: elementPageNum,
        tableData: elementTableData,
        totalCount: elementTotalCount,
        handlePageChange: this.getElementList
      },
      {
        name: '板卡',
        statisticTitle: '不同类型板卡故障次数',
        statisticCount: cardStatisticCount,
        statisticArr: cardStatisticArr,
        provinceChartName: '型号1板卡故障次数',
        provinceFilter: (
          <Radio.Group
            name="radio-group"
            value={cardProvinceFilterType}
            onChange={this.onProvinceFilterTypeChange}
          >
            <Radio value={0}>故障总次数</Radio>
            <Radio value={1}>
              按板卡型号
              <Select value={model} onChange={this.onSelectChange('model')}>
                {boardTypeOptions}
              </Select>
            </Radio>
          </Radio.Group>
        ),
        provinceData: cardProvinceData,
        top10Data: cardTop10Data,
        showProvince: false,
        tableFilter: (
          <div className="filter-wrap table-filter">
            <span className="filter-item">
              <span className="label">板卡型号：</span>
              <Select value={model1} onChange={this.onSelectChange('model1')}>
                {boardTypeOptions}
              </Select>
            </span>
            <span className="filter-item">
              <span className="label">所属网元名称：</span>
              <Input
                placeholder="支持模糊搜索"
                value={elementName1}
                onChange={this.onInputChange('elementName1')}
              />
            </span>
            <span className="filter-item">
              <span className="label">板卡名称：</span>
              <Input
                placeholder="支持模糊搜索"
                value={cardName}
                onChange={this.onInputChange('cardName')}
              />
            </span>
            <span className="right-btn">
              <Button type="primary" onClick={() => this.getCardList(1)}>
                筛选
              </Button>
              <Button onClick={this.resetTableFilter}>重置</Button>
            </span>
          </div>
        ),
        tableColumn: cardColumns,
        pageSize: cardPageSize,
        pageNum: cardPageNum,
        tableData: cardTableData,
        totalCount: cardTotalCount,
        handlePageChange: this.getCardList
      }
    ];

    const { activeTab: tab } = this.state;
    const tabObj = tabArr[tab];
    const name = tabObj.name;

    return (
      <div
        className="analysis-body"
        style={{ display: this.props.type === 1 ? '' : 'none' }}
      >
        <Tabs activeKey={tab + ''} onChange={this.onActiveTabChange}>
          <TabPane tab="网元故障" key={'0'} />
          <TabPane tab="板卡故障" key={'1'} />
        </Tabs>
        <div className="filter-wrap">
          <span className="filter-item">
            <span className="label">
              时间范围
              <Icon
                type="question-circle"
                style={{ color: '#CBCBCB', marginLeft: 5 }}
              />
              ：
            </span>
            <DateSelect
              startDate={this.state.startDate[tab]}
              endDate={this.state.endDate[tab]}
              onStartChange={this.onDateChange('startDate')}
              onEndChange={this.onDateChange('endDate')}
            />
          </span>
          <span className="filter-item">
            <span className="label">区域：</span>
            <RegionSelect
              value={this.state.region[tab]}
              onChange={this.onRegionChange}
            />
          </span>
          <span className="right-btn">
            <Button type="primary" onClick={this.getAllData}>
              查询
            </Button>
            <Button onClick={this.resetAllFilter}>重置</Button>
          </span>
        </div>
        <section>
          <p className="title">统计信息</p>
          <div className="statistic-info">
            <span className="left-item">
              <p className="info-name">{name}故障次数</p>
              <p className="info-value">
                {formatNumber(tabObj.statisticCount)}
              </p>
            </span>
            <span className="right-items">
              <p className="info-name info-title">{tabObj.statisticTitle}</p>
              <div>
                {tabObj.statisticArr.map((item, idx) => (
                  <span key={idx} className="right-item">
                    <p className="info-name">{item.name}</p>
                    <p className="info-value">{formatNumber(item.value)}</p>
                  </span>
                ))}
              </div>
            </span>
          </div>
          <div className="province-info">
            <div className="echart-wrap">
              <div className="province-filter">{tabObj.provinceFilter}</div>
              <p className="echart-title">
                <span className="text">分省情况</span>
                <span className="export">
                  <Icon type="download" />
                  导出
                </span>
              </p>
              <AnalysisBarChart
                className="province-echart"
                itemName={tabObj.provinceChartName}
                dataArr={tabObj.provinceData}
                needDataZone={false}
              />
            </div>
            <div className="echart-wrap">
              <p className="echart-title">
                <span className="text">故障次数TOP10 {name}</span>
                <span className="export">
                  <Icon type="download" />
                  导出
                </span>
              </p>
              <AnalysisBarChart
                className="province-echart"
                itemName="故障次数"
                dataArr={tabObj.top10Data}
                needDataZone={false}
                showProvince={tabObj.showProvince}
              />
            </div>
          </div>

          <p className="title table-title">故障{name}列表</p>
          {tabObj.tableFilter}
          <p className="echart-title">
            <span className="text">
              共<span className="num">{formatNumber(tabObj.totalCount)}</span>
              条记录
            </span>
            <span className="export">
              <Icon type="download" />
              导出
            </span>
          </p>
          <Table
            columns={tabObj.tableColumn}
            dataSource={tabObj.tableData}
            onChange={this.handleTableChange}
            pagination={false}
          />
          <TablePagination
            pageSize={tabObj.pageSize}
            pageNumber={tabObj.pageNum}
            total={tabObj.totalCount}
            preventDefaultLoad={true}
            hideTotal={true}
            handlePageChange={tabObj.handlePageChange}
          />
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  business: state.business,
  dict: state.dict
});

export default connect(mapStateToProps)(DeviceFault);
