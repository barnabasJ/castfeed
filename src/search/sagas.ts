import { call, put, takeLatest, delay } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'
import { searchPodcastFulfilled, searchPodcastRejected, searchPodcast } from '.'

export function * searchPodcastSaga ({ payload: term }: PayloadAction<string>) {
  try {
    yield delay(100) // debounce
    const resp = yield call(
      fetch,
      `https://itunes.apple.com/search?media=podcast&term=${term}`
    )
    const { results } = yield call(resp.json.bind(resp))
    yield put(searchPodcastFulfilled(results))
  } catch (e) {
    console.log('error', e)
    yield put(searchPodcastRejected(e))
  }
}

export function * searchSaga () {
  yield takeLatest(searchPodcast.toString(), searchPodcastSaga)
}
