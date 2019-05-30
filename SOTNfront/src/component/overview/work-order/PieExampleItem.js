import React, { Component } from 'react';

import styled from 'styled-components';

const PieExampleItemWrap = styled.div`
  display: flex;
  flex: 1 1;
  height: 24px;
  justify-content: space-between;
  align-items: center;
  .name {
    color: #72758C;
  }
  .value {
    color: #314658;
    text-align: right;
  }
  span {
    display: inline-block;
    vertical-align: middle;
  }
`;

const PieExampleItemIcon = styled.span`
  margin-right: 3px;
  height: 6px;
  width: 6px;
  border-radius: 3px;
  font-size: 12px;
  background-color: ${props => props.color || '#fff'};
`;

export default class PieExampleItem extends Component {

  render () {
    const { showIcon, iconColor, name, value } = this.props;
    return (
      <PieExampleItemWrap>
        <div className="name">
          {
            showIcon &&
            <PieExampleItemIcon className="icon" color={iconColor}/>
          }
          <span>{name}</span>
        </div>
        <div className="value">{value}</div>
      </PieExampleItemWrap>
    );
  }
}
