import React, { Component } from 'react';

import classNames from 'classnames';

import DeviceFault from '../../component/analysis/network-quality/DeviceFault';
import UnqualifiedPort from '../../component/analysis/network-quality/UnqualifiedPort';

import '../../assets/css/network-quality/network-quality.scss';

export default class NetworkQualityPage extends Component {
  state = {
    // 1：设备故障分析，2：不合格端口分析
    type: 1
  };

  onTypeChange = type => () => this.setState({ type });

  render() {
    const { type } = this.state;

    return (
      <div className="analysis-wrap network-quality">
        <header>
          <span className="text">网络质量分析</span>
          <span className="type-select">
            {[
              { name: '设备故障分析', type: 1 },
              { name: '不合格端口分析', type: 2 }
            ].map(item => {
              const cls = classNames({ active: type === item.type });
              return (
                <span
                  key={item.type}
                  onClick={this.onTypeChange(item.type)}
                  className={cls}
                >
                  {item.name}
                </span>
              );
            })}
          </span>
        </header>

        <DeviceFault type={type} />
        <UnqualifiedPort type={type} />
      </div>
    );
  }
}
