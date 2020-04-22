import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Provider } from 'react-redux'
import Store from './src/store'
import { initPlayerAction, playNewEpisodeAction, togglePlayAction } from './src/player';

export default function App() {
  useEffect(() =>  {
    Store.dispatch(initPlayerAction())
  }, [])

  return (
    <Provider store={Store}>
      <View style={styles.container}>
        <Button 
          title="pause"
          onPress={() => Store.dispatch(
            togglePlayAction()
          )}
        />
        <Button 
          title="play"
          onPress={() => Store.dispatch(
            playNewEpisodeAction({uri: "https://s3.amazonaws.com/exp-us-standard/audio/playlist-example/Comfort_Fit_-_03_-_Sorry.mp3"})
          )}
        />
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
  bottomView: {
    width: '100%',
    height: 150,
    backgroundColor: '#EE5407',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  textStyle: {
    color: '#fff',
    fontSize: 18,
  },
});
