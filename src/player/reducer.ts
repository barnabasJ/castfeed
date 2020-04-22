import { PlayerAction, PlayNewEpisodeSuccessfulAction } from './actions'
import { Audio } from 'expo-av'
import { PlaybackStatus } from 'expo-av/build/AV'
import {
  PLAYER_INIT_SUCCESSFUL,
  PLAYER_INIT_FAILED,
  PLAYER_PLAY_NEW_EPISODE_SUCCESSFUL,
  PLAYER_UPDATE_PLAYER_STATUS
} from './types'

interface PlayerState {
  initialized: boolean
  sound?: Audio.Sound
  status?: PlaybackStatus
  error?: Error
}

const initialState: PlayerState = {
  initialized: false
}

export function playerReducer (
  state = initialState,
  action: PlayerAction
): PlayerState {
  switch (action.type) {
    case PLAYER_INIT_SUCCESSFUL:
      return {
        ...state,
        initialized: true
      }
    case PLAYER_INIT_FAILED:
      return {
        ...state,
        initialized: false
      }
    case PLAYER_PLAY_NEW_EPISODE_SUCCESSFUL:
      return {
        ...state,
        sound: action.sound,
        status: action.status
      }
    case PLAYER_UPDATE_PLAYER_STATUS:
      return {
        ...state,
        status: action.status
      }
    default:
      return state
  }
}
