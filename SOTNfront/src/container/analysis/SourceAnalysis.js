import React from 'react';
import { Tabs } from 'antd';
import SourceSite from '../../component/analysis/source-analysis/Site';
import SourceMS from '../../component/analysis/source-analysis/MultiplexSection';
import SourceLS from '../../component/analysis/source-analysis/LightSection';
import SourceTNE from '../../component/analysis/source-analysis/TransmissionNe';
// import SourceChannel from '../../component/analysis/source-analysis/channel';
import SourcePort from '../../component/analysis/source-analysis/Port';
// import OpticalCable from '../../component/analysis/source-analysis/optical-cable';
import '../../assets/css/analysis/source-analysis.scss';

// 跳转到当前页面的指定tab
const tabNameArr = ['site', 'multiplexSection', 'lightSection', 'transmissionNe', 'port'];
const getActiveTab = location => {
  const { state } = location;
  if (state && state.tab) {
    return tabNameArr[state.tab];
  }
  return tabNameArr[0];
};

class SourceAnalysis extends React.Component {
  state = {
    tabActiveKey: getActiveTab(this.props.location)
  };

  onTabChange = tabActiveKey => this.setState({ tabActiveKey });

  render() {
    const { TabPane } = Tabs;
    const { tabActiveKey } = this.state;
    return (
      <div className="source-analysis">
        <div className="analysis-header clearfix">
          <div>
            <span>资源统计</span>
          </div>
        </div>
        <div className="analysis-content">
          <Tabs activeKey={tabActiveKey} onChange={this.onTabChange}>
            <TabPane tab="站点" key="site">
              <SourceSite activeKey={tabActiveKey} />
            </TabPane>
            <TabPane tab="复用段" key="multiplexSection">
              <SourceMS activeKey={tabActiveKey} />
            </TabPane>
            <TabPane tab="光放段" key="lightSection">
              <SourceLS activeKey={tabActiveKey} />
            </TabPane>
            <TabPane tab="传输网元" key="transmissionNe">
              <SourceTNE activeKey={tabActiveKey} />
            </TabPane>
            <TabPane tab="端口" key="port">
              <SourcePort activeKey={tabActiveKey} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
export default SourceAnalysis;
