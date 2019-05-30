import React, { Component } from 'react';

import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';

import { Modal } from 'antd';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { reorderArr, removeFomArr } from '../../util/ArrayUtils';

import '../../assets/css/overview/custom-view-modal.scss';

export default class CustomViewModal extends Component {
  static propTypes = {
    title: PropTypes.string,
    visible: PropTypes.bool,
    onShowModuleChange: PropTypes.func.isRequired,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    // 选中的模块id的数组
    showModuleList: PropTypes.arrayOf(PropTypes.string)
  };

  allModuleArr = [
    { id: 'workOrder', name: '工单统计' },
    { id: 'networkQuality', name: '网络质量' },
    { id: 'businessQuality', name: '业务质量' },
    { id: 'networkScala', name: '网络规模' },
    { id: 'businessScala', name: '业务规模' }
  ];

  static defaultProps = {
    title: '自定义视图',
    visible: false,
    onShowModuleChange: () => {},
    onOk: () => {},
    onCancel: () => {},
    showModuleList: []
  };

  state = {
    currentShowModuleList: this.props.showModuleList
  };

  static getDerivedStateFromProps(nextProps, state) {
    if (!_.isEqual(state.currentShowModuleList, nextProps.showModuleList)) {
      return { currentShowModuleList: nextProps.showModuleList };
    }
    return null;
  }

  getModule = ({ id, name }, visible, index) => {
    const iconClass = classNames('icon', { add: !visible, remove: visible });
    const onClick = visible ? this.onModuleRemove(index) : this.onModuleAdd(id);
    return (
      <span key={index} className="module-item">
        <span className="name">{name}</span>
        <span className={iconClass} onClick={onClick} />
      </span>
    );
  };

  getAllModule = () => {
    const { currentShowModuleList } = this.state;
    return this.allModuleArr.map((m, i) => {
      return this.getModule(m, currentShowModuleList.indexOf(m.id) !== -1, i);
    });
  };

  getShowModuleList = () => {
    return this.state.currentShowModuleList.map(id => {
      return this.allModuleArr.find(m => m.id === id);
    });
  };

  onDragEnd = result => {
    if (!result.destination) {
      return;
    }
    const items = reorderArr(
      this.state.currentShowModuleList,
      result.source.index,
      result.destination.index
    );
    // this.setState({ currentShowModuleList: items });
    this.props.onShowModuleChange(items);
  };

  onOk = () => {
    this.props.onOk(this.state.currentShowModuleList);
  };

  onCancel = () => {
    this.props.onCancel();
  };

  onModuleRemove = index => () => {
    this.props.onShowModuleChange(
      removeFomArr(this.state.currentShowModuleList, index)
    );
  };

  onModuleAdd = id => () => {
    const { currentShowModuleList } = this.state;
    currentShowModuleList.push(id);
    this.props.onShowModuleChange(currentShowModuleList);
  };

  render() {
    const { title, visible } = this.props;
    return (
      <Modal
        width={680}
        title={title}
        visible={visible}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        <div className="custom-view-wrap">
          <p className="title">已添加（选中拖拽，调整顺序）</p>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  className="module-wrap added"
                  {...provided.droppableProps}
                >
                  {this.getShowModuleList().map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <span
                          key={index}
                          className="module-item"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <span className="name">{item.name}</span>
                          <span
                            className="icon remove"
                            onClick={this.onModuleRemove(index)}
                          />
                        </span>
                      )}
                    </Draggable>
                  ))}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <p className="title">全部</p>
          <div className="module-wrap all">{this.getAllModule()}</div>
        </div>
      </Modal>
    );
  }
}
