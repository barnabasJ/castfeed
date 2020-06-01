import { createSlice, PayloadAction, createEntityAdapter } from '@reduxjs/toolkit'
import { withPayloadType } from 'src/utils'
import { Podcast } from 'src/podcasts'
import { serializeError } from 'serialize-error'
import { RootState } from 'src/store'

const podcastAdapter = createEntityAdapter({
  selectId: ({ trackId }: Podcast) => trackId,
  sortComparer: (p1: Podcast, p2: Podcast) => (p1.trackId - p2.trackId) % 2
})

type Podcasts = ReturnType<typeof podcastAdapter.getInitialState>

interface SearchState {
  term: string
  results: Podcasts
  loading: boolean
  error?: Error
}

const initialState: SearchState = {
  term: '',
  results: podcastAdapter.getInitialState(),
  loading: false
}

const search = createSlice({
  name: 'search',
  initialState,
  reducers: {
    searchPodcast: {
      reducer: (state) => {
        state.loading = true
      },
      prepare: withPayloadType<string>()
    },
    searchPodcastFulfilled: {
      reducer: (state, action: PayloadAction<Array<Podcast>>) => {
        state.loading = false
        const emptyResults = podcastAdapter.removeAll(state.results)
        state.results = podcastAdapter.addMany(emptyResults, action.payload)
      },
      prepare: withPayloadType<Array<Podcast>>()
    },
    searchPodcastRejected: {
      reducer: (state, action: PayloadAction<Error>) => {
        state.error = action.payload
        state.loading = false
      },
      prepare: (error) => ({
        payload: serializeError(error)
      })
    }
  }
})

export default search.reducer

export function selectSearch (state: RootState): SearchState {
  return state.search
}

export const {
  selectById,
  selectAll
} = podcastAdapter.getSelectors((state: RootState) => selectSearch(state).results)

export const {
  searchPodcast,
  searchPodcastFulfilled,
  searchPodcastRejected
} = search.actions
