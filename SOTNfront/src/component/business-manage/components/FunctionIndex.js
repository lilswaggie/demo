import React from 'react';
import { Button } from 'antd';
import { functionIdx } from './constant';

class FunctionIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { rateNameArr, rateIdx } = this.props;
    return (
      <div className="footer-button">
        {rateNameArr.map((item, index) => {
          return (
            <Button
              className={rateIdx === index ? 'active' : ''}
              onClick={this.props.selectRate(index)}
              key={index}
            >
              <div>{functionIdx[item.performance].name}</div>
              <div>{item.number}</div>
            </Button>
          );
        })}
      </div>
    );
  }
}

export default FunctionIndex;
