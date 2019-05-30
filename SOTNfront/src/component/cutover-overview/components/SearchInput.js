import React from 'react';
import { AutoComplete, Input, Icon } from 'antd';
import PropTypes from 'prop-types';

export default class NameLike extends React.Component {
  state = {
    dataSource: [],
    value: undefined,
    clearName: false
  };
  static propTypes = {
    placeholder: PropTypes.string,
    search: PropTypes.func,
    showSuffix: PropTypes.bool,
    resetName: PropTypes.bool,
    className: PropTypes.bool
  };

  static defaultProps = {
    showSuffix: false,
    resetName: false,
    className: false
  };
  componentWillReceiveProps(coming) {
    if (coming && coming.resetName) {
      const name = coming.resetName;
      this.setState({ clearName: name });
    }
  }

  handleChange = value => {
    const { clearName } = this.state;
    if (clearName === true) {
      this.setState({ value: null, clearName: false }, () => {
        console.log(this.state.value);
      });
    } else {
      this.setState({ value }, () => {
        this.props.handleChange(value);
      });
      console.log(value);
    }
  };
  handleSelect = value => {
    // const { value } = this.state;
    this.setState({ value }, () => {
      this.props.search(value);
    });
  };
  handleSearch = value => {
    this.setState({
      dataSource: !value ? [] : [value, value + value, value + value + value]
    });
  };

  render() {
    const { dataSource, value } = this.state;
    const suffix = this.props.showSuffix ? (
      <Icon
        type="search"
        onClick={() => this.props.search(value)}
        style={{ fontSize: '1rem' }}
      />
    ) : (
      ''
    );
    return (
      <AutoComplete
        dataSource={dataSource}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        onSearch={this.handleSearch}
        placeholder={this.props.placeholder}
        value={this.state.value}
        className={this.props.className === true ? 'trans-net-search' : ''}
      >
        <Input suffix={suffix} />
      </AutoComplete>
    );
  }
}
