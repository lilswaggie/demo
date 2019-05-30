import React, { Fragment } from 'react';
import { Table } from 'antd';
import TablePagination from '../../pub/TablePagination';
import { gotoPathWithState } from '../../../util/ReduxUtil';

const onRow = props => (record, index) => {
  return {
    onClick: () => {
      // 有businessType，代表是从网络故障过来的
      if (props.fromNetworkFault) {
        gotoPathWithState('/main/fault/business/line-detail', {
          record,
          from: 'network'
        });
      }
    }
  };
};

export default props => {
  const lineColumns = [
    {
      title: '专线名称',
      render: (text, record, index) => (
        <div className="line">
          <span
            className="key"
            style={{ backgroundColor: index > 2 ? '#BFCFD7' : '#F65F7B' }}
          >
            {index + 1}
          </span>
          {record.name}
        </div>
      ),
      width: '50%',
      align: 'left',
      key: 1
    },
    {
      title: '业务类型',
      render: (text, record) => (
        <div className="detail">{record.businessType}</div>
      ),
      width: '25%',
      align: 'right',
      key: 2
    }
  ];
  !props.businessTypeVisible && delete lineColumns[1];

  return (
    <Fragment>
      <Table
        className={props.className}
        columns={lineColumns}
        showHeader={props.showHeader}
        dataSource={props.lineList}
        rowKey={record => record.id}
        onRow={onRow(props)}
        pagination={false}
        scroll={{ y: props.scrollY }}
      />
      <TablePagination
        pageSize={props.pageSize}
        pageNumber={props.pageNum}
        total={props.totalCount}
        preventDefaultLoad={true}
        handlePageChange={props.onPageChange}
        hidePageSize={true}
        hidePageJump={true}
      />
    </Fragment>
  );
};
