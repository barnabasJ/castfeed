import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'
import { getDefaultMiddleware, configureStore } from '@reduxjs/toolkit'

import search from './search'
import player from './player'
import { rootSaga as playerSaga } from './player/sagas'
import { searchSaga } from './search/sagas'

const reducer = {
  search,
  player
}

const sagaMiddleware = createSagaMiddleware()
const middleware = [...getDefaultMiddleware(), sagaMiddleware]

const store = configureStore({
  reducer,
  middleware
})

sagaMiddleware.run(function * rootSaga () {
  yield all([searchSaga(), playerSaga()])
})

export default store
