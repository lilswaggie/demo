import qs from 'qs';
import _ from 'lodash';

import { createAction } from 'redux-actions';

/**
 * 包装[redux-action]的createAction函数，减少创建请求成功、失败的action函数的模版代码.
 * @param type {string} 请求成功、失败的action type
 */
const createAxiosResAction = type =>
  createAction(type, (response, requestConfig) => ({
    axios: {
      response,
      requestConfig
    }
  }));

/**
 * 包装[redux-action]的createAction函数，减少创建请求axios的action函数的模版代码.
 * @param type {string} redux-action的type, 必须以AXIOS_开头
 * @param types {[string, string]} [ success action type, failure action type ]
 */
const createAxiosReqAction = (type, types, shouldAxios) => {
  if (!type.startsWith('AXIOS_')) {
    throw new Error('axios action的[type]必须以"AXIOS_"开头');
  }

  if (_.isFunction(types)) {
    shouldAxios = types;
    types = null;
  }

  if (!types || !types.length) {
    // 如果为手动指定返回成功和失败的action type，则：
    // 成功的type：type去掉'AXIOS_'前缀 + '_SUCCESS'后缀
    // 失败的type：type去掉'AXIOS_'前缀 + '_FAILURE'后缀
    let actionShortName = type.replace('AXIOS_', '');
    types = [`${actionShortName}_SUCCESS`, `${actionShortName}_FAILURE`];
  }

  const resActions = types.map(t => createAxiosResAction(t));

  return [
    createAction(type, (requestConfig, isShould) => ({
      axios: {
        types: resActions,
        requestConfig,
        // response,
        shouldAxios: isShould || shouldAxios
      }
    })),
    ...resActions
  ];
};

const getAxiosData = action => {
  let requestData = action.payload.axios.requestConfig.data;
  if (typeof requestData === 'string') {
    requestData = qs.parse(requestData);
  }
  return {
    requestData,
    responseData: action.payload.axios.response.data
  };
};

export { createAxiosReqAction, createAxiosResAction, getAxiosData };
