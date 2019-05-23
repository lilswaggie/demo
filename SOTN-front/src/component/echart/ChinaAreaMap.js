import React, { Component } from 'react';

import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import _ from 'lodash';

import ReactEcharts from 'echarts-for-react';

import 'echarts/map/js/china';

import { showLineCustomerAction } from '../../redux/lineCustomerRedux';
import {
  formatNumber,
  mapState2PropsWithNoProps
} from '../../util/CommonUtils';

import '../../assets/css/echarts.scss';

window._ = _;

class ChinaAreaMap extends Component {
  static propTypes = {
    needPercent: PropTypes.bool,
    dataArr: PropTypes.array,
    className: PropTypes.string,
    itemName: PropTypes.string,
    showLines: PropTypes.bool,
    lineList: PropTypes.array
  };

  static defaultProps = {
    needPercent: false,
    dataArr: [],
    showLines: false
  };

  getName = regionName =>
    regionName
      .replace('省', '')
      .replace('市', '')
      .replace('壮族自治区', '');

  onEchartsReady = instance => {};

  getValueFromName = (name, dataArr) => {
    let val = '';
    dataArr.forEach(d => {
      d.name === name && (val = d.value);
    });
    return val;
  };

  getIndex = (name, dataArr) => {
    const val = this.getValueFromName(name, dataArr);
    const valUniqArr = _.uniq(
      _.cloneDeep(dataArr)
        .sort((a, b) => {
          return b.value - a.value;
        })
        .map(d => d.value)
    );
    const idx = valUniqArr.indexOf(val);
    return idx < 0 ? '-' : idx + 1;
  };

  isAZEquals = (line1, line2) => {
    return (
      (line1.aNe.id === line2.aNe.id && line1.zNe.id === line2.zNe.id) ||
      (line1.aNe.id === line2.zNe.id && line1.zNe.id === line2.aNe.id)
    );
  };

  newLineList = [];

  processLineList = () => {
    let newLineList = [];
    const { lineList } = this.props;
    if (lineList.length) {
      let sameLineList = [];
      let baseLine = lineList[0];
      _.cloneDeep(lineList).forEach((line, idx) => {
        if (this.isAZEquals(baseLine, line)) {
          baseLine.faultState = baseLine.faultState || line.faultState;
          sameLineList.push(line);
        } else {
          baseLine.sameLineList = sameLineList;
          newLineList.push(baseLine);
          baseLine = line;
          sameLineList = [];
        }
      });
      baseLine.sameLineList = sameLineList;
      newLineList.push(baseLine);
    }
    this.newLineList = newLineList;
  };

  getOption = () => {
    const { dataArr } = this.props;
    dataArr.push({
      name: '南海诸岛',
      value: 0,
      tooltip: {
        show: false
      }
    });

    const numArr = this.props.dataArr.map(item => item.value);
    let series = [
      {
        type: 'map',
        geoIndex: 0,
        width: '95%',
        data: this.props.dataArr
      }
    ];

    if (this.props.showLines) {
      this.processLineList();
      this.newLineList.forEach(line => {
        series.push({
          id: line.id,
          name: line.name,
          type: 'lines',
          zlevel: 2,
          symbol: ['circle', 'circle'],
          symbolSize: 6,
          effect: {
            show: true,
            period: 6,
            trailLength: 0,
            symbolSize: 8
          },
          lineStyle: {
            normal: {
              color: line.faultState ? '#F84848' : '#4D8CF4',
              width: 1,
              opacity: 0.4,
              curveness: 0.2
            }
          },
          data: [
            [
              {
                name: line.aNe.name,
                coord: [line.aNe.province.longitude, line.aNe.province.latitude]
              },
              {
                name: line.zNe.name,
                coord: [line.zNe.province.longitude, line.zNe.province.latitude]
              }
            ]
          ]
        });
      });
    }

    const option = {
      backgroundColor: '#fff',
      tooltip: {
        // padding: 10,
        enterable: true,
        transitionDuration: 1,
        confine: true,
        backgroundColor: '#FFFFFF',
        extraCssText: 'box-shadow:0px 2px 4px 0px rgba(0,0,0,0.2);',
        textStyle: {
          color: '#3C3E4A',
          decoration: 'none',
          fontSize: 14
        },
        formatter: params => {
          if (params.seriesType !== 'lines') {
            let value = `${formatNumber(params.value)}${
              this.props.needPercent ? '%' : ''
            }`;
            return `
                ${params.name}<br />
                <p>
                    ${this.props.itemName}:
                    <span style="color: #2AA8FF;">${value || 0}</span>
                </p>
            `;
          } else {
            const aName = params.data.fromName;
            const zName = params.data.toName;
            const lineName = params.seriesName;
            return `
                <p>${lineName}</p>
                <p>A端：${aName}</p>
                <p>Z端：${zName}</p>
            `;
          }
        }
      },
      visualMap: {
        type: 'piecewise',
        min: Math.min(...numArr),
        max: Math.max(...numArr),
        left: '10',
        bottom: '10',
        calculable: false,
        orient: 'vertical',
        inRange: {
          color: [
            '#7BB5F3',
            '#FFF899',
            '#B7DAFC',
            '#D4F6EB',
            '#E4EFFF'
          ].reverse(),
          symbolSize: [30, 100]
        },
        formatter: function(value, value2) {
          return (
            parseInt(value * 100) / 100 + '-' + parseInt(value2 * 100) / 100
          );
        }
      },
      // 底图、为了画飞线才使用
      geo: {
        show: true,
        map: 'china',
        roam: true,
        width: '95%',
        label: {
          normal: {
            show: true
          }
        },
        itemStyle: {
          normal: {
            borderColor: '#769EE4',
            borderWidth: 1,
            areaColor: 'rgba(249,251, 255, 1)',
            label: {
              show: true
            }
          },
          emphasis: {
            areaColor: '#FCC565',
            label: {
              show: false
            }
          }
        },
        selectedMode: 'single'
      },
      series: series
    };

    return option;
  };

  onMapClick = params => {
    if (params.seriesType === 'lines') {
      const lineList = this.newLineList.find(
        line => line.id === params.seriesId
      ).sameLineList;
      this.props.dispatch(showLineCustomerAction(true, lineList));
    }
  };

  getEvents = () => {
    let events = {
      // 点击省份，向父组件传递选择的省份或全国
      geoselectchanged: params => {
        params.batch[0].selected[params.batch[0].name]
          ? this.props.changeLoc(params.batch[0].name)
          : this.props.changeLoc('全国');
      }
    };
    this.props.showLines && (events.click = this.onMapClick);
    return events;
  };

  render() {
    return (
      <ReactEcharts
        className={this.props.className}
        option={this.getOption()}
        onEvents={this.getEvents()}
        notMerge={true}
        style={{ height: '100%' }}
        onChartReady={this.onEchartsReady}
      />
    );
  }
}

export default connect(mapState2PropsWithNoProps)(ChinaAreaMap);
