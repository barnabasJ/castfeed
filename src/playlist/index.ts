import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import concat from 'lodash/concat'
import filter from 'lodash/filter'
import has from 'lodash/has'
import forEach from 'lodash/fp/forEach'
import isString from 'lodash/isString'
import curry from 'lodash/curry'
import indexOf from 'lodash/indexOf'
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

const del = curry((obj, key) => {
  delete obj[key]
})

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
      reducer: (state, action: PayloadAction<string | string[]>) => {
        if (isString(action.payload)) {
          const id = action.payload
          state.playlist = filter(state.playlist, pId => pId !== id)
          del(state.episodes, id)
        } else {
          const ids = action.payload
          state.playlist = filter(state.playlist, pId => indexOf(ids, pId) < 0)
          forEach(del(state.episodes), ids)
        }
      },
      prepare: withPayloadType<string | string[]>()
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

export const selectPlaylistState = (state: RootState): PlaylistState => state.playlist

export const selectPlaylist = (state: RootState) => selectPlaylistState(state).playlist

export const selectCurrent = (state: RootState) => get(selectPlaylistState(state), 'playlist[0]') || null
