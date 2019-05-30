import { createAxiosReqAction, getAxiosData } from '../axios/axiosAction';
import { handleActions, combineActions } from 'redux-actions';
import { objectToDict } from '../util/AnalysisUtils';

export const DictIdEnum = {
  // 站点类型
  SITE_TYPE: 'SITE_TYPE',
  // 机房级别
  ROOM_LEVEL: 'ROOM_LEVEL',
  // 机架类型
  BAY_TYPE: 'BAY_TYPE',
  // 网元级别. 传输业务级别
  SERVICE_LEVEL: 'SERVICE_LEVEL',
  // 网元状态
  ELEMENT_STATE: 'ELEMENT_STATE',
  // 业务保障等级
  SERVICE_LEVEL_GUARANTEE: 'SERVICE_LEVEL_GUARANTEE',
  // 端口速率
  PORT_SPEED: 'PORT_SPEED',
  // 端口类型
  PORT_TYPE: 'PORT_TYPE',
  // 客户服务等级
  SECURITY_LEVEL: 'SECURITY_LEVEL',
  // 板卡型号
  BOARD_TYPE: 'BOARD_TYPE',
  // 站点状态
  SITE_CONDITION: 'SITE_CONDITION',
  // 光电属性
  PHOTOELECTRIC_PROPERTIES: 'PHOTOELECTRIC_PROPERTIES',
  // 端口状态
  PORT_STATUS: 'PORT_STATUS',
  // 告警级别
  ALARM_LEVEL: 'ALARM_LEVEL'
};

export const DictEnum = {
  AXIOS_GET_DICT: 'AXIOS_GET_DICT',
  GET_DICT_SUCCESS: 'GET_DICT_SUCCESS',
  GET_DICT_FAILURE: 'GET_DICT_FAILURE'
};

const [
  getDictAction,
  getDictSuccessAction,
  getDictFailureAction
] = createAxiosReqAction(DictEnum.AXIOS_GET_DICT);

export { getDictAction };

const dict = handleActions(
  {
    [combineActions(getDictSuccessAction, getDictFailureAction)](pre, action) {
      switch (action.type) {
        case DictEnum.GET_DICT_SUCCESS:
          const {
            data: { id, values }
          } = getAxiosData(action).responseData;
          return {
            ...pre,
            [id]: objectToDict(values)
          };
        case DictEnum.GET_DICT_FAILURE:
        default:
          return pre;
      }
    }
  },
  {
    // id: [{name, value}]
  }
);

export { dict };
