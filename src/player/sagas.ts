import { Audio } from 'expo-av'
import {
  call,
  put,
  select,
  takeLatest,
  takeEvery,
  delay
} from 'redux-saga/effects'
import get from 'lodash/get'
import { PlaybackStatus } from 'expo-av/build/AV'
import {
  initPlayer,
  playNewEpisode,
  runUpdatePlayerStatus,
  togglePlay,
  skipForward,
  skipBackward,
  setRate,
  initFulfilled,
  initRejected,
  updatePlayerStatus,
  playNewEpisodeFulfilled,
  playNewEpisodeRejected,
  PlayableFile
} from '.'
import { PayloadAction } from '@reduxjs/toolkit'

const soundContainer = (() => {
  let sound: Audio.Sound = null
  const getSound = () => sound
  const setSound = newSound => (sound = newSound)
  return {
    getSound,
    setSound
  }
})()

const initialStatus = {
  shouldPlay: true
}

function getStatus (state): PlaybackStatus {
  return get(state, 'player.status')
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
    yield put(initFulfilled())
  } catch (e) {
    console.log(e)
    put(initRejected(e))
  }
}

function * handleRunUpdatePlayerStatus ({
  payload: interval
}: PayloadAction<number>) {
  const sound = soundContainer.getSound()
  yield call(sound.setProgressUpdateIntervalAsync.bind(sound), interval)
  while (true) {
    const newStatus = yield call(sound.getStatusAsync.bind(sound))
    yield put(updatePlayerStatus(newStatus))
    yield delay(interval)
  }
}

function * handlePlayerPlayNewEpisode (action: PayloadAction<PlayableFile>) {
  try {
    const episode = action.payload
    const sound = soundContainer.getSound()
    if (sound) {
      yield call(sound.stopAsync.bind(sound))
    }
    const source = { uri: episode.uri }
    const { sound: newSound, status } = yield call(
      Audio.Sound.createAsync,
      source,
      initialStatus
    )
    soundContainer.setSound(newSound)
    yield put(runUpdatePlayerStatus(500))
    yield put(playNewEpisodeFulfilled(episode, status))
  } catch (e) {
    console.log(e)
    yield put(playNewEpisodeRejected(e))
  }
}

function * handleTogglePlay () {
  const status = yield select(getStatus)
  const sound = soundContainer.getSound()
  if (sound) {
    yield status.isPlaying
      ? call(sound.pauseAsync.bind(sound))
      : call(sound.playAsync.bind(sound))
  }
}
function * handleSkipForward ({ payload: millis }: PayloadAction<number>) {
  yield handleSkip(millis)
}

function * handleSkipBackward ({ payload: millis }: PayloadAction<number>) {
  yield handleSkip(-millis)
}

function * handleSkip (millis: number) {
  const status = yield select(getStatus)
  const sound = soundContainer.getSound()
  if (sound && status) {
    yield call(
      sound.setPositionAsync.bind(sound),
      status.positionMillis + millis
    )
  }
}

function * handleSetRate ({ payload: rate }: PayloadAction<number>) {
  const sound = soundContainer.getSound()
  if (sound && sound._loaded) {
    yield call(
      sound.setRateAsync.bind(sound),
      rate,
      true,
      Audio.PitchCorrectionQuality.High
    )
  }
}

export function * rootSaga () {
  yield takeLatest(initPlayer.toString(), handlePlayerInit)
  yield takeLatest(playNewEpisode.toString(), handlePlayerPlayNewEpisode)
  yield takeLatest(
    runUpdatePlayerStatus.toString(),
    handleRunUpdatePlayerStatus
  )
  yield takeLatest(togglePlay.toString(), handleTogglePlay)
  yield takeEvery(skipForward.toString(), handleSkipForward)
  yield takeEvery(skipBackward.toString(), handleSkipBackward)
  yield takeLatest(setRate.toString(), handleSetRate)
}
