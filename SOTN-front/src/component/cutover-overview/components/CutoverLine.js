import React from 'react';

import { Table } from 'antd';

import classNames from 'classnames';
import PropTypes from 'prop-types';

import TablePagination from '../../pub/TablePagination';

import { formatNumber } from '../../../util/CommonUtils';
import { gotoPathWithState } from '../../../util/ReduxUtil';

import '../stylesheets/cutover-line.scss';

class CutoverLine extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    aLine: PropTypes.number,
    aaLine: PropTypes.number,
    aaaLine: PropTypes.number,
    normalLine: PropTypes.number,
    cutoverTime: PropTypes.string,
    isShowBusinessType: PropTypes.bool,
    businessType: PropTypes.number,
    scrollY: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    totalCount: PropTypes.number,
    lineData: PropTypes.array,
    onPageChange: PropTypes.func
  };

  static defaultProps = {
    title: '割接影响的专线',
    aLine: 0,
    aaLine: 0,
    aaaLine: 0,
    normalLine: 0,
    cutoverTime: '',
    lineData: [],
    isShowBusinessType: true,
    pageNum: 1,
    pageSize: 10,
    totalCount: 0,
    onPageChange: () => {}
  };

  lineMap = {
    aaaLine: 'AAA专线',
    aaLine: 'AA专线',
    aLine: 'A专线',
    normalLine: '普通专线'
  };

  getLineTotalNum = () => {
    const { aLine, aaLine, aaaLine, normalLine } = this.props;
    return aLine + aaLine + aaaLine + normalLine;
  };

  getLinePercent = name => {
    const total = this.getLineTotalNum();
    return total === 0 ? 0 : (this.props[name] * 100) / total;
  };

  getFirstIdx = () => {
    const lineNameArr = Object.keys(this.lineMap);
    let idx = null;
    lineNameArr.forEach((name, i) => {
      if (this.props[name] && idx === null) {
        idx = i;
      }
    });
    return idx;
  };

  getLastIdx = () => {
    const lineNameArr = Object.keys(this.lineMap);
    let idx = 0;
    lineNameArr.forEach((name, i) => this.props[name] && (idx = i));
    return idx;
  };

  onRow = (record, index) => {
    return {
      onClick: () => {
        // 有businessType，代表是从网络故障过来的
        if (this.props.businessType) {
          gotoPathWithState('/main/fault/business/line-detail', {
            record,
            from: 'network'
          });
        }
      }
    };
  };

  render() {
    const { cutoverTime, lineData } = this.props;

    const lineNameArr = Object.keys(this.lineMap);

    // 专线列表
    const columsLine = [
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

    !this.props.isShowBusinessType && delete columsLine[1];

    return (
      <div className="cutover-line">
        <div className="line-text clearfix">
          <span>{this.props.title}</span>
          <span className="detail">{cutoverTime}</span>
        </div>
        <div className="progress clerfix">
          <div className="segments">
            {lineNameArr.map((name, idx) => {
              const cls = classNames({
                first: idx === this.getFirstIdx(),
                last: idx === this.getLastIdx()
              });
              return (
                <span
                  key={name}
                  className={cls}
                  style={{ width: `${this.getLinePercent(name)}%` }}
                />
              );
            })}
          </div>
          {[lineNameArr.slice(0, 2), lineNameArr.slice(2, 4)].map(
            (arr, idx) => (
              <div key={idx} className="line-point">
                {arr.map((name, i) => (
                  <div
                    key={i}
                    className={`${i === 0 ? 'start' : 'end'}-time clearfix`}
                  >
                    <div />
                    <div>{this.lineMap[name]}：</div>
                    <div>{formatNumber(this.props[name])}</div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
        <div className="bscutover-list">
          <div className="cutover-list">
            <Table
              columns={columsLine}
              dataSource={lineData}
              className="line-list"
              rowKey={record => record.id}
              onRow={this.onRow}
              pagination={false}
              scroll={{ y: this.props.scrollY }}
            />
            <TablePagination
              pageSize={this.props.pageSize}
              pageNumber={this.props.pageNum}
              total={this.props.totalCount}
              preventDefaultLoad={true}
              handlePageChange={this.props.onPageChange}
              hidePageSize={true}
              hidePageJump={true}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default CutoverLine;
