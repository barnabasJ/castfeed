import { createSlice, createEntityAdapter, createSelector } from '@reduxjs/toolkit'
import { getEpisodesForPodcastFulfilled } from 'src/rss'
import { unsubscribeFromPodcast } from 'src/podcasts'
import { RootState } from 'src/store'
import { selectCurrent } from 'src/playlist'

export interface Episode {
  id: string
  podcastId: number
  title: string
  pubDate: string
  link: string
  duration: number
  author: string
  summary: string
  subtitle: string
  description: string
  image: string
  file: {
    uri: string
    type: string
    length: number
  }
}

const episodeAdapter = createEntityAdapter({
  selectId: ({ id }: Episode) => id,
  sortComparer: (e1: Episode, e2: Episode) => e1.id.localeCompare(e2.id)
})

type IEpisodesState = ReturnType<typeof episodeAdapter.getInitialState>

const episodes = createSlice({
  name: 'episodes',
  initialState: episodeAdapter.getInitialState(),
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getEpisodesForPodcastFulfilled, (state, action) => {
      const { episodes } = action.payload
      episodeAdapter.upsertMany(state, episodes)
    })

    builder.addCase(unsubscribeFromPodcast, (state, action) => {
      delete state[action.payload.trackId]
    })
  }
})

export default episodes.reducer

export const {
  selectAll,
  selectById,
  selectEntities
} = episodeAdapter.getSelectors((state: RootState) => state.episodes)

export const selectCurrentEpisode = createSelector(
  selectCurrent,
  selectEntities,
  (id, episodes) => {
    return id && episodes[id]
  }
)
