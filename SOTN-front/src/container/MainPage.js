import React, { Component } from 'react';
import { Layout, Spin } from 'antd';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import CutoverOverview from '../component/cutover-overview/index';
import CutoverDetail from '../component/cutover-overview/components/Detail';
import ClientDetail from '../component/business-manage/components/ClientDetail';
import BslineDetail from '../component/business-manage/components/LineDetail';
import InflucenAnalysis from '../component/statistic-analysis/InfluenceAnalysis';
import NetResource from '../component/resource-manage/NetResource';

import HomePage from './HomePage';
import OverviewPage from './OverviewPage';

import BusinessFault from './BusinessFault';
import NetworkFault from './NetworkFault';
import BusinessManage from './BusinessManage';
import AlarmDetail from './AlarmDetail';
import LineDetail from './LineDetail';
import MainHeader from '../component/pub/MainHeader';
import WorkPlatformPage from './WorkPlatformPage';
import BusinessResource from './BusinessResource';
import WorkOrder from './WorkOrder';
import NoticeManagerPage from './NoticeManagerPage';
import DataCheckPage from './DataCheckPage';

import BussinessSupport from './analysis/BusinessSupport';
import SourceAnalysis from './analysis/SourceAnalysis';
import NetworkQualityPage from './analysis/NetworkQualityPage';
import BusinessQualityPage from './analysis/BusinessQualityPage';
import ServiceQualityPage from './analysis/ServiceQualityPage';
import KeySearchPage from './KeySearch';
import GisContainer from './GisContainer';
import '../assets/css/main.scss';

const { Content, Footer } = Layout;

class MainPage extends Component {
  render() {
    // const {visible, content} = this.props;
    return (
      <Layout className="main-container">
        <Spin delay={100} size="large" spinning={false} tip={''}>
          <MainHeader />
          <Content className="main-content-body">
            <Route exact={true} path="/main/home" component={HomePage} />
            <Route
              exact={true}
              path="/main/overview"
              component={OverviewPage}
            />
            <Route path="/main/gis/test" compoment={NoticeManagerPage} />

            <Route
              exact={true}
              path="/main/fault/business"
              component={BusinessFault}
            />
            <Route
              exact={true}
              path="/main/fault/business/line-detail"
              component={LineDetail}
            />

            <Route
              exact={true}
              path="/main/fault/cutover"
              component={CutoverOverview}
            />
            <Route
              exact={true}
              path="/main/fault/cutover/detail"
              component={CutoverDetail}
            />

            <Route
              exact={true}
              path="/main/fault/network"
              component={NetworkFault}
            />

            <Route
              exact={true}
              path="/main/business"
              component={BusinessManage}
            />
            <Route
              exact={true}
              path="/main/business/client-detail"
              component={ClientDetail}
            />
            <Route
              exact={true}
              path="/main/business/line-detail"
              component={BslineDetail}
            />

            <Route
              exact={true}
              path="/main/fault/network/alarm-detail"
              component={AlarmDetail}
            />
            <Route
              exact={true}
              path="/main/fault/business/alarm-detail"
              component={AlarmDetail}
            />

            <Route
              exact={true}
              path="/main/fault/network/influence"
              component={InflucenAnalysis}
            />
            <Route
              exact={true}
              path="/main/fault/business/influence"
              component={InflucenAnalysis}
            />
            <Route
              exact={true}
              path="/main/source/network"
              component={NetResource}
            />
            <Route
              exact={true}
              path="/main/source/business"
              component={BusinessResource}
            />
            <Route
              exact={true}
              path="/main/source/business/work-order"
              component={WorkOrder}
            />

            <Route
              exact={true}
              path="/main/analysis/business-support"
              component={BussinessSupport}
            />
            <Route
              exact={true}
              path="/main/analysis/source"
              component={SourceAnalysis}
            />

            <Route path="/main/work-platform" component={WorkPlatformPage} />

            <Route
              path="/main/analysis/network-quality"
              component={NetworkQualityPage}
            />
            <Route
              path="/main/analysis/business-quality"
              component={BusinessQualityPage}
            />
            <Route
              path="/main/analysis/service-quality"
              component={ServiceQualityPage}
            />
            <Route path="/main/notice" component={NoticeManagerPage} />
            <Route path="/main/data-check" component={DataCheckPage} />
            <Route path="/main/key-search" compoment={KeySearchPage} />


          </Content>
          <Footer className="main-content-footer">
            Copyright &copyright; 20xx-20xx 中国移动通信集团有限公司 版权所有
          </Footer>
        </Spin>
      </Layout>
    );
  }
}

const mapState2Props = state => ({
  location: state.routing.location
});

export default connect(mapState2Props)(MainPage);
