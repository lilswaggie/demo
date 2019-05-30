import React from 'react';

import PropTypes from 'prop-types';

import { Modal } from 'antd';

import WarnModal from '../component/pub/modal/WarnModal';
import { getAxios } from '../axios/mainAxios';

export default class ModalDemo extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    otnId: PropTypes.string,
    otnName: PropTypes.string
  };

  static defaultProps = {
    visible: false,
    // 父组件控制显示关闭
    onClose: () => {},
    otnId: '',
    otnName: ''
  };

  state = {
    warnSummary: 0,
    warnCountValues: {},

    pageNum: 1,
    pageSize: 10,
    total: 0,
    warnList: []
  };

  componentDidMount() {
    this.setData();
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.otnId !== this.props.otnId) {
      this.setData();
    }
  };

  setData = () => {
    this.setWarnCount();
    this.setWarnList();
  };

  setWarnCount = () => {
    getAxios(
      'api/alarms/stats/num/severity',
      { elementId: this.props.otnId },
      ({ summary, values }) =>
        this.setState({ warnSummary: summary, warnCountValues: values })
    );
  };

  setWarnList = (
    pageNum = this.state.pageNum,
    pageSize = this.state.pageSize
  ) => {
    getAxios(
      'api/alarms',
      {
        elementId: this.props.otnId,
        currentPage: pageNum - 1,
        pageSize: pageSize
      },
      ({ results, totalElements }) =>
        this.setState({
          warnList: results,
          total: totalElements,
          pageSize,
          pageNum
        })
    );
  };

  render() {
    const { visible, onClose, otnName } = this.props;
    const {
      warnSummary,
      warnCountValues,
      warnList,
      pageNum,
      pageSize,
      total
    } = this.state;

    return (
      <Modal
        title={`活动告警${otnName ? '-' + otnName : ''}`}
        visible={visible}
        footer={null}
        onCancel={onClose}
        width="56rem"
      >
        <WarnModal
          pathName="business"
          warnSummary={warnSummary}
          warnCountValues={warnCountValues}
          warnList={warnList}
          pageNum={pageNum}
          pageSize={pageSize}
          totalCount={total}
          onPageChange={this.setWarnList}
        />
      </Modal>
    );
  }
}
