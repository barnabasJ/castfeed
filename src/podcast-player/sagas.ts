import { select, put, takeLatest, takeEvery } from 'redux-saga/effects'
import { selectStatus, play, pause, playNewFile, fileFinishedPlaying, updatePlayerStatus, selectIsPlaying } from 'src/player'
import { PlaybackStatus } from 'expo-av/build/AV'
import { togglePlay } from '.'
import { addPlayNow, removeFromPlaylist, stepToNext } from 'src/playlist'
import { selectCurrentEpisode, Episode, selectById as selectEpisodeById } from 'src/episodes'
import { selectById as selectStatusById, updatesStatus as updateStatus } from 'src/status'
import { PayloadAction } from '@reduxjs/toolkit'

export function * handlePlayNow ({
  payload: episodeId
}: PayloadAction<string>) {
  const episode: Episode = yield select(state => selectEpisodeById(state, episodeId))
  const episodeStatus = yield select((state) => selectStatusById(state, episode.id))
  const { status } = episodeStatus || {}
  yield put(playNewFile(episode.file, status))
}

let lastEpisode = null
export function * handleRemoveFromPlaylist () {
  const currentEpisode: Episode | null = yield select(selectCurrentEpisode)
  if (!currentEpisode) {
    yield put(pause())
  }
  const isPlaying: boolean = yield select(selectIsPlaying)
  if (isPlaying && lastEpisode !== currentEpisode) {
    const episodeStatus = yield select((state) => selectStatusById(state, currentEpisode.id))
    const { status } = episodeStatus || {}
    yield put(playNewFile(currentEpisode.file, status))
  }
  lastEpisode = currentEpisode
}

function * handelTogglePlay () {
  const currentEpisode: Episode | null = yield select(selectCurrentEpisode)
  const playerStatus: PlaybackStatus | null = yield select(selectStatus)
  if (currentEpisode) {
    if (!playerStatus) {
      const episodeStatus = yield select((state) => selectEpisodeById(state, currentEpisode.id))
      const { status } = episodeStatus || {}
      yield put(playNewFile(currentEpisode.file, status))
    } else if (playerStatus && playerStatus.isLoaded && playerStatus.isPlaying) {
      yield put(pause())
    } else {
      yield put(play())
    }
  }
}

function * handleFileFinishedPlaying () {
  yield put(stepToNext())
  const currentEpisode: Episode | null = yield select(selectCurrentEpisode)
  if (currentEpisode) {
    const episodeStatus = yield select((state) => selectStatusById(state, currentEpisode.id))
    const { status } = episodeStatus || {}
    yield put(playNewFile(currentEpisode.file, status))
  }
}

function * handleUpdateStatus (action: ReturnType<typeof updatePlayerStatus>) {
  const playbackStatus = action.payload
  const currentEpisode = yield select(selectCurrentEpisode)
  yield put(updateStatus(currentEpisode, playbackStatus))
}

export default function * podcastPlayerSaga () {
  yield takeLatest(togglePlay, handelTogglePlay)
  yield takeLatest(fileFinishedPlaying, handleFileFinishedPlaying)
  yield takeLatest(updatePlayerStatus, handleUpdateStatus)
  yield takeEvery(addPlayNow, handlePlayNow)
  yield takeEvery(removeFromPlaylist, handleRemoveFromPlaylist)
}
