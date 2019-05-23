import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Checkbox } from 'antd';
export default class CategoryModal extends Component {
  state = {
    checkedList: [],
    indeterminate: false,
    isCheckAll: false
  };
  componentWillMount() {
    let { todoOptions } = this.props;
    let { isCheckAll, indeterminate } = this.checkStatus(todoOptions);
    this.setState({
      checkedList: [...todoOptions],
      isCheckAll,
      indeterminate
    });
  }
  checkStatus = list => {
    let isCheckAll = list.every(item => item.display);
    let indeterminate = list.some(item => item.display);
    return { isCheckAll, indeterminate: indeterminate && !isCheckAll };
  };
  onCheckChange = index => () => {
    let tempList = [...this.state.checkedList];
    let temp = tempList[index];
    temp.display = !temp.display;
    tempList.splice(index, 1, temp);
    let { isCheckAll, indeterminate } = this.checkStatus(tempList);
    this.setState({
      checkedList: [...tempList],
      isCheckAll,
      indeterminate
    });
  };
  onCheckAllChange = e => {
    let tempList = [...this.state.checkedList];
    if (e.target.checked) {
      tempList.forEach(item => (item.display = true));
      this.setState({
        checkedList: tempList,
        isCheckAll: true,
        indeterminate: false
      });
    } else {
      tempList.forEach(item => (item.display = false));
      this.setState({
        checkedList: tempList,
        isCheckAll: false,
        indeterminate: false
      });
    }
  };

  render() {
    const { indeterminate, isCheckAll } = this.state;
    return (
      <Modal
        width="600px"
        bodyStyle={{ paddingLeft: '60px', paddingRight: '50px' }}
        title="自定义"
        visible={this.props.visible}
        onOk={() => this.props.handleOk(this.state.checkedList)}
        onCancel={this.props.handleCancel}
      >
        <div>
          <div style={{ marginBottom: '10px', color: '#72758C' }}>
            <Checkbox
              indeterminate={indeterminate}
              onChange={this.onCheckAllChange}
              checked={isCheckAll}
            >
              全选
            </Checkbox>
          </div>
          {this.state.checkedList.map((item, index) => {
            return (
              <Button
                className={`category-btn ${item.display ? 'active' : ''}`}
                onClick={this.onCheckChange(index)}
                key={index}
              >
                {item.typeLabel}
              </Button>
            );
          })}
        </div>
      </Modal>
    );
  }
}

Component.propTypes = {
  visible: PropTypes.bool,
  handleOk: PropTypes.func,
  handleCancel: PropTypes.func
};
