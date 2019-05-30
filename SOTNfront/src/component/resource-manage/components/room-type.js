import React from 'react';
import { Carousel } from 'antd';
import PropTypes from 'prop-types';
import { formatNumber, splitArr } from '../../../util/CommonUtils';
import './site-type.scss';

export default class RoomType extends React.Component {
  static propTypes = {
    roomType: PropTypes.array
  };

  render() {
    const { roomType } = this.props;
    const groupArr = splitArr(roomType, 6);

    return (
      <div className="site-header">
        <div className="type-wrapper clearfix">
          {groupArr.length && (
            <Carousel autoplay={true}>
              {groupArr.map(arr => (
                <div>
                  {arr.map((item, index) => (
                    <div key={index} className={'type'}>
                      <div className="alarm-count">{item.name}</div>
                      <div className="alarm-tip">
                        {formatNumber(item.value)}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </Carousel>
          )}
        </div>
      </div>
    );
  }
}
