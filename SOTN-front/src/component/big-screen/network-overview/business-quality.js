import React, { Component } from 'react';

import { getAxios } from '../../../axios/mainAxios';
import {
  baseStaticUrl,
  formatNumber,
  msToHour
} from '../../../util/CommonUtils';

const msToHourArr = [
  'leased_line_complaint_time',
  'leased_line_fault_handling_time',
  'leased_line_interrupt_time',
  'survey_handling_time',
  'opening_handling_time'
];

const quotaMapName = {
  leased_line_complaint_time: '专线投诉处理时长(h)',
  leased_line_complaint_num: '专线投诉次数(次)',
  leased_line_complaint_ongoing: '专线投诉未处理次数(次)',
  leased_line_delay_time: '专线时延(ms)',
  leased_line_fault_handling_time: '专线故障处理时长(h)',
  leased_line_fault_num: '专线故障次数',
  leased_line_interrupt_time: '专线中断时长(h)',
  leased_line_switch_time: '专线倒换次数(次)',
  leased_line_usable_rate: '专线可用率(%)',
  survey_handling_time: '勘查处理时长(h)',
  opening_handling_time: '开通处理时长(h)'
};
const quotaMapId = {
  leased_line_complaint_time: 'zxtsclsc',
  leased_line_complaint_num: 'zxtscs',
  leased_line_complaint_ongoing: 'zxtswcls',
  leased_line_delay_time: 'zxsy',
  leased_line_fault_handling_time: 'zxgzclsc',
  leased_line_fault_num: 'zxgzcs',
  leased_line_interrupt_time: 'zxzdsc',
  leased_line_switch_time: 'dldhcs',
  leased_line_usable_rate: 'zxkyl',
  survey_handling_time: 'kcclsc',
  opening_handling_time: 'ktclsc'
};
export default class BusinessQuality extends Component {
  state = {
    data: []
  };
  loadData = () => {
    getAxios('/api/business/stats/current/business_quality', {}, data => {
      let values = [];
      for (let index in quotaMapName) {
        let obj = {};
        obj['key'] = index;
        obj['name'] = quotaMapName[index];
        let value = data.values[index];
        if (msToHourArr.indexOf(index) !== -1) {
          value = msToHour(value);
        }
        obj['value'] = formatNumber(value);
        obj['id'] = quotaMapId[index];
        values.push(obj);
      }
      this.setState({ data: values });
    });
  };
  componentDidMount() {
    this.loadData();
  }

  render() {
    let { data } = this.state;
    let { key } = this.props.activeItem;
    return (
      <div id="business-quality">
        <div id="header">业务质量</div>
        <video
          src={`${baseStaticUrl}mp4/ywzl.mp4`}
          autoPlay="autoplay"
          loop="loop"
        />
        {data.map((item, index) => {
          return (
            <div
              key={index}
              id={item.id}
              className={['circle', key === item.key ? 'active' : ''].join(' ')}
              onClick={() =>
                this.props.handlerNetworkItem(item.name, item.key, item.value)
              }
            >
              <span className="value digital">{item.value}</span>
              <span className="title">{item.name}</span>
            </div>
          );
        })}
      </div>
    );
  }
}
