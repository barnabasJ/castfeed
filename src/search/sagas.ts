import { call, put, debounce } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'
import { searchPodcastFulfilled, searchPodcastRejected, searchPodcast } from '.'
import { Platform } from 'react-native'

const CORS_ANYWHERE = 'https://cors-anywhere.herokuapp.com/'

export function * searchPodcastSaga ({ payload: term }: PayloadAction<string>) {
  try {
    const query = `https://itunes.apple.com/search?media=podcast&term=${term}`

    const resp = yield call(
      fetch, Platform.OS === 'web' ? CORS_ANYWHERE + query : query
    )
    const { results } = yield call(resp.json.bind(resp))
    yield put(searchPodcastFulfilled(results))
  } catch (e) {
    console.log('error', e)
    yield put(searchPodcastRejected(e))
  }
}

export function * searchSaga () {
  yield debounce(100, searchPodcast.toString(), searchPodcastSaga)
}
