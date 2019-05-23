/**
 * Created by luxia on 2017/7/31.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Button, Icon, Menu, Input, notification } from 'antd';
import '../../assets/css/pub/table-pagination.scss';

export default class TablePagination extends React.Component {
  static propTypes = {
    pageSize: PropTypes.number,
    pageSizeList: PropTypes.array,
    pageNumber: PropTypes.number,
    pageToJump: PropTypes.number,
    preventDefaultLoad: PropTypes.bool.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    total: PropTypes.number.isRequired,
    className: PropTypes.string,
    hidePageSize: PropTypes.bool,
    hidePageJump: PropTypes.bool,
    hideTotal: PropTypes.bool
  };
  static defaultProps = {
    pageSizeList: [10, 20, 50, 100],
    pageToJump: 1,
    pageSize: 10,
    pageNumber: 1,
    className: '',
    hidePageSize: false,
    hidePageJump: false,
    hideTotal: false
  };

  constructor(props) {
    super(props);
    this.state = {
      pageSize: props.pageSize,
      pageSizeList: props.pageSizeList,
      pageNumber: props.pageNumber,
      pageToJump: props.pageToJump
    };
  }

  componentDidMount() {
    if (!this.props.preventDefaultLoad) {
      this.getPageData();
    }
  }

  componentWillReceiveProps(props) {
    if (props.pageSize === 10) {
      this.setState({
        pageSize: 10
      });
    }
    if (props.pageNumber === 1) {
      this.setState({
        pageNumber: 1
      });
    }
    if (this.props.pageSize !== props.pageSize) {
      this.setState({ pageSize: props.pageSize });
    }
    if (this.props.pageNumber !== props.pageNumber) {
      this.setState({ pageNumber: props.pageNumber });
    }
    if (this.props.total !== props.total) {
      const totalPage = Math.ceil(props.total / props.pageSize);
      const pageNumber = Math.min(totalPage, props.pageNumber);
      this.setState({ pageNumber });
    }
    if (this.props.pageToJump !== props.pageToJump) {
      this.setState({ pageToJump: props.pageToJump });
    }
  }

  getPageData = () => {
    if (typeof this.props.handlePageChange === 'function') {
      this.props.handlePageChange(this.state.pageNumber, this.state.pageSize);
    }
    if (typeof this.props.handlePageJumpChange === 'function') {
      this.props.handlePageJumpChange(this.state.pageToJump);
    }
  };

  getPageSizeMenu = () => {
    const onClick = params => {
      const pageSize = params.item.props.children;
      const pageNumber = Math.min(
        Math.ceil(this.props.total / pageSize),
        this.state.pageNumber
      );
      this.setState(
        {
          pageNumber,
          pageSize: params.item.props.children
        },
        () => {
          this.getPageData();
        }
      );
    };
    return (
      <Menu onClick={onClick}>
        {this.state.pageSizeList.map((item, index) => (
          <Menu.Item key={index}>{item}</Menu.Item>
        ))}
      </Menu>
    );
  };

  getPageList = () => {
    const totalPage = Math.ceil(this.props.total / this.state.pageSize);
    let pageList = [];
    if (totalPage <= 5) {
      for (let i = 0; i < totalPage; i++) {
        pageList.push(i + 1);
      }
    } else {
      const start = 1;
      const end = totalPage;
      const { pageNumber } = this.state;
      if (start <= pageNumber && pageNumber <= start + 2) {
        pageList = [1, 2, 3, 4, '...', end - 1, end];
      } else if (pageNumber <= end && pageNumber >= end - 2) {
        pageList = [1, 2, '...', end - 3, end - 2, end - 1, end];
      } else {
        pageList = [
          1,
          '...',
          pageNumber - 1,
          pageNumber,
          pageNumber + 1,
          '...',
          end
        ];
      }
    }
    return pageList;
  };

  handlePageClick = e => {
    const pageNumber = parseInt(e.target.textContent, 10);
    if (!Number.isNaN(pageNumber)) {
      this.setState(
        {
          pageNumber
        },
        () => {
          this.getPageData();
        }
      );
    }
  };

  handleFirstPageClick = () => {
    this.setState(
      {
        pageNumber: 1
      },
      () => {
        this.getPageData();
      }
    );
  };

  handlePrevPageClick = () => {
    if (this.state.pageNumber > 1) {
      this.setState(
        {
          pageNumber: this.state.pageNumber - 1
        },
        () => {
          this.getPageData();
        }
      );
    }
  };

  handleNextPageClick = () => {
    if (
      this.state.pageNumber < Math.ceil(this.props.total / this.state.pageSize)
    ) {
      this.setState(
        {
          pageNumber: this.state.pageNumber + 1
        },
        () => {
          this.getPageData();
        }
      );
    }
  };

  handleLastPageClick = () => {
    this.setState(
      {
        pageNumber: Math.ceil(this.props.total / this.state.pageSize)
      },
      () => {
        this.getPageData();
      }
    );
  };

  handlePageJumpChange = e => {
    this.setState({
      pageToJump: parseInt(e.target.value, 10)
    });
  };

  jumpToPage = () => {
    if (Number.isNaN(this.state.pageToJump)) {
      notification.warning({
        duration: 3,
        message: '警告',
        description: '跳转的页码为空，请输入数字'
      });
      return;
    }
    const totalPage = Math.ceil(this.props.total / this.state.pageSize);
    const pageToJump = this.state.pageToJump < 1 ? 1 : this.state.pageToJump;
    this.setState(
      {
        pageNumber: this.state.pageToJump > totalPage ? totalPage : pageToJump
      },
      () => {
        this.getPageData();
      }
    );
  };

  render() {
    const { className, hidePageSize, hidePageJump } = this.props;
    return (
      <div className={`table-pagination clearfix ${className}`}>
        {!hidePageSize && (
          <div className="pagination-left">
            {!this.props.hideTotal && (
              <span className="total">
                共<span className="total-value">{this.props.total}</span>条记录
              </span>
            )}
            <span>
              每页显示
              <Dropdown overlay={this.getPageSizeMenu()} trigger={['click']}>
                <Button className="page-size-button">
                  {this.state.pageSize}
                  <Icon type="caret-down" className="drop-down-icon" />
                </Button>
              </Dropdown>
              条
            </span>
          </div>
        )}
        <div className="pagination-right">
          <ul className="pagination-list">
            {this.state.pageNumber === 1 ? (
              <li className="disabled">&lt;&lt;</li>
            ) : (
              <li onClick={this.handleFirstPageClick}>&lt;&lt;</li>
            )}
            {this.state.pageNumber === 1 ? (
              <li className="disabled">&lt;</li>
            ) : (
              <li onClick={this.handlePrevPageClick}>&lt;</li>
            )}
            {this.getPageList().map((item, index) => (
              <li
                key={index}
                className={this.state.pageNumber === item ? 'active' : ''}
                onClick={this.handlePageClick}
              >
                {item}
              </li>
            ))}
            {this.state.pageNumber ===
            Math.ceil(this.props.total / this.state.pageSize) ? (
                <li className="disabled">&gt;</li>
              ) : (
                <li onClick={this.handleNextPageClick}>&gt;</li>
              )}
            {this.state.pageNumber ===
            Math.ceil(this.props.total / this.state.pageSize) ? (
                <li className="disabled">&gt;&gt;</li>
              ) : (
                <li onClick={this.handleLastPageClick}>&gt;&gt;</li>
              )}
          </ul>
          {!hidePageJump && (
            <span className="pagination-jump">
              跳至
              <Input
                type="number"
                min={1}
                value={this.state.pageToJump > 0 ? this.state.pageToJump : null}
                onChange={this.handlePageJumpChange}
              />
              页<Button onClick={this.jumpToPage}>Go</Button>
            </span>
          )}
        </div>
      </div>
    );
  }
}
