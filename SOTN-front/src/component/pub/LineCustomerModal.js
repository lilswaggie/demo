import React, { Component } from 'react';

import { connect } from 'react-redux';

import _ from 'lodash';

import { Modal, Tabs, Table } from 'antd';

import { medal } from '../business-manage/LineListTab';

import { showLineCustomerAction } from '../../redux/lineCustomerRedux';
import { gotoPathWithState } from '../../util/ReduxUtil';

import '../../assets/css/pub/line-customer.scss';

class LineCustomerModal extends Component {
  state = {
    tab: '1' // 1客户、2专线
  };

  componentDidUpdate = (prevProps, prevState) => {
    console.log(prevProps, this.props);
  };

  onTabChange = tab => this.setState({ tab });

  getCustomerList = () => {
    return _.uniqWith(
      this.props.lineList.map(line => ({
        id: line.customerId,
        customerName: line.customerName,
        customerServiceLevel: line.customerServiceLevel
      })),
      (l1, l2) => l1.id === l2.id
    );
  };

  onClose = () => this.props.dispatch(showLineCustomerAction(false));

  onRow = type => record => ({
    onClick: () => {
      switch (type) {
      case 1:
        this.onClose();
        gotoPathWithState('/main/business/client-detail', {
          businessType: this.props.businessType,
          clientInfo: record,
          gotoHome: true
        });
        break;
      case 2:
        this.onClose();
        gotoPathWithState('/main/business/line-detail', {
          businessType: this.props.businessType,
          lineInfo: record,
          gotoHome: true
        });
        break;
      default:
        break;
      }
    }
  });

  render() {
    const TabPane = Tabs.TabPane;
    // this.data = this.data.concat(this.data);
    // this.data = this.data.concat(this.data);
    const lineColumns = [
      {
        render: (text, record) => (
          <div className="line-name" title={record.name}>
            <span
              style={{ backgroundColor: record.faultState ? '#F65F7B' : '' }}
            />
            <span>
              [
              {record.securityLevel === 'common'
                ? '普通'
                : record.securityLevel}
              ]
            </span>
            <span>{record.name}</span>
          </div>
        ),
        align: 'left',
        width: '100%',
        className: 'control-line',
        key: '1'
      }
    ];
    const customerColumns = [
      {
        render: (text, record) => (
          <div className="client">
            <img alt="" src={medal[record.customerServiceLevel]} />
            <span>{record.customerName}</span>
          </div>
        ),
        align: 'left',
        width: '100%',
        className: 'control-line',
        key: '2'
      }
    ];
    return (
      <Modal
        title="选择专线/客户"
        className="line-customer"
        visible={this.props.visible}
        footer={null}
        onCancel={this.onClose}
      >
        <Tabs activeKey={this.state.tab} onChange={this.onTabChange}>
          <TabPane tab="客户" key="1">
            <Table
              showHeader={false}
              columns={customerColumns}
              dataSource={this.getCustomerList()}
              rowKey={record => record.id}
              pagination={false}
              onRow={this.onRow(1)}
              scroll={{ y: '18rem' }}
            />
          </TabPane>
          <TabPane tab="专线" key="2">
            <Table
              showHeader={false}
              columns={lineColumns}
              dataSource={this.props.lineList}
              rowKey={record => record.id}
              pagination={false}
              onRow={this.onRow(2)}
              scroll={{ y: '18rem' }}
            />
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  ...state.lineCustomer,
  businessType: state.business.type
});

export default connect(mapStateToProps)(LineCustomerModal);
