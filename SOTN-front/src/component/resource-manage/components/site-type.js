import React from 'react';
import { Carousel } from 'antd';
import PropTypes from 'prop-types';
import { formatNumber, splitArr } from '../../../util/CommonUtils';
import './site-type.scss';

export default class SiteType extends React.Component {
  static propTypes = {
    siteType: PropTypes.array
  };

  render() {
    const { siteType } = this.props;
    const groupArr = splitArr(siteType, 6);

    return (
      <div className="site-header">
        <div className="type-wrapper clearfix">
          {groupArr.length && (
            <Carousel autoplay={true}>
              {groupArr.map((arr, index) => (
                <div key={index}>
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