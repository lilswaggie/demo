import { user } from '../redux/loginRedux';
import { business } from '../redux/businessRedux';
import { lineCustomer } from '../redux/lineCustomerRedux';
import { region } from '../redux/regionRedux';
import { dict } from '../redux/dictRedux';

export const rootReducer = {
  user,
  business,
  lineCustomer,
  region,
  dict
};
