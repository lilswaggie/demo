import React from 'react';
import { Select, Input, Table, Checkbox, Form, Button } from 'antd';
import jp from '../../assets/image/business-manage/jp.svg';
import yp from '../../assets/image/business-manage/yp.svg';
import tp from '../../assets/image/business-manage/tp.svg';
import bg from '../../assets/image/business-manage/bg.svg';
import { formatNumber } from '../../util/CommonUtils';
import TablePagination from '../pub/TablePagination';
import { Link } from 'react-router-dom';
import { getAxios } from '../../axios/mainAxios';
const Search = Input.Search;
const Option = Select.Option;

const option1 = [
  <Option value="全部" key="1">
    全部
  </Option>,
  <Option value="AAA" key="2">
    AAA
  </Option>,
  <Option value="AA" key="3">
    AA
  </Option>,
  <Option value="A" key="4">
    A
  </Option>,
  <Option value="普通" key="5">
    普通
  </Option>
];

export const medal = {
  金牌: jp,
  银牌: yp,
  铜牌: tp,
  标准: bg
};

// const medal = [jp,yp,tp,bg];
class LineListTab extends React.Component {
  state = {
    businessType: this.props.businessType,
    securityLevel: '',
    customerIndustry: '',
    customerLike: '',
    nameLike: '',
    faultOnly: false,
    alarmOnly: false,
    pageNo: 1,
    pageSize: 10,
    count: {},
    LineListData: [],
    total: 0
  };
  componentDidMount() {
    // 首次加载传默认参数请求并展示数据
    this.getLineListData(
      this.state.pageNo - 1,
      this.state.pageSize,
      this.state.businessType,
      this.state.securityLevel,
      this.state.customerIndustry,
      this.state.customerLike,
      this.state.nameLike,
      this.state.faultOnly,
      this.state.alarmOnly
    );
  }
  componentWillReceiveProps(next) {
    if (this.props.activeKey !== next.activeKey && next.activeKey === '2') {
      //当tab再次切换到当前组件时触发
      this.getLineListData(
        this.state.pageNo - 1,
        this.state.pageSize,
        this.state.businessType,
        this.state.securityLevel,
        this.state.customerIndustry,
        this.state.customerLike,
        this.state.nameLike,
        this.state.faultOnly,
        this.state.alarmOnly
      );
    }
    // 当监控到父级选择的业务类型改变时执行
    if (this.props.businessType !== next.businessType) {
      this.setState(
        {
          pageNo: 1,
          businessType: next.businessType
        },
        () => {
          this.getLineListData(
            this.state.pageNo - 1,
            this.state.pageSize,
            this.state.businessType,
            this.state.securityLevel,
            this.state.customerIndustry,
            this.state.customerLike,
            this.state.nameLike,
            this.state.faultOnly,
            this.state.alarmOnly
          );
        }
      );
    }
  }
  // 请求专线列表展示需要数据
  getLineListData = (
    currentPage,
    pageSize,
    businessType,
    securityLevel,
    customerIndustry,
    customerLike,
    nameLike,
    faultOnly,
    alarmOnly
  ) => {
    // 专线数的分不同保障等级（AAA、AA、A、普通）的统计信息
    const params1 = {
      businessType,
      securityLevel,
      customerIndustry,
      customerLike,
      nameLike,
      faultOnly,
      alarmOnly
    };
    const params2 = {
      currentPage,
      pageSize,
      businessType,
      securityLevel,
      customerIndustry,
      customerLike,
      nameLike,
      faultOnly,
      alarmOnly
    };
    !params1.businessType && delete params1.businessType;
    !params2.businessType && delete params2.businessType;
    params1.securityLevel === '全部' && delete params1.securityLevel;
    params1.customerIndustry === '全部' && delete params1.customerIndustry;
    params2.securityLevel === '全部' && delete params2.securityLevel;
    params2.customerIndustry === '全部' && delete params2.customerIndustry;
    getAxios(
      'api/leased_lines/stats/security_level',
      params1,
      data => this.setState({ count: data.values })
    );
    // 查询专线列表
    getAxios(
      'api/leased_lines',
      params2,
      data => this.setState({ total: data.totalElements, LineListData: data.results })
    );
  };
  // 分页器改变时触发
  onPageChange = (pageNo, pageSize) => {
    this.setState({ pageNo, pageSize }, () =>
      this.getLineListData(
        this.state.pageNo - 1,
        this.state.pageSize,
        this.state.businessType,
        this.state.securityLevel,
        this.state.customerIndustry,
        this.state.customerLike,
        this.state.nameLike,
        this.state.faultOnly,
        this.state.alarmOnly
      )
    );
  };
  // 点击查询时触发
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        this.setState(
          {
            pageNo: 1,
            securityLevel: values.securityLevel,
            customerIndustry: values.customerIndustry,
            customerLike: values.customerLike,
            nameLike: values.nameLike
          },
          () => {
            this.getLineListData(
              this.state.pageNo - 1,
              this.state.pageSize,
              this.state.businessType,
              this.state.securityLevel,
              this.state.customerIndustry,
              this.state.customerLike,
              this.state.nameLike,
              this.state.faultOnly,
              this.state.alarmOnly
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
  // 点击仅显示故障专线时触发
  handleCheck = e => {
    // console.log(e.target.checked,'bools')
    this.setState(
      {
        pageNo: 1,
        faultOnly: e.target.checked,
        alarmOnly: e.target.checked
      },
      () => {
        this.getLineListData(
          this.state.pageNo - 1,
          this.state.pageSize,
          this.state.businessType,
          this.state.securityLevel,
          this.state.customerIndustry,
          this.state.customerLike,
          this.state.nameLike,
          this.state.faultOnly,
          this.state.alarmOnly
        );
      }
    );
  };
  render() {
    const { total, pageNo, pageSize, count, LineListData } = this.state;
    const { getFieldDecorator } = this.props.form;
    // 表格列
    const columns = [
      {
        title: '专线名称',
        render: (text, record) => (
          <div className="line-name" title={record.name}>
            <span
              style={
                record.faultState
                  ? { backgroundColor: '#F65F7B' }
                  : { backgroundColor: '' }
              }
            />
            <span>
              [
              {record.securityLevel === 'common'
                ? '普通'
                : record.securityLevel}
              ]
            </span>
            <span>{record.name}</span>
          </div>
        ),
        align: 'left',
        width: '25%',
        className: 'control-line',
        key: 1
      },
      {
        title: '业务类型',
        render: (text, reord) => (
          <div>
            {reord.businessType === 1 && (
              <button className="inter">国际业务</button>
            )}
            {reord.businessType === 2 && (
              <button className="policy">政企业务</button>
            )}
          </div>
        ),
        align: 'left',
        width: '10%',
        className: 'control-line',
        key: 2
      },
      {
        title: '行业',
        dataIndex: 'customerIndustry',
        align: 'left',
        width: '6%',
        className: 'control-line',
        key: 3
      },
      {
        title: '客户',
        render: (text, record) => (
          <div className="client">
            <img alt="" src={medal[record.customerServiceLevel]} />
            <span>{record.customerName}</span>
          </div>
        ),
        align: 'left',
        width: '17%',
        className: 'control-line',
        key: 4
      },
      {
        title: 'A端',
        render: (text, record) => (
          <div className="control-line" title={record.aNe.name}>
            <span>{record.aNe.name}</span>
          </div>
        ),
        // dataIndex:'aacsRoomEqName',
        align: 'left',
        width: '15%',
        className: 'control-line',
        key: 5
      },
      {
        title: 'Z端',
        render: (text, record) => (
          <div className="control-line" title={record.zNe.name}>
            <span>{record.zNe.name}</span>
          </div>
        ),
        // dataIndex:'zacsRoomEqName',
        align: 'left',
        width: '15%',
        className: 'control-line',
        key: 6
      },
      {
        title: '带宽',
        dataIndex: 'businessBandwidth',
        align: 'left',
        width: '7%',
        className: 'control-line',
        key: 7
      },
      {
        title: '操作',
        render: (text, record) => (
          <div style={{ color: '#2C9CFA' }}>
            <Link
              to={{
                pathname: '/main/business/line-detail',
                //state: {item:record},
                state: {
                  businessType: this.state.businessType,
                  lineInfo: record
                }
              }}
            >
              详情
            </Link>
          </div>
        ),
        align: 'left',
        width: '8%',
        className: 'control-line',
        key: 8
      }
    ];
    return (
      <div className="line-tab">
        <div className="line1">
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <Form.Item label="业务保障等级">
              {getFieldDecorator('securityLevel', {
                initialValue: '全部'
              })(<Select style={{ width: '11rem' }}>{option1}</Select>)}
            </Form.Item>
            <Form.Item label="所属行业">
              {getFieldDecorator('customerIndustry', {
                initialValue: '全部'
              })(
                <Select style={{ width: '11rem' }}>
                  {this.props.industryOption}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="所属客户">
              {getFieldDecorator('customerLike', {})(
                <Input
                  placeholder="请输入"
                  style={{ width: '10rem' }}
                  autoComplete="off"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('nameLike', {})(
                <Search
                  placeholder="按专线名称搜索，支持模糊搜索"
                  autoComplete="off"
                />
              )}
            </Form.Item>
            <Form.Item style={{ float: 'right' }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: '0.8rem', fontSize: '0.75rem' }}
              >
                查询
              </Button>
              <Button
                onClick={this.handlereset}
                style={{ fontSize: '0.75rem' }}
              >
                重置
              </Button>
            </Form.Item>
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
            <span>普通({formatNumber(count['common'])})</span>
          </div>
          <div>
            <Checkbox onChange={this.handleCheck}>仅显示故障专线</Checkbox>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={LineListData}
          className="busimanage-table"
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
    );
  }
}
export default Form.create()(LineListTab);
