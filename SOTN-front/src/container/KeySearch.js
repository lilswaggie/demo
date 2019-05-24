/**
 * Created by wang.ning on 2019/5/23.
 */
import React,{ Component } from 'react';
import esriLoader from 'esri-loader';
import Iframe from './Iframe';
import { formatNumber, baseStaticUrl, msToHour } from '../util/CommonUtils';


export default class KeySearch extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){

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
  render() {
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
      </div>
    );
  }
}
