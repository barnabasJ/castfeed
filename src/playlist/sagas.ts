import { takeEvery, put, select } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'
import { selectById, Episode, selectCurrentEpisode } from 'src/episodes'
import { playNewFile, pause } from 'src/player'
import { addPlayNow, removeFromPlaylist } from '.'

export function * handlePlayNow ({
  payload: episodeId
}: PayloadAction<string>) {
  const episode: Episode = yield select(state => selectById(state, episodeId))
  yield put(playNewFile(episode.file))
}

let lastEpisode = null
export function * handleRemoveFromPlaylist () {
  const currentEpisode: Episode | null = yield select(selectCurrentEpisode)
  if (!currentEpisode) {
    yield put(pause())
  } else if (lastEpisode !== currentEpisode) {
    yield put(playNewFile(currentEpisode.file))
    lastEpisode = currentEpisode
  }
}

export function * playlistSaga () {
  yield takeEvery(addPlayNow, handlePlayNow)
  yield takeEvery(removeFromPlaylist, handleRemoveFromPlaylist)
}

export default playlistSaga
