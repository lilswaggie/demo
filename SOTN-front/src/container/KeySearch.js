/**
 * Created by wang.ning on 2019/5/23.
 */
import React,{ Component } from 'react';
import esriLoader from 'esri-loader';
import Iframe from './Iframe';
import { formatNumber, baseStaticUrl, msToHour } from '../util/CommonUtils';
import { Select, Button, Modal, Table, Divider, Tag, List, Checkbox, Row, Col, Pagination } from 'antd';
import '../assets/css/search/search.scss';
import { postAxios,getAxios, postAxiosBodyAndQuery } from '../axios/mainAxios';
import IModal from '../component/IModal';

const Option = Select.Option;
const { Column, ColumnGroup } = Table;

export default class KeySearch extends Component {
  constructor(props){
    super(props);
    this.state = {
      resultData: [],
      value: undefined,
      checkedFlag: 0,
      placeholder:'请输入站点..',
      visible: true,//控制卡片呈现flag
      lineVisible: false, // 控制专线列表弹窗flag
      modalTitle: '', // 卡片标题名称
      info: [], // 消息信息
      currentPage: 1,
      totalPage: 1,
      pagesize: 5,
      data: [
        {
          // key: '1',
          name: '【AAA】聊城移动办公楼',
          aNe: {name: 123},
          zNe: {name: 123},
          businessBandwidth: '10G',
        },
        {
          // key: '2',
          name: '【AAA】聊城移动办公楼',
          aNe: {name: 123},
          zNe: {name: 123},
          businessBandwidth: '10G',
        },
        {
          // key: '3',
          name: '【AAA】聊城移动办公楼',
          aNe: {name: 123},
          zNe: {name: 123},
          businessBandwidth: '10G',
        }
      ],
      infoData: [
        {
          title: 'AAA',
          number: 5321,
        },
        {
          title: 'AA',
          number: 4321,
        },
        {
          title: 'A',
          number: 2321,
        },
        {
          title: '普通',
          number: 9321,
        }
      ]
    };
  }
  handleSearch = value => {
    // var data = [];
    var param = {
      nameLike: value
    };
    if (this.state.checkedFlag === 0) {
      postAxios('/api/network/sites?pageSize=10&currentPage=1', param, data =>{
        this.setState({ resultData: data.results });
      });
    } else if (this.state.checkedFlag === 1) {
      postAxios('/api/network/elements?pageSize=10&currentPage=1', param, data =>{
        this.setState({ resultData: data.results });
      });
    } else if (this.state.checkedFlag === 2) {
      getAxios('/api/customers?pageSize=10&currentPage=1&nameLike='+ param.nameLike, data =>{
        this.setState({ resultData: data.results });
      });
    } else if (this.state.checkedFlag === 3) {
      getAxios('/api/leased_lines?pageSize=10&currentPage=1&nameLike='+ param.nameLike, data =>{
        this.setState({ resultData: data.results });
      });
    }

  };
  handleChange = (value, option) => {
    this.setState({ value });
    console.error('value:', value);
    console.error('option:', option);
    console.error('option:', option.props.data);
    this.setState({
      visible: true,
      modalTitle: option.props.children,
      info: option.props.data
    });
    console.error('data:', this.state.info);
  };
  handleClose = () => {
    this.setState({
      visible:false,
    });
  };
  handleOk = e => {
    this.setState({
      lineVisible: false,
    });
  };
  handleCancel = e => {
    this.setState({
      lineVisible: false,
    });
  };
  handlePage = (page, pageSize) => {
    this.setState({
      currentPage: page,
      pagesize: pageSize
    });
    getAxios('/api/leased_lines?pageSize=' + pageSize + '&currentPage=' + page + '&customer='+ this.state.info.id, data =>{
      this.setState({ data: data.results });
    });
  };
  showLineModal = () => {
    this.setState({
      lineVisible: true,
    });
    getAxios('/api/leased_lines?pageSize=10&currentPage=1&customer='+ this.state.info.id, data =>{
      this.setState({ data: data.results });
    });
  }
  onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  }
  componentDidMount(){
    this.handleSearchXX();
  }
  // getType = () => {
  //   postAxios('api/network/stats/site/type', this.getFilterParams(), data =>
  //     this.setState({ siteTypeArr: objectEchartsArray(data.values) })
  //   );
  // };
  handleSearchXX =()=>{
    // getAxios('api/leased_lines?nameLike="专线"', data =>{
    //   alert(123);
    //   console.error('dataxxxx',data);
    // });
    var param = {
      nameLike: '测试'
    };
    postAxios('/api/network/sites', param, data =>
      console.error('site', data)
    );
  }
  initMap(){

    let ArcgisObj = {
      url:'http://localhost:9090/arcgis_v36/arcgis_js_api/library/3.26/3.26/init.js',
      Global:{
        sysAddr_317:''
      }
    };

    esriLoader.loadModules(
      ['esri/map',
        'esri/SpatialReference',
        'esri/layers/ArcGISDynamicMapServiceLayer',
        'esri/layers/ArcGISTiledMapServiceLayer',
        'esri/geometry/Extent',
        'esri/layers/WebTiledLayer',
        'esri/geometry/Point',
        'dojo/domReady!'],ArcgisObj
    ).then(([Map,SpatialReference,ArcGISTiledMapServiceLayer,ArcGISDynamicMapServiceLayer,Extent,WebTiledLayer,Point])=>{
      let this_instance = this;
      let map = new Map('mapDiv', {
        logo: false,
        slider: true,
        showLabels: true,
        //extent: extent,
        zoom: 4
      });
      let heMapUrl = 'http://sgdt.mlocso.com:8089/tileServer?x={col}&y={row}&z={level}&maptype=2&key=5592f4830d22caccc27546e61faf9048&number=123456789';
      var layer = new WebTiledLayer(heMapUrl,{'id': 'baseMap'});
      map.addLayer(layer);
      map.setZoom(4);
      var point = new Point({x:104.42361111111111,y:36.54083333333333,spatialReference:{wkid:4326}});
      map.centerAt(point);
    });
  }
  handleTabChecked =(param)=>{
    this.handleSearchXX();
    this.setState({
      checkedFlag: param,
      resultData: [],
      // visible:false,
    });
    // this.setState({ resultData: [] });
    switch(param) {
    case 0 :
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
  }
  render() {
    const options = this.state.resultData.map(d => <Option data={d} key={d.id}>{d.name}</Option>);
    return (
      <div style={{width:'100%',height:800}}>
        <Iframe
          // url={`${baseStaticUrl}gis/gis3/networkFault/${this.props.business.type === 1 ? 'world' : 'china'}.html`}
          url={`${baseStaticUrl}gis/gis3/networkFault/china.html`}
          events={{
            setWarnOtnNetworkFault: this.setWarnOtnNetworkFault,
            clearWarnOtnNetworkFault: this.clearWarnOtnNetworkFault
          }}
        />
        <div
          className="seach-modal">
          <div id="search-bd" className="search-bd">
            <ul>
              <li onClick = {this.handleTabChecked.bind(this,0)} className={this.state.checkedFlag === 0 ? 'selected':''}>站点</li>
              <li onClick = {this.handleTabChecked.bind(this,1)} className={this.state.checkedFlag === 1 ? 'selected':''}>网元</li>
              <li onClick = {this.handleTabChecked.bind(this,2)} className={this.state.checkedFlag === 2 ? 'selected':''}>客户</li>
              <li onClick = {this.handleTabChecked.bind(this,3)} className={this.state.checkedFlag === 3 ? 'selected':''}>专线</li>
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
            notFoundContent={null}>
            {options}
          </Select>
          <Button type="primary" icon="search"/>
          {this.state.visible &&
            <IModal
              title={this.state.modalTitle}
              handleClose={this.handleClose}
              myStyle={{ display: true, width: '432px', top: '100px', left: '2px' }}>
              {this.state.checkedFlag === 0 &&
                <Col
                  span={24}
                  style={{ backgroundColor: '#69A5E7', paddingBottom: '5px' }}>
                  <div>
                    <Tag
                      color="white"
                      style={{ border: '1px solid #2C9CFA',borderRadius: '5px',fontSize: '11px',color: '#2C9CFA',float: 'left',marginLeft: '5px' }}>{this.state.info.state}</Tag>
                    <span style={{float: 'left',color: 'white'}}>产权性质</span>
                    <span style={{float: 'left',color: 'white',marginLeft: '10px',paddingLeft: '5px',borderLeft: '1px solid white'}}>骨干局站</span>
                    <span style={{float: 'left',color: 'white',marginLeft: '10px',paddingLeft: '5px',borderLeft: '1px solid white'}}>省际</span>
                  </div>
                </Col>
              }
              {this.state.checkedFlag === 0 &&
                <div>
                  <div style={{ textAlign: 'left', margin: '5px 0px', marginTop: '35px'}}>
                    <span style={{ color: '#000', marginLeft: '5px'}}>区域：{this.state.info.location}</span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px'}}>
                    <span style={{ color: '#000', marginLeft: '5px'}}>经纬度：{this.state.info.longitude}-{this.state.info.latitude}</span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px'}}>
                    <span style={{ color: '#000', marginLeft: '5px'}}>入网时间：没有</span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px'}}>
                    <span style={{ color: '#000', marginLeft: '5px'}}>包含传输网元数：{this.state.info.elementNum}</span>
                  </div>
                </div>
              }
              {this.state.checkedFlag === 1 &&
                <Col
                  span={24}
                  style={{ backgroundColor: '#69A5E7', paddingBottom: '5px' }}>
                  <div>
                    <Tag
                      color="white"
                      style={{ border: '1px solid #2C9CFA',borderRadius: '5px',fontSize: '11px',color: '#2C9CFA',float: 'left',marginLeft: '5px' }}>{this.state.info.state}</Tag>
                    <span style={{float: 'left',color: 'white'}}>{this.state.info.vendor}</span>
                    <span style={{float: 'left',color: 'white',marginLeft: '10px',paddingLeft: '5px',borderLeft: '1px solid white'}}>{this.state.info.serviceLevel}</span>
                    <span style={{float: 'left',color: 'white',marginLeft: '10px',paddingLeft: '5px',borderLeft: '1px solid white'}}>{this.state.info.signalType}</span>
                  </div>
                </Col>
              }
              {this.state.checkedFlag === 1 &&
                <div>
                  <div style={{ marginLeft: '5px', marginBottom:'5px',height: '65px' }}>
                    <div style={{ backgroundColor: '#FC6568', color: '#000', width: '65px', float: 'left', marginTop: '10px'}}>1</div>
                    <div style={{ backgroundColor: '#FDA761', color: '#000', width: '65px', float: 'left', marginTop: '10px'}}>2</div>
                    <div style={{ backgroundColor: '#FEEB78', color: '#000', width: '65px', float: 'left', marginTop: '10px'}}>70</div>
                    <div style={{ backgroundColor: '#8DBDFC', color: '#000', width: '65px', float: 'left', marginTop: '10px'}}>200</div>
                    <Button
                      style={{ border: 'none', float: 'right' }}
                      size="large"
                    >影响分析</Button>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px'}}>
                    <span style={{ color: '#000', marginLeft: '5px'}}>区域：{this.state.info.location}</span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px'}}>
                    <span style={{ color: '#000', marginLeft: '5px'}}>所属站点：{this.state.info.siteName}</span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px'}}>
                    <span style={{ color: '#000', marginLeft: '5px'}}>所属EMS：{this.state.info.emsName}</span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px'}}>
                    <span style={{ color: '#000', marginLeft: '5px'}}>所属传输子网：{this.state.info.transSubnet}</span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px'}}>
                    <span style={{ color: '#000', marginLeft: '5px'}}>支路端口数：</span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px'}}>
                    <span style={{ color: '#000', marginLeft: '5px'}}>IRDI端口数：</span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px'}}>
                    <span style={{ color: '#000', marginLeft: '5px'}}>包含办卡数：{this.state.info.cardNum}</span>
                  </div>
                </div>
              }
              {this.state.checkedFlag === 2 &&
                <Col
                  span={24}
                  style={{ backgroundColor: '#69A5E7', paddingBottom: '5px' }}>
                  <div>
                    <span style={{float: 'left',color: 'white',marginLeft: '5px'}}>金牌客户</span>
                    <span style={{float: 'left',color: 'white',marginLeft: '10px',paddingLeft: '5px',borderLeft: '1px solid white'}}>金融行业</span>
                  </div>
                </Col>
              }
              {this.state.checkedFlag === 2 &&
                <div>
                  <div style={{ textAlign: 'left', margin: '5px 0px', marginTop: '35px'}}>
                    <span style={{ color: '#000', marginLeft: '5px'}}>区域：</span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px'}}>
                    <span style={{ color: '#000', marginLeft: '5px'}}>拥有专线数：</span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px'}}>
                    <span style={{ color: '#000', marginLeft: '5px'}}>较上月：</span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px'}}>
                    <span style={{ color: '#000', marginLeft: '5px'}}>故障专线数：</span>
                  </div>
                  <div style={{ borderTop: '1px #CCCCCC solid'}}>
                    <Button
                      style={{ border: 'none', float: 'left' }}
                      size="large"
                    >客户详情</Button>
                    <Button
                      style={{ border: 'none', float: 'left' }}
                      size="large"
                      onClick={this.showLineModal}
                    >专线列表</Button>
                  </div>
                </div>
              }
              {this.state.checkedFlag === 3 &&
                <Col
                  span={24}
                  style={{ backgroundColor: '#69A5E7', paddingBottom: '5px' }}>
                  <div>
                    <span style={{float: 'left',color: 'white',marginLeft: '5px'}}>{this.state.info.securityLevel}</span>
                    <span style={{float: 'left',color: 'white',marginLeft: '10px',paddingLeft: '5px',borderLeft: '1px solid white'}}>{this.state.info.customerName}</span>
                    <span style={{float: 'left',color: 'white',marginLeft: '10px',paddingLeft: '5px',borderLeft: '1px solid white'}}>{this.state.info.businessBandwidth}</span>
                  </div>
                </Col>
              }
              {this.state.checkedFlag === 3 &&
                <div>
                  <div style={{ marginLeft: '5px', marginBottom:'5px',height: '65px' }}>
                    <div style={{ backgroundColor: '#FC6568', color: '#000', width: '65px', float: 'left', marginTop: '10px'}}>1</div>
                    <div style={{ backgroundColor: '#FDA761', color: '#000', width: '65px', float: 'left', marginTop: '10px'}}>2</div>
                    <div style={{ backgroundColor: '#FEEB78', color: '#000', width: '65px', float: 'left', marginTop: '10px'}}>70</div>
                    <div style={{ backgroundColor: '#8DBDFC', color: '#000', width: '65px', float: 'left', marginTop: '10px'}}>200</div>
                    <Button
                      style={{ border: 'none', float: 'right' }}
                      size="large"
                    >专线故障</Button>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px'}}>
                    <span style={{ color: '#000', marginLeft: '5px'}}>电路名称：{this.state.info.circuitName}</span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px'}}>
                    <span style={{ color: '#000', marginLeft: '5px'}}>电路级别：{this.state.info.circuitName}</span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px'}}>
                    <span style={{ color: '#000', marginLeft: '5px'}}>A端传输设备：{this.state.info.aNe.name}</span>
                  </div>
                  <div style={{ textAlign: 'left', margin: '5px 0px'}}>
                    <span style={{ color: '#000', marginLeft: '5px'}}>Z端传输设备：{this.state.info.zNe.name}</span>
                  </div>
                  <div style={{ borderTop: '1px #CCCCCC solid'}}>
                    <Button
                      style={{ border: 'none', float: 'left' }}
                      size="large"
                    >专线详情</Button>
                  </div>
                </div>
              }
            </IModal>
          }
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
                    <span>{item.title}({item.number})</span>
                  </List.Item>
                )}
              />
            </Col>
            <Col span={5}>
              <Checkbox onChange={this.onChange}>仅显示故障专线</Checkbox>
            </Col>
          </Row>
          <Table dataSource={this.state.data}>
            <Column title="专线名称" dataIndex="name" key="name" width="250px" />
            <Column title="A端" dataIndex="aNe.name" key="aNe.name" />
            <Column title="Z端" dataIndex="zNe.name" key="zNe.name" />
            <Column title="带宽" dataIndex="businessBandwidth" key="businessBandwidth" width="70px"/>
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
            current={this.state.currentPage}
            total={this.state.totalPage}
            pageSize={this.state.pagesize}
            onChange={this.handlePage}/>
        </Modal>
      </div>
    );
  }
}
