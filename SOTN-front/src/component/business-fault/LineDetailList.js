import React from 'react';
import { Icon } from 'antd';

import PropTypes from 'prop-types';

export default class ListItem extends React.Component {
  static propTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    isPortShow: false
  };

  handleShow = e => {
    this.setState({
      isPortShow: !this.state.isPortShow
    });
  };

  render() {
    const { router } = this.props;
    return (
      <li className="ulitem">
        <div className="line1">
          <span>{/* <span className="center"/> */}</span>
          <span className="control-line" title={router.a_ne_name}>
            {router.a_ne_name}
          </span>
          <span />
          <Icon type="caret-right" theme="outlined" />
          <span className="end control-line" title={router.z_ne_name}>
            {router.z_ne_name}
          </span>
          {this.state.isPortShow ? (
            <Icon
              type="minus-circle"
              theme="filled"
              onClick={this.handleShow}
            />
          ) : (
            <Icon type="plus-circle" theme="filled" onClick={this.handleShow} />
          )}
        </div>
        <ul
          className="line2"
          style={
            this.state.isPortShow ? { display: 'block' } : { display: 'none' }
          }
        >
          <li className="port-item">
            <div>
              <span className="port">端口：</span>
              <span
                className="port-name control-address"
                title={router.a_port_name}
              >
                {router.a_port_name}
              </span>
            </div>
            <div>
              <Icon type="environment" theme="outlined" />
              <span className="control-address" title={router.a_address}>
                {router.a_address}
              </span>
            </div>
          </li>
          <li className="port-item">
            <div>
              <span className="port">端口：</span>
              <span
                className="port-name control-address"
                title={router.z_port_name}
              >
                {router.z_port_name}
              </span>
            </div>
            <div>
              <Icon type="environment" theme="outlined" />
              <span className="control-address" title={router.z_address}>
                {router.z_address}
              </span>
            </div>
          </li>
        </ul>
      </li>
    );
  }
}
