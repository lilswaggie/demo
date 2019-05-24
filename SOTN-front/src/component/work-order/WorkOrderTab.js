import React from 'react';
import { Select, Input, Table, Form, Button } from 'antd';

import moment from 'moment/moment';

import TablePagination from '../pub/TablePagination';

import { postAxios } from '../../axios/mainAxios';
import { formatNumber } from '../../util/CommonUtils';

import jp from '../../assets/image/business-manage/jp.svg';
import yp from '../../assets/image/business-manage/yp.svg';
import tp from '../../assets/image/business-manage/tp.svg';
import bg from '../../assets/image/business-manage/bg.svg';

const Option = Select.Option;
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
// 业务保障等级
const option2 = [
  <Option value="全部" key="5">
    全部
  </Option>,
  <Option value="AAA" key="6">
    AAA
  </Option>,
  <Option value="AA" key="7">
    AA
  </Option>,
  <Option value="A" key="8">
    A
  </Option>,
  <Option value="普通" key="9">
    普通
  </Option>
];
// 客户所属省
const option3 = [
  <Option value="北京" key="北京市">
    北京市
  </Option>,
  <Option value="浙江省" key="浙江省">
    浙江省
  </Option>,
  <Option value="天津市" key="天津市">
    天津市
  </Option>,
  <Option value="安徽省" key="安徽省">
    安徽省
  </Option>,
  <Option value="上海市" key="上海市">
    上海市
  </Option>,
  <Option value="福建省" key="福建省">
    福建省
  </Option>,
  <Option value="重庆市" key="重庆市">
    重庆市
  </Option>,
  <Option value="江西省" key="江西省">
    江西省
  </Option>,
  <Option value="山东省" key="山东省">
    山东省
  </Option>,
  <Option value="河南省" key="河南省">
    河南省
  </Option>,
  <Option value="湖北省" key="湖北省">
    湖北省
  </Option>,
  <Option value="湖南省" key="湖南省">
    湖南省
  </Option>,
  <Option value="广东省" key="广东省">
    广东省
  </Option>,
  <Option value="海南省" key="海南省">
    海南省
  </Option>,
  <Option value="山西省" key="山西省">
    山西省
  </Option>,
  <Option value="青海省" key="青海省">
    青海省
  </Option>,
  <Option value="江苏省" key="江苏省">
    江苏省
  </Option>,
  <Option value="辽宁省" key="辽宁省">
    辽宁省
  </Option>,
  <Option value="吉林省" key="吉林省">
    吉林省
  </Option>,
  <Option value="台湾省" key="台湾省">
    台湾省
  </Option>,
  <Option value="河北省" key="河北省">
    河北省
  </Option>,
  <Option value="贵州省" key="贵州省">
    贵州省
  </Option>,
  <Option value="四川省" key="四川省">
    四川省
  </Option>,
  <Option value="云南省" key="云南省">
    云南省
  </Option>,
  <Option value="陕西省" key="陕西省">
    陕西省
  </Option>,
  <Option value="甘肃省" key="甘肃省">
    甘肃省
  </Option>,
  <Option value="黑龙江省" key="黑龙江省">
    黑龙江省
  </Option>,
  <Option value="香港特别行政区" key="香港特别行政区">
    香港特别行政区
  </Option>,
  <Option value="澳门特别行政区" key="澳门特别行政区">
    澳门特别行政区
  </Option>,
  <Option value="广西壮族自治区" key="广西壮族自治区">
    广西壮族自治区
  </Option>,
  <Option value="宁夏回族自治区" key="宁夏回族自治区">
    宁夏回族自治区
  </Option>,
  <Option value="新疆维吾尔自治区" key="新疆维吾尔自治区">
    新疆维吾尔自治区
  </Option>,
  <Option value="内蒙古自治区" key="内蒙古自治区">
    内蒙古自治区
  </Option>,
  <Option value="西藏自治区" key="西藏自治区">
    西藏自治区
  </Option>
];
//当前环节状态
const option4 = [
  <Option value="全部" key="全部">
    全部
  </Option>,
  <Option value={0} key="待办">
    待办
  </Option>,
  <Option value={1} key="抢办">
    抢办
  </Option>,
  <Option value={2} key="完成">
    完成
  </Option>
];
const medal = {
  金牌: jp,
  银牌: yp,
  铜牌: tp,
  标准: bg
};
const typeChToEn = {
  勘查: 'SURVEY',
  开通: 'OPENING',
  停闭: 'SHUTDOWN',
  变更勘查: 'ALTER_SURVEY',
  停机: 'ALTER_STOPPING',
  复机: 'ALTER_RESETTING',
  变更开通: 'ALTER_OPENING'
};
const currentState = {
  '0': '待办',
  '1': '抢办',
  '2': '完成'
};
class WorkTab extends React.Component {
  state = {
    wordOrderData: [],
    count: {},
    total: 0,
    pageNo: 1,
    pageSize: 10,
    type: typeChToEn[this.props.orderclass],
    chain: this.props.name,
    businessType: 0,
    securityLevel: '',
    status: '',
    customerProvince: '',
    customerNameLike: '',
    titleLike: ''
  };

