import * as React from 'react';

import PropTypes from 'prop-types';

// import IframeUtils from '../util/IframeUtils';

import '../assets/css/iframe.scss';
import { getToken } from '../util/ReduxUtil';

// 全局函数作用域，与gis交互用
window.gis = {
  getToken: getToken
};

export default class Iframe extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    url: PropTypes.string.isRequired,
    onLoaded: PropTypes.func,
    events: PropTypes.object
  };

  static defaultProps = {
    name: 'iframe',
    onLoaded: () => {},
    events: {}
  };

  // shouldComponentUpdate(nextProps, nextState) {
  //     return nextProps.url && nextProps.url !== this.props.url;
  // }

  state = {};

  // static getDerivedStateFromProps(nextProps, prevState) {
  //     // 静态方法，不能使用this
  // }

  componentDidMount = () => {
    const { events } = this.props;
    events &&
      Object.keys(events).forEach(eventKey => {
        window.gis[eventKey] = events[eventKey];
      });
  };

  // getSnapshotBeforeUpdate = (prevProps, prevState) => {
  //     // 这个方法在render之后，componentDidUpdate之前调用，有两个参数prevProps和prevState，
  //     // 表示之前的属性和之前的state，这个函数有一个返回值，会作为第三个参数传给componentDidUpdate，
  //     // 如果你不想要返回值，请返回null，不写的话控制台会有警告
  //     // 一定要和componentDidUpdate一起使用，否则控制台也会有警告
  // }

  // componentDidUpdate = (prevProps, prevState, snapshot) => {

  // }

  render() {
    const { name, url } = this.props;
    return url ? (
      <iframe
        className={this.props.className}
        onLoad={this.props.onLoaded}
        name={name}
        title="iframe"
        src={url}
        allowFullScreen={true}
      />
    ) : (
      ''
    );
  }
}
