import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button, Select, Radio, Form, Table, Icon, Tooltip } from 'antd';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import TablePagination from '../../pub/TablePagination';

import RegionSelect from '../../pub/RegionSelect';
import DateSelect from '../../pub/DateSelect';
import AnalysisBarChart from '../../pub/AnalysisBarChart';

import { postAxios, postAxiosBodyAndQuery } from '../../../axios/mainAxios';

import { getDictOptions } from '../../../util/AnalysisUtils';
import { getDict } from '../../../util/ReduxUtil';
import { DictIdEnum, DictEnum } from '../../../redux/dictRedux';
import {
  formatNumber,
  objectEchartsArray,
  objSum
} from '../../../util/CommonUtils';

import jp from '../../../assets/image/business-manage/jp.svg';
import yp from '../../../assets/image/business-manage/yp.svg';
import tp from '../../../assets/image/business-manage/tp.svg';
import bg from '../../../assets/image/business-manage/bg.svg';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const medal = {
  金牌: jp,
  银牌: yp,
  铜牌: tp,
  标准: bg
};
//工单类型中英对照
const typeChToEn = {
  勘查: 'SURVEY',
  开通: 'OPENING',
  停闭: 'SHUTDOWN',
  变更勘查: 'ALTER_SURVEY',
  停机: 'ALTER_STOPPING',
  复机: 'ALTER_RESETTING',
  变更开通: 'ALTER_OPENING'
};
//工单单选选择与url的对应
const radioToUrl = {
  全部工单: 'total',
  在途工单: 'ongoing',
  归档工单: 'finished',
  已超时工单: 'expired',
  即将超时工单: 'expiring',
  勘察及时率: 'survey_rate'
};
// 业务类型选择
const option1 = [
  <Option value={0} key="0">
    全部
  </Option>,
  <Option value={1} key="1">
    国际业务
  </Option>,
  <Option value={2} key="2">
    政企业务
  </Option>
];
// 是否归档
const option3 = [
  <Option value="归档" key="10">
    是
  </Option>,
  <Option value="在途" key="11">
    否
  </Option>
];

