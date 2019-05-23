import React from 'react';
import { Row, Col, Table, Divider } from 'antd';

import TablePagination from '../pub/TablePagination';
import PieEchart from '../cutover-overview/components/PieEchart';

import { getAxios } from '../../axios/mainAxios';

import { gotoPath, goBack } from '../../util/ReduxUtil';
import { securityLevelLineMap } from '../../util/AnalysisUtils';
import { objectEchartsArray } from '../../util/CommonUtils';

import './influence-analysis.scss';

class InfluenceAnalysis extends React.Component {
  state = {
    pageNum: 1,
    pageSize: 10,
    totalCount: 0,
    lineList: [],

    // AAA、AA、A、commom
    securityLevel: {},
    // 金牌、银牌、铜牌、标准
    clientLevel: {},

    // elementName/title/id
    alarm: {}
  };

  componentDidMount = () => {
    const { state } = this.props.location;
    if (!state || !state.alarm || !state.alarm.id) {
      gotoPath('/main/home');
    } else {
      this.setState({ alarm: state.alarm }, this.setData);
    }
  };

  // leased_lines/
  // customers/stats/num/level
  // leased_lines/stats/security_level

  setData = () => {
    this.getSecurityLevel();
    this.getClientLevel();
    this.handlePageChange();
  };

  getParams = () => {
    return { alarmId: this.state.alarm.id };
  };

  handlePageChange = (
    currentPage = this.state.pageNum,
    pageSize = this.state.pageSize
  ) => {
    getAxios(
      'api/leased_lines',
      { currentPage: currentPage - 1, pageSize, ...this.getParams() },
      data => {
        let realData = data.results || [];
        realData.forEach(record => (record.key = record.id));
        this.setState({
          lineList: realData,
          totalCount: data.totalElements,
          pageSize,
          pageNum: currentPage
        });
      }
    );
  };

  // AAA专线...
  getSecurityLevel = () => {
    getAxios('api/leased_lines/stats/security_level', this.getParams(), data =>
      this.setState({
        securityLevel: objectEchartsArray(data.values)
          .filter(
            item => Object.keys(securityLevelLineMap).indexOf(item.name) >= 0
          )
          .map(item => {
            item.name = securityLevelLineMap[item.name];
            return item;
          })
      })
    );
  };

  getClientLevel = () => {
    getAxios('api/customers/stats/num/level', this.getParams(), data =>
      this.setState({
        clientLevel: objectEchartsArray(data.values).map(item => {
          item.name = item.name + '客户';
          return item;
        })
      })
    );
  };

  render() {
    const {
      lineList,
      securityLevel,
      clientLevel,
      totalCount,
      alarm
    } = this.state;

    const clientText = '影响的客户';
    const clientName = '客户数';
    const lineText = '影响的专线';
    const lineName = '专线数';
    const color = ['#71CA41', '#8776EF', '#F65F7B', '#F0B34A'];

    const columns = [
      {
        title: '电路名称',
        dataIndex: 'circuitName',
        width: '26%'
      },
      {
        title: '专线名称',
        dataIndex: 'name',
        width: '26%'
      },
      {
        title: '业务保障等级',
        dataIndex: 'securityLevel',
        width: '11%',
        render: text => {
          return (securityLevelLineMap[text] || '').replace('专线', '');
        }
      },
      {
        title: '客户名称',
        dataIndex: 'customerName',
        width: '26%'
      },
      {
        title: '客户服务等级',
        dataIndex: 'customerServiceLevel',
        render: text => {
          let status, statusTag;
          switch (text) {
          case '金牌':
            status = '金牌';
            statusTag = 'status-tag-gold';
            break;
          case '银牌':
            status = '银牌';
            statusTag = 'status-tag-sliver';
            break;
          case '铜牌':
            status = '铜牌';
            statusTag = 'status-tag-bronze';
            break;
          case '标准':
            status = '标准';
            statusTag = 'status-tag-standard';
            break;
          default:
            status = '—';
            statusTag = '';
          }
          return <span className={statusTag}>{status}</span>;
        },
        width: '12%',
        align: 'left'
      }
    ];

    return (
      <div className="influence-analysis">
        <div className="influence-header">
          <span className="back" onClick={goBack}>
            &lt; 返回
          </span>
          <span className="line-divider">
            <Divider type="vertical" />
          </span>
          <span>影响分析</span>
        </div>
        <div className="influence-content">
          <Row>
            <Col span={24}>
              <div className="cutover-analysis">
                <div className="space" />
                <div className="alarm-title">
                  <span>告警标题：&nbsp;{alarm.title}</span>
                  <span>告警对象：&nbsp;{alarm.elementName}</span>
                </div>
                <div className="title">
                  <span>影响分析</span>
                </div>
                <div className="cutover-client">
                  <div className="cilent-number clearfix">
                    <PieEchart
                      graphicText={clientText}
                      seriesName={clientName}
                      pieColor={color}
                      pieData={clientLevel}
                    />
                  </div>
                  <div className="line-number clearfix">
                    <PieEchart
                      graphicText={lineText}
                      seriesName={lineName}
                      pieColor={color}
                      pieData={securityLevel}
                    />
                  </div>
                </div>
                <div className="table-wrap">
                  <Table
                    columns={columns}
                    dataSource={lineList}
                    pagination={false}
                  />
                  <TablePagination
                    pageNumber={this.state.pageNo}
                    pageSize={this.state.pageSize}
                    total={totalCount}
                    preventDefaultLoad={true}
                    handlePageChange={this.handlePageChange}
                    pageSizeList={[10, 20, 50, 100]}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default InfluenceAnalysis;
