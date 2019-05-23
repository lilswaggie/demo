import { takeEvery } from 'redux-saga/effects';
import { watchAxiosRequest } from '../axios/mainAxios';

export function* rootSagas(state) {
  yield takeEvery(
    actionProps => actionProps.type.startsWith('AXIOS_'),
    watchAxiosRequest,
    state
  );
}
