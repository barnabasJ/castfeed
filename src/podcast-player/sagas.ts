import { debounce, select, put, takeLatest } from 'redux-saga/effects'
import { selectStatus, play, pause, playNewFile, fileFinishedPlaying, updatePlayerStatus } from 'src/player'
import { PlaybackStatus } from 'expo-av/build/AV'
import { togglePlay } from '.'
import { selectCurrentEpisode, Episode } from 'src/episodes'
import { stepToNext } from 'src/playlist'
import { selectById, updatesStatus as updateStatus } from 'src/status'

function * handelTogglePlay () {
  const currentEpisode: Episode | null = yield select(selectCurrentEpisode)
  const playerStatus: PlaybackStatus | null = yield select(selectStatus)
  if (currentEpisode) {
    if (!playerStatus) {
      const episodeStatus = yield select((state) => selectById(state, currentEpisode.id))
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
    const episodeStatus = yield select((state) => selectById(state, currentEpisode.id))
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
  yield takeLatest(togglePlay.toString(), handelTogglePlay)
  yield takeLatest(fileFinishedPlaying.toString(), handleFileFinishedPlaying)
  yield takeLatest(updatePlayerStatus.toString(), handleUpdateStatus)
}
