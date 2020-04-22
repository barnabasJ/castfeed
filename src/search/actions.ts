export const SEARCH_PODCAST = 'SEARCH_PODCAST'
export const SEARCH_SUCCESSFUL = 'SEARCH_SUCCESSFUL'
export const SEARCH_FAILED = 'SEARCH_FAILED'

export function searchPodcast (term) {
  return { type: SEARCH_PODCAST, term }
}

export function searchSuccessful (results) {
  return { type: SEARCH_SUCCESSFUL, results }
}

export function searchFailed (error) {
  return { type: SEARCH_FAILED, error }
}
