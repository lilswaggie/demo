import _ from 'lodash';
import { configStore } from '../index';
import { push } from 'react-router-redux';
import { AxiosRequest } from '../axios/mainAxios';
import { getRegionAction } from '../redux/regionRedux';
import { getDictAction } from '../redux/dictRedux';

const mockTock =
  'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzb3RuLW84IiwiZXhwIjoxODExNjkyNjEzLCJpYXQiOjE1NTI0OTI2MTN9.MoNOIuaTUfqRS7Dgjd97XELoIs1HNMZwAifc1soZ6sXY7nOHFASuf4l7SIEI4utlYEcZQzeh9yOXPy6RuBknHg';

export const getToken = () => {
  const user = configStore.store.getState().user;
  return (user ? user.token : '') || mockTock;
};

export const getBusinessType = () => {
  const business = configStore.store.getState().business;
  return business.type;
};

export const isAdmin = () => {
  const user = configStore.store.getState().user;
  return !!user && !!user.admin;
};

export const gotoPath = path => {
  configStore.store.dispatch(push(path));
};

export const gotoPathWithState = (path, state) => {
  configStore.store.dispatch(push(path, state));
};

export const goBack = () => {
  configStore.history.goBack();
};

export const toLogin = () => {
  gotoPath('login');
};

/**
 * 获取地域数据.
 */
export const getRegion = () => {
  const requestConfig = {
    method: AxiosRequest.GET,
    url: 'api/provinces'
  };
  configStore.store.dispatch(getRegionAction(requestConfig));
};

/**
 * 根据id获取dict.
 * @param {string} id
 */
export const getDict = id => {
  const requestConfig = {
    method: AxiosRequest.GET,
    url: 'api/sys_dict/' + id
  };
  const should = state => !state.dict[id] || !state.dict[id].length;
  configStore.store.dispatch(getDictAction(requestConfig, should));
};

export const getNameByDictKey = (id, key) => {
  const dict = configStore.store.getState().dict;
  if (_.isEmpty(dict[id])) {
    return '';
  }
  let find = dict[id].find(d => d.name === key);
  if (!find) {
    return '';
  }
  return find.value;
};
