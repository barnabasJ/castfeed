import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit'
import { serializeError } from 'serialize-error'
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
    getEpisodesForPodcastRejected: {
      reducer: (state, action: PayloadAction<Error>) => {
        state.error = action.payload
      },
      prepare: (error) => ({
        payload: serializeError(error)
      })
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

export const updateEpisodesForAllPodcasts = createAction(
  'rss/updateEpisodesForAllPodcasts'
)
