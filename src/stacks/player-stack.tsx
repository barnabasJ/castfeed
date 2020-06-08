import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import PlayerScreen from 'src/screens/player-screen'
import PlaylistScreen from 'src/screens/playlist-screen'

const Tabs = createMaterialTopTabNavigator()

export function PlayerStack () {
  return (
    <Tabs.Navigator tabBarOptions={{
      activeTintColor: 'tomato',
      inactiveTintColor: 'grey',
      indicatorStyle: {
        backgroundColor: 'tomato'
      }
    }}
    initialRouteName="Player"
    >
      <Tabs.Screen name="Player" component={PlayerScreen}/>
      <Tabs.Screen name="Playlist" component={PlaylistScreen} />
    </Tabs.Navigator>
  )
}

export default PlayerStack
