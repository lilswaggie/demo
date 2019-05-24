// 兼容IE9 import 'babel-polyfill';
import 'react-app-polyfill/ie9';

import React from 'react';
import ReactDOM from 'react-dom';

import { Route } from 'react-router-dom';

// import { AppContainer } from 'react-hot-loader';
import configureStore from './store/configureStore';

import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { LocaleProvider, message } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

import DevTools from './container/DevTools';
import App from './App';

import * as serviceWorker from './serviceWorker';

import './index.scss';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

message.config({ top: 60, duration: 2, maxCount: 3 });

export const configStore = configureStore({});

const getDom = () => {
  const devDom = (
    <LocaleProvider locale={zh_CN}>
      <Provider store={configStore.store}>
        <PersistGate loading={null} persistor={configStore.persistor}>
          <ConnectedRouter history={configStore.history}>
            <div>
              <Route path="/" component={App} />
              <DevTools />
            </div>
          </ConnectedRouter>
        </PersistGate>
      </Provider>
    </LocaleProvider>
  );

  const prodDom = (
    <LocaleProvider locale={zh_CN}>
      <Provider store={configStore.store}>
        <PersistGate loading={null} persistor={configStore.persistor}>
          <ConnectedRouter history={configStore.history}>
            <Route path="/" component={App} />
          </ConnectedRouter>
        </PersistGate>
      </Provider>
    </LocaleProvider>
  );

  return process.env.NODE_ENV === 'production' ? prodDom : devDom;
};

ReactDOM.render(getDom(), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls. Learn
// more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
