import { createSlice } from '@reduxjs/toolkit'
import { createAction, PayloadAction } from '@reduxjs/toolkit'
import { withPayloadType } from 'src/utils'
import { Podcast } from 'src/podcasts'
import { Episode } from 'src/episodes'

interface RssState {
  result?: RssFetchResult
  error?: Error
}

interface RssFetchResult {
  episodes: Array<Episode>
  podcast: Podcast
}

const initialState: RssState = {}

const rss = createSlice({
  name: 'rss',
  initialState,
  reducers: {
    getEpisodesForPodcastFulfilled: {
      reducer: (state, action: PayloadAction<RssFetchResult>) => {
        state.result = action.payload
      },
      prepare: (podcast: Podcast, episodes: Array<Episode>) => ({
        payload: {
          podcast,
          episodes
        }
      })
    },
    getEpisodesForPodcastRejected: (state, action: PayloadAction<Error>) => {
      state.error = action.payload
    }
  }
})

export default rss.reducer

export const {
  getEpisodesForPodcastFulfilled,
  getEpisodesForPodcastRejected
} = rss.actions

export const getEpisodesForPodcast = createAction(
  'rss/getEpisodesForPodcast',
  withPayloadType<Podcast>()
)
