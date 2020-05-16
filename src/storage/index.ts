import { select, takeLatest } from 'redux-saga/effects'
import { AsyncStorage } from 'react-native'
import { createSelector } from '@reduxjs/toolkit'
import { RootState } from 'src/store'

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

const selectPodcasts = (state: RootState) => state.podcasts
const selectEpisodes = (state: RootState) => state.episodes
const selectPlaylist = (state: RootState) => state.playlist

const dataToSaveSelector = createSelector(
  [selectPodcasts, selectEpisodes, selectPlaylist],
  (podcasts, episodes, playlist) => ({
    podcasts,
    episodes,
    playlist
  })
)

let lastState = null
export function * handleSave () {
  const storage = storageContainer.getStorage()
  const state = yield select(dataToSaveSelector)
  if (lastState !== state) {
    console.log('saving state', state)
    lastState = state
    storage.setItem(storageKey, JSON.stringify(state))
  }
}

export function * storageSaga () {
  yield takeLatest('*', handleSave)
}
