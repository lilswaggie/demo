import React, { Component } from 'react';
import { Divider, Radio, Button, Table, Tag, message } from 'antd';
import Default from './Default';
import CategoryModal from './CategoryModal';
import TablePagination from '../pub/TablePagination';
import { getAxios, postAxios } from '../../axios/mainAxios';
import './css/work-plateform.scss';
import moment from 'moment';

export default class Todo extends Component {
  constructor() {
    super();
    this.state = {
      todoOptions: [],
      todoSum: 0,
      option: '',
      data: [],
      todoColumns: [
        {
          title: '主题',
          dataIndex: 'subject',
          key: 'subject',
          width: '50%',
          render: (subject, record, index) => (
            <div>
              <Tag>{this.optionsMap[record.type]}</Tag>
              <span>{subject}</span>
            </div>
          )
        },
        {
          title: '当前环节处理人',
          dataIndex: 'customerName',
          key: 'customerName',
          width: '20%'
        },
        {
          title: '建单时间',
          dataIndex: 'createdTime',
          key: 'createdTime',
          width: '15%',
          render: (subject, record, index) => (
            <div>{this.timestampToTime(subject)}</div>
          )
        },
        {
          title: '到达时间',
          key: 'dealTime',
          dataIndex: 'dealTime',
          width: '15%',
          render: (subject, record, index) => (
            <div>{this.timestampToTime(subject)}</div>
          )
        }
      ],
      visible: false,
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      preventDefaultLoad: false
    };
    this.optionsMap = {};
  }
  componentDidMount() {
    this.loadTodoStats();
  }
  timestampToTime = time => {
    return time ? moment(time - 0).format('YYYY-MM-DD HH:mm') : '-';
  };
  handleChangeOption = e => {
    this.setState(
      {
        option: e.target.value,
        pageNumber: 1
      },
      () => {
        this.loadData(this.state.pageNumber, this.state.pageSize);
      }
    );
  };
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  handleOk = options => {
    let ignoreArr = [];
    options.forEach(item => {
      if (!item.display) {
        ignoreArr.push(item.typeId);
      }
    });
    postAxios('/api/user/profiles', { ignoredPendings: ignoreArr }, data => {
      // success
      // const { option } = this.state;
      this.setState(
        {
          visible: false,
          todoOptions: options,
          // option: ignoreArr.includes(option) ? '' : option,
          option: ''
        },
        () => {
          this.loadTodoStats();
          this.loadData(1);
        }
      );
    });
  };
  handleCancel = e => {
    this.setState({
      visible: false
    });
  };
  loadTodoStats = () => {
    getAxios('/api/flow_pendings/stats', {}, data => {
      let sum = 0;
      data.forEach(item => {
        sum = sum + item.count;
      });
      this.setState(
        { todoOptions: data, todoSum: sum },
        this.loadIgnoreOptions
      );
    });
  };
  loadData = (currentPage, pageSize = this.state.pageSize) => {
    if (currentPage <= 0) {
      message.error('页码超出范围');
      return;
    }
    this.setState({ preventDefaultLoad: false });
    getAxios(
      '/api/flow_pendings',
      { currentPage: currentPage - 1, pageSize, type: this.state.option },
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
  loadIgnoreOptions = () => {
    getAxios('/api/user/profiles', data => {
      // success
      let tempOptions = this.state.todoOptions.map(item => {
        data.ignoredPendings && data.ignoredPendings.includes(item.typeId)
          ? (item.display = false)
          : (item.display = true);
        this.optionsMap[item.typeId] = item.typeLabel;
        return item;
      });
      this.setState({ todoOptions: tempOptions });
    });
  };

  getOptionsSysInfoByType = type => {
    const arr = this.state.todoOptions;
    let result = null;
    arr &&
      arr.length &&
      arr.forEach(o => {
        o.typeId === type && (result = o.sysInfo);
      });
    return result;
  };

  onRow = (record, idx) => ({
    onClick: () => {
      const { type, entryUrl } = record;
      const sysInfo = this.getOptionsSysInfoByType(type);
      if (sysInfo && entryUrl) {
        if (sysInfo.authNeeded) {
          getAxios(
            `api/tickets/${sysInfo.sysId}`,
            { link: entryUrl },
            ({ link }) => window.open(link)
          );
        } else {
          window.open(entryUrl);
        }
      }
    }
  });

  render() {
    return (
      <div id="todo" className="todo-wrap">
        <section>
          <header className="header">
            <span>
              <Divider type="vertical" className="divider" />
              <span>我的待办</span>
            </span>
            <Button type="primary" ghost onClick={this.showModal}>
              自定义
            </Button>
          </header>
          <div className="todoOptions">
            <Radio.Group
              value={this.state.option}
              onChange={this.handleChangeOption}
            >
              <Radio.Button value={''}>
                全部
                <span className="num">&nbsp;({this.state.todoSum})</span>
              </Radio.Button>
              {this.state.todoOptions.map((item, index) => {
                return item.display ? (
                  <Radio.Button key={index} value={item.typeId}>
                    {item.typeLabel}
                    <span className="num">&nbsp;({item.count})</span>
                  </Radio.Button>
                ) : (
                  ''
                );
              })}
            </Radio.Group>
          </div>
        </section>
        <section>
          <Table
            rowKey={record => record.id}
            columns={this.state.todoColumns}
            dataSource={this.state.data}
            pagination={false}
            onRow={this.onRow}
          />
          <TablePagination
            pageNumber={this.state.pageNumber}
            pageSize={this.state.pageSize}
            total={this.state.total}
            preventDefaultLoad={this.state.preventDefaultLoad}
            handlePageChange={this.loadData}
          />
        </section>
        <section>
          <Default reminder={'暂无数据'} />
        </section>
        {this.state.visible ? (
          <CategoryModal
            visible={this.state.visible}
            todoOptions={this.state.todoOptions}
            handleOk={this.handleOk}
            handleCancel={this.handleCancel}
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}
