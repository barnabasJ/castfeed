import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'

import * as Search from './search'
import * as Player from './player'

console.log('Search: ', Search)

const reducer = combineReducers({
  search: Search.reducer,
  player: Player.playerReducer
})

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose

const sagaMiddleware = createSagaMiddleware()

const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware))

const store = createStore(reducer, enhancer)

sagaMiddleware.run(function * rootSaga () {
  yield all([Search.searchSaga(), Player.rootSaga()])
})

export default store
