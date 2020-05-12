import { select, takeLatest } from "redux-saga/effects";
import { persistor, store } from './local-storage';

const storageContiner = (() => {
  let storage = window.localStorage;

  const getStorage = () => storage
  const setStorage = newStorage => storage = newStorage

  return {
    getStorage,
    setStorage
  }
})()

const storageKey = 'castfeed'

export const loadState = () => JSON.parse(storageContiner.getStorage().getItem(storageKey) || '{}')

let lastState = null
export function * handleSave() {
  const storage = storageContiner.getStorage()
  const state = yield select(({podcasts, episodes}) => ({
    podcasts,
    episodes
  }))
  console.log(lastState, state)
  if (lastState != state) {
    console.log('save state')
    lastState = state
    storage.setItem(storageKey, JSON.stringify(state))
  }
}

export function * storageSaga() {
  yield takeLatest('*', handleSave)
}