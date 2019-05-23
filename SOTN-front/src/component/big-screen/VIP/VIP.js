import React, { Component } from 'react';
import { Select, message } from 'antd';

import ImportantClient from './important-client';
import SpecialLine from './special-line';
import Alarm from './alarm';
import QualityQuota from './quality-quota';
import Area from './area';
import Topo from './topo';

import '../css/vip.scss';
import { getAxios } from '../../../axios/mainAxios';

const Option = Select.Option;

export default class VIP extends Component {
  state = {
    displayTopo: false,
    lineInfo: {},
    sceneId: '',
    businessType: 0,
    sceneList: [],
    clientInfo: {}
  };
  /**
   * 选择客户
   * */
  chooseClient = clientInfo => {
    if (clientInfo.id === this.state.clientInfo.id) {
      this.setState({ clientInfo: {} });
    } else {
      this.setState({ clientInfo });
    }
    this.hideTopo();
  };
  /**
   * 选择专线
   * */
  chooseLine = lineInfo => this.setState({ lineInfo, displayTopo: true });
  /**
   * 隐藏拓扑
   * */
  hideTopo = () => {
    this.setState({ displayTopo: false, lineInfo: {} });
  };
  /**
   * 选择业务
   * */
  chooseBusiness = businessType => {
    this.setState({ businessType });
  };
  /**
   * 改变场景
   * */
  chooseScene = sceneId =>
    this.setState({ sceneId, clientInfo: {} }, () => {
      this.hideTopo();
    });
  /**
   * 加载重保场景数据
   * */
  loadScene = () => {
    getAxios(
      '/api/scene',
      {},
      data => {
        //success
        this.setState({
          sceneList: data,
          sceneId: data.length ? data[0].sceneId : ''
        });
      },
      data => {
        //fail
        message.error(data.message);
      }
    );
  };
  componentDidMount() {
    this.loadScene();
  }
  render() {
    return (
      <div id="important-client">
        <div id="header">
          <span>重保客户</span>
          <Select
            id="sceneList"
            defaultValuevalue=""
            value={this.state.sceneId}
            onChange={this.chooseScene}
          >
            {this.state.sceneList.length > 0 &&
              this.state.sceneList.map(item => (
                <Option className="sceneOption" key={item.sceneId}>
                  {item.sceneName}
                </Option>
              ))}
          </Select>
        </div>
        <div id="content">
          <ImportantClient
            chooseClient={this.chooseClient}
            sceneId={this.state.sceneId}
            clientInfo={this.state.clientInfo}
          />
          <div className="right">
            {!this.state.displayTopo ? (
              <Area
                sceneId={this.state.sceneId}
                customer={this.state.clientInfo.id || ''}
                businessType={this.state.businessType}
                chooseBusiness={this.chooseBusiness}
              />
            ) : (
              <Topo lineInfo={this.state.lineInfo} back={this.hideTopo} />
            )}
            <SpecialLine
              sceneId={this.state.sceneId}
              customer={this.state.clientInfo.id || ''}
              businessType={this.state.businessType}
              lineInfo={this.state.lineInfo}
              chooseLine={this.chooseLine}
            />
            {!this.state.displayTopo ? (
              <QualityQuota
                sceneId={this.state.sceneId}
                customer={this.state.clientInfo.name || ''}
                customerId={this.state.clientInfo.id || ''}
                businessType={this.state.businessType}
              />
            ) : (
              <Alarm leasedLine={this.state.lineInfo.name || ''} />
            )}
          </div>
        </div>
      </div>
    );
  }
}
