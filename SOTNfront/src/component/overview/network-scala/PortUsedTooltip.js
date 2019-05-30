import React, { Component } from 'react';

import styled from 'styled-components';

const PortUsedTooltipWrap = styled.div`
  display: flex;
  width: 160px;
  flex-wrap: wrap;
  justify-content: space-between;

  & > div:nth-child(1) {
    width: 40%;
  }
  & > div:nth-child(2) {
    width: 20%;
  }
  && > div:nth-child(3) {
    width: 40%;
  }
  & > div:nth-child(4) {
    display: flex;
    justify-content: space-between;
    width: 100%;
    color: #666;
  }
`;

const ColorBar = styled.div`
  width: 100%;
  height: 10px;
  background-color: ${props => props.color};
`;

export const portUsedColorArr = ['#71CA41', '#F0B34A', '#EC474A'];
export const getPortUsedColor = used => {
  return used > 60
    ? portUsedColorArr[2]
    : used > 40
      ? portUsedColorArr[1]
      : portUsedColorArr[0];
};

export default class PortUsedTooltip extends Component {
  render() {
    return (
      <PortUsedTooltipWrap>
        <div>
          <ColorBar color={portUsedColorArr[0]}/>
        </div>
        <div>
          <ColorBar color={portUsedColorArr[1]}/>
        </div>
        <div>
          <ColorBar color={portUsedColorArr[2]}/>
        </div>
        <div>
          <div>0</div>
          <div>40</div>
          <div>60</div>
          <div>100</div>
        </div>
      </PortUsedTooltipWrap>
    );
  }
}
