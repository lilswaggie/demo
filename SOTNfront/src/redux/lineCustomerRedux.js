import { createAction, handleActions, combineActions } from 'redux-actions';

export const LineCustomerEnum = {
  SHOW_LINE_CUSTOMER: 'SHOW_LINE_CUSTOMER'
};

const showLineCustomerAction = createAction(
  LineCustomerEnum.SHOW_LINE_CUSTOMER,
  (visible, lineList = [], closable = true) => ({
    lineCustomer: { visible, lineList, closable }
  })
);

export { showLineCustomerAction };

const lineCustomer = handleActions(
  {
    [combineActions(showLineCustomerAction)](pre, action) {
      switch (action.type) {
        case LineCustomerEnum.SHOW_LINE_CUSTOMER:
          return { ...pre, ...action.payload.lineCustomer };
        default:
          return pre;
      }
    }
  },
  {
    visible: false,
    lineList: [],
    closable: true
  }
);

export { lineCustomer };
