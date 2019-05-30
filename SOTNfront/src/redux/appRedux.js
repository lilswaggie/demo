import { createAction, handleActions, combineActions } from 'redux-actions';

export const AppEnum = {
  SET_APP_TYPE: 'SET_APP_TYPE',
  SHOW_APP_TYPE: 'SHOW_APP_TYPE'
};

const setAppTypeAction = createAction(
  AppEnum.SET_APP_TYPE,
  type => ({ app: { type } })
);
const showAppTypeAction = createAction(
  AppEnum.SHOW_APP_TYPE,
  (visible, closable = false) => ({ app: { visible, closable } })
);

export { setAppTypeAction, showAppTypeAction };

const app = handleActions(
  {
    [combineActions(setAppTypeAction, showAppTypeAction)](
      pre,
      action
    ) {
      switch (action.type) {
        case AppEnum.SET_APP_TYPE:
        case AppEnum.SHOW_APP_TYPE:
          return { ...pre, ...action.payload.app };
        default:
          return pre;
      }
    }
  },
  {
    type: 0,
    visible: false,
    closable: false
  }
);

export { app };
