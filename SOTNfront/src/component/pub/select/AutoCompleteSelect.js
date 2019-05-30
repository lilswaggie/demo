import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createGlobalStyle } from 'styled-components';
import { Input, AutoComplete, Button, Icon } from 'antd';

const GlobalStyle = createGlobalStyle`
  .autocomplete-search {
    width: 100%;

    &.ant-select-auto-complete.ant-select-lg {
      .ant-select-selection__rendered {
        line-height: 50px;
      }

      .ant-input {
        height: 50px;
        border: 1px solid #fff;
        border-radius: 0;
      }

      .ant-input-affix-wrapper .ant-input-suffix {
        .ant-btn {
          right: -12px;
          height: 52px;
          width: 52px;
          border-radius: 0;

          .anticon {
            font-size: 26px;
          }
        }
      }
    }
  }

  .autocomplete-search-item {
    line-height: 40px;
  }
`;

export default class AutoCompleteSelect extends Component {
  static propTypes = {
    className: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onSelect: PropTypes.func,
    onSearch: PropTypes.func,
    onSearchClick: PropTypes.func,
    optionLabelProp: PropTypes.string
  };

  render() {
    const {
      className,
      // value,
      placeholder,
      dataSource,
      onSelect,
      onSearch,
      onSearchClick,
      optionLabelProp
    } = this.props;
    return (
      <React.Fragment>
        <GlobalStyle />
        <AutoComplete
          size="large"
          className={`autocomplete-search ${className}`}
          dataSource={dataSource}
          // value={value}
          onSelect={onSelect}
          onSearch={onSearch}
          placeholder={placeholder}
          optionLabelProp={optionLabelProp}
        >
          <Input
            suffix={
              <Button size="large" type="primary" onClick={onSearchClick}>
                <Icon type="search" />
              </Button>
            }
          />
        </AutoComplete>
      </React.Fragment>
    );
  }
}
