import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Provider } from 'react-redux'
import Store from './src/store'
import { initPlayer, playNewEpisode, togglePlay, skipBackward, skipForward, setRate } from './src/player';
import { searchPodcast } from './src/search';
import { Search } from 'src/components/search';
import Player from "./src/components/player/Player";
export default function App() {
  useEffect(() =>  {
    Store.dispatch(initPlayer())
  }, [])
  return (
    <Provider store={Store}>
      <View style={styles.container}>
        <Player/>
      </View>
    </Provider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    color: '#fff',
    fontSize: 18,
  },
});
