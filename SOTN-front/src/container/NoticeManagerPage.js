import React, { Component } from 'react';

import { Button, Table, Select, message } from 'antd';

import moment from 'moment';

import { getAxios, postAxios, putAxios, deleteAxios } from '../axios/mainAxios';

import NoticeEditModal from '../component/notice/NoticeEditModal';
import NoticeDetailModal from '../component/notice/NoticeDetailModal';
import TablePagination from '../component/pub/TablePagination';

import '../assets/css/notice/notice.scss';

const Option = Select.Option;

const statusNameMap = {
  TB_PUBLISH: '未发布',
  PUBLISHED: '已发布',
  EXPIRED: '已失效'
};
const statusClassMap = {
  TB_PUBLISH: 'no-publish',
  PUBLISHED: 'publish',
  EXPIRED: 'expired'
};

window.moment = moment;

export const EXPIRE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';

export default class NoticeManagerPage extends Component {
  state = {
    selectedRowKeys: [],
    pageNum: 1,
    pageSize: 10,
    // sortedInfo: null,
    data: [],
    totalCount: 0,

    //
    modalName: '添加公告',
    noticeDetailVisible: false,
    noticeEditVisible: false,
    // name, content, influence, expire, expireTime
    noticeItem: {}
  };

  componentDidMount = () => {
    this.getNoticeData();
  };

  onSelectChange = selectedRowKeys => this.setState({ selectedRowKeys });

  getNoticeData = (
    pageNum = this.state.pageNum,
    pageSize = this.state.pageSize
  ) => {
    getAxios(
      'api/announcements',
      { currentPage: pageNum - 1, pageSize },
      data => {
        let realData = data.results || [];
        realData.forEach(record => (record.key = record.id));
        this.setState({
          data: realData,
          totalCount: data.totalElements,
          pageSize,
          pageNum
        });
      }
    );
  };

  addNotice = () =>
    this.setState({
      modalName: '添加公告',
      noticeEditVisible: true,
      noticeItem: {}
    });

  showNoticeDetail = record => () => {
    const noticeItem = {
      name: record.name,
      content: record.content,
      influence: record.influence,
      expire: !record.expiredAt ? 1 : 2,
      expireTime: !record.expiredAt ? null : moment(record.expiredAt - 0)
    };
    this.setState({
      modalName: '公告详情',
      noticeItem,
      noticeDetailVisible: true
    });
  };

  deleteNotice = () => {
    deleteAxios(
      'api/announcements',
      { ids: this.state.selectedRowKeys },
      () => {
        message.success('公告删除成功');
        this.getNoticeData();
      }
    );
  };

  publishNotice = id => () => {
    postAxios('api/announcements/publish', { ids: [id] }, () => {
      message.success('公告发布成功');
      this.getNoticeData();
    });
  };

  editNotice = record => () => {
    const noticeItem = {
      id: record.id,
      name: record.name,
      content: record.content,
      influence: record.influence || '无',
      expire: !record.expiredAt ? 1 : 2,
      expireTime: !record.expiredAt ? null : moment(record.expiredAt - 0)
    };
    this.setState({
      modalName: '修改公告',
      noticeItem,
      noticeEditVisible: true
    });
  };

  submitNotice = status => {
    const params = { ...this.state.noticeItem, status };
    const { expire, expireTime, id } = params;
    if (expire === 1) {
      delete params.expire;
    }
    if (expire === 2 && expireTime) {
      params.expire = moment(
        params.expireTime.format(EXPIRE_TIME_FORMAT),
        EXPIRE_TIME_FORMAT
      ).valueOf();
    }
    delete params.expireTime;

    if (id) {
      putAxios(`api/announcements/${id}`, params, this.submitCallback(1));
    } else {
      postAxios('api/announcements', params, this.submitCallback(0));
    }
  };

  submitCallback = type => () => {
    message.success(`公告${type ? '修改' : '添加'}成功`);
    this.setState({ noticeEditVisible: false });
    this.getNoticeData();
  };

  onPageSizeChange = pageSize =>
    this.setState({ pageSize }, this.getNoticeData);

  pageSizeSelect = (
    <Select
      className="pagesize-select"
      size="small"
      onChange={this.onPageSizeChange}
      value={this.state.pageSize}
    >
      <Option value={10}>10</Option>
      <Option value={20}>20</Option>
      <Option value={50}>50</Option>
      <Option value={100}>100</Option>
    </Select>
  );

  onCloseNoticeModal = visibleName => () =>
    this.setState({ [visibleName]: false, noticeItem: {} });

  onChangeFormValue = (name, value) => {
    this.setState({ noticeItem: { ...this.state.noticeItem, [name]: value } });
  };

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    const hasSelected = selectedRowKeys.length > 0;

    const columns = [
      {
        title: '公告主题',
        dataIndex: 'name',
        width: '52%'
      },
      {
        title: '有效期',
        dataIndex: 'expiredAt',
        sorter: (a, b) => {
          return a.expiredAt < b.expiredAt ? 1 : -1;
        },
        width: '14%',
        render: (text, record, index) => {
          return !text ? '永久' : moment(text - 0).format(EXPIRE_TIME_FORMAT);
        }
      },
      {
        title: '最后更新时间',
        dataIndex: 'lastModifiedAt',
        sorter: (a, b) => {
          return a.lastModifiedAt < b.lastModifiedAt ? 1 : -1;
        },
        width: '14%',
        render: (text, record, index) => {
          return !text ? '-' : moment(text - 0).format(EXPIRE_TIME_FORMAT);
        }
      },
      {
        title: '状态',
        render: (text, record, index) => {
          const { status } = record;
          return (
            <span className={`status ${statusClassMap[status]}`}>
              {statusNameMap[status]}
            </span>
          );
        },
        width: '7%'
      },
      {
        title: '操作',
        render: (text, record, index) => {
          const arr = [
            <span
              key={1}
              className="operation"
              onClick={this.showNoticeDetail(record)}
            >
              详情
            </span>,
            <span
              key={2}
              className="operation"
              onClick={this.editNotice(record)}
            >
              修改
            </span>,
            <span
              key={3}
              className="operation"
              onClick={this.publishNotice(record.id)}
            >
              发布
            </span>
          ];
          record.status !== 'TB_PUBLISH' && delete arr[1] && delete arr[2];
          return arr;
        },
        width: '12%'
      }
    ];

    return (
      <div className="notice-container">
        <p className="title">公告管理</p>
        <div className="container">
          <div className="btns">
            <Button type="primary" className="add-btn" onClick={this.addNotice}>
              +添加公告
            </Button>
            {!hasSelected ? (
              <Button className="delete-btn disabled">删除</Button>
            ) : (
              <Button className="delete-btn" onClick={this.deleteNotice}>
                删除
              </Button>
            )}
          </div>

          <div className="table-container">
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={this.state.data}
              pagination={false}
            />
          </div>

          <div className="pagination-container">
            <TablePagination
              pageSize={this.state.pageSize}
              pageNumber={this.state.pageNum}
              total={this.state.totalCount}
              preventDefaultLoad={true}
              handlePageChange={this.getNoticeData}
            />
          </div>
        </div>
        <NoticeEditModal
          modalName={this.state.modalName}
          visible={this.state.noticeEditVisible}
          onHandleCancel={this.onCloseNoticeModal('noticeEditVisible')}
          onSubmit={this.submitNotice}
          formValue={this.state.noticeItem}
          onChangeFormValue={this.onChangeFormValue}
        />
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
