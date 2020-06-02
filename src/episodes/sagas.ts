import { takeEvery, put, select } from 'redux-saga/effects'
import { subscribeToPodcast, Podcast, unsubscribeFromPodcast } from 'src/podcasts'
import { PayloadAction } from '@reduxjs/toolkit'
import { getEpisodesForPodcast } from 'src/rss'
import { selectIds, remove } from '.'
import filter from 'lodash/fp/filter'
import startsWith from 'lodash/startsWith'

export function * handleGetEpisodesForPodcast ({
  payload: podcast
}: PayloadAction<Podcast>) {
  yield put(getEpisodesForPodcast(podcast))
}

export function * handleUnsubscribeFromPodcast ({ payload: podcast }: PayloadAction<Podcast>) {
  const ids = yield select(selectIds)
  const idsToRemove = filter((id: string) => startsWith(id, podcast.trackId.toString()), ids)
  yield put(remove(idsToRemove))
}

export function * episodesSaga () {
  yield takeEvery(subscribeToPodcast.toString(), handleGetEpisodesForPodcast)
  yield takeEvery(unsubscribeFromPodcast.toString(), handleUnsubscribeFromPodcast)
}
