import React, { useEffect, useState } from 'react'
import { StyleSheet, ActivityIndicator, StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { Provider } from 'react-redux'
import { Action } from '@reduxjs/toolkit'
import createStore from 'src/store'
import { initPlayer } from 'src/player'
import PodcastStack from 'src/stacks/podcast-stack'
import { FilterStack } from 'src/stacks/filter-stack'
import { loadState } from 'src/storage'
import PlayerStack from 'src/stacks/player-stack'
import { Toaster } from 'src/components/toast'

const TabNavigator = createBottomTabNavigator()

const screenOptions = ({ route }) => {
  const TabBarIcon = ({ color, size }) => {
    let iconName

    if (route.name === 'Podcasts') {
      iconName = 'md-apps'
    } else if (route.name === 'Filter') {
      iconName = 'md-funnel'
    } else if (route.name === 'Player') {
      iconName = 'md-play-circle'
    }

    // You can return any component that you like here!
    return <Ionicons name={iconName} size={size} color={color} />
  }
  return {
    tabBarIcon: TabBarIcon
  }
}

const Main = () => {
  return (
    <TabNavigator.Navigator
      screenOptions={screenOptions}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray'
      }}
    >
      <TabNavigator.Screen name="Podcasts" component={PodcastStack}/>
      <TabNavigator.Screen name="Filter" component={FilterStack}/>
      <TabNavigator.Screen name="Player" component={PlayerStack} />
    </TabNavigator.Navigator>
  )
}

const useStore = (actions: Array<Action>) => {
  const [store, setStore] = useState(null)

  useEffect(() => {
    const cs = async () => {
      const preloadedState = await loadState()
      setStore(createStore(preloadedState))
    }
    cs()
  }, [setStore])

  useEffect(() => {
    if (store) { actions.map(store.dispatch) }
  }, [store])

  return store
}

export default function App () {
  const store = useStore([initPlayer()])

  return (
    <Toaster>
      {store
        ? <Provider store={store}>
          <StatusBar/>
          <NavigationContainer>
            <Main/>
          </NavigationContainer>
        </Provider>
        : <ActivityIndicator/>}
    </Toaster>

  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textStyle: {
    color: '#fff',
    fontSize: 18
  }
})
