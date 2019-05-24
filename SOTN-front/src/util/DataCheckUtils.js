import moment from 'moment';
import { DateStyle } from '../component/pub/DateSelect';

export const CHECK_FOLDER = 'output';

export const getCheckPath = (date = moment().format(DateStyle.YMD)) =>
  `${CHECK_FOLDER}/${date}`;

export const getCheckMenuFile = date => `${getCheckPath(date)}/index.json`;
