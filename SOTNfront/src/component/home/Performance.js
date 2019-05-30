import React from 'react';
import styled from 'styled-components';

const PerformanceWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
`;

const Performance = styled.div`
  margin-top: 10px;
  cursor: pointer;

  .name {
    font-family: 'PingFangSC-Light', 'PingFang SC Light', 'PingFang SC';
    font-weight: 200;
    font-size: 14px;
    color: #ffffff;
    line-height: 20px;
  }
  .value {
    display: flex;
    align-items: center;
    font-weight: 400;
    color: #6adbff;
    text-decoration: underline;

    .number {
      font-family: 'SimHei';
      font-weight: 400;
      font-size: 28px;
      line-height: 50px;
    }
    .unit {
      margin-left: 3px;
      font-family: 'PingFangSC-Regular', 'PingFang SC';
      font-size: 14px;
    }
  }
  &:hover {
    .value {
      color: #ffffff;
    }
  }
`;

export default props => {
  const { className, dataArr = [], onClick } = props;
  return (
    <PerformanceWrap className={className}>
      {dataArr.map(({ name, value, unit }, index) => (
        <Performance key={index} onClick={onClick}>
          <div className="name">{name}</div>
          <div className="value">
            <span className="number">{value}</span>
            {unit && <span className="unit">{unit}</span>}
          </div>
        </Performance>
      ))}
    </PerformanceWrap>
  );
};
