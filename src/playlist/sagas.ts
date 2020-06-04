import { takeEvery, put, select } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'
import { selectIds } from 'src/episodes'
import { unsubscribeFromPodcast } from 'src/podcasts'
import filter from 'lodash/fp/filter'
import startsWith from 'lodash/startsWith'
import { removeFromPlaylist } from '.'

export function * handleUnsubscribeFromPodcast ({ payload: podcast }: PayloadAction<Podcast>) {
  const ids = yield select(selectIds)
  const idsToRemove = filter((id: string) => startsWith(id, podcast.trackId.toString()), ids)
  yield put(removeFromPlaylist(idsToRemove))
}

export function * playlistSaga () {
  yield takeEvery(unsubscribeFromPodcast, handleUnsubscribeFromPodcast)
}

export default playlistSaga
