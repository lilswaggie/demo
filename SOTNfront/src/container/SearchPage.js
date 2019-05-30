import React, { Component } from 'react';
import Iframe from './Iframe';

import { baseStaticUrl } from '../util/CommonUtils';

export default class SearchPage extends Component {
  render() {
    return (
      <Iframe
        className="key-search-iframe"
        url={`${baseStaticUrl}gis/gis3/key_search/china.html`}
      />
    );
  }
}
