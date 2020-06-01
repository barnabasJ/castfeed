import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import PodcastOverviewScreen from 'src/screens/podcast-overview-screen'
import PodcastSearchScreen from 'src/screens/podcast-search-screen'

const Stack = createStackNavigator()

export function PodcastStack () {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PodcastOverview" component={PodcastOverviewScreen}/>
      <Stack.Screen name="PodcastSearch" component={PodcastSearchScreen}/>
    </Stack.Navigator>
  )
}

export default PodcastStack
