import { throttle, select, put, takeLatest } from 'redux-saga/effects'
import { selectStatus, play, pause, playNewFile, fileFinishedPlaying } from 'src/player'
import { PlaybackStatus } from 'expo-av/build/AV'
import { togglePlay } from '.'
import { selectCurrentEpisode, Episode } from 'src/episodes'
import { stepToNext } from 'src/playlist'

function * handelTogglePlay () {
  const currentEpisode: Episode | null = yield select(selectCurrentEpisode)
  const status: PlaybackStatus | null = yield select(selectStatus)
  if (currentEpisode) {
    if (!status) {
      yield put(playNewFile(currentEpisode.file))
    } else if (status && status.isLoaded && status.isPlaying) {
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
    yield put(playNewFile(currentEpisode.file))
  }
}

export default function * podcastPlayerSaga () {
  yield throttle(100, togglePlay.toString(), handelTogglePlay)
  yield takeLatest(fileFinishedPlaying.toString(), handleFileFinishedPlaying)
}
