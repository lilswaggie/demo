import createSagaMiddleware from 'redux-saga';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { routerMiddleware, routerReducer } from 'react-router-redux';

import { createLogger } from 'redux-logger';
import { createBrowserHistory } from 'history';

import DevTools from '../container/DevTools';

import { rootSagas } from '../saga/mainSaga';
// import { watchAxiosRequest } from '../axios/mainAxios';
import { rootReducer } from '../reducer/mainReducer';

import { persistStore, persistReducer } from 'redux-persist';
// defaults to localStorage for web and AsyncStorage for react-native
import storage from 'redux-persist/lib/storage';

import '../axios/mainAxios';

const configureStore = preloadedState => {
  const persistConfig = {
    key: 'sotn',
    storage: storage,
    whitelist: ['user', 'business' /*'region'*/]
  };

  const isProdEnv = process.env.NODE_ENV === 'production';
  let history = createBrowserHistory({
    basename: isProdEnv ? '/sotn' : '/',
    getUserConfirmation: (message, callback) => {
      // 注销时不做拦截，需要在注销之前单独拦截
      // const user = getUser();
      // if (user && user.userid) {
      //     modalUtil.confirmDangerModal(message, () => callback(true), () => callback(false), '确定离开');
      // } else {
      //     callback(true);
      // }
      callback(true);
    }
  });

  const sagasMiddle = createSagaMiddleware();
  const middleWareArr = [routerMiddleware(history), sagasMiddle];

  const reducers = {
    ...rootReducer,
    routing: routerReducer
  };

  if (!isProdEnv) {
    middleWareArr.push(createLogger());
  }

  const persistedReducer = persistReducer(
    persistConfig,
    combineReducers(reducers)
  );
  // let enhancer = window['devToolsExtension'] ? window['devToolsExtension']()(createStore) : createStore;
  let store = createStore(
    persistedReducer,
    preloadedState,
    isProdEnv
      ? compose(applyMiddleware(...middleWareArr))
      : compose(
        applyMiddleware(...middleWareArr),
        DevTools.instrument()
      )
  );

  let persistor = persistStore(store);

  // run sagas
  sagasMiddle.run(rootSagas, store.getState);

  // if (!isProdEnv && module.hot) {
  //     // Enable Webpack hot module replacement for reducers
  //     module.hot.accept('../reducers/mainReducer', () => {
  //         const nextRootReducer = require('../reducers/mainReducer').rootReducer;
  //         store.replaceReducer(nextRootReducer);
  //     });
  // }

  return {
    // 把history导出，供index.ts的react-router-redux的ConnectedRouter组件引用
    history,
    // 把store导出，供index.ts的react-redux的Provider组件引用
    store,
    persistor
  };
};

export default configureStore;
