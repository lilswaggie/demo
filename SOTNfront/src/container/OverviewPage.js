import React, { Component, Fragment } from 'react';

import _ from 'lodash';

import ModuleWrap from '../component/overview/ModuleWrap';

import WorkOrderContent from '../component/overview/WorkOrderContent';
import NetworkQualityContent from '../component/overview/NetworkQualityContent';
import BusinessQualityContent from '../component/overview/BusinessQualityContent';
import NetworkScalaContent from '../component/overview/NetworkScalaContent';
import BusinessScalaContent from '../component/overview/BusinessScalaContent';
import ProvinceModal from '../component/overview/ProvinceModal';

import CustomViewModal from '../component/overview/CustomViewModal';
import { reorderArr, removeFomArr } from '../util/ArrayUtils';
import { postAxios, getAxios, AxiosRequest } from '../axios/mainAxios';

import { gotoPath } from '../util/ReduxUtil';

import '../assets/css/overview/overview.scss';

export default class OverviewPage extends Component {
  state = {
    // 模块数组，按名称顺序显示
    showModuleArr: [],
    // 弹窗设置临时存储用
    customShowModuleArr: [],
    customViewVisible: false,

    provinceTitle: '',
    performanceItemArr: [],
    provinceVisible: false
  };

  titleArr = ['工单统计', '网络质量', '业务质量', '网络规模', '业务规模'];

  provinceUrlMapArr = [
    [
      {
        name: '故障处理时长',
        url: 'api/network/stats/fault_handling_time/location',
        method: AxiosRequest.POST
      },
      {
        name: '故障处理及时率',
        url: 'api/network/stats/fault_handling_rate/location',
        method: AxiosRequest.POST
      },
      {
        name: '投诉处理时长',
        url: 'api/handling/stats/complaint_time/location',
        method: AxiosRequest.POST
      },
      {
        name: '投诉处理及时率',
        url: 'api/handling/stats/complaint_rate/location',
        method: AxiosRequest.POST
      },
      {
        name: '勘查及时率',
        url: 'api/handling/stats/survey_rate/location',
        method: AxiosRequest.POST
      },
      {
        name: '勘查时长',
        url: 'api/handling/stats/survey_time/location',
        method: AxiosRequest.GET
      },
      {
        name: '开通及时率',
        url: 'api/handling/stats/open_up_rate/location',
        method: AxiosRequest.POST
      },
      {
        name: '开通时长',
        url: 'api/handling/stats/opening_handling_avg_time/location',
        method: AxiosRequest.GET
      }
    ],
    [
      {
        name: '告警总数',
        url: 'api/alarms/stats/num/location',
        method: AxiosRequest.GET
      },
      {
        name: '光缆故障次数',
        url: 'api/network/stats/optical_cable_fault/location',
        method: AxiosRequest.GET
      },
      {
        name: '网元故障次数',
        url: 'api/network/elements/stats/fault_num/location',
        method: AxiosRequest.POST
      },
      {
        name: '光功率不合格端口数',
        url: 'api/network/stats/port_fault/location',
        method: AxiosRequest.GET
      },
      {
        name: '误码率不合格端口数',
        url: 'api/network/stats/wave_fault/location',
        method: AxiosRequest.GET
      },
      {
        name: '网络故障处理时长',
        url: 'api/network/stats/fault_handling_time/location',
        method: AxiosRequest.POST
      },
      {
        name: '网络故障处理及时率',
        url: 'api/network/stats/fault_handling_rate/location',
        method: AxiosRequest.POST
      }
    ],
    [
      {
        name: '专线可用率',
        url: 'api/leased_lines/stats/usable/location',
        method: AxiosRequest.POST
      },
      {
        name: '专线故障次数',
        url: 'api/leased_lines/stats/fault/frequency/location',
        method: AxiosRequest.POST
      },
      {
        name: '专线中断时长',
        url: 'api/leased_lines/stats/interrupted/location',
        method: AxiosRequest.POST
      },
      {
        name: '专线投诉次数',
        url: 'api/leased_lines/stats/complaint/location',
        method: AxiosRequest.POST
      },
      {
        name: '专线时延',
        url: 'api/leased_lines/stats/delay/location',
        method: AxiosRequest.POST
      },
      {
        name: '专线倒换次数',
        url: 'api/leased_lines/stats/circuit_switch/location',
        method: AxiosRequest.POST
      }
    ],
    [
      {
        name: '站点总数',
        url: 'api/network/stats/site/location',
        method: AxiosRequest.POST
      },
      {
        name: '网元总数',
        url: 'api/network/elements/stats/num/location',
        method: AxiosRequest.POST
      },
      {
        name: '端口利用率',
        url: 'api/network/stats/port_usage/location',
        method: AxiosRequest.POST
      },
      {
        name: '一干光缆总长度',
        url: 'api/network/stats/optical_cable_length/location',
        method: AxiosRequest.GET
      },
      {
        name: '纤芯利用率',
        url: 'api/network/stats/fiber_usage/location',
        method: AxiosRequest.POST
      }
    ],
    [
      {
        name: '客户总数',
        url: 'api/customers/stats/num/location',
        method: AxiosRequest.GET
      },
      {
        name: '故障客户数',
        url: 'api/customers/stats/fault/location',
        method: AxiosRequest.GET
      },
      {
        name: '专线总数',
        url: 'api/leased_lines/stats/num/location',
        method: AxiosRequest.GET
      },
      {
        name: '故障专线数',
        url: 'api/leased_lines/stats/fault/num/location',
        method: AxiosRequest.GET
      }
    ]
  ];

