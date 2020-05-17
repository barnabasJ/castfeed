import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import pick from 'lodash/pick'
import merge from 'lodash/merge'
import { PlaybackStatus } from 'expo-av/build/AV'
import { Episode } from 'src/episodes'
import { RootState } from 'src/store'

export interface IEpisodeStatus {
  id: string
  positionMillis: number
  durationMillis: number
}

const statusAdapter = createEntityAdapter({
  selectId: ({ id }: IEpisodeStatus) => id,
  sortComparer: (e1: IEpisodeStatus, e2: IEpisodeStatus) => e1.id.localeCompare(e2.id)
})

type IStatusState = ReturnType<typeof statusAdapter.getInitialState>

const createEpisodeStatus = (episode: Episode, status: PlaybackStatus) => {
  const fromPlaybackStatus = pick(status, 'id', 'durationMillis', 'positionMillis')
  return merge({
    id: episode.id,
    positionMillis: 0,
    durationMillis: 0
  }, fromPlaybackStatus)
}

const status = createSlice({
  name: 'status',
  initialState: statusAdapter.getInitialState(),
  reducers: {
    updatesStatus: {
      reducer: (state, action: PayloadAction<{episode: Episode, status: PlaybackStatus}>) => {
        const { episode, status } = action.payload
        statusAdapter.upsertOne(state, createEpisodeStatus(episode, status))
      },
      prepare: (episode: Episode, status: PlaybackStatus) => ({
        payload: { episode, status }
      })
    }
  }
})

export default status.reducer

export const selectStatus = (state: RootState) => state.status

export const {
  updatesStatus
} = status.actions

export const {
  selectAll,
  selectById,
  selectEntities
} = statusAdapter.getSelectors(selectStatus)
