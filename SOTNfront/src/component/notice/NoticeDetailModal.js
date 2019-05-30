import React, { Component } from 'react';
import { Modal, Divider } from 'antd';

import PropTypes from 'prop-types';

import { EXPIRE_TIME_FORMAT } from '../../container/NoticeManagerPage';

import '../../assets/css/notice/notice-detail.scss';

export default class NoticeDetailModal extends Component {
  static propTypes = {
    modalName: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    formValue: PropTypes.object.isRequired
  };

  render() {
    const {
      name,
      content,
      expire,
      expireTime,
      influence
    } = this.props.formValue;

    return (
      <Modal
        width={638}
        style={{ top: 50 }}
        title={this.props.modalName}
        wrapClassName="notice-detail-modal"
        visible={this.props.visible}
        onCancel={this.props.onHandleCancel}
        maskClosable={false}
        footer={null}
      >
        <div className="notice-detail">
          <div className="row">
            <p className="text title">{name}</p>
          </div>
          <div className="row">
            <span className="label">有效期：</span>
            <span className="text">
              {expire === 1
                ? '永久'
                : expireTime
                  ? expireTime.format(EXPIRE_TIME_FORMAT)
                  : ''}
            </span>
          </div>

          <Divider />

          <div className="row">
            <p className="notice-label">公告详情</p>
            <div className="content">{content}</div>
          </div>

          <div className="row influence-row">
            <p className="notice-label">影响范围</p>
            <div className="content">{influence}</div>
          </div>
        </div>
      </Modal>
    );
  }
}
