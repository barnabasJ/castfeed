import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import concat from 'lodash/concat'
import filter from 'lodash/filter'
import has from 'lodash/has'
import { withPayloadType } from 'src/utils'
import { RootState } from 'src/store'

interface PlaylistState {
  playlist: string[]
  episodes: {
    [key: string]: any
  }
}

const initialState: PlaylistState = {
  playlist: [],
  episodes: {}

}

function prepareForInsert (id, state) {
  if (has(state.episodes, id)) {
    state.playlist = filter(state.playlist, pId => pId !== id)
  }
  state.episodes[id] = true
}

const playlist = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    addPayLast: {
      reducer: (state, action: PayloadAction<string>) => {
        prepareForInsert(action.payload, state)
        state.playlist = concat(state.playlist, action.payload)
      },
      prepare: withPayloadType<string>()
    },
    addPlayNext: {
      reducer: (state, action: PayloadAction<string>) => {
        const id = action.payload
        prepareForInsert(id, state)
        if (isEmpty(state.playlist)) state.playlist = [id]
        const [current, ...next] = state.playlist
        state.playlist = concat(current, id, next)
      },
      prepare: withPayloadType<string>()
    },
    addPlayNow: {
      reducer: (state, action: PayloadAction<string>) => {
        prepareForInsert(action.payload, state)
        state.playlist = concat(action.payload, state.playlist)
      },
      prepare: withPayloadType<string>()
    },
    stepToNext: (state) => {
      const [current, ...next] = state.playlist
      delete state.episodes[current]
      state.playlist = next
    },
    removeFromPlaylist: {
      reducer: (state, action: PayloadAction<string>) => {
        const id = action.payload
        if (has(state.episodes, id)) {
          state.playlist = filter(state.playlist, pId => pId !== id)
        }
        delete state.episodes[id]
      },
      prepare: withPayloadType<string>()
    }
  }
})

export default playlist.reducer

export const {
  addPlayNow,
  addPlayNext,
  addPayLast,
  stepToNext,
  removeFromPlaylist
} = playlist.actions

export const selectPlaylist = (state: RootState): PlaylistState => state.playlist

export const selectCurrent = (state: RootState) => get(selectPlaylist(state), 'playlist[0]') || null
