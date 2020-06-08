import React, { useEffect } from 'react'
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
import { initPlayer, setRate, skipBackward, skipForward } from 'src/player'
import { togglePlay } from 'src/podcast-player'
import { selectCurrentEpisode } from 'src/episodes'
import { useToast } from 'src/components/toast'
import colors from 'src/styles/colors'
import { RootState } from 'src/store'
import { Icon, IconSize } from 'src/components/icon'

const Slider = Platform.OS === 'web' ? WebSlider : NativeSlider

export default function Player () {
  const episode = useSelector(selectCurrentEpisode)
  const Toast = useToast()
  const dispatch = useDispatch()
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

  useEffect(() => {
    if (!isLoaded) {
      Toast.show('Loading...', 3 * 1000)
    }
    dispatch(initPlayer())
  }, [])

  if (!episode) {
    return (
      <View>
        <Text>
          There are currently no episodes queued for playback!
        </Text>
      </View>
    )
  }

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
            {positionMillis && durationMillis && isLoaded
              ? millisToTime(positionMillis) + '/' + millisToTime(durationMillis)
              : 'Buffering...' }
          </Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.horizontalSpace}
            onPress={() => dispatch(
              skipBackward(30 * 1000)
            )}
          >
            <Icon name="replay-30"
              size={IconSize.large}
              color={colors.darkText}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.horizontalSpace}
            onPress={() => dispatch(
              togglePlay()
            )}>
            <Icon
              name={ isPlaying ? 'pause' : 'play-arrow'}
              size={IconSize.large}
              color={colors.darkText}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.horizontalSpace}
            onPress={() => dispatch(
              skipForward(30 * 1000)
            )}

          >
            <Icon name="forward-30"
              size={IconSize.large}
              color={colors.darkText}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.rateSlider}>
          <Icon name='av-timer' size={IconSize.medium} color={colors.darkText}/>
          <View style={{
            width: 100
          }}>
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
          </View>
        </View>
        <Text style={{ margin: 10 }}>Playback speed: {rate}</Text>
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
    width: '100%'
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '50%'
  },
  textRow: {
    height: 20
  },
  episodeText: {
    height: 20
  }
})
