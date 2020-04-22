import { call, put, takeLatest } from 'redux-saga/effects'
import { searchSuccessful, searchFailed, SEARCH_PODCAST } from './actions'

export function * searchPodcastSaga ({ term }) {
  try {
    const resp = yield call(
      fetch,
      `https://itunes.apple.com/search?media=podcast&term=${term}`
    )
    const json = yield call(resp.json.bind(resp))
    console.log(json)
    yield put(searchSuccessful(json))
  } catch (e) {
    console.log("error", e)
    yield put(searchFailed(e))
  }
}

export function * searchSaga () {
  yield takeLatest(SEARCH_PODCAST, searchPodcastSaga)
}
