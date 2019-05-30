import React from 'react';
import { Button } from 'antd';
import { formatNumber } from '../../../util/CommonUtils';
import { innerResourceIdx } from '../../business-manage/components/constant';
import '../net-resource.scss';

export default function InnerResource(props) {
  const { innerResourceArr, innerIdx } = props;
  return (
    <div className="content-header">
      <div className="alarm-count-wrapper">
        {innerResourceArr.map((item, index) => {
          return (
            <Button
              className={innerIdx === index ? 'btnActive' : ''}
              onClick={props.selectInner(index)}
              key={index}
            >
              <div className="alarm-count">
                {innerResourceIdx[item.performance].name}
                {`(${innerResourceIdx[item.performance].unit})`}
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
