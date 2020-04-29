import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'
import { getDefaultMiddleware, configureStore } from '@reduxjs/toolkit'

import search from './search'
import player from './player'
import podcasts from './podcasts'
import episodes from './episodes'
import rss from './rss'
import { rootSaga as playerSaga } from './player/sagas'
import { episodesSaga } from './episodes/sagas'
import { searchSaga } from './search/sagas'
import { rssSaga } from './rss/sagas'
import { loadState, storageSaga } from './storage'

const reducer = {
  podcasts,
  episodes,
  search,
  rss,
  player
}

const preloadedState = loadState()

const sagaMiddleware = createSagaMiddleware()
const middleware = [...getDefaultMiddleware(), sagaMiddleware]

const store = configureStore({
  reducer,
  preloadedState,
  middleware
})

sagaMiddleware.run(function * rootSaga () {
  yield all([searchSaga(), playerSaga(), rssSaga(), episodesSaga(), storageSaga()])
})

export type RootState = ReturnType<typeof store.getState>

export default store
