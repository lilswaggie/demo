import { createAction, handleActions, combineActions } from 'redux-actions';

export const BusinessEnum = {
  SET_BUSINESS_TYPE: 'SET_BUSINESS_TYPE',
  SHOW_BUSINESS_TYPE: 'SHOW_BUSINESS_TYPE'
};

const setBusinessTypeAction = createAction(
  BusinessEnum.SET_BUSINESS_TYPE,
  type => ({ business: { type } })
);
const showBusinessTypeAction = createAction(
  BusinessEnum.SHOW_BUSINESS_TYPE,
  (visible, closable = false) => ({ business: { visible, closable } })
);

export { setBusinessTypeAction, showBusinessTypeAction };

const business = handleActions(
  {
    [combineActions(setBusinessTypeAction, showBusinessTypeAction)](
      pre,
      action
    ) {
      switch (action.type) {
      case BusinessEnum.SET_BUSINESS_TYPE:
      case BusinessEnum.SHOW_BUSINESS_TYPE:
        return { ...pre, ...action.payload.business };
      default:
        return pre;
      }
    }
  },
  {
    type: 0, // 1是国际，2是政企
    visible: false,
    closable: false
  }
);

export { business };
