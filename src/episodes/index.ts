import { createSlice } from '@reduxjs/toolkit'
import { getEpisodesForPodcastFulfilled } from 'src/rss'
import { unsubscribeFromPodcast } from 'src/podcasts'

export interface Episode {
  podcastId: string
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
    url: string
    type: string
    length: number
  }
}

interface EpisodesState {
  [key: string]: Array<Episode>
}

const initialState: EpisodesState = {}
const episodes = createSlice({
  name: 'episodes',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getEpisodesForPodcastFulfilled, (state, action) => {
      const { podcast, episodes } = action.payload
      state[podcast.trackId] = episodes
    })

    builder.addCase(unsubscribeFromPodcast, (state, action) => {
      delete state[action.payload.trackId]
    })
  }
})

export default episodes.reducer

export const {} = episodes.actions
