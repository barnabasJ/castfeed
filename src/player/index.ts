import { PlaybackStatus } from 'expo-av/build/AV'
import { createSlice, PayloadAction, createAction, createSelector } from '@reduxjs/toolkit'
import { withPayloadType } from 'src/utils'
import { RootState } from 'src/store'
import { IEpisodeStatus } from 'src/status'

export interface IPlayableFile {
  uri: string
}

interface PlayerState {
  initialized: boolean
  episode?: IPlayableFile
  status?: PlaybackStatus
  error?: Error
}

const initialState: PlayerState = {
  initialized: false
}

interface PlayNewEpisodeFulfilledPayload {
  episode: IPlayableFile
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
    playNewFileFulfilled: {
      reducer: (
        state,
        action: PayloadAction<PlayNewEpisodeFulfilledPayload>
      ): void => {
        const { episode, status } = action.payload
        state.episode = episode
        state.status = status
      },
      prepare: (episode: IPlayableFile, status: PlaybackStatus) => ({
        payload: {
          episode,
          status
        }
      })
    },
    playNewFileRejected: {
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
  playNewFileFulfilled,
  playNewFileRejected,
  updatePlayerStatus
} = player.actions

export const selectPlayer = (state: RootState): PlayerState => state.player

export const selectStatus = createSelector(selectPlayer, (playerState) => playerState.status)

export const selectIsPlaying = createSelector(selectStatus, (status) =>
  (status && status.isLoaded && status.isPlaying) || false
)

export const initPlayer = createAction('player/init')
export const playNewFile = createAction(
  'player/playNewFile',
  (file: IPlayableFile, status: IEpisodeStatus) => ({
    payload: {
      file, status
    }
  })
)
export const play = createAction(
  'player/play'
)
export const pause = createAction('player/pause')
export const runUpdatePlayerStatus = createAction(
  'player/runUpdateStatus',
  withPayloadType<number>()
)
export const stopUpdatePlayerStatus = createAction(
  'player/stopUpdateStatus'
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
export const fileFinishedPlaying = createAction('player/fileFinishedPlaying')
