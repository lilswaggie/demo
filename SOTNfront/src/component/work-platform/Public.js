import React, { Component } from 'react';

import { Divider, Table, message } from 'antd';

import moment from 'moment';

import { getAxios } from '../../axios/mainAxios';

import TablePagination from '../pub/TablePagination';
import Default from './Default';
import NoticeDetailModal from '../notice/NoticeDetailModal';
import { EXPIRE_TIME_FORMAT } from '../../container/NoticeManagerPage';

import './css/work-plateform.scss';

window.moment = moment;
export default class Public extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      publicColumns: [
        {
          title: '主题',
          dataIndex: 'name',
          key: 'name',
          width: '50%'
        },
        {
          title: '影响范围',
          dataIndex: 'influence',
          key: 'influence',
          render: text => text || '无'
        },
        {
          title: '发布时间',
          dataIndex: 'lastModifiedAt',
          key: 'lastModifiedAt',
          width: '15%',
          render: text =>
            !text ? '-' : moment(text - 0).format(EXPIRE_TIME_FORMAT)
        }
      ],
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      preventDefaultLoad: false,
      modalName: '',
      noticeDetailVisible: false,
      noticeItem: {}
    };
  }

  loadData = (currentPage, pageSize) => {
    if (currentPage <= 0) {
      message.error('页码超出范围');
      return;
    }
    this.setState({ preventDefaultLoad: false });
    getAxios(
      '/api/announcements',
      { currentPage: currentPage - 1, pageSize },
      data => {
        // success
        this.setState({
          data: data.results,
          preventDefaultLoad: true,
          total: data.totalElements,
          pageNumber: currentPage,
          pageSize: pageSize
        });
      },
      data => {
        // fail
        message.error(data.message);
        this.setState({ preventDefaultLoad: true });
      }
    );
  };
  showNoticeDetail = record => () => {
    const noticeItem = {
      name: record.name,
      content: record.content,
      influence: record.influence,
      expire: !record.expire ? 1 : 2,
      expireTime: !record.expire ? null : moment(record.expire)
    };
    this.setState({
      modalName: '公告详情',
      noticeItem,
      noticeDetailVisible: true
    });
  };
  onCloseNoticeModal = visibleName => () =>
    this.setState({ [visibleName]: false, noticeItem: {} });

  render() {
    return (
      <div id="public">
        <section>
          <header className="header">
            <span>
              <Divider type="vertical" className="divider" />
              <span>最新公告</span>
            </span>
          </header>
        </section>
        <section>
          <Table
            onRow={record => {
              return { onClick: this.showNoticeDetail(record) };
            }}
            rowKey={record => record.id}
            columns={this.state.publicColumns}
            dataSource={this.state.data}
            pagination={false}
          />
          <TablePagination
            pageSize={this.state.pageSize}
            pageNumber={this.state.pageNumber}
            total={this.state.total}
            preventDefaultLoad={this.state.preventDefaultLoad}
            handlePageChange={this.loadData}
          />
          <Default show={!this.state.total} reminder={'暂无数据'} />
        </section>
        <NoticeDetailModal
          modalName={this.state.modalName}
          visible={this.state.noticeDetailVisible}
          onHandleCancel={this.onCloseNoticeModal('noticeDetailVisible')}
          formValue={this.state.noticeItem}
        />
      </div>
    );
  }
}
//css
