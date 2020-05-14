import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'
import { getDefaultMiddleware, configureStore, combineReducers, DeepPartial } from '@reduxjs/toolkit'
import { useSelector as reactReduxUseSelector, TypedUseSelectorHook } from 'react-redux'

import search from './search'
import player from './player'
import podcasts from './podcasts'
import episodes from './episodes'
import rss from './rss'
import playlist from './playlist'
import { rootSaga as playerSaga } from './player/sagas'
import { episodesSaga } from './episodes/sagas'
import { searchSaga } from './search/sagas'
import { rssSaga } from './rss/sagas'
import { storageSaga } from './storage'
import { playlistSaga } from './playlist/sagas'

const reducer = combineReducers({
  podcasts,
  episodes,
  search,
  rss,
  player,
  playlist
})

const createStore = (preloadedState: DeepPartial<RootState>) => {
  const sagaMiddleware = createSagaMiddleware()
  const middleware = [...getDefaultMiddleware(), sagaMiddleware]

  const store = configureStore({
    reducer,
    preloadedState,
    middleware
  })

  sagaMiddleware.run(function * rootSaga () {
    yield all([searchSaga(), playerSaga(), playlistSaga(), rssSaga(), episodesSaga(), storageSaga()])
  })
  return store
}
export type RootState = ReturnType<typeof reducer>

export const useSelector: TypedUseSelectorHook<RootState> = reactReduxUseSelector

export default createStore
