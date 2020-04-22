import { Audio } from 'expo-av'
import { call, put, select, takeLatest, delay } from 'redux-saga/effects'
import get from 'lodash/get'
import {
  initPlayerSuccessfulAction,
  initPlayerFailedAction,
  playNewEpisodeSuccessfulAction,
  playNewEpisodeFailedAction,
  PlayNewEpisodeAction,
  RunUpdatePlayerStatusAction,
  updatePlayerStatusAction,
  runUpdatePlayerStatusAction
} from './actions'
import { PLAYER_INIT, PLAYER_PLAY_NEW_EPISODE, PLAYER_RUN_UPDATE_PLAYER_STATUS, PLAYER_TOGGLE_PLAY } from './types'
import { PlaybackStatus } from 'expo-av/build/AV'

const initialStatus = {
  shouldPlay: true
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
  console.log("setting progress update intervall: ", interval)
  yield call(sound.setProgressUpdateIntervalAsync.bind(sound), interval)
  while (true) {
    console.log("Waiting for new status")
    const newStatus = yield call(sound.getStatusAsync.bind(sound))
    console.log("Setting new status")
    yield put(updatePlayerStatusAction(newStatus))
    console.log("Waiing: ", interval)
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
  const {
    sound,
    status
  }: { sound: Audio.Sound; status: PlaybackStatus } = yield select(state => ({
    sound: get(state, 'player.sound'),
    status: get(state, 'player.status')
  }))
  console.log("Toggle Play/Pause")
  if (sound) {
    yield status.isPlaying
      ? call(sound.pauseAsync.bind(sound))
      : call(sound.playAsync.bind(sound))
  }
}

export function * rootSaga () {
  yield takeLatest(PLAYER_INIT, handlePlayerInit)
  yield takeLatest(PLAYER_PLAY_NEW_EPISODE, handlePlayerPlayNewEpisode)
  yield takeLatest(PLAYER_RUN_UPDATE_PLAYER_STATUS, handleRunUpdatePlayerStatus)
  yield takeLatest(PLAYER_TOGGLE_PLAY, handleTogglePlay)
}
