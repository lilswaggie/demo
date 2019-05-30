import React from 'react';
import styled from 'styled-components';

// import { Divider } from 'antd';
// <Divider type="vertical" />

const LabelCountWrap = styled.div`
  line-height: 2;
  font-size: 14px;

  .label {
    font-weight: normal;
    color: rgb(114, 117, 140);
  }

  .value {
    display: inline-block;
    min-width: 80px;
    font-weight: 600;
    font-size: 20px;
    color: #2c9cfa;
  }
`;

export default props => {
  return (
    <LabelCountWrap className={props.className}>
      <span className="label">{props.label}：</span>
      <span className="value">{props.value}</span>
    </LabelCountWrap>
  );
};
