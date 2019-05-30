import React, { Component } from 'react';
import NetworkScale from './network-scale';
import NetworkQuality from './network-quality';
import BusinessScale from './business-scale';
import BusinessQuality from './business-quality';

import '../css/special-network-overview.scss';
export default class SpecialNetworkOverview extends Component {
  render() {
    return (
      <div id="special-network-overview">
        <header>国际及政企专网概览</header>
        <NetworkScale
          activeItem={this.props.activeItem}
          handlerNetworkItem={this.props.handlerNetworkItem}
        />
        <NetworkQuality
          activeItem={this.props.activeItem}
          handlerNetworkItem={this.props.handlerNetworkItem}
        />
        <BusinessScale
          activeItem={this.props.activeItem}
          handlerNetworkItem={this.props.handlerNetworkItem}
        />
        <BusinessQuality
          activeItem={this.props.activeItem}
          handlerNetworkItem={this.props.handlerNetworkItem}
        />
      </div>
    );
  }
}
