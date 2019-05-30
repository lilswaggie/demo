import React from 'react';
import styled from 'styled-components';

const PageContentWrap = styled.div`
  margin: 12px 32px;
`;

export default function(props) {
  return (
    <PageContentWrap className={props.className}>
      {props.children}
    </PageContentWrap>
  );
}
