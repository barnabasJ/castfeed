import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import PlayerSmall from "./PlayerSmall";

export default class App extends React.Component<any, any> {
  render() {
    return (
       <View style={styles.containerMain}>
         <Text> Main Content</Text>
         <View style={styles.bottomView}>
           <PlayerSmall/>
         </View>
       </View>
    );
  }
}
const styles = StyleSheet.create({
  containerMain: {
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
