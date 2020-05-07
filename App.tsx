import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Provider } from 'react-redux'
import { Action } from '@reduxjs/toolkit'
import createStore from './src/store'
import { initPlayer } from './src/player'
import { PodcastScreen } from 'src/screens/podcast-screen'
import { FilterScreen } from 'src/screens/filter-screen'
import { loadState } from 'src/storage'

const Stack = createStackNavigator()

const TabNavigator = createBottomTabNavigator()

const Tabs = () => {
  return (
    <TabNavigator.Navigator>
      <TabNavigator.Screen name="Episode" component={PodcastScreen}/>
      <TabNavigator.Screen name="Filter" component={FilterScreen}/>
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
    store
      ? <Provider store={store}>
        <NavigationContainer>
          <Tabs/>
        </NavigationContainer>
      </Provider>
      : <ActivityIndicator/>

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
