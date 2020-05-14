import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import concat from 'lodash/concat'
import { withPayloadType } from 'src/utils'
import { RootState } from 'src/store'

interface PlaylistState {
  episodes: string[]
}

const initialState: PlaylistState = {
  episodes: []
}

const playlist = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    addPayLast: {
      reducer: (state, action: PayloadAction<string>) => {
        state.episodes = concat(state.episodes, action.payload)
      },
      prepare: withPayloadType<string>()
    },
    addPlayNext: {
      reducer: (state, action: PayloadAction<string>) => {
        if (isEmpty(state.episodes)) state.episodes = [action.payload]
        const [current, ...next] = state.episodes
        state.episodes = concat(current, action.payload, next)
      },
      prepare: withPayloadType<string>()
    },
    addPlayNow: {
      reducer: (state, action: PayloadAction<string>) => {
        state.episodes = concat(action.payload, state.episodes)
      },
      prepare: withPayloadType<string>()
    }
  }
})

export default playlist.reducer

export const {
  addPlayNow,
  addPlayNext,
  addPayLast
} = playlist.actions

export const selectPlaylist = (state: RootState): PlaylistState => state.playlist

export const selectCurrentEpisode = (state: RootState): null | string => get(selectPlaylist(state), 'episodes[0]') || null
