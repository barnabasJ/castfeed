import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit'
import { withPayloadType } from 'src/utils'

interface SearchResult {
  artistName: string
  artworkUrl100: string
  artworkUrl30: string
  artworkUrl600: string
  artworkUrl60: string
  collectionCensoredName: string
  collectionExplicitness: string
  collectionHdPrice: number
  collectionId: string
  collectionName: string
  collectionPrice: number
  collectionViewUrl: string
  contentAdvisoryRating: string
  country: string
  currency: string
  feedUrl: string
  genreIds: Array<number>
  genres: Array<string>
  kind: string
  primaryGenreName: string
  releaseDate: string
  trackCensoredName: string
  trackCount: number
  trackExplicitness: string
  trackHdPrice: number
  trackHdRentalPrice: number
  trackId: string
  trackName: string
  trackPrice: number
  trackRentalPrice: number
  trackViewUrl: string
  wrapperType: string
}

interface SearchState {
  term: string
  results: Array<SearchResult>
  error?: Error
}

const initialState: SearchState = {
  term: '',
  results: []
}

const search = createSlice({
  name: 'search',
  initialState,
  reducers: {
    searchPodcastFulfilled: {
      reducer: (state, action: PayloadAction<Array<SearchResult>>) => {
        state.results = action.payload
      },
      prepare: withPayloadType<Array<SearchResult>>()
    },
    searchPodcastRejected: {
      reducer: (state, action: PayloadAction<Error>) => {
        state.error = action.payload
      },
      prepare: withPayloadType<Error>()
    }
  }
})

export default search.reducer

export const { searchPodcastFulfilled, searchPodcastRejected } = search.actions

export const searchPodcast = createAction(
  'search/searchPodcast',
  withPayloadType<string>()
)
