/**
 * Created by gaozhao on 2017/12/27.
 */
import React from 'react';
import PropTypes from 'prop-types';
import classname from 'classnames';
import { Row, Col, Button, Tag } from 'antd';
import styles from './style.less';

export default class IModalPanel extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string,
    headerCls: PropTypes.string,
    headerStyle: PropTypes.object,
    handleClose: PropTypes.func,
    children: PropTypes.node,
    myStyle: PropTypes.object,
  }

  // 返回默认值
  static defaultProps = {
    myStyle: { left: '250px', top: '70px', width: '1000px' },
    // headerStyle: { backgroundColor: '#69A5E7' },
  }

  constructor (props) {
    super(props);
    let tabLeft = props.myStyle.left;
    const tabTop = props.myStyle.top;
    if (!tabLeft && props.myStyle.right) {
      tabLeft = window.innerWidth - parseInt(props.myStyle.right, 10)
        - parseInt(props.myStyle.width, 10);
      tabLeft = `${tabLeft}px`;
    }
    this.state = {
      tabLeft,
      tabTop,
      draggable: false,
      resizable: false,
      width: props.myStyle.width,
      height: 'auto',
      moveX: 0,
      moveY: 0,
    };
  }

  componentDidMount () {
    document.body.addEventListener('mousemove', this.handleMouseMove);
    document.body.addEventListener('mouseup', this.handleMouseUp);
  }

  componentWillUnmount () {
    document.body.removeEventListener('mousemove', this.handleMouseMove);
    document.body.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseMove = (e) => {
    const { draggable, resizable, moveX, moveY, tabLeft, tabTop, width } = this.state;
    if (draggable) {
      const nextRight = e.pageX - moveX + parseInt(tabLeft, 10);
      const nextTop = e.pageY - moveY + parseInt(tabTop, 10);
      this.setState({
        tabLeft: `${nextRight}px`,
        tabTop: `${nextTop}px`,
        moveX: e.pageX,
        moveY: e.pageY,
      });
    }

    if (resizable) {
      let height = this.state.height;
      if (height === 'auto') {
        height = this.tabDOM.scrollHeight;
      }
      const nextWidth = e.pageX - moveX + parseInt(width, 10);
      const nextHeight = e.pageY - moveY + parseInt(height, 10);
      this.setState({
        width: `${nextWidth}px`,
        height: `${nextHeight}px`,
        moveX: e.pageX,
        moveY: e.pageY,
      });
    }
  }

  handleMouseDown = (e) => {
    this.setState({
      draggable: true,
      moveX: e.pageX,
      moveY: e.pageY,
    });
  }

  handleMouseUp = () => {
    this.setState({
      draggable: false,
      resizable: false,
    });
  }

  render () {
    const { tabLeft, tabTop, width, height, headerCls, headerStyle } = this.state;
    const { myStyle } = this.props;
    return (
      <div
        style={{
          position: 'absolute',
          left: tabLeft,
          top: tabTop,
          width,
          backgroundColor: '#fff',
          borderLeft: 'solid 2px #1587CE',
          zIndex: '1000',
          display: myStyle.display,
          boxShadow: '5px 5px 10px #888888',
          height:this.props.height?this.props.height:height,
        }}
      >
        <Row>
          <Col
            span={24}
            // style={headerStyle}
            style={{ backgroundColor: '#69A5E7' }}
            className={headerCls ? classname({
              [styles.imodalHeader]: true, [headerCls]: true,
            }) : classname({ [styles.imodalHeader]: true })}
            onMouseDown={this.handleMouseDown}
          >
            <b style={{ marginLeft: '5px', fontSize: '16px', color: '#fff', float: 'left', marginTop: '10px' }}>{this.props.title}</b>
            <Button
              style={{ border: 'none', float: 'right' }}
              size="large"
              ghost
              onClick={this.props.handleClose}
              icon="close"
            />
          </Col>
          {/* <Col
            span={24}
            style={{ backgroundColor: '#69A5E7', paddingBottom: '5px' }}>
            <div>
              <Tag
                color="white"
                style={{ border: '1px solid #2C9CFA',borderRadius: '5px',fontSize: '11px',color: '#2C9CFA',float: 'left',marginLeft: '5px' }}>在网</Tag>
              <span style={{float: 'left',color: 'white'}}>产权性质</span>
              <span style={{float: 'left',color: 'white',marginLeft: '10px',paddingLeft: '5px',borderLeft: '1px solid white'}}>骨干局站</span>
              <span style={{float: 'left',color: 'white',marginLeft: '10px',paddingLeft: '5px',borderLeft: '1px solid white'}}>省际</span>
            </div>
          </Col> */}
          <Col span={24}>
            <div
              ref={dom => {
                this.tabDOM = dom;
              }}
              style={{ overflow: 'auto', height }}
            >
              {this.props.children}
            </div>
          </Col>
        </Row>
        <span
          className={styles.imodalResize}
          onMouseDown={(e) => this.setState({ resizable: true, moveX: e.pageX, moveY: e.pageY })}
          onMouseUp={() => this.setState({ resizable: false })}
        />
      </div>
    );
  }
}
