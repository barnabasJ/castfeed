import { Action } from 'redux'
import {
  PLAYER_INIT,
  PLAYER_INIT_SUCCESSFUL,
  PLAYER_INIT_FAILED,
  PLAYER_PLAY_NEW_EPISODE,
  PLAYER_PLAY_NEW_EPISODE_SUCCESSFUL,
  PLAYER_PLAY_NEW_EPISODE_FAILED,
  PLAYER_TOGGLE_PLAY,
  PLAYER_RUN_UPDATE_PLAYER_STATUS,
  PLAYER_UPDATE_PLAYER_STATUS
} from './types'
import { Audio } from 'expo-av'
import { PlaybackStatus } from 'expo-av/build/AV'

interface FailedAction<T> extends Action<T> {
  error: Error
}

export interface InitPlayerAction extends Action<typeof PLAYER_INIT> {}
export interface InitPlayerSuccessfulAction
  extends Action<typeof PLAYER_INIT_SUCCESSFUL> {}
export interface InitPlayerFailedAction
  extends FailedAction<typeof PLAYER_INIT_FAILED> {}
export interface PlayNewEpisodeAction
  extends Action<typeof PLAYER_PLAY_NEW_EPISODE> {
  episode: Episode
}
export interface PlayNewEpisodeSuccessfulAction
  extends Action<typeof PLAYER_PLAY_NEW_EPISODE_SUCCESSFUL> {
  sound: Audio.Sound
  status: PlaybackStatus
}
export interface PlayNewEpisodeFailedAction
  extends FailedAction<typeof PLAYER_PLAY_NEW_EPISODE_FAILED> {}

export interface PauseAction extends Action<typeof PLAYER_TOGGLE_PLAY> {}
export interface RunUpdatePlayerStatusAction
  extends Action<typeof PLAYER_RUN_UPDATE_PLAYER_STATUS> {
  sound: Audio.Sound
  interval: number
}

export interface UpdatePlayerStatusAction
  extends Action<typeof PLAYER_UPDATE_PLAYER_STATUS> {
  status: PlaybackStatus
}

export type PlayerAction =
  | PlayNewEpisodeAction
  | PlayNewEpisodeFailedAction
  | PlayNewEpisodeSuccessfulAction
  | InitPlayerAction
  | InitPlayerFailedAction
  | InitPlayerSuccessfulAction
  | PauseAction
  | RunUpdatePlayerStatusAction
  | UpdatePlayerStatusAction

export function initPlayerAction (): PlayerAction {
  return {
    type: PLAYER_INIT
  }
}

export function initPlayerSuccessfulAction (): PlayerAction {
  return {
    type: PLAYER_INIT_SUCCESSFUL
  }
}

export function initPlayerFailedAction (error: Error): PlayerAction {
  return {
    type: PLAYER_INIT_FAILED,
    error
  }
}

export interface Episode {
  uri: string
}

export function playNewEpisodeAction (episode: Episode): PlayerAction {
  return {
    type: PLAYER_PLAY_NEW_EPISODE,
    episode
  }
}

export function playNewEpisodeSuccessfulAction (
  sound: Audio.Sound,
  status: PlaybackStatus
): PlayNewEpisodeSuccessfulAction {
  return {
    type: PLAYER_PLAY_NEW_EPISODE_SUCCESSFUL,
    sound,
    status
  }
}

export function playNewEpisodeFailedAction (error: Error): PlayerAction {
  return {
    type: PLAYER_PLAY_NEW_EPISODE_FAILED,
    error
  }
}

export function togglePlayAction (): PlayerAction {
  return {
    type: PLAYER_TOGGLE_PLAY
  }
}

export function runUpdatePlayerStatusAction (
  sound,
  interval
): RunUpdatePlayerStatusAction {
  return {
    type: PLAYER_RUN_UPDATE_PLAYER_STATUS,
    sound,
    interval
  }
}

export function updatePlayerStatusAction (status): UpdatePlayerStatusAction {
  return {
    type: PLAYER_UPDATE_PLAYER_STATUS,
    status
  }
}
