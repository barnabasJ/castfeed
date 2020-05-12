import React, {useEffect, useState} from 'react';
import {
   StyleSheet,
   Text,
   View,
   Image,
   TouchableOpacity,
   Slider,
   SafeAreaView,
   StatusBar,
   ToastAndroid,
} from 'react-native';
import {Provider} from 'react-redux'
import Store, {RootState} from '../../store'
import {MaterialIcons, MaterialCommunityIcons} from '@expo/vector-icons';
import {initPlayer, playNewEpisode, setRate, skipBackward, togglePlay} from "../../player";
import colors from '../../styles/colors'
import {useSelector} from 'react-redux'

export default function Player() {
   const {positionMillis} = useSelector((state: RootState) => state.player.status) || {}
   const {durationMillis} = useSelector((state: RootState) => state.player.status) || {}
   const {isLoaded} = useSelector((state: RootState) => state.player.status) || {}
   const {isPlaying} = useSelector((state: RootState) => state.player.status) || {}
   const {rate} = useSelector((state: RootState) => state.player.status) || {}
   const {isBuffering} = useSelector((state: RootState) => state.player.status) || {}
   const {uri} = useSelector((state: RootState) => state.player.episode) || {}

   const currentEpisode = "https://s3.amazonaws.com/exp-us-standard/audio/playlist-example/" +
      "Comfort_Fit_-_03_-_Sorry.mp3"
   const [position, setPosition] = useState(0);
   const [speed, setSpeed] = useState(1);
   const [episode, setEpisode] = useState(() => Store.dispatch(
      playNewEpisode({uri: currentEpisode})
   ));
   const [waitState, setWaitState] = useState("");

   const onPositionSliderChange = position => {
      Store.dispatch(skipBackward(positionMillis - position))
   }

   const onRateSliderChange = position => Store.dispatch(setRate(position))

   const millisToTime = (positionMillis) => {
      let positionSeconds = Math.floor((positionMillis / 1000) % 60)
      let positionMinutes = Math.floor((positionMillis / (1000 * 60) % 60))
      let positionHours = Math.floor((positionMillis / (1000 * 60 * 60)) % 24)
      return (
         // left pad with zero
         ("00" + positionHours).substr(-2, 2) +
         ":" +
         ("00" + positionMinutes).substr(-2, 2) +
         ":" +
         ("00" + positionSeconds).substr(-2, 2)
      )
   }


   useEffect(() => {
      isBuffering ? setWaitState("Buffering...") : setWaitState("")
      if (!isLoaded) ToastAndroid.show("Loading...", ToastAndroid.SHORT);
      Store.dispatch(initPlayer())
   }, [])
   return (
      <Provider store={Store}>
         <StatusBar backgroundColor="black"/>
         <SafeAreaView style={styles.container}>
            <Image
               style={styles.image}
               source={{
                  uri: 'https://picsum.photos/400',
               }}
            />
            <Text style={styles.episodeText}>{currentEpisode.substring(
               currentEpisode.lastIndexOf('/') + 1)}</Text>
            <Slider style={styles.positionSlider}
                    thumbTintColor={colors.darkText}
                    minimumTrackTintColor={colors.primaryColor}
                    maximumTrackTintColor={colors.secondaryColor}
                    maximumValue={durationMillis}
                    value={Math.floor(positionMillis) || 0}
                    step={1000}
                    onValueChange={onPositionSliderChange}/>
            <View style={styles.textRow}>
               <Text>{millisToTime(positionMillis) + "/" + millisToTime(durationMillis)}</Text>
            </View>
            <View style={styles.controls}>
               <TouchableOpacity style={styles.horizontalSpace}>
                  <MaterialIcons name="skip-previous"
                                 size={50}
                                 color={colors.darkText}
                                 onPress={() => Store.dispatch(
                                    playNewEpisode({uri: currentEpisode})
                                 )}
                  />
               </TouchableOpacity>
               <TouchableOpacity style={styles.horizontalSpace}
                                 onPress={() => Store.dispatch(
                                    togglePlay()
                                 )}>
                  {isPlaying ?
                     <MaterialIcons
                        name="pause"
                        size={50}
                        color={colors.darkText}/>
                     :
                     <MaterialIcons
                        name="play-arrow"
                        size={50}
                        color={colors.darkText}/>}
               </TouchableOpacity>
               <TouchableOpacity style={styles.horizontalSpace}>
                  <MaterialIcons name="skip-next"
                                 size={50}
                                 color={colors.darkText}
                                 onPress={() => Store.dispatch(
                                    playNewEpisode({uri: currentEpisode})
                                 )}
                  />
               </TouchableOpacity>
            </View>
            <Slider style={styles.rateSlider}
                    minimumTrackTintColor={colors.primaryColor}
                    maximumTrackTintColor={colors.secondaryColor}
                    thumbTintColor={colors.darkText}
                    maximumValue={1.5}
                    minimumValue={0.5}
                    value={rate || 0}
                    step={0.25}
                    onValueChange={position => Store.dispatch(
                       setRate(position)
                    )}/>
            <Text style={{margin:10}}>Playback speed: {rate}</Text>
         </SafeAreaView>
      </Provider>
   );
}
const styles = StyleSheet.create({
   container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: "space-between",
      alignItems: 'center',
      alignSelf: 'stretch',
      backgroundColor: "white",
   },
   image: {
      marginTop: 100,
      width: 310,
      height: 310,
      borderRadius: 5
   },
   controls: {
      flex: 1,
      flexDirection: 'row',
      paddingVertical: 15,
      paddingBottom: 40
   },
   horizontalSpace: {
      padding: 10
   },
   positionSlider: {
      width: '85%',
      paddingTop: 50
   },
   rateSlider: {
      width: '30%',
   },
   textRow: {
      flex: 1,
      flexDirection: "row",
   },
   episodeText: {
      margin: 20,
      fontWeight: "bold"
   }
});
