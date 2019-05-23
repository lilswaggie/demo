import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';

import _ from 'lodash';
import moment from 'moment';

import { Row, Col, DatePicker, Menu, Empty } from 'antd';
import CodeBlock from '../component/pub/CodeBlock';

import { DateStyle } from '../component/pub/DateSelect';
import { checkAxiosInstance } from '../axios/mainAxios';

import { getCheckMenuFile } from '../util/DataCheckUtils';

import '../assets/css/check/data-check.scss';
import 'github-markdown-css';

export default class DataCheckPage extends Component {
  state = {
    date: moment().format(DateStyle.YMD),
    menuData: [],
    selectedMenu: {},
    markdown: ''
  };

  componentDidMount() {
    this.getMenu();
  }

  componentDidUpdate(prevProps, prevState) {
    const { date, menuData, selectedMenu } = this.state;
    if (prevState.date !== date) {
      this.getMenu();
    }
    if (!_.isEqual(prevState.menuData, menuData)) {
      this.setState({ selectedMenu: !!menuData.length ? menuData[0] : {} });
    }
    if (!_.isEqual(prevState.selectedMenu, selectedMenu)) {
      this.getMarkdown();
    }
  }

  getMenu = () => {
    checkAxiosInstance
      .get(getCheckMenuFile(this.state.date))
      .then(response => {
        this.setState({ menuData: response.data });
      })
      .catch(reason => {
        this.setState({ menuData: [] });
      });
  };

  getMarkdown = () => {
    const {
      selectedMenu: { path }
    } = this.state;
    if (path) {
      checkAxiosInstance
        .get(path)
        .then(response => {
          this.setState({ markdown: response.data });
        })
        .catch(reason => {
          this.setState({ markdown: '' });
        });
    } else {
      this.setState({ markdown: '' });
    }
  };

  onDateChange = (date, dateString) => this.setState({ date: dateString });

  selectMenu = selectedMenu => () => this.setState({ selectedMenu });

  render() {
    const { menuData, selectedMenu, markdown } = this.state;
    return (
      <div className="data-check">
        <header>
          <span className="text">数据校验</span>
        </header>
        <div className="body">
          <div className="filter">
            <span className="item">
              <span className="label">日期：</span>
              <DatePicker
                value={moment(this.state.date)}
                onChange={this.onDateChange}
              />
            </span>
          </div>
          {!!menuData && !!menuData.length ? (
            <Row gutter={16}>
              <Col span={4}>
                {
                  <Menu mode="inline" selectedKeys={[selectedMenu.key]}>
                    {menuData.map(d => (
                      <Menu.Item key={d.key} onClick={this.selectMenu(d)}>
                        {d.name}
                      </Menu.Item>
                    ))}
                  </Menu>
                }
              </Col>
              <Col className="markdown" span={20}>
                {!!markdown ? (
                  <ReactMarkdown
                    source={markdown}
                    escapeHtml={false}
                    renderers={{
                      code: CodeBlock
                    }}
                  />
                ) : (
                  <Empty />
                )}
              </Col>
            </Row>
          ) : (
            <Empty />
          )}
        </div>
      </div>
    );
  }
}
