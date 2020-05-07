import { select, takeLatest } from 'redux-saga/effects'
import { AsyncStorage } from 'react-native'

const storageContainer = (() => {
  let storage = AsyncStorage

  const getStorage = () => storage
  const setStorage = newStorage => { storage = newStorage }

  return {
    getStorage,
    setStorage
  }
})()

const storageKey = 'castfeed'

export const loadState = async () => JSON.parse(await storageContainer.getStorage().getItem(storageKey) || '{}')

let lastState = null
export function * handleSave () {
  const storage = storageContainer.getStorage()
  const state = yield select(({ podcasts, episodes }) => ({
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

export function * storageSaga () {
  yield takeLatest('*', handleSave)
}
