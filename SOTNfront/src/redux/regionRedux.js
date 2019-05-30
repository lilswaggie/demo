import { createAxiosReqAction, getAxiosData } from '../axios/axiosAction';
import { handleActions, combineActions } from 'redux-actions';

export const RegionEnum = {
  AXIOS_GET_REGION: 'AXIOS_GET_REGION',
  GET_REGION_SUCCESS: 'GET_REGION_SUCCESS',
  GET_REGION_FAILURE: 'GET_REGION_FAILURE'
};

const [
  getRegionAction,
  getRegionSuccessAction,
  getRegionFailureAction
] = createAxiosReqAction(
  RegionEnum.AXIOS_GET_REGION,
  state => !state.region || !state.region.length
);

export { getRegionAction };

const region = handleActions(
  {
    [combineActions(getRegionSuccessAction, getRegionFailureAction)](
      preRegion,
      action
    ) {
      switch (action.type) {
        case RegionEnum.GET_REGION_SUCCESS:
          return getAxiosData(action).responseData.data;
        case RegionEnum.GET_REGION_FAILURE:
        default:
          return preRegion;
      }
    }
  },
  []
);

export { region };
