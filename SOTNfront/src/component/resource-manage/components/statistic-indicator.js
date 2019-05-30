import React from 'react';
import { Button } from 'antd';
import { formatNumber } from '../../../util/CommonUtils';
import { statsIndicator } from '../../business-manage/components/constant';
import '../net-resource.scss';

export default function StatisticIndicator(props) {
  const { statisticArr, statisticIdx } = props;
  return (
    <div className="content-header">
      <div className="alarm-count-wrapper">
        {statisticArr.map((item, index) => {
          return (
            <Button
              className={statisticIdx === index ? 'btnActive' : ''}
              onClick={props.selectStatistic(index)}
              key={index}
            >
              <div className="alarm-count">
                {statsIndicator[item.performance].name}
                {`(${statsIndicator[item.performance].unit})`}
              </div>
              <div className="alarm-tip">
                {item.number === null ? '--' : formatNumber(item.number)}
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
