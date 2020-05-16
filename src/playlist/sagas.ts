import { takeEvery, put, select } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'
import { selectById, Episode } from 'src/episodes'
import { playNewFile } from 'src/player'
import { addPlayNow } from '.'

export function * handlePlayNow ({
  payload: episodeId
}: PayloadAction<string>) {
  const episode: Episode = yield select(state => selectById(state, episodeId))
  yield put(playNewFile(episode.file))
}

export function * playlistSaga () {
  yield takeEvery(addPlayNow, handlePlayNow)
}

export default playlistSaga
