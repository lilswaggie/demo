import React, { Component } from 'react';
import { Modal, Button, Radio, DatePicker, Input } from 'antd';

import PropTypes from 'prop-types';

import { EXPIRE_TIME_FORMAT } from '../../container/NoticeManagerPage';

import '../../assets/css/notice/notice-edit.scss';

const RadioGroup = Radio.Group;

export default class NoticeEditModal extends Component {
  static propTypes = {
    modalName: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    onHandleCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    formValue: PropTypes.object.isRequired,
    onChangeFormValue: PropTypes.func.isRequired
  };

  state = {
    timeOpen: false,
    nameCheck: false,
    contentCheck: false,
    influenceCheck: false,
    expireCheck: false
  };

  stateNameMap = {
    name: '公告标题',
    content: '公告详情',
    influence: '影响范围',
    expire: '有效期'
  };

  onTimeOpenChange = status => {
    if (status && this.props.formValue.expire !== 2) {
      this.props.onChangeFormValue('expire', 2);
    }
    this.setState({ timeOpen: status });
  };

  onFormChange = name => e => {
    this.props.onChangeFormValue(name, e.target.value);
    this.setChecked(`${name}Check`, true)();
  };

  onTimeChange = (m, value) => {
    this.props.onChangeFormValue('expireTime', m);
  };

  onOk = value => {};

  setChecked = (stateName, bool) => () => this.setState({ [stateName]: bool });

  setAllChecked = callback => {
    const changeState = {};
    Object.keys(this.stateNameMap).forEach(name => {
      name = `${name}Check`;
      !this.state[name] && (changeState[name] = true);
    });
    this.setState(changeState, callback);
  };

  isAllCheckedValid = () => {
    return Object.keys(this.stateNameMap).every(
      name => !this.getCheckedMsg(name)
    );
  };

  onSave = () => {
    this.setAllChecked(
      () => this.isAllCheckedValid() && this.props.onSubmit('TB_PUBLISH')
    );
  };

  onPublish = () => {
    this.setAllChecked(
      () => this.isAllCheckedValid() && this.props.onSubmit('PUBLISHED')
    );
  };

  getCheckedMsg = name => {
    const value = this.props.formValue[name];
    const isCheck = this.state[`${name}Check`];
    if (name === 'expire') {
      return isCheck && value === 2 && !this.props.formValue.expireTime
        ? `请选择${this.stateNameMap[name]}`
        : '';
    } else {
      return isCheck && !value ? `请输入${this.stateNameMap[name]}` : '';
    }
  };

  render() {
    return (
      <Modal
        width={638}
        style={{ top: 50 }}
        title={this.props.modalName}
        wrapClassName="notice-edit-modal"
        visible={this.props.visible}
        onCancel={this.props.onHandleCancel}
        maskClosable={false}
        footer={[
          <Button key="1" className="save" onClick={this.onSave}>
            存为草稿
          </Button>,
          <Button
            key="2"
            type="primary"
            size="default"
            onClick={this.onPublish}
          >
            发布
          </Button>
        ]}
      >
        <div className="edit-notice">
          <div className="notice-row">
            <span className="notice-label">
              <em>*</em>公告主题
            </span>
            <Input
              className="notice-title"
              value={this.props.formValue.name}
              onChange={this.onFormChange('name')}
              type="text"
              maxLength={20}
              placeholder=""
              // onFocus={this.setChecked('isCheckTitle', true)}
            />
          </div>
          <div className="error-message">{this.getCheckedMsg('name')}</div>

          <div className="notice-row">
            <span className="notice-label ">
              <em>*</em>公告详情
            </span>
            <Input.TextArea
              value={this.props.formValue.content}
              onChange={this.onFormChange('content')}
              maxLength={200}
              placeholder=""
              // onFocus={this.setChecked('isCheckContent', true)}
            />
          </div>
          <div className="error-message">{this.getCheckedMsg('content')}</div>

          <div className="notice-row">
            <span className="notice-label">
              <em>*</em>影响范围
            </span>
            <Input.TextArea
              value={this.props.formValue.influence}
              onChange={this.onFormChange('influence')}
              maxLength={200}
              placeholder="若无请输入‘无’"
              // onFocus={this.setChecked('isCheckInfluence', true)}
            />
          </div>
          <div className="error-message">{this.getCheckedMsg('influence')}</div>

          <div className="notice-row">
            <span className="notice-label">
              <em>*</em>有效期
            </span>
            <RadioGroup
              name="radio-group"
              value={this.props.formValue.expire || 1}
              onChange={this.onFormChange('expire')}
            >
              <Radio value={1}>永久</Radio>
              <Radio value={2}>
                <DatePicker
                  className={
                    this.props.formValue.expire === 2 ? 'active-time' : ''
                  }
                  showTime={true}
                  format={EXPIRE_TIME_FORMAT}
                  value={this.props.formValue.expireTime}
                  onChange={this.onTimeChange}
                  onOk={this.onOk}
                  open={this.state.timeOpen}
                  onOpenChange={this.onTimeOpenChange}
                />
              </Radio>
            </RadioGroup>
          </div>
          <div className="error-message">{this.getCheckedMsg('expire')}</div>
        </div>
      </Modal>
    );
  }
}
