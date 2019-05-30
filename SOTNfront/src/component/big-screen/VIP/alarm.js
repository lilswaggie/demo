import React, { Component } from 'react';

import { getAxios } from '../../../axios/mainAxios';

// 确认状态标识
const ackStateMap = {
  '0': {
    text: '未确认',
    clazz: 'wqrgj'
  },
  '1': {
    text: '已确认',
    clazz: 'yqrgj'
  }
};
// 派单状态标识
const pdStatusMap = {
  '0': {
    text: '未派单',
    clazz: 'wpd'
  },
  '1': {
    text: '等待派单',
    clazz: 'ddpd'
  },
  '2': {
    text: '人工终止派单',
    clazz: 'rgzzpd'
  },
  '3': {
    text: '系统抑制派单',
    clazz: 'xtyzpd'
  },
  '4': {
    text: '派单失败',
    clazz: 'pdsb'
  },
  '5': {
    text: '自动派单成功',
    clazz: 'zdpdcg'
  },
  '6': {
    text: '手工派单成功',
    clazz: 'sgpdcg'
  }
};

export default class Alarm extends Component {
  state = {
    alarmList: [],
    alarmNum: {},
    alarmTotal: 0,
    params: {
      currentPage: 1,
      pageSize: 10
    },
    totalPages: 0
  };
  loadData = props => {
    let { params } = this.state;
    //if(totalPages > params.currentPage) return;
    getAxios(
      '/api/alarms',
      { ...params, ...props, currentPage: params.currentPage - 1 },
      data => {
        if (this.state.params.currentPage === 1) {
          document.getElementById('alarmScroll').scrollTop = 0;
          this.setState({
            alarmList: data.results,
            totalPages: data.totalPages
          });
        } else {
          this.setState(prevState => ({
            alarmList: [...prevState.alarmList, ...data.results],
            totalPages: data.totalPages
          }));
        }
      }
    );
  };
  loadAlarmNum = props => {
    getAxios('api/alarms/stats/num/severity', { ...props }, data =>
      this.setState({ alarmNum: data.values, alarmTotal: data.summary })
    );
  };
  orderScroll = () => {
    let nDivHeight = document.getElementById('alarmScroll').offsetHeight;
    let nScrollHeight = document.getElementById('alarmScroll').scrollHeight;
    let nScrollTop = document.getElementById('alarmScroll').scrollTop;
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
      .getElementById('alarmScroll')
      .removeEventListener('scroll', this.orderScroll);
  }
  componentDidMount() {
    document
      .getElementById('alarmScroll')
      .addEventListener('scroll', this.orderScroll);
    this.loadData();
    this.loadAlarmNum();
  }
  componentWillReceiveProps(nextProps) {
    let { leasedLine } = nextProps;
    let { leasedLine: self_leasedLine } = this.props;
    if (leasedLine === self_leasedLine) {
      return;
    }
    this.setState(
      prevState => ({
        params: { ...prevState.params, currentPage: 1, totalPages: 0 }
      }),
      (this.loadData({ leasedLine }), this.loadAlarmNum({ leasedLine }))
    );
  }
  render() {
    let { alarmList, alarmNum, alarmTotal } = this.state;
    return (
      <div id="alarm">
        <div className="content-title">活动告警</div>
        <div id="header">
          <span id="title">网元名</span>
          <span id="legend">
            <span className="label all">{alarmTotal}</span>
            <span className="label one">{alarmNum['1'] || 0}</span>
            <span className="label two">{alarmNum['2'] || 0}</span>
            <span className="label three">{alarmNum['3'] || 0}</span>
            <span className="label four">{alarmNum['4'] || 0}</span>
          </span>
        </div>
        <table>
          <thead>
            <tr>
              <th className="status">状态标识</th>
              <th className="level">告警级别</th>
              <th className="title">告警标题</th>
              <th className="time">告警时间</th>
            </tr>
          </thead>
          <tbody id="alarmScroll">
            {alarmList.map((item, index) => {
              return (
                <tr key={index}>
                  <td className="status">
                    <span className={ackStateMap[item.ackState].clazz} />
                    <span
                      className={item.standardFlag === 2 ? 'ybzh' : 'wbzh'}
                    />
                    <span className={item.alarmMemo ? 'ybz' : 'wbz'} />
                    <span className={pdStatusMap[item.sheetSendStatus].clazz} />
                  </td>
                  <td className="level">
                    <span
                      className={[
                        item.severity === 1 ? 'one' : '',
                        item.severity === 2 ? 'two' : '',
                        item.severity === 3 ? 'three' : '',
                        item.severity === 4 ? 'four' : ''
                      ].join(' ')}
                    >
                      {[
                        item.severity === 1 ? '一级告警' : '',
                        item.severity === 2 ? '二级告警' : '',
                        item.severity === 3 ? '三级告警' : '',
                        item.severity === 4 ? '四级告警' : ''
                      ].join(' ')}
                    </span>
                  </td>
                  <td className="title">{item.title}</td>
                  <td className="time">{item.alarmedAt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
