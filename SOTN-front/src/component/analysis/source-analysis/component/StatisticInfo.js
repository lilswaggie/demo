import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatNumber, dimensionArr } from '../../../../util/CommonUtils';

export default class StatisticInfo extends Component {
  static propTypes = {
    siteType: PropTypes.array,
    className: PropTypes.string
  };

  static defaultProps = {
    siteType: [],
    className: ''
  };

  render() {
    const { siteType, className } = this.props;
    return (
      <div>
        {// 二维 + 数组
          dimensionArr(siteType) > 1 ? (
            siteType.map((arr, index) => (
              <div className={`alarm-count-wrapper ${className}`} key={index}>
                {arr.map((item, index) => (
                  <div key={index}>
                    <div className="alarm-count" title={item.name || '--'}>
                      {item.name || '--'}
                    </div>
                    <div
                      className="alarm-tip1"
                      title={formatNumber(item.value) || 0}
                    >
                      {formatNumber(item.value) || 0}
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
          // 一维数组
            <div className="alarm-count-wrapper">
              {siteType.map((item, index) => (
                <div key={index}>
                  <div className="alarm-count" title={item.name || '--'}>
                    {item.name || '--'}
                  </div>
                  <div
                    className="alarm-tip1"
                    title={formatNumber(item.value) || 0}
                  >
                    {formatNumber(item.value) || 0}
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    );
  }
}