  onProvinceClick = index => () => {
    this.setState({
      provinceTitle: this.titleArr[index],
      performanceItemArr: this.provinceUrlMapArr[index],
      provinceVisible: true
    });
  };

  moduleNameModulePropsMap = {
    workOrder: {
      title: this.titleArr[0],
      onProvinceClick: this.onProvinceClick(0),
      detailButtonVisible: false,
      onDetailButtonClick: () => {}
    },
    networkQuality: {
      title: this.titleArr[1],
      onProvinceClick: this.onProvinceClick(1),
      detailButtonVisible: true,
      onDetailButtonClick: () => gotoPath('/main/analysis/network-quality')
    },
    businessQuality: {
      title: this.titleArr[2],
      onProvinceClick: this.onProvinceClick(2),
      detailButtonVisible: true,
      onDetailButtonClick: () => gotoPath('/main/analysis/business-quality')
    },
    networkScala: {
      title: this.titleArr[3],
      onProvinceClick: this.onProvinceClick(3),
      detailButtonVisible: true,
      onDetailButtonClick: () => gotoPath('/main/analysis/source')
    },
    businessScala: {
      title: this.titleArr[4],
      onProvinceClick: this.onProvinceClick(4),
      detailButtonVisible: true,
      onDetailButtonClick: () => gotoPath('/main/business')
    }
  };

  moduleNameContentMap = {
    workOrder: <WorkOrderContent />,
    networkQuality: <NetworkQualityContent />,
    businessQuality: <BusinessQualityContent />,
    networkScala: <NetworkScalaContent />,
    businessScala: <BusinessScalaContent />
  };

  componentDidMount() {
    // 请求模块数组，设置showModuleArr和allModuleArr数据
    this.getData();
  }

  getData = () => {
    getAxios('api/user/profiles/overview_module_custom', showModuleArr => {
      if (!_.isArray(showModuleArr) || !showModuleArr.length) {
        showModuleArr = [
          'workOrder',
          'networkQuality',
          'businessQuality',
          'networkScala',
          'businessScala'
        ];
      }
      this.setState({
        showModuleArr,
        customShowModuleArr: showModuleArr
      });
    });
  };

  setCustomModalVisible = visible => () =>
    this.setState({ customViewVisible: visible });

  onCustomModalOk = showModuleArr => {
    this.setModule(showModuleArr);
    this.setCustomModalVisible(false)();
  };

  onCustomShowModuleChange = customShowModuleArr =>
    this.setState({ customShowModuleArr });

  setModule = (showModuleArr, callback) => {
    postAxios('api/user/profiles/overview_module_custom', showModuleArr, () =>
      this.setState({
        showModuleArr,
        customShowModuleArr: showModuleArr
      })
    );
  };

  onTopButtonClick = index => () => {
    this.setModule(reorderArr(this.state.showModuleArr, index, 0));
  };

  onRemoveButtonClick = index => () => {
    this.setModule(removeFomArr(this.state.showModuleArr, index));
  };

  setProvinceVisible = visible => () => {
    this.setState({ provinceVisible: visible });
  };

  render() {
    const { showModuleArr, customShowModuleArr } = this.state;
    return (
      <Fragment>
        <div className="overview-wrap">
          {showModuleArr.map((module, index) => (
            <ModuleWrap
              key={index}
              index={index}
              topButtonVisible={index !== 0}
              onTopButtonClick={this.onTopButtonClick(index)}
              removeButtonVisible={true}
              onRemoveButtonClick={this.onRemoveButtonClick(index)}
              {...this.moduleNameModulePropsMap[module]}
            >
              {this.moduleNameContentMap[module]}
            </ModuleWrap>
          ))}
        </div>
        <div
          className="overview-custom-btn"
          onClick={this.setCustomModalVisible(true)}
        >
          自定义视图
        </div>
        <CustomViewModal
          visible={this.state.customViewVisible}
          showModuleList={customShowModuleArr}
          onShowModuleChange={this.onCustomShowModuleChange}
          onOk={this.onCustomModalOk}
          onCancel={this.setCustomModalVisible(false)}
        />
        <ProvinceModal
          visible={this.state.provinceVisible}
          title={this.state.provinceTitle}
          performanceItemArr={this.state.performanceItemArr}
          onCancel={this.setProvinceVisible(false)}
        />
      </Fragment>
    );
  }
}
