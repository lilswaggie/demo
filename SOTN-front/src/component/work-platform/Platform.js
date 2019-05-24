import React, { Component } from 'react';
import '../../assets/css/work-platform/todo.scss';
import Public from './Public';
import Todo from './Todo';
export default class Platform extends Component {
  render() {
    return (
      <div id="todo-comp">
        <Todo />
        <Public />
      </div>
    );
  }
}
