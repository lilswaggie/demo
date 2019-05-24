import React, { Component } from 'react';

import { Icon } from 'antd';

import { getAxios } from '../../../axios/mainAxios';
export default class ImportantClient extends Component {
  state = {
    clientList: [],
    filterClientList: [],
    faultNum: 0,
    inputValue: ''
  };

  handleGetInputValue = event => {
    this.setState(
      {
        inputValue: event.target.value
      },
      () => {
        this.searchClient();
      }
    );
  };
  searchClient = () => {
    let filterClientList = this.state.clientList.filter(item => {
      return item.name.indexOf(this.state.inputValue) !== -1;
    });
    this.setState({ filterClientList });
  };
  /**
   * 加载重保客户
   * */
  loadClient = sceneId => {
    getAxios('/api/scene/' + sceneId + '/customers', {}, data => {
      this.setState({ clientList: data, filterClientList: data });
    });
  };
  loadClientFaultNum = sceneId => {
    getAxios('/api/scene/' + sceneId + '/customers/fault', {}, data => {
      this.setState({ faultNum: data });
    });
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.sceneId !== nextProps.sceneId) {
      this.loadClient(nextProps.sceneId);
      this.loadClientFaultNum(nextProps.sceneId);
    }
  }
  render() {
    let { clientInfo } = this.props;
    let { filterClientList, clientList, faultNum } = this.state;
    return (
      <div id="important-client-list">
        <div className="content-title">重保客户</div>
        <div id="client-overview">
          <div>
            <span>客户总数&nbsp;</span>
            <span className="digital num-normal">{clientList.length}</span>
          </div>
          <div>
            <span>故障客户总数&nbsp;</span>
            <span className="digital num-error">{faultNum}</span>
          </div>
        </div>
        <div id="client-search">
          <input
            type="text"
            placeholder="按客户姓名搜索"
            onChange={this.handleGetInputValue}
          />
          <Icon
            type="search"
            style={{ fontSize: '25px', color: '#fff' }}
            onClick={this.searchClient}
          />
        </div>
        <div id="client-list">
          {filterClientList.map((value, index) => {
            return (
              <div
                key={index}
                onClick={() => this.props.chooseClient(value)}
                className={[
                  'item',
                  clientInfo && clientInfo.id === value.id ? 'active' : ''
                ].join(' ')}
              >
                <span className="index">{index + 1}</span>
                <span className="badge gold" />
                <img alt="" src={require('../imgs/jiansheyinhang@2x.png')} />
                <span
                  className="content"
                  style={{
                    backgroundSize: `20px 10px, ${(value.faultLeasedLines /
                      value.leasedLines) *
                      300}px 10px, 300px 10px`
                  }}
                >
                  <span className="company">{value.name}</span>
                  <span className="value">
                    <span className="num-error">{value.faultLeasedLines}</span>
                    <span className="num-normal">/{value.leasedLines}</span>
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
