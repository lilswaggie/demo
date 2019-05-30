import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../component/big-screen/css/big-screen.scss';
import SpecialNetworkOverview from '../component/big-screen/network-overview/special-network-overview';
import NetworkTotal from '../component/big-screen/network-total/network-total';
import VIP from '../component/big-screen/VIP/VIP';
import { processIframeMethod } from '../util/IframeUtils';
class BigScreenPage extends Component {
  state = {
    activeItem: {
      name: '',
      key: '',
      value: ''
    }
  };

  handlerNetworkItem = (name, key, value) => {
    this.setState({ activeItem: { name, key, value } });
    processIframeMethod('renderColor', 'iframe-3d-big-screen')(key);
  };

  onIframe3dLoaded = () => {
    processIframeMethod('renderColor', 'iframe-3d-big-screen')('element');
  };

  render() {
    return (
      <div id="big-screen">
        <div id="header">
          <hr />
          <span>中国移动国际及政企专网网管</span>
          <hr />
        </div>
        <div id="content">
          <SpecialNetworkOverview
            activeItem={this.state.activeItem}
            handlerNetworkItem={this.handlerNetworkItem}
          />
          <NetworkTotal
            activeItem={this.state.activeItem}
            onIframe3dLoaded={this.onIframe3dLoaded}
          />
          <VIP />
        </div>
      </div>
    );
  }
}
const mapState2Props = state => ({
  location: state.routing.location
});

export default connect(mapState2Props)(BigScreenPage);
