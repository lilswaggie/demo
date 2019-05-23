import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Table, Menu, Icon, Dropdown, Tooltip } from 'antd';

import moment from 'moment';

import PropTypes from 'prop-types';

import { formatNumber } from '../../util/CommonUtils';

// 确认
import wqrgj from '../../assets/image/business-fault/wqrgj.svg';
import yqrgj from '../../assets/image/business-fault/yqrgj.svg';
// 备注
import wbz from '../../assets/image/business-fault/wbz.svg';
import ybz from '../../assets/image/business-fault/ybz.svg';
// 标准化
import ybzh from '../../assets/image/business-fault/ybzh.svg';
import wbzh from '../../assets/image/business-fault/wbzh.svg';
// 派单
import wpd from '../../assets/image/business-fault/wpd.svg';
import ddpd from '../../assets/image/business-fault/ddpd.svg';
import rgzzpd from '../../assets/image/business-fault/rgzzpd.svg';
import xtyzpd from '../../assets/image/business-fault/xtyzpd.svg';
import pdsb from '../../assets/image/business-fault/pdsb.svg';
import zdpdcg from '../../assets/image/business-fault/zdpdcg.svg';
import sgpdcg from '../../assets/image/business-fault/sgpdcg.svg';

// import zd from '../../assets/image/alarm/topped.png';
// import qxzd from '../../assets/image/alarm/topped-disabled.png';

import '../../assets/css/modal.scss';
import TablePagination from './TablePagination';

// 告警级别中文对应名称
export const alarmCh = [
  {
    name: '一级告警',
    color: '#FF6464'
  },
  {
    name: '二级告警',
    color: '#FFEC6F'
  },
  {
    name: '三级告警',
    color: '#FFA85A'
  },
  {
    name: '四级告警',
    color: '#8BBCFE'
  }
];
// 确认状态标识
const ackStateMap = {
  '0': {
    text: '未确认',
    image: wqrgj
  },
  '1': {
    text: '已确认',
    img: yqrgj
  }
};
// 派单状态标识
const pdStatusMap = {
  '0': {
    text: '未派单',
    image: wpd
  },
  '1': {
    text: '等待派单',
    image: ddpd
  },
  '2': {
    text: '人工终止派单',
    image: rgzzpd
  },
  '3': {
    text: '系统抑制派单',
    image: xtyzpd
  },
  '4': {
    text: '派单失败',
    image: pdsb
  },
  '5': {
    text: '自动派单成功',
    image: zdpdcg
  },
  '6': {
    text: '手工派单成功',
    image: sgpdcg
  }
};

export default class WarnModal extends Component {
  static propTypes = {
    // 区分是网络故障，还是业务故障页面。关于顶部菜单的显示问题。 network | business
    pathName: PropTypes.string,
    warnSummary: PropTypes.number,
    warnCountValues: PropTypes.object,
    warnList: PropTypes.array,
    title: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    totalCount: PropTypes.number,
    onPageChange: PropTypes.func
  };

  static defaultProps = {
    pathName: 'business',
    warnSummary: 0,
    warnCountValues: {},
    warnList: [],
    pageNum: 1,
    pageSize: 10,
    totalCount: 0,
    onPageChange: () => {}
  };

  // onRowSelection = {
  //     onChange: (selectedRowKeys, selectedRows) => {
  //         console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  //     }
  // };

  getOperateMenu = alarm => (
    <Menu>
      <Menu.Item>
        <Link
          to={{
            pathname: `/main/fault/${this.props.pathName}/alarm-detail`,
            state: { alarm }
          }}
        >
          告警详情
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link
          to={{
            pathname: `/main/fault/${this.props.pathName}/influence`,
            state: { alarm }
          }}
        >
          影响分析
        </Link>
      </Menu.Item>
    </Menu>
  );

  render() {
    // 操作选项

    // 表格列
    const columns = [
      {
        title: '状态标识',
        render: (text, record) => (
          <div>
            <Tooltip title={ackStateMap[record.ackState].text}>
              <img alt="" src={ackStateMap[record.ackState].image} />
            </Tooltip>
            <Tooltip title={record.alarmMemo ? '已备注' : '未备注'}>
              <img alt="" src={record.alarmMemo ? ybz : wbz} />
            </Tooltip>
            <Tooltip
              title={record.standardFlag === 2 ? '已标准化' : '未标准化'}
            >
              <img alt="" src={record.standardFlag === 2 ? ybzh : wbzh} />
            </Tooltip>
            <Tooltip title={pdStatusMap[record.sheetSendStatus].text}>
              <img alt="" src={pdStatusMap[record.sheetSendStatus].image} />
            </Tooltip>
          </div>
        ),
        align: 'center',
        width: '15%',
        key: '1'
      },
      {
        title: '告警级别',
        render: (text, record) => (
          <div
            className="alarm"
            style={{
              backgroundColor: `${alarmCh[record.severity - 1].color}`
            }}
          >
            {alarmCh[record.severity - 1].name}
          </div>
        ),
        align: 'center',
        width: '15%',
        key: '2'
      },
      {
        title: '告警标题',
        dataIndex: 'title',
        align: 'left',
        width: '15%',
        className: 'control-line',
        key: '3'
      },
      {
        title: '告警对象',
        dataIndex: 'elementName',
        align: 'left',
        width: '10%',
        className: 'control-line',
        key: '4'
      },
      {
        title: '影响的专线数',
        render: (text, record) => (
          <div style={{ color: '#2C9CFA' }}>{record.affectedLeasedLineNum}</div>
        ),
        align: 'center',
        width: '15%',
        key: '5'
      },
      {
        title: '告警时间',
        dataIndex: 'alarmedAt',
        align: 'center',
        width: '14%',
        className: 'control-line',
        render: (text, record) =>
          moment(record.alarmedAt - 0).format('YYYY-MM-DD HH:mm'),
        key: '6'
      },
      {
        title: '操作',
        render: (text, record) => (
          <Dropdown overlay={this.getOperateMenu(record)}>
            <span style={{ color: '#2C9CFA' }}>
              操作
              <Icon type="down" />
            </span>
          </Dropdown>
        ),
        align: 'center',
        width: '11%',
        key: '7'
      }
    ];

    const { warnSummary, warnCountValues, warnList, title } = this.props;
    return (
      <div className="line-modal">
        <div className="tableChoose">
          <div className="alarm-line1">
            {title && <span className="warn-title">{title}</span>}
            <div className="circle">
              <div className="item">
                <div className="comm">
                  <div className="top" />
                  <div className="right" />
                  <div className="bottom" />
                  <div className="left" />
                </div>
                <span>{formatNumber(warnSummary)}</span>
              </div>
              {[
                { key: '1', color: '#FF6464' },
                { key: '2', color: '#FFA85A' },
                { key: '3', color: '#FFEC6F' },
                { key: '4', color: '#8BBCFE' }
              ].map((item, idx) => (
                <span className="item" key={idx}>
                  <span
                    style={{ backgroundColor: `${item.color}` }}
                    className="comm"
                  />
                  <span>{formatNumber(warnCountValues[item.key])}</span>
                </span>
              ))}
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={warnList}
            className="busifault-table"
            rowKey={(record, idx) => idx + ''}
            pagination={false}
            // rowSelection={this.onRowSelection}
            scroll={{ y: '24rem' }}
          />
          <TablePagination
            pageSize={this.props.pageSize}
            pageNumber={this.props.pageNum}
            total={this.props.totalCount}
            preventDefaultLoad={true}
            handlePageChange={this.props.onPageChange}
          />
        </div>
      </div>
    );
  }
}
