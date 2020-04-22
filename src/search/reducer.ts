import {
  SEARCH_SUCCESSFUL,
  SEARCH_FAILED,
} from './actions'


const initalState = {
  term: "",
  results: [],
  error: null
}

export function reducer(state = initalState, action) {
  switch(action.type) {
    case SEARCH_SUCCESSFUL:
      return {
        ...state,
        results: action.results,
        error: null
      }
    case SEARCH_FAILED:
      return {
        ...state,
        error: action.error
      }
    default:
      return state
  }
}