import React from 'react';
import styled from 'styled-components';
import LabelCount from './LabelCount';
import { insertBetweenArrayItem } from '../../util/ArrayUtils';
import { Divider } from 'antd';

const CombineLabelCountWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default props => {
  const { dataArr = [] } = props;
  let labelCountArr = insertBetweenArrayItem(
    dataArr.map(({ label, value }, index) => props => (
      <LabelCount {...props} label={label} value={value} />
    )),
    props => <Divider {...props} type="vertical" />
  );

  return (
    <CombineLabelCountWrap>
      {labelCountArr.map((render, index) => render({ key: index }))}
    </CombineLabelCountWrap>
  );
};
