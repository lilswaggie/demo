import axios from 'axios';
import _ from 'lodash';
import qs from 'qs';
import { call, put } from 'redux-saga/effects';
import { message } from 'antd';
import { getToken } from '../util/ReduxUtil';
import { baseUrl, mockBaseUrl, baseCheckUrl } from '../util/CommonUtils';

export const AxiosRequest = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
  HEAD: 'head',
  PATCH: 'patch'
};

export const AxiosResponseType = {
  BLOB: 'blob',
  ARRAY_BUFFER: 'arraybuffer',
  DOCUMENT: 'document',
  JSON: 'json',
  TEXT: 'text',
  STREAM: 'stream'
};

// 设置默认全局配置
const makeAxiosInstance = (baseURL = baseUrl) =>
  axios.create({
    baseURL: baseURL,
    headers: {
      // 'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    // transformRequest: [(data) => {
    //     return qs.stringify(data, { indices: false });
    // }],
    paramsSerializer: params => qs.stringify(params, { indices: false })
    // withCredentials: process.env.NODE_ENV !== 'production',
  });

const axiosInstance = makeAxiosInstance(baseUrl);
const checkAxiosInstance = makeAxiosInstance(baseCheckUrl);
const mockAxiosInstance = makeAxiosInstance(mockBaseUrl);

const axiosFormDataInstance = axios.create({
  baseURL: baseUrl
});

const axiosDownloadInstance = axios.create({
  baseURL: baseUrl,
  responseType: AxiosResponseType.BLOB,
  paramsSerializer: params => qs.stringify(params, { indices: false })
});

// request拦截器，拦截在请求发出之前
[
  axiosInstance,
  axiosFormDataInstance,
  mockAxiosInstance,
  axiosDownloadInstance
].forEach(item => {
  item.interceptors.request.use(
    config => {
      // 添加一些通用配置，例如：把token放到headers里面
      // 必须返回config
      let token = getToken();
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
    },
    error => {
      // 错误处理
      return Promise.reject(error);
    }
  );

  // response拦截器，拦截在请求返回之后，数据处理函数执行之前
  item.interceptors.response.use(
    response => {
      // if (response.request.responseType === AxiosResponseType.Blob) {
      // }
      // // 对返回的数据进行一些通用处理
      // const data = response.data;
      // if (data.code === 401) {
      // }
      return response;
    },
    error => {
      // Do something with response error
      return Promise.reject(error);
    }
  );
});

/**
 * watch 所有type以AXIOS_开头axios.
 * 根据action里设定的请求参数配置、对所有的请求进行统一处理
 * 根据types定义的action名，对处理结果进行分发（请求成功、请求失败）
 */
function* watchAxiosRequest(getState, action) {
  if (action.payload.axios) {
    const {
      types = [],
      requestConfig,
      shouldAxios = state => true
    } = action.payload.axios;

    // 必须包含url字段
    // method为空或不传，默认为"get"
    if (!requestConfig || !requestConfig.url) {
      throw new Error('AXIOS: 字段[requestConfig.url] 不能为空.');
    }

    if (
      !Array.isArray(types) ||
      types.length !== 2 ||
      !types.every(type => _.isFunction(type))
    ) {
      throw new Error(
        'AXIOS: 字段[types]必须是长度为2的redux-action创建的函数数组.'
      );
    }

    // 对于一些直接从store能读取到就不需要请求的数据，不进行http请求
    if (!shouldAxios(getState())) {
      return;
    }

    const [successActionCreator, failureActionCreator] = types;

    // 执行请求、获取response
    const response = yield call(axiosInstance.request, requestConfig);

    const { status, statusText } = response;
    // 请求失败的情况
    if (status !== 200) {
      message.error('系统繁忙，请稍候重试.');
      throw new Error(`${requestConfig.url} 请求出错: ${statusText}.`);
    }

    let data = response.data;

    // 请求成功、处理失败的情况
    if (data.status === 0) {
      // message.error(data.msg, 5);
      // 接口处理失败执行的操作
      yield put(failureActionCreator(response, requestConfig));
      requestConfig.callback && requestConfig.callback();
      requestConfig.failureCallback &&
        requestConfig.failureCallback(data.statusInfo.errorMsg);
    } else {
      // 请求成功、进行reducer的处理
      yield put(successActionCreator(response, requestConfig));
      requestConfig.callback && requestConfig.callback();
      requestConfig.successCallback && requestConfig.successCallback();
    }
  }
}

const catchFun = fFun => error => {
  // if (process.env.NODE_ENV !== 'production') {
  console.error(error);
  fFun ? fFun() : message.error('系统繁忙，请稍候重试.');
};

const processAxiosResponse = (sFun, fFun) => response => {
  const responseData = response.data;
  if (responseData.code - 0 === 200) {
    sFun && sFun(responseData.data);
  } else {
    fFun ? fFun(responseData) : message.error(responseData.msg);
  }
};

function postAxiosFormData(url, formData, sFun, fFun) {
  const config = { headers: { 'Content-Type': 'multipart/form-data' } };
  axiosFormDataInstance
    .post(url, formData, config)
    .then(processAxiosResponse(sFun, fFun))
    .catch(catchFun(fFun));
}

function postAxiosBodyAndQuery(url, data, query, sFun, fFun) {
  axiosInstance
    .post(url, data, { params: query })
    .then(processAxiosResponse(sFun, fFun))
    .catch(catchFun(fFun));
}

const makeGetAxiosStaticData = instance => (url, callback) => {
  instance
    .get(url)
    .then(response => callback && callback(response.data))
    .catch(catchFun());
};

const makeAxiosFun = (instance, axiosFun) => (url, data, sFun, fFun) => {
  _.isFunction(data) && ([data, sFun, fFun] = [{}, data, sFun]);
  axiosFun(instance, url, data)
    .then(processAxiosResponse(sFun, fFun))
    .catch(catchFun(fFun));
};
const getAxiosFun = (instance, url, data) =>
  instance.get(url, { params: data });
const postAxiosFun = (instance, url, data) => instance.post(url, data);

const deleteAxiosFun = (instance, url, data) => instance.delete(url, { data });
const putAxiosFun = (instance, url, data) => instance.put(url, data);

const getAxios = makeAxiosFun(axiosInstance, getAxiosFun);
const postAxios = makeAxiosFun(axiosInstance, postAxiosFun);
const putAxios = makeAxiosFun(axiosInstance, putAxiosFun);
const deleteAxios = makeAxiosFun(axiosInstance, deleteAxiosFun);
const getAxiosStaticData = makeGetAxiosStaticData(axiosInstance);

const getMockAxios = makeAxiosFun(mockAxiosInstance, getAxiosFun);
const postMockAxios = makeAxiosFun(mockAxiosInstance, postAxiosFun);
const putMockAxios = makeAxiosFun(mockAxiosInstance, putAxiosFun);
const deleteMockAxios = makeAxiosFun(mockAxiosInstance, deleteAxiosFun);
const getMockAxiosStaticData = makeGetAxiosStaticData(mockAxiosInstance);

const makeDownloadAxios = method => (url, data, sFun, fFun) => {
  let config = {
    method,
    url,
    data
  };
  if (method === AxiosRequest.GET) {
    config.params = data;
    delete config.data;
  }
  axiosDownloadInstance
    .request(config)
    .then(response => {
      sFun && sFun(response);
    })
    .catch(catchFun(fFun));
};
const getDownloadAxios = makeDownloadAxios(AxiosRequest.GET);
const postDownloadAxios = makeDownloadAxios(AxiosRequest.POST);

export {
  axiosInstance,
  watchAxiosRequest,
  getAxios,
  postAxios,
  postAxiosBodyAndQuery,
  putAxios,
  deleteAxios,
  getAxiosStaticData,
  postAxiosFormData,
  getMockAxios,
  postMockAxios,
  putMockAxios,
  deleteMockAxios,
  getMockAxiosStaticData,
  checkAxiosInstance,
  getDownloadAxios,
  postDownloadAxios
};
