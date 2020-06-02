import { createSlice, createEntityAdapter, createSelector, PayloadAction } from '@reduxjs/toolkit'
import { getEpisodesForPodcastFulfilled } from 'src/rss'
import { RootState } from 'src/store'
import { selectCurrent } from 'src/playlist'
import isString from 'lodash/isString'

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
  reducers: {
    remove: (state, action: PayloadAction<string | string[]>) => {
      if (isString(action.payload)) {
        episodeAdapter.removeOne(state, action.payload)
      } else {
        episodeAdapter.removeMany(state, action.payload)
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(getEpisodesForPodcastFulfilled, (state, action) => {
      const { episodes } = action.payload
      episodeAdapter.upsertMany(state, episodes)
    })
  }
})

export default episodes.reducer

export const {
  selectAll,
  selectById,
  selectEntities,
  selectIds
} = episodeAdapter.getSelectors((state: RootState) => state.episodes)

export const selectCurrentEpisode = createSelector(
  selectCurrent,
  selectEntities,
  (id, episodes) => {
    return id && episodes[id]
  }
)

export const {
  remove
} = episodes.actions
