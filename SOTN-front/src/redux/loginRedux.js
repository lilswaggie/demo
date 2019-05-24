import { createAxiosReqAction, getAxiosData } from '../axios/axiosAction';
import { handleActions, combineActions } from 'redux-actions';

export const LoginEnum = {
  AXIOS_LOGIN: 'AXIOS_LOGIN',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',

  AXIOS_GET_USER: 'AXIOS_GET_USER',
  GET_USER_SUCCESS: 'GET_USER_SUCCESS',
  GET_USER_FAILURE: 'GET_USER_FAILURE'
};

const [
  loginAction,
  loginSuccessAction,
  loginFailureAction
] = createAxiosReqAction(LoginEnum.AXIOS_LOGIN);

const [
  getUserAction,
  getUserSuccessAction,
  getUserFailureAction
] = createAxiosReqAction(LoginEnum.AXIOS_GET_USER);

export { loginAction, getUserAction };

const defaultUser = {
  admin: false,
  ignoredPendings: [],
  others: {},
  token: '',
  userId: ''
};

const user = handleActions(
  {
    [combineActions(
      loginSuccessAction,
      loginFailureAction,
      getUserSuccessAction,
      getUserFailureAction
    )](preUser, action) {
      switch (action.type) {
      case LoginEnum.LOGIN_SUCCESS:
      case LoginEnum.GET_USER_SUCCESS:
        return { ...preUser, ...getAxiosData(action).responseData.data };
      case LoginEnum.LOGIN_FAILURE:
      case LoginEnum.GET_USER_FAILURE:
      default:
        return preUser;
      }
    }
  },
  defaultUser
);

export { user };
