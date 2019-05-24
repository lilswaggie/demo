import React from 'react';
import { Link } from 'react-router-dom';

import { Row, Col } from 'antd';

import moment from 'moment';
import 'moment/locale/zh-cn';

import PropTypes from 'prop-types';
import TablePagination from '../../pub/TablePagination';
import { postMockAxios } from '../../../axios/mainAxios';
import PieEchart from './PieEchart';
import CutoverProgress from './CoutoverPorgress';

import { objectEchartsArray, objLineName } from '../../../util/CommonUtils';

import '../stylesheets/detail.scss';

import gold from '../stylesheets/image/gold.svg';
import sliver from '../stylesheets/image/sliver.svg';
import bronze from '../stylesheets/image/bronze.svg';
import standard from '../stylesheets/image/standard.svg';
import progressing from '../stylesheets/image/progressing.svg';
import field from '../stylesheets/image/field.svg';
import success from '../stylesheets/image/success.svg';

class CutoverDetail extends React.Component {
  constructor(props) {
    super(props);
    const { state } = this.props.location;
    const { cutoverInfo, time, hotKey } = state;
    this.state = {
      cutoverId: cutoverInfo.id,
      proStatus: cutoverInfo.status,
      timeSince: time[0],
      timeUntil: time[1],
      hotKey: hotKey,
      leasedLine: [],
      pageNo: 1,
      pageSize: 10,
      totalPage: 0,
      securityLevel: [],
      clientLevel: []
    };
  }
  static propTypes = {
    cutoverInfo: PropTypes.array
  };
  componentDidMount = () => {
    this.handlePageChange();
    this.getPieData();
  };
  handlePageChange = (
    pageNo = this.state.pageNo,
    pageSize = this.state.pageSize
  ) => {
    this.setState(
      {
        pageNo,
        pageSize
      },
      () => {
        const {
          pageNo,
          pageSize,
          timeSince,
          timeUntil,
          hotKey,
          cutoverId
        } = this.state;
        this.getLeasedLine(
          pageNo,
          pageSize,
          timeSince,
          timeUntil,
          hotKey,
          cutoverId
        );
      }
    );
  };
  getLeasedLine = (
    currentPage,
    pageSize,
    timeSince,
    timeUntil,
    hotKey,
    cutoverId,
    elementId
  ) => {
    postMockAxios(
      'api/cutover/leased_line',
      {
        currentPage: currentPage - 1,
        pageSize,
        input: {
          cutoverId: cutoverId,
          elementId: elementId,
          startDate: {
            customDate: {
              since: timeSince,
              until: timeUntil
            },
            dateOption: hotKey
          }
        }
      },
      data =>
        this.setState({
          leasedLine: data.results,
          totalPage: data.totalElements
        })
    );
  };
  // AAA专线...
  getSecurityLevel = (timeSince, timeUntil, hotKey, cutoverId, elementId) => {
    postMockAxios(
      'api/cutover/stats/leased_line/security_level',
      {
        input: {
          cutoverId: cutoverId,
          elementId: elementId,
          startDate: {
            customDate: {
              since: timeSince,
              until: timeUntil
            },
            dateOption: hotKey
          }
        }
      },
      data => this.setState({ securityLevel: objLineName(data.values) })
    );
  };
  getClientLevel = cutoverId => {
    postMockAxios(
      'api/cutover/stats/customer/security_level',
      { cutoverId },
      data => this.setState({ clientLevel: objectEchartsArray(data.values) })
    );
  };
  getPieData = () => {
    const { timeSince, timeUntil, hotKey, cutoverId } = this.state;
    this.getSecurityLevel(timeSince, timeUntil, hotKey, cutoverId);
    this.getClientLevel(cutoverId);
  };

