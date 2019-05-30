import React from 'react';
import { Select, Input, Icon, Progress, Form, Button } from 'antd';
import jp from '../../assets/image/business-manage/jp.svg';
import yp from '../../assets/image/business-manage/yp.svg';
import tp from '../../assets/image/business-manage/tp.svg';
import bg from '../../assets/image/business-manage/bg.svg';
import { formatNumber } from '../../util/CommonUtils';
import { getAxios } from '../../axios/mainAxios';
import TablePagination from '../pub/TablePagination';
import { Link } from 'react-router-dom';
const Search = Input.Search;
const Option = Select.Option;

const option2 = [
  <Option value="全部" key="6">
    全部
  </Option>,
  <Option value="金牌" key="7">
    金牌客户
  </Option>,
  <Option value="银牌" key="8">
    银牌客户
  </Option>,
  <Option value="铜牌" key="9">
    铜牌客户
  </Option>,
  <Option value="标准" key="10">
    标准客户
  </Option>
];
const medal = {
  金牌: jp,
  银牌: yp,
  铜牌: tp,
  标准: bg
};
class ClientListTab extends React.Component {
  state = {
    count: {},
    industry: '',
    level: '',
    nameLike: '',
    clientListData: [],
    total: 0,
    pageNo: 1,
    pageSize: 8
  };
  componentDidMount() {
    // 首次加载传默认参数请求并展示数据
    this.getClientListData(
      this.state.pageNo - 1,
      this.state.pageSize,
      this.state.industry,
      this.state.level,
      this.state.nameLike
    );
  }
  componentWillReceiveProps(next) {
    if (this.props.activeKey !== next.activeKey && next.activeKey === '1') {
      //当tab再次切换到当前组件时触发
      this.getClientListData(
        this.state.pageNo - 1,
        this.state.pageSize,
        this.state.industry,
        this.state.level,
        this.state.nameLike
      );
    }
  }

  // 请求客户列表展示需要数据
  getClientListData = (currentPage, pageSize, industry, level, nameLike) => {
    // 查询客户的分不同服务等级的统计
    const params1 = { industry, level, nameLike };
    const params2 = {
      currentPage,
      pageSize,
      industry,
      level,
      nameLike
    };
    params1.industry === '全部' && delete params1.industry;
    params1.level === '全部' && delete params1.level;
    params2.industry === '全部' && delete params2.industry;
    params2.level === '全部' && delete params2.level;
    getAxios('api/customers/stats/num/level', params1, data =>
      this.setState({ count: data.values })
    );
    // 查询客户列表
    getAxios('api/customers', params2, data =>
      this.setState({ total: data.totalElements, clientListData: data.results })
    );
  };
  // 分页器改变时触发
  onPageChange = (pageNo, pageSize) => {
    this.setState({ pageNo, pageSize }, () =>
      this.getClientListData(
        this.state.pageNo - 1,
        this.state.pageSize,
        this.state.industry,
        this.state.level,
        this.state.nameLike
      )
    );
  };
  // 点击查询时触发
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState(
          {
            pageNo: 1,
            industry: values.industry,
            level: values.level,
            nameLike: values.nameLike
          },
          () =>
            this.getClientListData(
              this.state.pageNo - 1,
              this.state.pageSize,
              this.state.industry,
              this.state.level,
              this.state.nameLike
            )
        );
      }
    });
  };
  // 点击重置时触发
  handlereset = () => {
    this.props.form.resetFields();
  };
  render() {
    const { clientListData, total, pageNo, pageSize, count } = this.state;
    const { getFieldDecorator } = this.props.form;
    const clientList = [];
    if (clientListData.length !== 0) {
      clientListData.forEach((item, index) => {
        // let bool = index <= pageNo * pageSize - 1 && index >= (pageNo-1) * pageSize;
        clientList.push(
          <Link
            className="item"
            key={index}
            to={{
              pathname: '/main/business/client-detail',
              state: { clientInfo: item }
            }}
          >
            <div>
              <div className="firstline">
                <span>{item.name}</span> <img alt="" src={medal[item.level]} />
              </div>
              <p>
                <span>所属行业：</span>
                <span>{item.industry}</span>
              </p>
              <div className="line">
                <div className="sum">
                  <div className="tit">专线数</div>
                  <div className="cont">
                    <span>{item.leasedLines}</span>
                    <span>条</span>
                    <Icon
                      type="arrow-up"
                      theme="outlined"
                      style={
                        item.leasedLineRatio > 0
                          ? { display: 'inline' }
                          : { display: 'none' }
                      }
                    />
                    <Icon
                      type="arrow-down"
                      theme="outlined"
                      style={
                        item.leasedLineRatio < 0
                          ? { display: 'inline' }
                          : { display: 'none' }
                      }
                    />
                    <span
                      style={
                        item.leasedLineRatio === 0
                          ? { display: 'inline' }
                          : { display: 'none' }
                      }
                    >
                      —
                    </span>
                    {Math.abs(item.leasedLineRatio)}
                  </div>
                </div>
                <div className="fault">
                  <div className="tit">故障专线数</div>
                  <div className="cont">
                    <span>{item.faultLeasedLines}</span>
                    <span>条</span>
                    <Progress
                      percent={Math.round(
                        (item.faultLeasedLines / item.leasedLines) * 100
                      )}
                    />
                  </div>
                </div>
              </div>
              <div>
                <button
                  className="policy"
                  style={
                    item.businessTypes.indexOf(2) !== -1
                      ? { display: 'inline-block' }
                      : { display: 'none' }
                  }
                >
                  政企业务
                </button>
                <button
                  className="inter"
                  style={
                    item.businessTypes.indexOf(1) !== -1
                      ? { display: 'inline-block' }
                      : { display: 'none' }
                  }
                >
                  国际业务
                </button>
              </div>
            </div>
          </Link>
        );
      });
    }
    return (
      <div className="client-tab">
        <div className="line1">
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <Form.Item label="所属行业">
              {getFieldDecorator('industry', {
                initialValue: '全部'
              })(
                <Select style={{ width: '12rem', marginRight: '3rem' }}>
                  {this.props.industryOption}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="客户服务等级">
              {getFieldDecorator('level', {
                initialValue: '全部'
              })(
                <Select style={{ width: '12rem', marginRight: '3rem' }}>
                  {option2}
                </Select>
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('nameLike', {})(
                <Search
                  placeholder="按客户名称搜索，支持模糊搜索"
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
            <img alt="" src={jp} />
            <span>金牌({formatNumber(count['金牌'])})</span>
          </div>
          <div>
            <img alt="" src={yp} />
            <span>银牌({formatNumber(count['银牌'])})</span>
          </div>
          <div>
            <img alt="" src={tp} />
            <span>铜牌({formatNumber(count['铜牌'])})</span>
          </div>
          <div>
            <img alt="" src={bg} />
            <span>标准({formatNumber(count['标准'])})</span>
          </div>
        </div>
        <div className="list">{clientList}</div>
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
export default Form.create()(ClientListTab);
