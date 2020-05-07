import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'
import { getDefaultMiddleware, configureStore, combineReducers } from '@reduxjs/toolkit'

import search from './search'
import player from './player'
import podcasts from './podcasts'
import episodes from './episodes'
import rss from './rss'
import { rootSaga as playerSaga } from './player/sagas'
import { episodesSaga } from './episodes/sagas'
import { searchSaga } from './search/sagas'
import { rssSaga } from './rss/sagas'
import { storageSaga } from './storage'

const reducer = combineReducers({
  podcasts,
  episodes,
  search,
  rss,
  player
})

const createStore = (preloadedState: Partial<RootState>) => {
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
  return store
}
export type RootState = ReturnType<typeof reducer>
export default createStore
