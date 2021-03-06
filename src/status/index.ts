import { createEntityAdapter, createSlice, PayloadAction, DeepPartial } from '@reduxjs/toolkit'
import { PlaybackStatus } from 'expo-av/build/AV'
import { Episode, remove } from 'src/episodes'
import { RootState } from 'src/store'
import isString from 'lodash/isString'

export interface IEpisodeStatus {
  id: string
  status: DeepPartial<PlaybackStatus>
}

const statusAdapter = createEntityAdapter({
  selectId: ({ id }: IEpisodeStatus) => id,
  sortComparer: (e1: IEpisodeStatus, e2: IEpisodeStatus) => e1.id.localeCompare(e2.id)
})

type IStatusState = ReturnType<typeof statusAdapter.getInitialState>

const createEpisodeStatus = (episode: Episode, status: PlaybackStatus) => {
  return {
    id: episode.id,
    status
  }
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
  },
  extraReducers: builder => {
    builder.addCase(remove, (state, action: PayloadAction<string | string[]>) => {
      if (isString(action.payload)) {
        statusAdapter.removeOne(state, action.payload)
      } else {
        statusAdapter.removeMany(state, action.payload)
      }
    })
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
