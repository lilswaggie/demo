import React, { Component } from 'react';
import { connect } from 'react-redux';
import Platform from '../component/work-platform/Platform';

class WorkPlatformPage extends Component {
  render() {
    return (
      <div style={styles.container}>
        <header style={styles.header}>工作台</header>
        <Platform />
      </div>
    );
  }
}
const mapState2Props = state => ({
  location: state.routing.location
});
const styles = {
  container: {
    backgroundColor: '#F1F4F9'
  },
  header: {
    backgroundColor: '#fff',
    color: '#3C3E4A',
    fontSize: '14px',
    height: '32px',
    lineHeight: '32px',
    textAlign: 'left',
    verticalAlign: 'middle',
    paddingLeft: '32px'
  }
};

export default connect(mapState2Props)(WorkPlatformPage);