class SupportContent extends Component {
  state = {
    province: '', //默认省份
    timeRange: {
      since: '',
      until: ''
    },
    startDate: moment().day(-30),
    endDate: moment(),
    orderClass:
      this.props.orderClass !== '变更'
        ? this.props.orderClass
        : this.props.activeKey, // 父组件传来的工单类型
    radioValue: '全部工单', //单选默认值
    businessType: this.props.business.type, //业务类型默认值(获取程序入口的选择)
    securityLevel: '', //业务保障等级
    chain: '归档', //是否归档
    total: 0,
    pageNo: 1,
    pageSize: 10,
    firstData: [],
    firstSum: 0,
    secondData: [],
    secondSum: 0,
    thirdData: [],
    thirdSum: 0,
    mapData: [],
    tableData: []
  };
  //dom加载完毕后根据初始参数请求数据
  componentDidMount() {
    const {
      province,
      timeRange,
      orderClass,
      radioValue,
      businessType,
      chain,
      securityLevel,
      pageNo,
      pageSize
    } = this.state;
    this.getLevelData(
      businessType,
      province,
      timeRange,
      typeChToEn[orderClass]
    );
    //应该传入全部工单分省统计接口，待修改
    this.getProvinceData(
      radioValue,
      businessType,
      province,
      timeRange,
      typeChToEn[orderClass]
    );
    this.getTableData(
      pageNo,
      pageSize,
      businessType,
      chain,
      securityLevel,
      province,
      timeRange,
      typeChToEn[orderClass]
    );
    // 业务保障等级选择框内容
    getDict(DictIdEnum.SERVICE_LEVEL_GUARANTEE);
  }
  // 当store中business改变时，重刷数据
  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (prevProps.business.type !== this.props.business.type) {
      this.setState(
        {
          businessType: this.props.business.type
        },
        () => {
          this.getAllData();
        }
      );
    }
  };
  //监测到属性改变时触发
  componentWillReceiveProps(next) {
    if (this.props.orderClass !== next.orderClass) {
      this.setState(
        {
          orderClass: next.orderClass
        },
        () => {
          this.getAllData();
        }
      );
    }
    if (
      next.activeKey === this.props.name &&
      this.props.activeKey !== next.activeKey
    ) {
      //如果tab发生切换且切换到当前页时
      this.setState(
        {
          orderClass: next.activeKey
        },
        () => {
          this.getAllData();
        }
      );
    }
  }
  // 请求接口得到需要展示的数据
  getAllData = () => {
    this.getLevelData(
      this.state.businessType,
      this.state.province,
      this.state.timeRange,
      typeChToEn[this.state.orderClass]
    );
    //应该传入全部工单分省统计接口，待修改
    this.getProvinceData(
      this.state.radioValue,
      this.state.businessType,
      this.state.province,
      this.state.timeRange,
      typeChToEn[this.state.orderClass]
    );
    this.getTableData(
      this.state.pageNo,
      this.state.pageSize,
      this.state.businessType,
      this.state.chain,
      this.state.securityLevel,
      this.state.province,
      this.state.timeRange,
      typeChToEn[this.state.orderClass]
    );
  };
  //得到工单按业务保障等级分类统计
  getLevelData = (businessType, province, timeRange, type) => {
    // 得到全部工单饼图数据和工单总数
    postAxios(
      'api/flows/stats/security_level',
      { businessType, province, timeRange, type },
      data => {
        this.setState({
          firstData: objectEchartsArray(data.values),
          firstSum: objSum(data.values)
        });
      }
    );
    // 得到在途工单饼图数据和工单总数
    postAxios(
      'api/flows/stats/security_level',
      { businessType, chain: '在途', province, timeRange, type },
      data => {
        this.setState({
          secondData: objectEchartsArray(data.values),
          secondSum: objSum(data.values)
        });
      }
    );
    // 得到归档工单饼图数据和工单总数
    postAxios(
      'api/flows/stats/security_level',
      { businessType, chain: '归档', province, timeRange, type },
      data => {
        this.setState({
          thirdData: objectEchartsArray(data.values),
          thirdSum: objSum(data.values)
        });
      }
    );
  };
  //得到工单分省统计
  getProvinceData = (radioValue, businessType, province, timeRange, type) => {
    if (radioValue === '勘查及时率') {
      postAxios(
        'api/handling/stats/survey_rate/location',
        { timeRange },
        data => {
          this.setState({
            mapData: objectEchartsArray(data.values)
          });
        }
      );
    } else {
      postAxios(
        `api/flows/stats/${radioToUrl[radioValue]}/location`,
        { businessType, province, timeRange, type },
        data => {
          this.setState({
            mapData: objectEchartsArray(data.values)
          });
        }
      );
    }
  };
  //得到表格展示数据
  getTableData = (
    currentPage,
    pageSize,
    businessType,
    chain,
    securityLevel,
    province,
    timeRange,
    type
  ) => {
    postAxiosBodyAndQuery(
      'api/flows',
      { businessType, chain, securityLevel, province, timeRange, type },
      { currentPage, pageSize },
      data => {
        this.setState({
          total: data.totalElements,
          tableData: data.results
        });
      }
    );
  };
  // 回调函数获取开始日期、结束日期、区域
  onStartChange = (date, dateString) => {
    this.setState({ startDate: date });
  };
  onEndChange = (date, dateString) => {
    console.log(dateString);
    this.setState({ endDate: date });
  };
  handlePro = value => {
    this.setState({
      province: value
    });
  };
  //时间范围或选择区域改变时
  search = () => {
    let timeRange = {};
    timeRange.since = this.state.startDate.valueOf();
    timeRange.until = this.state.endDate.valueOf();
    this.setState(
      {
        timeRange: timeRange
      },
      () => {
        this.getAllData();
      }
    );
  };
  reset = () => {
    this.setState(
      {
        startDate: moment().day(-30),
        endDate: moment(),
        province: ''
      },
      () => {
        this.getAllData();
      }
    );
  };
  //获取单选工单类别选择
  handleRaido = e => {
    this.setState(
      {
        radioValue: e.target.value
      },
      () => {
        this.getProvinceData(
          this.state.radioValue,
          this.state.businessType,
          this.state.province,
          this.state.timeRange,
          typeChToEn[this.state.orderClass]
        );
      }
    );
  };
  //获取工单列表筛选条件（工单列表提交）
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState(
          {
            pageNo: 1,
            businessType: values.businessType, //如果选的全部传什么参数？
            securityLevel:
              values.securityLevel === '全部' ? '' : values.securityLevel,
            chain:
              values.chain === '是' || values.chain === '归档' ? '归档' : '在途'
          },
          () => {
            this.getTableData(
              this.state.pageNo,
              this.state.pageSize,
              this.state.businessType,
              this.state.chain,
              this.state.securityLevel,
              this.state.province,
              this.state.timeRange,
              typeChToEn[this.state.orderClass]
            );
          }
        );
      }
    });
  };
  // 点击重置时触发（工单列表重置）
  handlereset = () => {
    this.props.form.resetFields();
  };
  // 分页器改变时触发
  onPageChange = (pageNo, pageSize) => {
    this.setState({ pageNo, pageSize }, () =>
      this.getTableData(
        this.state.pageNo,
        this.state.pageSize,
        this.state.businessType,
        this.state.chain,
        this.state.securityLevel,
        this.state.province,
        this.state.timeRange,
        typeChToEn[this.state.orderClass]
      )
    );
  };
  // 饼状图
  getPie = (text, data) => {
    let option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      color: ['#8776EF', '#F65F7B', '#F0B34A', '#71CA41'],
      graphic: {
        type: 'text',
        left: 'center',
        top: 'center',
        style: {
          text: text,
          textAlign: 'center',
          fill: '#72758C',
          font: '400 14px PingFangSC-Regular'
        }
      },
      series: [
        {
          name: text,
          type: 'pie',
          radius: ['40%', '60%'],
          center: ['50%', '50%'],
          roseType: 'radius',
          data: data,
          itemStyle: {
            normal: {
              label: {
                show: true,
                formatter: function(params) {
                  return (
                    params.name + ':\n' + formatNumber(params.data['value'])
                  );
                },
                color: '#72758C',
                fontSize: '14px'
              },
              labelLine: { show: true }
            }
          }
        },
        {
          name: '',
          type: 'pie',
          radius: ['70%', '72%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          color: '#E6EDF8',
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [{ value: 1, name: '' }],
          tooltip: {
            show: false
          }
        }
      ]
    };
    return option;
  };
  render() {
    const {
      orderClass,
      radioValue,
      firstData,
      firstSum,
      secondData,
      secondSum,
      thirdData,
      thirdSum,
      mapData,
      total,
      pageNo,
      pageSize,
      tableData
    } = this.state;
    const { getFieldDecorator } = this.props.form;

    const securityLevelOptions = getDictOptions(
      DictEnum.SERVICE_LEVEL_GUARANTEE
    );

    //表格列
    const columns = [
      // {
      //     title:'序号',
      //     dataIndex:'no',
      //     align:'left',
      //     width:'5%',
      //     key:1,
      // },
      {
        title: '省份',
        dataIndex: 'customerProvince',
        align: 'left',
        width: '5%',
        className: 'control-line',
        key: 2
      },
      {
        title: '工单编号',
        dataIndex: 'id',
        align: 'left',
        width: '6%',
        className: 'control-line',
        key: 3
      },
      {
        title: '派单时间',
        render: (text, record) => (
          <div className="control-line" title={record.sendtime}>
            {moment(parseInt(record.sendTime)).format(
              'YYYY-MM-DD hh:mm:ss'
            )}
          </div>
        ),
        sorter: (a, b) => a.sendtime - b.sendtime,
        align: 'left',
        width: '8%',
        key: 4
      },
      {
        title: '实际完成时间',
        render: (text, record) => (
          <div className="control-line" title={record.finishtime}>
            {moment(parseInt(record.finishtime)).format(
              'YYYY-MM-DD hh:mm:ss'
            )}
          </div>
        ),
        sorter: (a, b) => a.finishtime - b.finishtime,
        align: 'left',
        width: '11%',
        key: 5
      },
      {
        title: '要求完成时间',
        render: (text, record) => (
          <div className="control-line" title={record.limitTime}>
            {moment(parseInt(record.limitTime)).format(
              'YYYY-MM-DD hh:mm:ss'
            )}
          </div>
        ),
        sorter: (a, b) => a.limitTime - b.limitTime,
        align: 'left',
        width: '11%',
        key: 6
      },
      {
        title: '客户名称',
        render: (text, record) => (
          <div className="client control-line" title={record.customerName}>
            <Tooltip title={record.customerServiceLevel}>
              <img alt="" src={medal[record.customerServiceLevel]} />
            </Tooltip>
            <span>{record.customerName}</span>
          </div>
        ),
        align: 'left',
        // width:'15%',
        key: 7
      },
      {
        title: '产品实例标识',
        dataIndex: 'productNo',
        align: 'left',
        // width:'8%',
        className: 'control-line',
        key: 8
      },
      {
        title: '业务类型',
        render: (text, record) => (
          <div>
            {record.businessType === 1 ? (
              <button className="policy">政企业务</button>
            ) : (
              <button className="inter">国际业务</button>
            )}
          </div>
        ),
        align: 'left',
        // width:'10%',
        className: 'control-line',
        key: 9
      },
      {
        title: '业务保障等级',
        dataIndex: 'securityLevel',
        align: 'left',
        //width:'15%',
        className: 'control-line',
        key: 10
      },

      {
        title: '专线A/Z端所属省',
        dataIndex: 'azprovince',
        render: (text, record) => (
          <div className="control-line">
            {record.abusinessProvince}/{record.zbusinessProvince}
          </div>
        ),
        align: 'left',
        //width:'15%',
        className: 'control-line',
        key: 11
      },
      {
        title: '是否归档',
        render: (text, record) => (
          <div>{record.chain === '归档' ? '是' : '否'}</div>
        ),
        align: 'left',
        //width:'15%',
        className: 'control-line',
        key: 12
      }
    ];
    return (
      <div>
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
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              onStartChange={this.onStartChange}
              onEndChange={this.onEndChange}
            />
          </span>
          <span className="filter-item">
            <span className="label">区域：</span>
            <RegionSelect
              value={this.state.province}
              onChange={this.handlePro}
            />
          </span>
          <span className="right-btn">
            <Button type="primary" onClick={this.search}>
              查询
            </Button>
            <Button onClick={this.reset}>重置</Button>
          </span>
        </div>
        <div className="content">
          <div className="message">
            <p className="mes-tit">统计信息</p>
            <div className="block1">
              <div className="line1">
                <div
                  className="item"
                  style={{
                    display:
                      orderClass === '勘查' || orderClass === '开通'
                        ? 'block'
                        : 'none'
                  }}
                >
                  <span>{orderClass}处理时长</span>
                  <span className="fontB">0.5h</span>
                </div>
                <div
                  className="item"
                  style={{
                    display:
                      orderClass === '勘查' || orderClass === '开通'
                        ? 'block'
                        : 'none'
                  }}
                >
                  <span>{orderClass}处理及时率</span>
                  <span className="fontB">89.90%</span>
                </div>
                <div className="item">
                  <span>已超时工单数</span>
                  <span className="fontR">20</span>
                </div>
                <div className="item">
                  <span>即将超时工单数</span>
                  <span className="fontR">10</span>
                </div>
              </div>
              <div className="line2">
                <div className="item">
                  <p>全部工单</p>
                  <div className="wrap">
                    <div className="left">
                      <p>工单总数</p>
                      <p>{firstSum}</p>
                    </div>
                    <div className="right">
                      <ReactEcharts
                        option={this.getPie('全部工单', firstData)}
                        notMerge={true}
                        style={{ height: '100%' }}
                      />
                    </div>
                  </div>
                </div>
                <div className="item">
                  <p>在途工单</p>
                  <div className="wrap">
                    <div className="left">
                      <p>在途工单数</p>
                      <p>{secondSum}</p>
                    </div>
                    <div className="right">
                      <ReactEcharts
                        option={this.getPie('在途工单', secondData)}
                        notMerge={true}
                        style={{ height: '100%' }}
                      />
                    </div>
                  </div>
                </div>
                <div className="item">
                  <p>归档工单</p>
                  <div className="wrap">
                    <div className="left">
                      <p>归档工单数</p>
                      <p>{thirdSum}</p>
                    </div>
                    <div className="right">
                      <ReactEcharts
                        option={this.getPie('归档工单', thirdData)}
                        notMerge={true}
                        style={{ height: '100%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="block2">
              <div className="line1">
                <RadioGroup onChange={this.handleRaido} value={radioValue}>
                  {[
                    '全部工单',
                    '在途工单',
                    '归档工单',
                    '已超时工单',
                    '即将超时工单',
                    '勘查及时率'
                  ].map((item, index) => (
                    <Radio value={item} key={index}>
                      {item}
                    </Radio>
                  ))}
                </RadioGroup>
              </div>
              <div className="pro-wrapper">
                <div>
                  分省情况
                  <div className="export">
                    <Icon type="upload" />
                    <span>导出</span>
                  </div>
                </div>
                <AnalysisBarChart
                  className="province-echart"
                  itemName={radioValue}
                  dataArr={mapData}
                  needDataZone={false}
                />
              </div>
            </div>
          </div>
          <div className="list">
            <p className="list-tit">工单列表</p>
            <div className="select">
              <Form onSubmit={this.handleSubmit}>
                <div className="left">
                  <Form.Item label="业务类型">
                    {getFieldDecorator('businessType', {
                      initialValue: 0
                    })(<Select>{option1}</Select>)}
                  </Form.Item>
                  <Form.Item label="业务保障等级">
                    {getFieldDecorator('securityLevel', {
                      initialValue: '全部'
                    })(<Select>{securityLevelOptions}</Select>)}
                  </Form.Item>
                  <Form.Item label="是否归档">
                    {getFieldDecorator('chain', {
                      initialValue: '是'
                    })(<Select>{option3}</Select>)}
                  </Form.Item>
                </div>
                <div className="right">
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      筛选
                    </Button>
                    <Button className="reset-btn" onClick={this.handlereset}>
                      重置
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            </div>
            <div style={{ overflow: 'hidden', padding: '0 1.125rem' }}>
              <div className="record">
                <span className="text">
                  共<span className="num">{formatNumber(total)}</span>条记录
                </span>
              </div>
              <div className="export">
                <Icon type="upload" />
                <span>导出</span>
              </div>
            </div>
            <Table
              columns={columns}
              dataSource={tableData}
              className="workorder-table"
              rowKey={record => record.id}
              pagination={false}
            />
            <TablePagination
              {...{
                total: total,
                pageSize: pageSize,
                pageNumber: pageNo,
                handlePageChange: this.onPageChange,
                preventDefaultLoad: true
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  business: state.business,
  dict: state.dict
});

export default connect(mapStateToProps)(Form.create()(SupportContent));