  render() {
    const { leasedLine, securityLevel, clientLevel, proStatus } = this.state;
    const { cutoverInfo, cutStatus } = this.props.location.state;
    const startTime = moment(parseInt(cutoverInfo.startedTime)).format(
      'YYYY-MM-DD HH:mm:ss'
    );
    const endTime = moment(parseInt(cutoverInfo.finishedTime)).format(
      'YYYY-MM-DD HH:mm:ss'
    );
    const clientText = '影响的客户';
    const lineText = '影响的专线';
    const clientName = '客户数';
    const lineName = '专线数';
    const color = ['#F65F7B', '#F0B34A', '#8776EF', '#71CA41'];
    const cutContent = [
      '草稿',
      '割接影响分析中',
      '割接审批中',
      '割接中',
      '资源变更中',
      '待归档',
      '已归档'
    ];
    // const proStatus = '割接审批中';
    return (
      <div className="cutover-detail">
        <div className="detail-header">
          <div>
            <Link to={'/main/fault/cutover'}>{'<'}返回</Link>
            <span>割接详情</span>
          </div>
        </div>
        <div className="detail-content">
          <Row>
            <Col span={24}>
              <div className="cutover-topic">
                <div className="topic-left clearfix">
                  <CutoverProgress
                    cutContent={cutContent}
                    proStatus={proStatus}
                  />
                </div>
                <div className="topic-right clearfix">
                  <div className="topic-header">
                    <span>{cutoverInfo.subject}</span>
                    <span className="object-name">{cutoverInfo.target}</span>
                  </div>
                  <div className="start-time clearfix">
                    <div />
                    <div>拟开始时间</div>
                    <div>{startTime}</div>
                  </div>
                  <div className="start-time clearfix">
                    <div />
                    <div>拟结束时间</div>
                    <div>{endTime}</div>
                  </div>
                  <div className="coutover-status">
                    {cutStatus === 'progress' ? (
                      <div>
                        {/* <Progress type="circle" percent={99} width={50} format={percent => `${percent}...`} /> */}
                        <img src={progressing} alt="割接未完成" />
                        <span>割接未完成</span>
                      </div>
                    ) : cutStatus === 'failed' ? (
                      <div>
                        <img src={field} alt="割接取消" />
                        <span>割接取消</span>
                      </div>
                    ) : (
                      <div>
                        <img src={success} alt="割接完成" />
                        <span>割接完成</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div className="cutover-analysis">
                <div className="title">
                  <span>预计影响分析</span>
                </div>
                <div className="cutover-client">
                  <div className="cilent-number clearfix">
                    <PieEchart
                      {...{
                        graphicText: clientText,
                        seriesName: clientName,
                        pieColor: color,
                        pieData: clientLevel
                      }}
                    />
                  </div>
                  <div className="line-number clearfix">
                    <PieEchart
                      {...{
                        graphicText: lineText,
                        seriesName: lineName,
                        pieColor: color,
                        pieData: securityLevel
                      }}
                    />
                  </div>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>电路名称</th>
                        <th>专线名称</th>
                        <th>业务保障等级</th>
                        <th>客户名称</th>
                        <th>客户服务等级</th>
                        <th>中断时长</th>
                        <th>是否影响重保</th>
                        <th>分析时间</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leasedLine.length === 0 ? (
                        <tr>
                          <td colSpan={8}>暂无数据</td>
                        </tr>
                      ) : (
                        leasedLine.map((item, index) => {
                          const clientClass = {
                            金牌: gold,
                            银牌: sliver,
                            铜牌: bronze,
                            标准: standard
                          };
                          let analysisTime = moment(
                            parseInt(item.analysisAt)
                          ).format('YYYY-MM-DD HH:mm:ss');
                          const influence =
                            item.affectedFProtect === true ? '是' : '否';
                          let status, statusTag;
                          switch (item.customerServiceLevel) {
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
                          return (
                            <tr key={index}>
                              <td title={item.circuitName}>
                                {item.circuitName}
                              </td>
                              <td title={item.name}>{item.name}</td>
                              <td title={item.securityLevel}>
                                {item.securityLevel}
                              </td>
                              <td title={item.customerName}>
                                {item.customerName}
                              </td>
                              <td title={status}>
                                <img
                                  src={clientClass[item.customerServiceLevel]}
                                  alt="tupian"
                                />
                                <span className={statusTag}>{status}</span>
                              </td>
                              <td title={item.interruptedTime}>
                                <span>{item.interruptedTime}</span>
                              </td>
                              <td title={influence}>{influence}</td>
                              <td title={analysisTime}>{analysisTime}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                  <TablePagination
                    pageNumber={this.state.pageNo}
                    pageSize={this.state.pageSize}
                    total={this.state.totalPage}
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
export default CutoverDetail;
