import React, { Component } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Divider } from 'antd';
import PieExampleItem from './PieExampleItem';

const PieExampleWrap = styled.div`
  padding: 10px;
  background-color: rgba(240,243,247,1);
`;

export const StyledDivider = styled(Divider)`
  margin: 5px 0;
  background-color: #E5E5E5;
`;

export default class PieExample extends Component {
  static propTypes = {
    className: PropTypes.string,
    data: PropTypes.shape({
      total_num: PropTypes.number,
      finished_num: PropTypes.number,
      ongoing_num: PropTypes.number
    })
  };

  render() {
    const { data, className } = this.props;
    return (
      <PieExampleWrap className={className}>
        <PieExampleItem name="总数" value={data.total_num}/>
        <StyledDivider/>
        <PieExampleItem
          showIcon={true}
          iconColor="#6496FE"
          name="已归档"
          value={data.finished_num}
        />
        <PieExampleItem
          showIcon={true}
          iconColor="#71CA41"
          name="在途"
          value={data.ongoing_num}
        />
      </PieExampleWrap>
    );
  }
}
