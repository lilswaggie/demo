import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const GisWrap = styled.div`
  position: relative;
  height: ${props => props.height + 6 + 'px'};
  background-color: #1d1d59;
`;

export default function(props) {
  function getWindowHeight() {
    return document.compatMode === 'CSS1Compat'
      ? document.documentElement.clientHeight
      : document.body.clientHeight;
  }

  const [height, setHeight] = useState(getWindowHeight() - 48);

  useEffect(() => {
    function setHeightStatus() {
      setHeight(getWindowHeight() - 48);
    }
    window.addEventListener('resize', setHeightStatus);
    return () => {
      window.removeEventListener('resize', setHeightStatus);
    };
  }, [height]);

  return <GisWrap height={height}>{props.children}</GisWrap>;
}
