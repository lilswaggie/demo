import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import LineTable from './LineTable';
import { formatNumber } from '../../../util/CommonUtils';
import '../stylesheets/cutover-line.scss';

class CutoverLine extends React.Component {
  static propTypes = {
    title: PropTypes.node,
    // 折叠显示
    contentVisible: PropTypes.bool,
    aLine: PropTypes.number,
    aaLine: PropTypes.number,
    aaaLine: PropTypes.number,
    normalLine: PropTypes.number,
    time: PropTypes.string,

    businessTypeVisible: PropTypes.bool,
    fromNetworkFault: PropTypes.bool,
    scrollY: PropTypes.string,
    pageNum: PropTypes.number,
    pageSize: PropTypes.number,
    totalCount: PropTypes.number,
    lineList: PropTypes.array,
    onPageChange: PropTypes.func
  };

  static defaultProps = {
    title: '割接影响的专线',
    contentVisible: true,
    aLine: 0,
    aaLine: 0,
    aaaLine: 0,
    normalLine: 0,
    time: '',
    lineList: [],
    businessTypeVisible: true,
    fromNetworkFault: false,
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

  render() {
    const { title, contentVisible, time } = this.props;
    const lineNameArr = Object.keys(this.lineMap);

    return (
      <div className="cutover-line">
        <div className="line-text clearfix">
          <span>{title}</span>
          <span className="detail">{time}</span>
        </div>
        <div
          className="progress clerfix"
          style={{ display: contentVisible ? '' : 'none' }}
        >
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
        <div
          className="bscutover-list"
          style={{ display: contentVisible ? '' : 'none' }}
        >
          <div className="cutover-list">
            <LineTable
              className="line-list"
              showHeader={true}
              businessTypeVisible={this.props.businessTypeVisible}
              fromNetworkFault={this.props.fromNetworkFault}
              scrollY={this.props.scrollY}
              pageNum={this.props.pageNum}
              pageSize={this.props.pageSize}
              totalCount={this.props.totalCount}
              lineList={this.props.lineList}
              onPageChange={this.props.onPageChange}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default CutoverLine;
