/**
 * Created by wang.ning on 2019/5/23.
 */
import React,{ Component } from 'react';
import esriLoader from 'esri-loader';
import Iframe from './Iframe';
import { formatNumber, baseStaticUrl, msToHour } from '../util/CommonUtils';
import { Select, Button } from 'antd';
import '../assets/css/search/search.scss';
import { postAxios,getAxios, postAxiosBodyAndQuery } from '../axios/mainAxios';

const Option = Select.Option;

export default class KeySearch extends Component {
  constructor(props){
    super(props);
    this.state = {
      resultData: [],
      value: undefined,
      checkedFlag: 0,
      placeholder:'请输入站点..'
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
  handleChange = value => {
    this.setState({ value });
  };
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
      resultData: []
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
    const options = this.state.resultData.map(d => <Option key={d.id}>{d.name}</Option>);
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
        </div>
      </div>
    );
  }
}
