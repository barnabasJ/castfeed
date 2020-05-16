import { throttle, select, put } from 'redux-saga/effects'
import { selectStatus, play, pause } from 'src/player'
import { PlaybackStatus } from 'expo-av/build/AV'
import { togglePlay } from '.'

function * handelTogglePlay () {
  const status: PlaybackStatus | null = yield select(selectStatus)
  if (status && status.isLoaded && status.isPlaying) {
    yield put(pause())
  } else {
    yield put(play())
  }
}

export default function * podcastPlayerSaga () {
  yield throttle(100, togglePlay.toString(), handelTogglePlay)
}
