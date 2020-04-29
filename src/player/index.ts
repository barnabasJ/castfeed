import { PlaybackStatus } from 'expo-av/build/AV'
import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit'
import { withPayloadType } from 'src/utils'

export interface Episode {
  uri: string
}

interface PlayerState {
  initialized: boolean
  episode?: Episode
  status?: PlaybackStatus
  error?: Error
}

const initialState: PlayerState = {
  initialized: false
}

interface PlayNewEpisodeFulfilledPayload {
  episode: Episode
  status: PlaybackStatus
}

const player = createSlice({
  name: 'player',
  initialState,
  reducers: {
    initFulfilled: (state): void => {
      state.initialized = true
    },
    initRejected: {
      reducer: (state): void => {
        state.initialized = false
      },
      prepare: withPayloadType<Error>()
    },
    playNewEpisodeFulfilled: {
      reducer: (
        state,
        action: PayloadAction<PlayNewEpisodeFulfilledPayload>
      ): void => {
        const { episode, status } = action.payload
        state.episode = episode
        state.status = status
      },
      prepare: (episode: Episode, status: PlaybackStatus) => ({
        payload: {
          episode,
          status
        }
      })
    },
    playNewEpisodeRejected: {
      reducer: (state): void => {
        state.initialized = false
      },
      prepare: withPayloadType<Error>()
    },
    updatePlayerStatus: {
      reducer: (state, action: PayloadAction<PlaybackStatus>): void => {
        state.status = action.payload
      },
      prepare: withPayloadType<PlaybackStatus>()
    }
  }
})

export default player.reducer

export const {
  initFulfilled,
  initRejected,
  playNewEpisodeFulfilled,
  playNewEpisodeRejected,
  updatePlayerStatus
} = player.actions

export const initPlayer = createAction('player/init')
export const playNewEpisode = createAction(
  'player/playNewEpisode',
  withPayloadType<Episode>()
)
export const togglePlay = createAction('player/togglePlay')
export const runUpdatePlayerStatus = createAction(
  'player/runUpdateStatus',
  withPayloadType<number>()
)
export const skipForward = createAction(
  'player/skipForward',
  withPayloadType<number>()
)
export const skipBackward = createAction(
  'player/skipBackward',
  withPayloadType<number>()
)
export const setRate = createAction('player/setRate', withPayloadType<number>())
