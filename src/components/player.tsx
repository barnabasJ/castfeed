import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Slider as NativeSlider,
  Platform
} from 'react-native'
import WebSlider from 'react-native-slider-web'
import { useSelector, useDispatch } from 'react-redux'
import { MaterialIcons } from '@expo/vector-icons'
import { createSelector } from '@reduxjs/toolkit'
import { initPlayer, playNewEpisode, setRate, skipBackward, togglePlay, skipForward } from 'src/player'
import { selectEntities } from 'src/episodes'
import { selectCurrentEpisode } from 'src/playlist'
import { useToast } from 'src/components/toast'
import colors from 'src/styles/colors'
import { RootState } from 'srcstore'

const Slider = Platform.OS === 'web' ? WebSlider : NativeSlider

const currentEpisodeSelector = createSelector(
  selectCurrentEpisode,
  selectEntities,
  (id, episodes) => id && episodes[id]
)

export default function Player () {
  const Toast = useToast()
  const dispatch = useDispatch()
  const episode = useSelector(currentEpisodeSelector)
  const playbackStatus = useSelector((state: RootState) => state.player.status)

  const {
    positionMillis = null,
    durationMillis = null,
    isLoaded = false,
    isPlaying = false,
    rate = 1
  } = playbackStatus && playbackStatus.isLoaded ? playbackStatus : {}

  const onPositionSliderChange = position => {
    dispatch(skipBackward(positionMillis - position))
  }

  const millisToTime = (positionMillis) => {
    const positionSeconds = Math.floor((positionMillis / 1000) % 60)
    const positionMinutes = Math.floor((positionMillis / (1000 * 60) % 60))
    const positionHours = Math.floor((positionMillis / (1000 * 60 * 60)) % 24)
    return (
    // left pad with zero
      ('00' + positionHours).substr(-2, 2) +
         ':' +
         ('00' + positionMinutes).substr(-2, 2) +
         ':' +
         ('00' + positionSeconds).substr(-2, 2)
    )
  }
  console.log(Math.floor(positionMillis))
  console.log(Math.floor(rate))

  useEffect(() => {
    if (!isLoaded) {
      Toast.show('Loading...', 10)
    }
    dispatch(initPlayer())
  }, [])
  return (
    <View>
      <StatusBar backgroundColor="black"/>
      <SafeAreaView style={styles.container}>
        <View style={styles.hero} >
          {episode && (
            <>
              <Image style={styles.image}
                source={{
                  uri: episode.image
                }}
              />
              <Text style={styles.episodeText}>
                {episode.title}
              </Text>
            </>
          )}
        </View>
        <View style={styles.positionSlider}>
          <Slider
            thumbTintColor={colors.darkText}
            minimumTrackTintColor={colors.primaryColor}
            maximumTrackTintColor={colors.secondaryColor}
            maximumValue={durationMillis || 0}
            value={positionMillis || 0}
            step={1000}
            onValueChange={onPositionSliderChange}/>
        </View>
        <View style={styles.textRow}>
          <Text>
            {positionMillis && durationMillis
              ? millisToTime(positionMillis) + '/' + millisToTime(durationMillis)
              : 'Buffering...' }
          </Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.horizontalSpace}>
            <MaterialIcons name="replay-30"
              size={50}
              color={colors.darkText}
              onPress={() => dispatch(
                skipBackward(30 * 1000)
              )}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.horizontalSpace}
            onPress={() => dispatch(
              togglePlay()
            )}>
            {isPlaying
              ? <MaterialIcons
                name="pause"
                size={50}
                color={colors.darkText}/>
              : <MaterialIcons
                name="play-arrow"
                size={50}
                color={colors.darkText}/>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.horizontalSpace}>
            <MaterialIcons name="forward-30"
              size={50}
              color={colors.darkText}
              onPress={() => dispatch(
                skipForward(30 * 1000)
              )}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.rateSlider}>
          <Slider
            minimumTrackTintColor={colors.primaryColor}
            maximumTrackTintColor={colors.secondaryColor}
            thumbTintColor={colors.darkText}
            maximumValue={2}
            minimumValue={0.25}
            value={rate || 1}
            step={0.25}
            onValueChange={rate => dispatch(
              setRate(rate)
            )}/>
          <Text style={{ margin: 10 }}>Playback speed: {rate}</Text>
        </View>
      </SafeAreaView>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10
  },
  hero: {
    height: 310,
    textAlign: 'center'
  },
  image: {
    height: '90%',
    width: 'auto'
  },
  controls: {
    height: 100,
    display: 'flex',
    flexDirection: 'row'
  },
  horizontalSpace: {
    height: 20
  },
  positionSlider: {
    width: '100%',
    height: 20
  },
  rateSlider: {
    width: '30%',
    height: 20
  },
  textRow: {
    height: 20
  },
  episodeText: {
    height: 20
  }
})
