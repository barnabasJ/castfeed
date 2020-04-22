import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Provider } from 'react-redux'
import Store from './src/store'
import { initPlayerAction, playNewEpisodeAction, togglePlayAction, skipBackwardAction, skipForwardAction, setRateAction } from './src/player';

export default function App() {
  useEffect(() =>  {
    Store.dispatch(initPlayerAction())
  }, [])

  return (
    <Provider store={Store}>
      <View style={styles.container}>
        <Button 
          title="back"
          onPress={() => Store.dispatch(
            skipBackwardAction(3 * 1000)
          )}
        />
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
        <Button 
          title="forward"
          onPress={() => Store.dispatch(
            skipForwardAction(3 * 1000)
          )}
        />
        <Button 
          title="set rate 2"
          onPress={() => Store.dispatch(
            setRateAction(2)
          )}
        />
        <Button 
          title="set rate 1"
          onPress={() => Store.dispatch(
            setRateAction(1)
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
