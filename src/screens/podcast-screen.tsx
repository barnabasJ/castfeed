import React from 'react'
import { Text, View } from 'react-native'
import { Search } from 'src/components/search';
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import  map  from 'lodash/map'
import { Podcast } from 'src/podcasts';
import { PlaybackStatus } from 'expo-av/build/AV';

export const PodcastScreen: React.FunctionComponent<{}> = () => {
  const podcasts = useSelector((state: RootState) => state.podcasts.subscribedPodcasts)
  console.log("podcast screen->podcasts", podcasts)
  return (
    <View>
      <Text>Podcast Screen</Text>
      <Search/>
      <Text>Subscribed Podcasts</Text>
      {map(podcasts, (p: Podcast, id) => 
        <Text key={p.trackId}>{p.trackName}</Text>
      )}
    </View>
  )
}

export const Player: React.FunctionComponent = () => {
  const { positionMillis } = useSelector((state: RootState) => state.player.status) || {}
  return (
    
  positionMillis ? <Text>{positionMillis}</Text> : <Text>Nothing Playing</Text>
  )
}