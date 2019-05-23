import React, { Component } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';
import classnames from 'classnames';

import { Modal } from 'antd';

import ChinaAreaMap from '../echart/ChinaAreaMap';
import PercentChart from './work-order/PercentChart';

import { AxiosRequest, getAxios, postAxios } from '../../axios/mainAxios';
import { objectEchartsArray, formatNumber } from '../../util/CommonUtils';

const ProvinceWrap = styled.div`
  margin: -16px;
  height: 480px;
`;

const PerformanceWrap = styled.div`
  margin-top: 10px;
  height: 30px;
`;

const PerformanceItem = styled.span`
  padding: 6px 8px;
  color: rgb(60, 62, 74);
  border: 1px solid #dddddd;
  cursor: pointer;

  &.active {
    color: rgb(44, 156, 250);
    border: 1px solid rgb(44, 156, 250);
    background-color: #d1e9fe;
  }
  &:hover {
    color: rgb(98, 185, 255);
  }
`;

const ChartWrap = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin-top: 10px;
  height: 430px;
  width: 100%;
`;

const ItemWrap = styled.div`
  height: 100%;
  width: 500px;
`;

const ProvinceItemWrap = styled(ItemWrap)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 12px;
  color: rgba(69, 82, 116);
  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 0.5rem;
    height: 0.5rem;
  }
  ::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 1);
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgb(160, 166, 175);
  }

  ::-webkit-input-placeholder {
    color: #ffffff;
  }
  :-moz-placeholder {
    color: #ffffff;
  }
  ::-moz-placeholder {
    color: #ffffff;
  }
  :-ms-input-placeholder {
    color: #ffffff;
  }
`;

const ProvinceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  width: 100%;
`;

const ProvinceName = styled.div`
  width: 100px;
  text-align: right;
`;

const StyledPercentChart = styled(PercentChart)`
  width: 250px;
`;

const Count = styled.div`
  width: 100px;
  text-align: left;
`;

export default class ProvinceModal extends Component {
  static propTypes = {
    title: PropTypes.string,
    visible: PropTypes.bool,
    // performance: url
    performanceItemArr: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        url: PropTypes.string,
        method: PropTypes.string
      })
    ),
    onCancel: PropTypes.func
  };

  static defaultProps = {
    title: '',
    visible: false,
    performanceItemArr: []
  };

  state = {
    selectedIndex: 0,
    provinceDataArr: []
  };

  componentDidMount() {
    if (this.props.visible) {
      this.getProvinceData();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // 关闭之后再打开的情况
    if (!prevProps.visible && this.props.visible) {
      // 关闭A之后再打开B的情况
      if (prevProps.title !== this.props.title) {
        this.setDefaultData();
        if (prevState.selectedIndex === 0) {
          // 如果之前的选中的是0，必然重置之后下一个生命周期不会走到GET DATA的判断
          // 需要手动调用
          this.getProvinceData();
        }
      }
    }
    // GET DATA
    if (prevState.selectedIndex !== this.state.selectedIndex) {
      this.getProvinceData();
    }
  }

  setDefaultData = () => {
    this.setState({
      selectedIndex: 0,
      provinceDataArr: []
    });
  };

  getProvinceData = () => {
    const { performanceItemArr } = this.props;
    const { selectedIndex } = this.state;
    const performanceItem = performanceItemArr[selectedIndex];
    const axios =
      performanceItem.method === AxiosRequest.GET ? getAxios : postAxios;
    axios(performanceItem.url, ({ values }) =>
      this.setState({ provinceDataArr: this.sort(objectEchartsArray(values)) })
    );
  };

  sort = provinceDataArr => {
    provinceDataArr.sort((a, b) => b.value - a.value);
    return provinceDataArr;
  };

  getItemName = () => {
    const { performanceItemArr } = this.props;
    const { selectedIndex } = this.state;
    const performance = performanceItemArr[selectedIndex];
    return performance ? performance.name : '';
  };

  onSelect = index => () => this.setState({ selectedIndex: index });

  getMax = () => {
    let arr = this.props.performanceItemArr.map(item => item.count);
    if (!arr || !arr.length) {
      return 1;
    }
    return Math.max.apply(null, arr) || 1;
  };

  getPercent = value => (value * 100) / this.getMax();

  render() {
    const { title, visible, performanceItemArr } = this.props;
    const { provinceDataArr, selectedIndex } = this.state;
    return (
      <Modal
        width={1020}
        title={`${title}分省情况`}
        visible={visible}
        footer={null}
        onCancel={this.props.onCancel}
        style={{ top: 50 }}
      >
        <ProvinceWrap>
          <PerformanceWrap>
            {performanceItemArr.map((performance, index) => (
              <PerformanceItem
                key={index}
                onClick={this.onSelect(index)}
                className={classnames({ active: index === selectedIndex })}
              >
                {performance.name}
              </PerformanceItem>
            ))}
          </PerformanceWrap>
          <ChartWrap>
            <ItemWrap>
              <ChinaAreaMap
                needPercent={false}
                dataArr={provinceDataArr}
                itemName={this.getItemName()}
              />
            </ItemWrap>
            <ProvinceItemWrap>
              {provinceDataArr.map((item, index) => (
                <ProvinceItem key={index}>
                  <ProvinceName>{item.name}</ProvinceName>
                  <StyledPercentChart percent={this.getPercent(item.value)} />
                  <Count>{formatNumber(item.value)}</Count>
                </ProvinceItem>
              ))}
            </ProvinceItemWrap>
          </ChartWrap>
        </ProvinceWrap>
      </Modal>
    );
  }
}
