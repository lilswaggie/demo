import React, { Component } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';
import { px2rem } from '../../../util/StyleUtils';

const WarnTop5ProvinceWrap = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: rgba(240, 243, 247, 1);
`;

const WarnTop5Item = styled.div`

`;

const Top5ItemOuterCircle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: ${px2rem(66)};
  height: ${px2rem(66)};
  border-radius: 50%;
  background-color: #6496FE;
`;

const Top5ItemInnerCircle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${px2rem(40)};
  height: ${px2rem(40)};
  border-radius: 50%;
  background: linear-gradient(to bottom, #935DFE, #F65F7B);
`;

const WarnNumber = styled.div`
  font-size: 13px;
  color: #FFFFFF;
`;

const Top5ItemProvince = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #666666;
`;

export default class WarnFirstTop5Province extends Component {
  static propTypes = {
    className: PropTypes.string,
    dataArr: PropTypes.arrayOf(PropTypes.shape({
      province: PropTypes.string,
      warnCount: PropTypes.number,
      firstLevelWarnCount: PropTypes.number
    }))
  };

  static defaultProps = {
    dataArr: []
  }

  render() {
    return (
      <WarnTop5ProvinceWrap className={this.props.className}>
        {this.props.dataArr.map((data, idx) => (
          <WarnTop5Item key={idx}>
            <Top5ItemOuterCircle>
              <WarnNumber>{data.warnCount}</WarnNumber>
              <Top5ItemInnerCircle>
                <WarnNumber>{data.firstLevelWarnCount}</WarnNumber>
              </Top5ItemInnerCircle>
            </Top5ItemOuterCircle>
            <Top5ItemProvince>{data.province}</Top5ItemProvince>
          </WarnTop5Item>
        ))}
      </WarnTop5ProvinceWrap>
    );
  }
}
