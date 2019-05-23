import React, { Component } from 'react';

import { Carousel } from 'antd';

// import ChartExampleHomeDark from '../component/pub/ChartExampleHomeDark';

import '../assets/css/home/home.scss';

export default class HomePage extends Component {
  render() {
    return (
      <div className="home">
        <Carousel autoplay={false} dots={true} dotPosition="right">
          <div className="cover-scope-wrap">cover-scope-wrap</div>
          <div className="business-quality-wrap">business-quality-wrap</div>
        </Carousel>
      </div>
    );
  }
}
