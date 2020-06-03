import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import PlayerScreen from 'src/screens/player-screen'
import PlaylistScreen from 'src/screens/playlist-screen'
import SafeArea from 'src/components/safe-area'

const Tabs = createMaterialTopTabNavigator()

export function PlayerStack () {
  return (
    <SafeArea>
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
    </SafeArea>
  )
}

export default PlayerStack
