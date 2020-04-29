import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'
import { getDefaultMiddleware, configureStore } from '@reduxjs/toolkit'

import * as Search from './search'
import player from './player'
import { rootSaga as playerSaga } from './player/sagas'

const reducer = {
  search: Search.reducer,
  player
}

const sagaMiddleware = createSagaMiddleware()
const middleware = [...getDefaultMiddleware(), sagaMiddleware]

const store = configureStore({
  reducer,
  middleware,
})

sagaMiddleware.run(function * rootSaga () {
  yield all([Search.searchSaga(), playerSaga()])
})

export default store
