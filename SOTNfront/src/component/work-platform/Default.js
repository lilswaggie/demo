import React, { Component } from 'react';
import '../../assets/css/work-platform/todo.scss';
import imgURL from '../../assets/image/work-platform/Group.png';
export default class Default extends Component {
  render() {
    return this.props.show ? (
      <div id="default">
        <img
          alt=""
          style={{ width: '120px', height: '120px', marginBottom: '10px' }}
          src={imgURL}
        />
        <span>{this.props.reminder}</span>
      </div>
    ) : (
      ''
    );
  }
}
