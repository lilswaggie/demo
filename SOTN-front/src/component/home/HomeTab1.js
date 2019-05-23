import React from 'react';
import { connect } from 'react-redux';

import Iframe from '../../container/Iframe';
import ChartExampleHomeChina from '../pub/ChartExampleHomeChina';
import ChartExampleHome from '../pub/ChartExampleHome';

import { baseStaticUrl } from '../../util/CommonUtils';

class Tab1 extends React.Component {
  render() {
    const type = this.props.business.type;
    return (
      <div className="tab1">
        {!!type && (
          <Iframe
            url={`${baseStaticUrl}gis/gis3/index/${
              type === 1 ? 'world' : 'china'
            }.html`}
          />
        )}
        {!!type &&
          (type === 1 ? <ChartExampleHome /> : <ChartExampleHomeChina />)}
        {!!type && (
          <div
            style={{ display: type === 1 ? 'block' : 'none' }}
            className="legend"
          >
            {[
              { name: '在建海缆', num: 1 },
              { name: '已建海缆', num: 6 },
              { name: '租用海缆', num: 10 },
              { name: '在建陆缆', num: 3 }
            ].map((item, index) => (
              <div className="legend-item" key={index}>
                <p>{item.name}</p>
                <p>
                  <span>{item.num}</span>条
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  business: state.business
});

export default connect(mapStateToProps)(Tab1);
