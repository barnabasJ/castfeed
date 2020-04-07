import { combineReducers, createStore } from 'redux'

import * as Search from './search'

console.log('Search: ', Search)

const reducer = combineReducers({
  search: Search.reducer
})

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store
