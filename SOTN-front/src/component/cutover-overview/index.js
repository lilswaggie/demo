import React from 'react';
// import { Link } from 'react-router-dom';
import { Radio, DatePicker, Row, Col } from 'antd';
import moment from 'moment';
import ChartExampleCutover from '../pub/ChartExampleCutover';
import Iframe from '../../container/Iframe';
import CutoverLine from './components/CutoverLine';
import NameLike from './components/SearchInput';
import TablePagination from '../pub/TablePagination';
import { postMockAxios } from '../../axios/mainAxios';
import { formatNumber, baseStaticUrl } from '../../util/CommonUtils';
import { gotoPathWithState } from '../../util/ReduxUtil';

import './stylesheets/index.scss';

const dateFormat = 'YYYY-MM-DD';
const today = moment().format(dateFormat);
const tomorrow = moment()
  .add(1, 'days')
  .format(dateFormat);
const yestoday = moment()
  .subtract(1, 'days')
  .format(dateFormat);

class CutoverOverview extends React.Component {
  constructor(props) {
    super(props);
    // 从 location 传递过来 cutTime 必须是 Number 类型的时间戳(若为字符串类型则报错)
    const cutTime =
      this.props.location.state === undefined
        ? moment(moment().format(dateFormat))
        : this.props.location.state.cutTime;
    let firstTime = moment(cutTime).format(dateFormat);
    let secondTime = moment(cutTime).format(dateFormat);
    this.state = {
      // timeRage: [moment(today, dateFormat), moment(today, dateFormat)],
      timeRage: [moment(firstTime, dateFormat), moment(secondTime, dateFormat)],
      radioValue: 'TODAY',
      radioStatus: 'all',
      searchKey: '',
      cutoverList: [],
      securityLevel: {},
      lineTime: '',
      cutStatus: '',
      cutNumber: {
        today: { total: 0, finished: 0, unfinished: 0 },
        tomorrow: { total: 0, finished: 0, unfinished: 0 },
        yestoday: { total: 0, finished: 0, unfinished: 0 }
      },
      mapData: {},
      pageNo: 1,
      pageSize: 10,
      totalPage: 0,

      // 专线列表
      linePageNum: 1,
      linePageSize: 6,
      lineTotalCount: 0,
      leasedLine: []
    };
  }
  componentDidMount = () => {
    this.handlePageChange();
    this.getCutoverInfo();
    this.getCutNumber();
  };
  disabledDate = current => {
    const disabledStartDate =
      current <
      moment()
        .endOf('day')
        .subtract(1, 'months');
    const disabledEndDate =
      current >
      moment()
        .startOf('day')
        .add(1, 'months');
    return disabledStartDate || disabledEndDate;
  };
  onTimeChange = dateString => {
    this.setState({ timeRage: dateString }, () => {
      const { pageSize, searchKey } = this.state;
      this.handlePageChange(1, pageSize, searchKey);
    });
  };
  onRadioValueChange = e => {
    this.setState({ radioValue: e.target.value }, () => {
      const { radioValue, cutNumber, pageSize, searchKey } = this.state;
      if (radioValue === 'TODAY') {
        this.setState({
          timeRage: [moment(today, dateFormat), moment(today, dateFormat)],
          mapData: cutNumber.today
        });
      } else if (radioValue === 'YESTERDAY') {
        this.setState({
          timeRage: [
            moment(yestoday, dateFormat),
            moment(yestoday, dateFormat)
          ],
          mapData: cutNumber.yestoday
        });
      } else {
        this.setState({
          timeRage: [
            moment(tomorrow, dateFormat),
            moment(tomorrow, dateFormat)
          ],
          mapData: cutNumber.tomorrow
        });
      }
      this.handlePageChange(1, pageSize, searchKey);
      this.getCutoverInfo();
    });
  };
  onRadioStatusChange = e => {
    this.setState({ radioStatus: e.target.value });
    const { pageSize, searchKey } = this.state;
    this.handlePageChange(1, pageSize, searchKey);
  };
  handleChange = value => {
    this.setState({ searchKey: value });
  };
  search = value => {
    // this.setState({ searchKey });
    // const {  searchKey } = this.state;
    this.handlePageChange(1, this.state.pageSize, value);
  };
  // onSearchChange = (e) => {
  //   this.setState({ searchKey: e.target.value });
  // };
  handlePageChange = (
    pageNo = this.state.pageNo,
    pageSize = this.state.pageSize,
    searchKey
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
          timeRage,
          radioStatus,
          radioValue
        } = this.state;
        const startTime = moment(timeRage[0]).format('YYYY-MM-DD');
        const endTime = moment(timeRage[1]).format('YYYY-MM-DD');
        this.getCutoverList(
          pageNo,
          pageSize,
          moment(startTime).format('x'),
          moment(endTime).format('x'),
          radioStatus,
          radioValue,
          searchKey
        );
      }
    );
  };
  // 割接列表
  getCutoverList = (
    currentPage,
    pageSize,
    timeSince,
    timeUntil,
    status,
    hotKey,
    targetLike,
    elementId
  ) => {
    postMockAxios(
      'api/cutover',
      {
        currentPage: currentPage - 1,
        pageSize,
        input: {
          elementId: elementId,
          startDate: {
            customDate: {
              since: timeSince,
              until: timeUntil
            },
            dateOption: hotKey
          },
          status: status,
          targetLike: targetLike
        }
      },
      data => {
        this.setState({
          cutoverList: data.results,
          totalPage: data.totalElements
        });
      }
    );
  };
  // 割接影响专线
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
          lineTotalCount: data.totalElements
        })
    );
  };
  // 专线列表翻页
  onLinePageChange = (
    linePageNum = this.state.linePageNum,
    linePageSize = this.state.linePageSize
  ) => {
    this.setState({ linePageNum, linePageSize }, () => {
      const { linePageNum, linePageSize, timeRage, radioValue } = this.state;
      const startTime = moment(timeRage[0]).format('YYYY-MM-DD');
      const endTime = moment(timeRage[1]).format('YYYY-MM-DD');
      this.getLeasedLine(
        linePageNum,
        linePageSize,
        moment(startTime).format('x'),
        moment(endTime).format('x'),
        radioValue
      );
    });
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
      data =>
        this.setState({
          securityLevel: data.values,
          lineTime: data.time.timeRange.until
        })
    );
  };
  // 割接状态
  getStatus = (timeSince, timeUntil, hotKey, cutoverId, elementId) => {
    postMockAxios(
      'api/cutover/stats/status',
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
      data =>
        this.setState({
          cutStatus: data.values.status
        })
    );
  };
  // 统计昨天、今天、明天的信息
  getCutNumber = () => {
    postMockAxios(
      'api/cutover/stats/num/date',
      // {  },
      data => {
        this.setState(
          {
            cutNumber: data.values
          },
          () => {
            const { cutNumber } = this.state;
            this.setState({ mapData: cutNumber.today });
          }
        );
      }
    );
  };
  getCutoverInfo = () => {
    const { timeRage, radioValue } = this.state;
    const startTime = moment(timeRage[0]).format('YYYY-MM-DD');
    const endTime = moment(timeRage[1]).format('YYYY-MM-DD');
    // this.getLeasedLine(
    //   moment(startTime).format('x'),
    //   moment(endTime).format('x'),
    //   radioValue,
    // );
    this.onLinePageChange(1);
    this.getSecurityLevel(
      moment(startTime).format('x'),
      moment(endTime).format('x'),
      radioValue
    );
    this.getStatus(
      moment(startTime).format('x'),
      moment(endTime).format('x'),
      radioValue
    );
  };
  goToCutoverDetail = (cutoverInfo, time, cutStatus, hotKey) => e => {
    e.stopPropagation();
    gotoPathWithState('/main/fault/cutover/detail', {
      cutoverInfo,
      time,
      cutStatus,
      hotKey
    });
  };

  render() {
    const RadioButton = Radio.Button;
    const RadioGroup = Radio.Group;
    const RangePicker = DatePicker.RangePicker;
    const dateFormat = 'YYYY-MM-DD';

    const {
      timeRage,
      radioValue,
      radioStatus,
      cutoverList,
      totalPage,
      leasedLine,
      securityLevel,
      lineTime,
      cutNumber,
      mapData,
      cutStatus
    } = this.state;

    const cutoverTime = moment(Number(lineTime)).format('HH:mm');
    const cutStartTime = moment(
      moment(timeRage[0]).format('YYYY-MM-DD')
    ).format('x');
    const cutEndTime = moment(moment(timeRage[1]).format('YYYY-MM-DD')).format(
      'x'
    );
    const toData = cutNumber.tomorrow.total || 0;
    const todayData = cutNumber.today.total || 0;
    const yesData = cutNumber.yestoday.total || 0;
    const totalNumber = mapData.total || 0;
    const finisedNumber = mapData.finished || 0;
    const unfinishedNumber = mapData.unfinished || 0;
    const cancelNumber =
      mapData.total - mapData.finished - mapData.unfinished || 0;
    const aaaLine = securityLevel['AAA'] || 0;
    const aaLine = securityLevel['AA'] || 0;
    const aLine = securityLevel['A'] || 0;
    const normalLine = securityLevel['common'] || 0;
    return (
      <div className="cutover-overview">
        <div className="title clearfix">
          <span>割接概览</span>
        </div>
        <div className="select-btn clearfix">
          <span className="about-time">预计开始时间：</span>
          <RadioGroup
            value={radioValue}
            onChange={this.onRadioValueChange}
            className="select-time cleafix"
          >
            <RadioButton value="YESTERDAY">{`昨天(${yesData})`}</RadioButton>
            <RadioButton value="TODAY">{`今天(${todayData})`}</RadioButton>
            <RadioButton value="TOMORROW">{`明天(${toData})`}</RadioButton>
          </RadioGroup>
          <RangePicker
            className="select-date"
            value={timeRage}
            disabledDate={this.disabledDate}
            format={dateFormat}
            onChange={this.onTimeChange}
          />
        </div>
        <div className="cutover-content">
          <Row>
            <Col span={16}>
              <div className="cutover-map clearfix">
                <div style={{ position: 'absolute' }}>
                  <div className="total-cutover">
                    割接总数
                    <span>{formatNumber(totalNumber)}</span>
                  </div>
                  <div className="unfinished-cutover">
                    未完成
                    <span>{formatNumber(unfinishedNumber)}</span>
                  </div>
                  <div className="finished-cutover">
                    已完成
                    <span>{formatNumber(finisedNumber)}</span>
                  </div>
                  <div className="cancel-cutover">
                    已取消
                    <span>{formatNumber(cancelNumber)}</span>
                  </div>
                </div>
                <Iframe url={`${baseStaticUrl}gis/gis3/cutOver/china.html`} />
                <ChartExampleCutover />
              </div>
            </Col>
            <Col span={8}>
              <CutoverLine
                aaaLine={aaaLine}
                aaLine={aaLine}
                aLine={aLine}
                normalLine={normalLine}
                cutoverTime={cutoverTime}
                scrollY={'16.5rem'}
                pageNum={this.state.linePageNum}
                pageSize={this.state.linePageSize}
                totalCount={this.state.lineTotalCount}
                onPageChange={this.onLinePageChange}
                lineData={leasedLine}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div className="cutover-alarm">
                <div className="title clearfix">
                  <span>割接列表</span>
                </div>
                <RadioGroup
                  value={radioStatus}
                  onChange={this.onRadioStatusChange}
                  className="select-status cleafix"
                >
                  <RadioButton value="all">全部</RadioButton>
                  <RadioButton value="analysising">影响分析中</RadioButton>
                  <RadioButton value="auditing">审批中</RadioButton>
                  <RadioButton value="cutovering">割接中</RadioButton>
                  <RadioButton value="changing">资源变更中</RadioButton>
                  <RadioButton value="achiving">待归档</RadioButton>
                  <RadioButton value="achived">已归档</RadioButton>
                </RadioGroup>
                <div className="search-wrap clearfix">
                  <NameLike
                    placeholder="按割接对象搜索"
                    search={this.search}
                    handleChange={this.handleChange}
                    showSuffix={true}
                  />
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>割接主题</th>
                        <th>割接对象</th>
                        <th>拟开始时间</th>
                        <th>拟结束时间</th>
                        <th>工单状态</th>
                        <th>预计影响专线</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cutoverList.length === 0 ? (
                        <tr>
                          <td colSpan={7}>暂无数据</td>
                        </tr>
                      ) : (
                        cutoverList.map((item, index) => {
                          let startTime = moment(
                            parseInt(item.startedTime)
                          ).format('YYYY-MM-DD HH:mm');
                          let endTime = moment(
                            parseInt(item.finishedTime)
                          ).format('YYYY-MM-DD HH:mm');
                          let status, statusTag;
                          switch (item.status) {
                          case 'analysising':
                            status = '影响分析中';
                            statusTag = 'status-tag-info';
                            break;
                          case 'auditing':
                            status = '审批中';
                            statusTag = 'status-tag-info';
                            break;
                          case 'cutovering':
                            status = '割接中';
                            statusTag = 'status-tag-info';
                            break;
                          case 'changing':
                            status = '资源变更中';
                            statusTag = 'status-tag-info';
                            break;
                          case 'achiving':
                            status = '待归档';
                            statusTag = 'status-tag-error';
                            break;
                          case 'achived':
                            status = '已归档';
                            statusTag = 'status-tag-success';
                            break;
                          default:
                            status = '—';
                            statusTag = '';
                          }
                          return (
                            <tr key={index}>
                              <td title={item.subject}>{item.subject}</td>
                              <td title={item.target}>{item.target}</td>
                              <td title={startTime}>{startTime}</td>
                              <td title={endTime}>{endTime}</td>
                              <td title={status}>
                                <span className={statusTag}>{status}</span>
                              </td>
                              <td title={item.affectedLeasedLineNum}>
                                {item.affectedLeasedLineNum}
                              </td>
                              <td>
                                <span
                                  style={{ color: '#2C9CFA' }}
                                  onClick={this.goToCutoverDetail(
                                    item,
                                    [cutStartTime, cutEndTime],
                                    cutStatus,
                                    radioValue
                                  )}
                                >
                                  {/* <Link className="link" to={{
                                    pathname: "/main/fault/cutover/detail",
                                    state: {
                                      cutoverInfo: item,
                                      time: [cutStartTime, cutEndTime],
                                      cutStatus: cutStatus,
                                      hotKey: radioValue,
                                    }
                                  }}>
                                    详情
                                  </Link> */}
                                  详情
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                  <TablePagination
                    pageNumber={this.state.pageNo}
                    pageSize={this.state.pageSize}
                    total={totalPage}
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
export default CutoverOverview;