  componentDidMount() {
    //根据父组件传递得工单类型和当前环节查询初始表格
    this.getOrderTableData(
      this.state.pageNo - 1,
      this.state.pageSize,
      this.state.type,
      this.state.chain,
      this.state.businessType,
      this.state.securityLevel,
      this.state.status,
      this.state.customerProvince,
      this.state.customerNameLike,
      this.state.titleLike
    );
  }

  // 监测到父组件传递的参数改变时触发
  componentWillReceiveProps(next) {
    // 当工单类型或环节改变时触发

    if (
      this.props.name === next.activeKey &&
      ((next.orderclass && this.props.orderclass !== next.orderclass) ||
        (next.activeKey && this.props.activeKey !== next.activeKey))
    ) {
      this.setState(
        {
          type: typeChToEn[next.orderclass],
          chain: next.activeKey
        },
        () => {
          this.getOrderTableData(
            this.state.pageNo - 1,
            this.state.pageSize,
            this.state.type,
            this.state.chain,
            this.state.businessType,
            this.state.securityLevel,
            this.state.status,
            this.state.customerProvince,
            this.state.customerNameLike,
            this.state.titleLike
          );
        }
      );
    }
  }
  // 分页器改变时触发
  onPageChange = (pageNo, pageSize) => {
    this.setState({ pageNo, pageSize }, () => {
      this.getOrderTableData(
        this.state.pageNo - 1,
        this.state.pageSize,
        this.state.type,
        this.state.chain,
        this.state.businessType,
        this.state.securityLevel,
        this.state.status,
        this.state.customerProvince,
        this.state.customerNameLike,
        this.state.titleLike
      );
    });
  };
  getOrderTableData = (
    currentPage,
    pageSize,
    type,
    chain,
    businessType,
    securityLevel,
    status,
    customerProvince,
    customerNameLike,
    titleLike
  ) => {
    const params1 = {
      currentPage,
      pageSize,
      type,
      chain,
      businessType,
      securityLevel,
      status,
      customerProvince,
      customerNameLike,
      titleLike
    };
    // params.businessType = params.businessType - 0;
    !params1.businessType && delete params1.businessType;
    params1.securityLevel === '全部' && delete params1.securityLevel;
    params1.status === '全部' && delete params1.status;
    params1.customerProvince === '全部' && delete params1.customerProvince;
    const params2 = {
      type,
      chain,
      businessType,
      securityLevel,
      status,
      customerProvince,
      customerNameLike,
      titleLike
    };
    !params2.businessType && delete params2.businessType;
    params2.securityLevel === '全部' && delete params2.securityLevel;
    params2.status === '全部' && delete params2.status;
    params2.customerProvince === '全部' && delete params2.customerProvince;
    // 获取资源工单各类型工单的统计信息
    postAxios('api/flows', params1, data => {
      const arr = [];
      data.results.map((item, index) => {
        item.key = index;
        arr.push(item);
        return arr;
      });
      this.setState({
        wordOrderData: arr,
        total: data.totalElements
      });
    });
    // 工单业务保障等级的分类统计
    postAxios('api/flows/stats/security_level', params2, data => {
      this.setState({
        count: data.values
      });
    });
  };
  // 点击查询时触发
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState(
          {
            pageNo: 1,
            businessType: values.businessType,
            securityLevel: values.securityLevel,
            status: values.status,
            customerProvince: values.customerProvince,
            customerNameLike: values.customerNameLike,
            titleLike: values.titleLike
          },
          () => {
            this.getOrderTableData(
              this.state.pageNo - 1,
              this.state.pageSize,
              this.state.type,
              this.state.chain,
              this.state.businessType,
              this.state.securityLevel,
              this.state.status,
              this.state.customerProvince,
              this.state.customerNameLike,
              this.state.titleLike
            );
          }
        );
      }
    });
  };
  // 点击重置时触发
  handlereset = () => {
    this.props.form.resetFields();
  };
  render() {
    const { wordOrderData, total, count } = this.state;
    const { getFieldDecorator } = this.props.form;
    // 表格列
    const columns = [
      {
        title: '工单标题',
        render: (text, record) => (
          <div title={record.title} className="control-line">
            {record.title}
          </div>
        ),
        align: 'left',
        width: '20%',
        key: 1
      },
      {
        title: '当前环节状态',
        render: (text, record) => <div>{currentState[record.status]}</div>,
        align: 'left',
        width: '7%',
        className: 'control-line',
        key: 2
      },
      {
        title: '业务保障等级',
        dataIndex: 'securityLevel',
        align: 'left',
        width: '8%',
        className: 'control-line',
        key: 3
      },
      {
        title: '业务类型',
        render: (text, reord) => (
          <div>
            {reord.businessType === 1 ? (
              <button className="policy">政企业务</button>
            ) : (
              <button className="inter">国际业务</button>
            )}
          </div>
        ),
        align: 'left',
        width: '10%',
        className: 'control-line',
        key: 4
      },

      {
        title: '客户名称',
        render: (text, record) => (
          <div className="client control-line" title={record.customerName}>
            <img alt="" src={medal[record.customerServiceLevel]} />
            <span>{record.customerName}</span>
          </div>
        ),
        align: 'left',
        width: '15%',
        key: 5
      },
      {
        title: '客户所属省',
        dataIndex: 'customerProvince',
        align: 'left',
        width: '15%',
        className: 'control-line',
        key: 6
      },
      {
        title: '派单时间',
        render: (text, record) => (
          <div>
            {moment(parseInt(record.sendTime)).format('YYYY-MM-DD hh:mm:ss')}
          </div>
        ),
        align: 'left',
        width: '15%',
        className: 'control-line',
        key: 7
      }
    ];
    return (
      <div className="word-tab">
        <div className="line1">
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
                })(<Select>{option2}</Select>)}
              </Form.Item>
              <Form.Item label="当前环节状态">
                {getFieldDecorator('status', {
                  initialValue: '全部'
                })(<Select>{option4}</Select>)}
              </Form.Item>
              <Form.Item label="客户所属省">
                {getFieldDecorator('customerProvince', {
                  initialValue: '全部'
                })(<Select>{option3}</Select>)}
              </Form.Item>
              <Form.Item label="工单标题">
                {getFieldDecorator('titleLike', {})(
                  <Input placeholder="请输入" autoComplete="off" />
                )}
              </Form.Item>
              <Form.Item label="客户名称">
                {getFieldDecorator('customerNameLike', {})(
                  <Input placeholder="请输入" autoComplete="off" />
                )}
              </Form.Item>
            </div>
            <div className="right">
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button onClick={this.handlereset}>重置</Button>
              </Form.Item>
            </div>
          </Form>
        </div>
        <div className="line2">
          <div>
            <span>AAA({formatNumber(count['AAA'])})</span>
          </div>
          <div>
            <span>AA({formatNumber(count['AA'])})</span>
          </div>
          <div>
            <span>A({formatNumber(count['A'])})</span>
          </div>
          <div>
            <span>普通({formatNumber(count['标准'])})</span>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={wordOrderData}
          className="workorder-table"
          rowKey={record => record.key}
          pagination={false}
        />
        <TablePagination
          {...{
            total: total,
            pageSize: this.state.pageSize,
            pageNumber: this.state.pageNo,
            handlePageChange: this.onPageChange,
            preventDefaultLoad: true
          }}
        />
      </div>
    );
  }
}
export default Form.create()(WorkTab);
