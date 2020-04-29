import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit'
import { withPayloadType } from 'src/utils'
import { Podcast } from 'src/podcasts'

interface SearchState {
  term: string
  results: Array<Podcast>
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
      reducer: (state, action: PayloadAction<Array<Podcast>>) => {
        state.results = action.payload
      },
      prepare: withPayloadType<Array<Podcast>>()
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
