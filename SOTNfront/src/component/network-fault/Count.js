import React from 'react';
import styled from 'styled-components';
import { px2rem } from '../../util/StyleUtils';

const CountWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
  height: ${px2rem(90)};
  min-width: ${px2rem(180)};
  background: rgba(240, 243, 247, 0.39);

  .title {
    color: rgb(114, 117, 140);
  }

  .content {
    font-size: 20px;
    font-weight: 600;
    color: rgb(44, 156, 250);
  }
`;

export default props => {
  return (
    <CountWrap className={props.className}>
      <div className="title">{props.title}</div>
      <div className="content">{props.content || props.children}</div>
    </CountWrap>
  );
};
