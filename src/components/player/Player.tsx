import React, {useEffect, useState} from 'react';
import {
   StyleSheet,
   Text,
   View,
   Button,
   Image,
   TouchableOpacity,
   Slider,
   SafeAreaView,
   StatusBar,
   Dimensions
} from 'react-native';
import {Provider} from 'react-redux'
import Store from '../../store'
import {MaterialIcons} from '@expo/vector-icons';
import {initPlayer, playNewEpisode, togglePlay} from "../../player";
import colors from '../../styles/colors'


export default function Player() {
   const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");
   const [playing, setPlaying] = useState(true);
   const [position, setPosition] = useState(0);
   const [speed, setSpeed] = useState(1);
   const [episode, setEpisode] = useState(() => Store.dispatch(
      playNewEpisode({uri: "https://s3.amazonaws.com/exp-us-standard/audio/playlist-example/Comfort_Fit_-_03_-_Sorry.mp3"})
   ));


   const togglePlaying = (event) => {
      Store.dispatch(
         togglePlay()
      )
      setPlaying(!playing);
   }


   useEffect(() => {
      Store.dispatch(initPlayer())
   }, [])
   return (
      <Provider store={Store}>
         <StatusBar backgroundColor={colors.backgroundLight}/>
         <SafeAreaView style={styles.container}>
            <Image
               style={styles.image}
               source={{
                  uri: 'https://picsum.photos/400',
               }}
            />
            <Slider style={styles.slider}
                    minimumTrackTintColor={colors.primaryColor}
                    maximumTrackTintColor={colors.secondaryColor}
                    maximumValue={180}
                    step={1}
                    onValueChange={value => setPosition(value)}/>

            <Text>{Math.floor(position / 60) + ":" + (position - Math.floor(position / 60) * 60)}</Text>
            <View style={styles.controls}>
               <TouchableOpacity style={styles.horizontalSpace}>
                  <MaterialIcons name="skip-previous" size={50} color={colors.darkText}/>
               </TouchableOpacity>
               <TouchableOpacity style={styles.horizontalSpace} onPress={togglePlaying}>
                  {playing ? <MaterialIcons name="pause" size={50} color={colors.darkText}/> : <MaterialIcons name="play-arrow" size={50} color={colors.darkText}/>}
               </TouchableOpacity>
               <TouchableOpacity style={styles.horizontalSpace}>
                  <MaterialIcons name="skip-next" size={50} color={colors.darkText}/>
               </TouchableOpacity>
            </View>
         </SafeAreaView>
      </Provider>
   );
}
const styles = StyleSheet.create({
   container: {
      flex: 1,
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      backgroundColor: colors.backgroundLight,
   },
   textStyle: {
      color: '#fff',
      fontSize: 18,
   },
   image: {
      marginTop: 50,
      width: 310,
      height: 310,
      borderRadius: 5
   },
   helpLink: {
      paddingVertical: 15,
   },
   controls: {
      flex: 1,
      flexDirection: 'row',
      paddingVertical: 15,
   },
   horizontalSpace: {
      paddingHorizontal: 10
   },
   slider: {
      width: '85%',
      paddingTop: 50
   }
});
