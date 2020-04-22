import { Audio } from 'expo-av'
import { call, put, select, takeLatest, takeEvery, delay } from 'redux-saga/effects'
import get from 'lodash/get'
import {
  initPlayerSuccessfulAction,
  initPlayerFailedAction,
  playNewEpisodeSuccessfulAction,
  playNewEpisodeFailedAction,
  PlayNewEpisodeAction,
  RunUpdatePlayerStatusAction,
  updatePlayerStatusAction,
  runUpdatePlayerStatusAction,
  SkipForwardAction
} from './actions'
import {
  PLAYER_INIT,
  PLAYER_PLAY_NEW_EPISODE,
  PLAYER_RUN_UPDATE_PLAYER_STATUS,
  PLAYER_TOGGLE_PLAY,
  PLAYER_SKIP_FORWARD,
  PLAYER_SKIP_BACKWARD
} from './types'
import { PlaybackStatus } from 'expo-av/build/AV'

const initialStatus = {
  shouldPlay: true
}

function getSoundAndStatus (
  state
): { sound: Audio.Sound; status: PlaybackStatus } {
  return {
    sound: get(state, 'player.sound'),
    status: get(state, 'player.status')
  }
}

function * handlePlayerInit () {
  try {
    yield call(Audio.setAudioModeAsync, {
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false
    })
    yield put(initPlayerSuccessfulAction())
  } catch (e) {
    console.log(e)
    put(initPlayerFailedAction(e))
  }
}

function * handleRunUpdatePlayerStatus ({
  sound,
  interval
}: RunUpdatePlayerStatusAction) {
  console.log('setting progress update intervall: ', interval)
  yield call(sound.setProgressUpdateIntervalAsync.bind(sound), interval)
  while (true) {
    console.log('Waiting for new status')
    const newStatus = yield call(sound.getStatusAsync.bind(sound))
    console.log('Setting new status')
    yield put(updatePlayerStatusAction(newStatus))
    console.log('Waiing: ', interval)
    yield delay(interval)
  }
}

function * handlePlayerPlayNewEpisode ({ episode }: PlayNewEpisodeAction) {
  try {
    const oldSound = yield select(state => get(state, 'player.sound'))
    if (oldSound) {
      yield call(oldSound.stopAsync.bind(oldSound))
    }
    const source = { uri: episode.uri }
    const { sound, status } = yield call(
      Audio.Sound.createAsync,
      source,
      initialStatus
    )
    yield put(runUpdatePlayerStatusAction(sound, 500))
    yield put(playNewEpisodeSuccessfulAction(sound, status))
  } catch (e) {
    console.log(e)
    yield put(playNewEpisodeFailedAction(e))
  }
}

function * handleTogglePlay () {
  const { sound, status } = yield select(getSoundAndStatus)
  console.log('Toggle Play/Pause')
  if (sound) {
    yield status.isPlaying
      ? call(sound.pauseAsync.bind(sound))
      : call(sound.playAsync.bind(sound))
  }
}
function * handleSkipForward ({ millis }: SkipForwardAction) {
  yield handleSkip(millis)
}

function * handleSkipBackward ({ millis }: SkipForwardAction) {
  yield handleSkip(-millis)
}

function * handleSkip (millis: number) {
  const { sound, status } = yield select(getSoundAndStatus)
  if (sound && status) {
    yield call(
      sound.setPositionAsync.bind(sound),
      status.positionMillis + millis
    )
  }
}

export function * rootSaga () {
  yield takeLatest(PLAYER_INIT, handlePlayerInit)
  yield takeLatest(PLAYER_PLAY_NEW_EPISODE, handlePlayerPlayNewEpisode)
  yield takeLatest(PLAYER_RUN_UPDATE_PLAYER_STATUS, handleRunUpdatePlayerStatus)
  yield takeLatest(PLAYER_TOGGLE_PLAY, handleTogglePlay)
  yield takeEvery(PLAYER_SKIP_FORWARD, handleSkipForward)
  yield takeEvery(PLAYER_SKIP_BACKWARD, handleSkipBackward)
}
