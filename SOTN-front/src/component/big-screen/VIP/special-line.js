import React, { Component } from 'react';

import { Radio } from 'antd';

import { getAxios } from '../../../axios/mainAxios';

const RadioGroup = Radio.Group;

export default class SpecialLine extends Component {
  state = {
    params: {
      currentPage: 1,
      pageSize: 10,
      faultOnly: false
    },
    totalPages: 1,
    lineList: [],
    lineNum: {}
  };

  orderScroll = () => {
    let nDivHeight = document.getElementById('lineScroll').offsetHeight;
    let nScrollHeight = document.getElementById('lineScroll').scrollHeight;
    let nScrollTop = document.getElementById('lineScroll').scrollTop;
    if (nScrollTop + nDivHeight + 10 >= nScrollHeight) {
      let pageIndex = this.state.params.currentPage + 1;
      this.setState(
        prevState => ({
          params: { ...prevState.params, currentPage: pageIndex }
        }),
        this.loadData()
      );
    }
  };

  componentWillUnmount() {
    document
      .getElementById('lineScroll')
      .removeEventListener('scroll', this.orderScroll.bind(this));
  }

  componentDidMount() {
    document
      .getElementById('lineScroll')
      .addEventListener('scroll', this.orderScroll.bind(this));
    this.loadData();
    this.loadLineNum();
  }

  onChange = e => {
    this.setState(
      prevState => ({
        params: {
          ...prevState.params,
          faultOnly: e.target.value,
          currentPage: 1
        }
      }),
      this.loadData
    );
  };

  loadData = (nextProps = this.props) => {
    if (nextProps.sceneId || nextProps.customer) {
      let { params } = this.state;
      let requestParams = {
        ...params,
        ...nextProps,
        currentPage: params.currentPage - 1
      };
      requestParams.faultOnly && (requestParams.alarmOnly = true);
      requestParams.customer && delete requestParams.sceneId;
      !requestParams.businessType && delete requestParams.businessType;
      getAxios('/api/leased_lines', requestParams, data => {
        if (this.state.params.currentPage === 1) {
          document.getElementById('lineScroll').scrollTop = 0;
          this.setState({
            lineList: data.results,
            totalPages: data.totalPages
          });
        } else {
          this.setState(prevState => ({
            lineList: [...prevState.lineList, ...data.results],
            totalPages: data.totalPages
          }));
        }
      });
    }
  };
  loadLineNum = (nextProps = this.props) => {
    if (nextProps.sceneId || nextProps.customer) {
      let { params } = this.state;
      let requestParams = { ...params, ...nextProps };
      delete requestParams.currentPage;
      delete requestParams.pageSize;
      requestParams.faultOnly && (requestParams.alarmOnly = true);
      requestParams.customer && delete requestParams.sceneId;
      !requestParams.customer && delete requestParams.customer;
      !requestParams.businessType && delete requestParams.businessType;
      console.log(requestParams);
      getAxios('/api/leased_lines/stats/num/fault', requestParams, data =>
        this.setState({ lineNum: data })
      );
    }
  };

  componentWillReceiveProps(nextProps) {
    let { customer, sceneId, businessType } = nextProps;
    let {
      customer: self_customer,
      sceneId: self_sceneId,
      businessType: self_businessType
    } = this.props;
    if (
      customer === self_customer &&
      sceneId === self_sceneId &&
      businessType === self_businessType
    ) {
      return;
    }
    this.setState(
      prevState => ({
        params: { ...prevState.params, currentPage: 1 }
      }),
      this.loadData({ customer, sceneId, businessType })
    );
    this.loadLineNum({ customer, sceneId, businessType });
  }

  render() {
    return (
      <div id="special-line">
        <div className="content-title">专线列表</div>
        <RadioGroup
          onChange={this.onChange}
          value={this.state.params.faultOnly}
        >
          <Radio value={false}>
            全部专线
            <span className="num-normal">
              &nbsp;&nbsp;{this.state.lineNum.total}
            </span>
          </Radio>
          <Radio value={true}>
            故障专线
            <span className="num-normal">
              &nbsp;&nbsp;{this.state.lineNum.fault}
            </span>
          </Radio>
        </RadioGroup>
        <table>
          <thead>
            <tr>
              <th>专线名称</th>
              <th>业务类型</th>
              <th>A-Z端省</th>
              <th>带宽</th>
              <th>一级警告</th>
            </tr>
          </thead>
          <tbody id="lineScroll">
            {this.state.lineList.map((item, index) => (
              <tr
                className={
                  this.props.lineInfo && this.props.lineInfo.id === item.id
                    ? 'active'
                    : ''
                }
                key={index}
                onClick={() => this.props.chooseLine(item)}
              >
                <td title={item.circuitName}>
                  [{item.securityLevel}]{item.circuitName}
                </td>
                <td>{item.businessType}</td>
                <td title={[item.aprovince, item.zprovince].join('-')}>
                  {item.aprovince}-{item.zprovince}
                </td>
                <td>{item.businessBandwidth}</td>
                <td>{item.firstLevelAlarmNum}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
