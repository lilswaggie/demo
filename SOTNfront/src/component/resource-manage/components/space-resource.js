import React from 'react';
import { Button } from 'antd';
import { formatNumber } from '../../../util/CommonUtils';
import { spaceResourceIdx } from '../../business-manage/components/constant';
import '../net-resource.scss';

export default function SpaceResource(props) {
  const { spaceResourceArr, spaceIdx } = props;
  return (
    <div className="content-header">
      <div className="alarm-count-wrapper">
        {spaceResourceArr.map((item, index) => {
          return (
            <Button
              className={spaceIdx === index ? 'btnActive' : ''}
              onClick={props.selectSpace(index)}
              key={index}
            >
              <div className="alarm-count">
                {spaceResourceIdx[item.performance].name}
                {`(${spaceResourceIdx[item.performance].unit})`}
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
