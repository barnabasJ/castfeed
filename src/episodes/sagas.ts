import { takeEvery, put} from 'redux-saga/effects'
import { subscribeToPodcast, Podcast } from "src/podcasts";
import { PayloadAction } from '@reduxjs/toolkit';
import { getEpisodesForPodcast } from 'src/rss';

export function * handleGetEpisodesForPodcast ({
  payload: podcast
}: PayloadAction<Podcast>) {
  yield put(getEpisodesForPodcast(podcast))
}

export function * episodesSaga () {
  yield takeEvery(subscribeToPodcast.toString(), handleGetEpisodesForPodcast)
}