import React, { Component } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Icon, Popover } from 'antd';

import { getRegion } from '../../../util/ReduxUtil';
import { splitArr } from '../../../util/CommonUtils';

import '../../../assets/css/pub/region-select.scss';

class RegionSelect extends Component {
  static propTypes = {
    // 手动控制选择的值
    value: PropTypes.string,
    // 默认选择的值
    defaultValue: PropTypes.string,
    // 选择值改变时，触发的函数。 value => {}
    onChange: PropTypes.func,

    // 用于手动控制选择框显隐
    visible: PropTypes.bool,
    // 默认是否显隐
    defaultVisible: PropTypes.bool,
    // 显示隐藏的回调	(visible) => void
    onVisibleChange: PropTypes.func
  };

  static defaultProps = {
    defaultValue: '',
    defaultVisible: false
  };

  state = {
    visible: !!this.props.visible || !!this.props.defaultVisible,
    // 初始值使用父组件传递的值，若无，则使用defaultValue
    value: this.props.value || this.props.defaultValue
  };

  componentDidMount() {
    getRegion();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!('visible' in nextProps) && !('value' in nextProps)) {
      return null;
    }
    // 若父组件传递受控值，则更新state
    const state = {};
    if ('visible' in nextProps) {
      state.visible = nextProps.visible;
    }
    if ('value' in nextProps) {
      state.value = nextProps.value;
    }
    return state;
  }

  onVisibleChange = visible => {
    const { onVisibleChange } = this.props;
    !('visible' in this.props) && this.setState({ visible });
    onVisibleChange && onVisibleChange(visible);
  };

  handleSelect = value => () => {
    const { onChange } = this.props;
    !('value' in this.props) && this.setState({ value });
    onChange && onChange(value);
    this.onVisibleChange(false);
  };

  getRegionOption = selected => {
    const arr = splitArr(this.props.region, 4);
    arr.unshift([{ id: '', abbreviation: '全国' }]);
    return arr.map((a, i) => (
      <p key={i} className="option-line">
        {a.map((item, idx) => (
          <span
            key={idx}
            className={classNames('option-item', {
              active: item.id === selected
            })}
            onClick={this.handleSelect(item.id)}
          >
            {item.abbreviation}
          </span>
        ))}
      </p>
    ));
  };

  getRegionNameFromId = id => {
    let name = '';
    this.props.region.forEach(r => {
      r.id === id && (name = r.abbreviation);
    });
    return name || '全国';
  };

  render() {
    const { value, visible } = this.state;

    const selectClass = classNames('select', { active: visible });
    const iconClass = classNames('icon', { active: visible });
    return (
      <span className="region-select">
        <Popover
          visible={visible}
          onVisibleChange={this.onVisibleChange}
          overlayClassName="region-select-popover"
          content={this.getRegionOption(value)}
          trigger="click"
          placement="bottomLeft"
        >
          <span className={selectClass}>{this.getRegionNameFromId(value)}</span>
          <span className={iconClass}>
            <Icon type="down" />
          </span>
        </Popover>
      </span>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({ region: state.region });

export default connect(mapStateToProps)(RegionSelect);
