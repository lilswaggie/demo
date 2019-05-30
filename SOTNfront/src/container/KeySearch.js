/**
 * Created by wang.ning on 2019/5/23.
 */
import React, { Component } from 'react';
import Iframe from './Iframe';
import { baseStaticUrl } from '../util/CommonUtils';
import {
  Select,
  Button,
  Modal,
  Table,
  Tag,
  List,
  Checkbox,
  Row,
  Col,
  Pagination
} from 'antd';
import { postAxios, getAxios } from '../axios/mainAxios';
import IModal from '../component/search/IModal';
import Gis from '../component/home/Gis';
import '../assets/css/search/search.scss';
import { gotoPathWithState } from '../util/ReduxUtil';
import { processIframeMethod } from '../util/IframeUtils';

const Option = Select.Option;
const { Column } = Table;

export default class KeySearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resultData: [],
      value: undefined,
      checkedFlag: 0,
      placeholder: '请输入站点..',
      visible: false, //控制卡片呈现flag
      lineVisible: false, // 控制专线列表弹窗flag
      modalTitle: '', // 卡片标题名称
      info: {}, // 消息信息
      currentPage: 1,
      pagesize: 5,
      total: 1,
      reaserchPageSize: 10,
      reaserchCurrentPage: 1,
      data: [
        {
          // key: '1',
          name: '【AAA】聊城移动办公楼',
          aNe: { name: 123 },
          zNe: { name: 123 },
          businessBandwidth: '10G'
        },
        {
          // key: '2',
          name: '【AAA】聊城移动办公楼',
          aNe: { name: 123 },
          zNe: { name: 123 },
          businessBandwidth: '10G'
        },
        {
          // key: '3',
          name: '【AAA】聊城移动办公楼',
          aNe: { name: 123 },
          zNe: { name: 123 },
          businessBandwidth: '10G'
        }
      ],
      infoData: [
        {
          title: 'AAA',
          number: 5321
        },
        {
          title: 'AA',
          number: 4321
        },
        {
          title: 'A',
          number: 2321
        },
        {
          title: '普通',
          number: 9321
        }
      ]
    };
  }
  handleSearch = value => {
    //  搜索选择框搜索事件
    // var data = [];
    var param = {
      nameLike: value
    };
    if (this.state.checkedFlag === 0) {
      postAxios(
        '/api/network/sites?pageSize=' +
          this.state.reaserchPageSize +
          '&currentPage=' +
          this.state.reaserchCurrentPage,
        param,
        data => {
          this.setState({ resultData: data.results });
        }
      );
    } else if (this.state.checkedFlag === 1) {
      postAxios(
        '/api/network/elements?pageSize=' +
          this.state.reaserchPageSize +
          '&currentPage=' +
          this.state.reaserchCurrentPage,
        param,
        data => {
          this.setState({ resultData: data.results });
        }
      );
    } else if (this.state.checkedFlag === 2) {
      getAxios(
        '/api/customers?pageSize=' +
          this.state.reaserchPageSize +
          '&currentPage=' +
          this.state.reaserchCurrentPage +
          '&nameLike=' +
          param.nameLike,
        data => {
          this.setState({ resultData: data.results });
        }
      );
    } else if (this.state.checkedFlag === 3) {
      getAxios(
        '/api/leased_lines?pageSize=' +
          this.state.reaserchPageSize +
          '&currentPage=' +
          this.state.reaserchCurrentPage +
          '&nameLike=' +
          param.nameLike,
        data => {
          this.setState({ resultData: data.results });
        }
      );
    }
  };

  gotoNetworkDetail = () => {
    const { info } = this.state;
    if (info.id && info.name) {
      gotoPathWithState('/main/fault/network/detail', {otn: {id: info.id, name: info.name}});
    }
  }

  iframeName = 'iframe-gis-search';

  handleChange = (value, option) => {
    //  搜索选择框选择某一项后事件
    this.setState({ value });
    console.error('value:', value);
    console.error('option:', option);
    console.error('option:', option.props.data);
    this.setState({
      visible: true,
      modalTitle: option.props.children,
      info: option.props.data
    });

    processIframeMethod('...', this.iframeName)(value);

    console.error('data:', this.state.info);
  };
  handleClose = () => {
    //  信息卡片关闭按钮
    this.setState({
      visible: false
    });
  };
  handleOk = e => {
    //  专线列表弹窗确认按钮
    this.setState({
      lineVisible: false
    });
  };
  handleCancel = e => {
    //  专线列表弹窗取消按钮
    this.setState({
      lineVisible: false
    });
  };
  handlePage = (page, pageSize) => {
    // 修改分页页数
    this.setState({
      currentPage: page,
      pagesize: pageSize
    });
    getAxios(
      '/api/leased_lines?pageSize=' +
        this.state.pagesize +
        '&currentPage=' +
        this.state.currentPage +
        '&customer=' +
        this.state.info.id,
      data => {
        this.setState({
          data: data.results,
          currentPage: data.currentPage
        });
      }
    );
  };
  showLineModal = () => {
    // 显示专线列表弹窗
    this.setState({
      lineVisible: true
    });
    getAxios(
      '/api/leased_lines?pageSize=' +
        this.state.pagesize +
        '&currentPage=' +
        this.state.currentPage +
        '&customer=' +
        this.state.info.id,
      data => {
        this.setState({
          data: data.results,
          currentPage: data.currentPage
        });
      }
    );
    getAxios(
      '/api/leased_lines/stats/security_level?customer=' + this.state.info.id,
      data => {
        this.setState({
          infoData: [
            {
              title: 'AAA',
              number: data.values.additionalProp1
            },
            {
              title: 'AA',
              number: data.values.additionalProp2
            },
            {
              title: 'A',
              number: data.values.additionalProp3
            },
            {
              title: '普通',
              number: 9321
            }
          ]
        });
        console.error('securityLevel', data.values);
      }
    );
  };
  onChange = e => {
    // 客户卡片中专线列表弹窗  仅显示故障专线checkbox控制
    console.log(`checked = ${e.target.checked}`);
  };
  componentDidMount() {}

  handleTabChecked = param => {
    // 切换信息卡片tab页
    this.setState({
      checkedFlag: param,
      resultData: [],
      visible: false
    });
    // this.setState({ resultData: [] });
    switch (param) {
      case 0:
        this.setState({
          placeholder: '请输入站点..'
        });
        break;
      case 1:
        this.setState({
          placeholder: '请输入网元..'
        });
        break;
      case 2:
        this.setState({
          placeholder: '请输入客户..'
        });
        break;
      case 3:
        this.setState({
          placeholder: '请输入专线..'
        });
        break;
      default:
        break;
    }
  };

  testFrameMethods = (a, b) => {

  }
  render() {
    const options = this.state.resultData.map(d => (
      <Option data={d} key={d.id}>
        {d.name}
      </Option>
    ));
    return (
      <Gis>
        <Iframe
          name="iframe-gis-search"
          onLoaded={() => {}}
          url={`${baseStaticUrl}gis/gis3/key_search/china.html`}
          events={{
            testFrameMethods: this.testFrameMethods
          }}
        />
        <div className="seach-modal">
          <div id="search-bd" className="search-bd">
            <ul>
              <li
                onClick={this.handleTabChecked.bind(this, 0)}
                className={this.state.checkedFlag === 0 ? 'selected' : ''}
              >
                站点
              </li>
              <li
                onClick={this.handleTabChecked.bind(this, 1)}
                className={this.state.checkedFlag === 1 ? 'selected' : ''}
              >
                网元
              </li>
              <li
                onClick={this.handleTabChecked.bind(this, 2)}
                className={this.state.checkedFlag === 2 ? 'selected' : ''}
              >
                客户
              </li>
              <li
                onClick={this.handleTabChecked.bind(this, 3)}
                className={this.state.checkedFlag === 3 ? 'selected' : ''}
              >
                专线
              </li>
            </ul>
          </div>
          <Select
            className="search-select"
            showSearch
            value={this.state.value}
            placeholder={this.state.placeholder}
            style={this.props.style}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={this.handleSearch}
            onChange={this.handleChange}
            notFoundContent={null}
          >
            {options}
          </Select>
          <Button type="primary" icon="search" />
          {this.state.visible && (
            <IModal
              title={this.state.modalTitle}
              handleClose={this.handleClose}
              myStyle={{
                display: true,
                width: '432px',
                top: '100px',
                left: '2px'
              }}
            >
              {this.state.checkedFlag === 0 && (
                <Col
                  span={24}
                  style={{ backgroundColor: '#69A5E7', paddingBottom: '5px' }}
                >
                  <div>
                    <Tag
                      color="white"
                      style={{
                        border: '1px solid #2C9CFA',
                        borderRadius: '5px',
                        fontSize: '11px',
                        color: '#2C9CFA',
                        float: 'left',
                        marginLeft: '5px'
                      }}
                    >
                      {this.state.info.state}
                    </Tag>
                    <span style={{ float: 'left', color: 'white' }}>
                      产权性质
                    </span>
                    <span
                      style={{
                        float: 'left',
                        color: 'white',
                        marginLeft: '10px',
                        paddingLeft: '5px',
                        borderLeft: '1px solid white'
                      }}
                    >
                      骨干局站
                    </span>
                    <span
                      style={{
                        float: 'left',
                        color: 'white',
                        marginLeft: '10px',
                        paddingLeft: '5px',
                        borderLeft: '1px solid white'
                      }}
                    >
                      省际
                    </span>
                  </div>
                </Col>
              )}
              {this.state.checkedFlag === 0 && (
                <div>
                  <div
                    style={{
                      textAlign: 'left',
                      margin: '5px 0px',
                      marginTop: '35px'
                    }}
                  >
                    <span style={{ color: '#000', marginLeft: '5px' }}>
                      区域：{this.state.info.location}
                    </span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px' }}>
                    <span style={{ color: '#000', marginLeft: '5px' }}>
                      经纬度：{this.state.info.longitude}-
                      {this.state.info.latitude}
                    </span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px' }}>
                    <span style={{ color: '#000', marginLeft: '5px' }}>
                      入网时间：--
                    </span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px' }}>
                    <span style={{ color: '#000', marginLeft: '5px' }}>
                      包含传输网元数：{this.state.info.elementNum}
                    </span>
                  </div>
                </div>
              )}
              {this.state.checkedFlag === 1 && (
                <Col
                  span={24}
                  style={{ backgroundColor: '#69A5E7', paddingBottom: '5px' }}
                >
                  <div>
                    <Tag
                      color="white"
                      style={{
                        border: '1px solid #2C9CFA',
                        borderRadius: '5px',
                        fontSize: '11px',
                        color: '#2C9CFA',
                        float: 'left',
                        marginLeft: '5px'
                      }}
                    >
                      {this.state.info.state}
                    </Tag>
                    <span style={{ float: 'left', color: 'white' }}>
                      {this.state.info.vendor}
                    </span>
                    <span
                      style={{
                        float: 'left',
                        color: 'white',
                        marginLeft: '10px',
                        paddingLeft: '5px',
                        borderLeft: '1px solid white'
                      }}
                    >
                      {this.state.info.serviceLevel}
                    </span>
                    <span
                      style={{
                        float: 'left',
                        color: 'white',
                        marginLeft: '10px',
                        paddingLeft: '5px',
                        borderLeft: '1px solid white'
                      }}
                    >
                      {this.state.info.signalType}
                    </span>
                  </div>
                </Col>
              )}
              {this.state.checkedFlag === 1 && (
                <div>
                  <div
                    style={{
                      marginLeft: '5px',
                      marginBottom: '5px',
                      height: '65px'
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: '#FC6568',
                        color: '#000',
                        width: '65px',
                        float: 'left',
                        marginTop: '10px'
                      }}
                    >
                      1
                    </div>
                    <div
                      style={{
                        backgroundColor: '#FDA761',
                        color: '#000',
                        width: '65px',
                        float: 'left',
                        marginTop: '10px'
                      }}
                    >
                      2
                    </div>
                    <div
                      style={{
                        backgroundColor: '#FEEB78',
                        color: '#000',
                        width: '65px',
                        float: 'left',
                        marginTop: '10px'
                      }}
                    >
                      70
                    </div>
                    <div
                      style={{
                        backgroundColor: '#8DBDFC',
                        color: '#000',
                        width: '65px',
                        float: 'left',
                        marginTop: '10px'
                      }}
                    >
                      200
                    </div>
                    <Button
                      style={{ border: 'none', float: 'right' }}
                      size="large"
                      onClick={this.gotoNetworkDetail}
                    >
                      影响分析
                    </Button>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px' }}>
                    <span style={{ color: '#000', marginLeft: '5px' }}>
                      区域：{this.state.info.location}
                    </span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px' }}>
                    <span style={{ color: '#000', marginLeft: '5px' }}>
                      所属站点：{this.state.info.siteName}
                    </span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px' }}>
                    <span style={{ color: '#000', marginLeft: '5px' }}>
                      所属EMS：{this.state.info.emsName}
                    </span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px' }}>
                    <span style={{ color: '#000', marginLeft: '5px' }}>
                      所属传输子网：{this.state.info.transSubnet}
                    </span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px' }}>
                    <span style={{ color: '#000', marginLeft: '5px' }}>
                      支路端口数：
                    </span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px' }}>
                    <span style={{ color: '#000', marginLeft: '5px' }}>
                      IRDI端口数：
                    </span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px' }}>
                    <span style={{ color: '#000', marginLeft: '5px' }}>
                      包含办卡数：{this.state.info.cardNum}
                    </span>
                  </div>
                </div>
              )}
              {this.state.checkedFlag === 2 && (
                <Col
                  span={24}
                  style={{ backgroundColor: '#69A5E7', paddingBottom: '5px' }}
                >
                  <div>
                    <span
                      style={{
                        float: 'left',
                        color: 'white',
                        marginLeft: '5px'
                      }}
                    >
                      金牌客户
                    </span>
                    <span
                      style={{
                        float: 'left',
                        color: 'white',
                        marginLeft: '10px',
                        paddingLeft: '5px',
                        borderLeft: '1px solid white'
                      }}
                    >
                      金融行业
                    </span>
                  </div>
                </Col>
              )}
              {this.state.checkedFlag === 2 && (
                <div>
                  <div
                    style={{
                      textAlign: 'left',
                      margin: '5px 0px',
                      marginTop: '35px'
                    }}
                  >
                    <span style={{ color: '#000', marginLeft: '5px' }}>
                      区域：
                    </span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px' }}>
                    <span style={{ color: '#000', marginLeft: '5px' }}>
                      拥有专线数：
                    </span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px' }}>
                    <span style={{ color: '#000', marginLeft: '5px' }}>
                      较上月：
                    </span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px' }}>
                    <span style={{ color: '#000', marginLeft: '5px' }}>
                      故障专线数：
                    </span>
                  </div>
                  <div style={{ borderTop: '1px #CCCCCC solid' }}>
                    <Button
                      style={{ border: 'none', float: 'left' }}
                      size="large"
                    >
                      客户详情
                    </Button>
                    <Button
                      style={{ border: 'none', float: 'left' }}
                      size="large"
                      onClick={this.showLineModal}
                    >
                      专线列表
                    </Button>
                  </div>
                </div>
              )}
              {this.state.checkedFlag === 3 && (
                <Col
                  span={24}
                  style={{ backgroundColor: '#69A5E7', paddingBottom: '5px' }}
                >
                  <div>
                    <span
                      style={{
                        float: 'left',
                        color: 'white',
                        marginLeft: '5px'
                      }}
                    >
                      {this.state.info.securityLevel}
                    </span>
                    <span
                      style={{
                        float: 'left',
                        color: 'white',
                        marginLeft: '10px',
                        paddingLeft: '5px',
                        borderLeft: '1px solid white'
                      }}
                    >
                      {this.state.info.customerName}
                    </span>
                    <span
                      style={{
                        float: 'left',
                        color: 'white',
                        marginLeft: '10px',
                        paddingLeft: '5px',
                        borderLeft: '1px solid white'
                      }}
                    >
                      {this.state.info.businessBandwidth}
                    </span>
                  </div>
                </Col>
              )}
              {this.state.checkedFlag === 3 && (
                <div>
                  <div
                    style={{
                      marginLeft: '5px',
                      marginBottom: '5px',
                      height: '65px'
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: '#FC6568',
                        color: '#000',
                        width: '65px',
                        float: 'left',
                        marginTop: '10px'
                      }}
                    >
                      1
                    </div>
                    <div
                      style={{
                        backgroundColor: '#FDA761',
                        color: '#000',
                        width: '65px',
                        float: 'left',
                        marginTop: '10px'
                      }}
                    >
                      2
                    </div>
                    <div
                      style={{
                        backgroundColor: '#FEEB78',
                        color: '#000',
                        width: '65px',
                        float: 'left',
                        marginTop: '10px'
                      }}
                    >
                      70
                    </div>
                    <div
                      style={{
                        backgroundColor: '#8DBDFC',
                        color: '#000',
                        width: '65px',
                        float: 'left',
                        marginTop: '10px'
                      }}
                    >
                      200
                    </div>
                    <Button
                      style={{ border: 'none', float: 'right' }}
                      size="large"
                    >
                      专线故障
                    </Button>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px' }}>
                    <span style={{ color: '#000', marginLeft: '5px' }}>
                      电路名称：{this.state.info.circuitName}
                    </span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px' }}>
                    <span style={{ color: '#000', marginLeft: '5px' }}>
                      电路级别：{this.state.info.circuitName}
                    </span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px' }}>
                    <span style={{ color: '#000', marginLeft: '5px' }}>
                      A端传输设备：{this.state.info.aNe.name}
                    </span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px' }}>
                    <span style={{ color: '#000', marginLeft: '5px' }}>
                      Z端传输设备：{this.state.info.zNe.name}
                    </span>
                  </div>
                  <div style={{ borderTop: '1px #CCCCCC solid' }}>
                    <Button
                      style={{ border: 'none', float: 'left' }}
                      size="large"
                    >
                      专线详情
                    </Button>
                  </div>
                </div>
              )}
            </IModal>
          )}
        </div>
        <Modal
          title="专线列表"
          width="800px"
          visible={this.state.lineVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Row>
            <Col span={19}>
              <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={this.state.infoData}
                renderItem={item => (
                  <List.Item>
                    <span>
                      {item.title}({item.number})
                    </span>
                  </List.Item>
                )}
              />
            </Col>
            <Col span={5}>
              <Checkbox onChange={this.onChange}>仅显示故障专线</Checkbox>
            </Col>
          </Row>
          <Table pagination={false} dataSource={this.state.data}>
            <Column
              title="专线名称"
              dataIndex="name"
              key="name"
              width="250px"
            />
            <Column title="A端" dataIndex="aNe.name" key="aNe.name" />
            <Column title="Z端" dataIndex="zNe.name" key="zNe.name" />
            <Column
              title="带宽"
              dataIndex="businessBandwidth"
              key="businessBandwidth"
              width="70px"
            />
            <Column
              title="操作"
              key="action"
              width="70px"
              render={(text, record) => (
                <span>
                  <a href="javascript:;">详情</a>
                </span>
              )}
            />
          </Table>
          <Pagination
            style={{ textAlign: 'right', marginTop: '10px' }}
            current={this.state.currentPage}
            pageSize={this.state.pagesize}
            onChange={this.handlePage}
            total={this.state.total}
          />
        </Modal>
      </Gis>
    );
  }
}
