import React from "react";
import {
   Dimensions,
   Image,
   Slider,
   StyleSheet,
   Text,
   TouchableHighlight,
   View
} from "react-native";
import {Asset} from "expo-asset";
import {Audio, Video} from "expo-av";
import {Sound} from "expo-av/build/Audio/Sound";

class Icon {
   module: any;
   width: any;
   height: any;
   constructor(module, width, height) {
      this.module = module;
      this.width = width;
      this.height = height;
      Asset.fromModule(this.module).downloadAsync();
   }
}

class PlaylistItem {
   name: any;
   uri: any;
   image: any;
   constructor(name, uri, image) {
      this.name = name;
      this.uri = uri;
      this.image = image;
   }
}

const PLAYLIST = [
   new PlaylistItem(
      "Comfort Fit - “Sorry”",
      "https://s3.amazonaws.com/exp-us-standard/audio/playlist-example/Comfort_Fit_-_03_-_Sorry.mp3",
      'https://facebook.github.io/react/img/logo_og.png'
   ),
   new PlaylistItem(
      "Mildred Bailey – “All Of Me”",
      "https://ia800304.us.archive.org/34/items/PaulWhitemanwithMildredBailey/PaulWhitemanwithMildredBailey-AllofMe.mp3",
      'https://facebook.github.io/react/img/logo_og.png'
   ),
   new PlaylistItem(
      "Podington Bear - “Rubber Robot”",
      "https://s3.amazonaws.com/exp-us-standard/audio/playlist-example/Podington_Bear_-_Rubber_Robot.mp3",
      'https://facebook.github.io/react/img/logo_og.png'
   )
];


const ICON_PLAY_BUTTON = new Icon(
   require("./assets/images/play_button.png"),
   34,
   51
);
const ICON_PAUSE_BUTTON = new Icon(
   require("./assets/images/pause_button.png"),
   34,
   51
);

const ICON_FORWARD_BUTTON = new Icon(
   require("./assets/images/forward_button.png"),
   33,
   25
);
const ICON_BACK_BUTTON = new Icon(
   require("./assets/images/back_button.png"),
   33,
   25
);

const ICON_LOOP_ALL_BUTTON = new Icon(
   require("./assets/images/loop_all_button.png"),
   77,
   35
);
const ICON_LOOP_ONE_BUTTON = new Icon(
   require("./assets/images/loop_one_button.png"),
   77,
   35
);


const ICON_TRACK_1 = new Icon(require("./assets/images/track_1.png"), 166, 5);
const ICON_THUMB_1 = new Icon(require("./assets/images/thumb_1.png"), 18, 19);
const ICON_THUMB_2 = new Icon(require("./assets/images/thumb_2.png"), 15, 19);

const LOOPING_TYPE_ALL = 0;
const LOOPING_TYPE_ONE = 1;
const LOOPING_TYPE_ICONS = {0: ICON_LOOP_ALL_BUTTON, 1: ICON_LOOP_ONE_BUTTON};

const {width: DEVICE_WIDTH, height: DEVICE_HEIGHT} = Dimensions.get("window");
const BACKGROUND_COLOR = "#f8f9fb";
const DISABLED_OPACITY = 0.5;
const FONT_SIZE = 14;
const LOADING_STRING = "... loading ...";
const BUFFERING_STRING = "...buffering...";
const RATE_SCALE = 3.0;

export default class PlayerSmall extends React.Component<any, any> {
   private index: number;
   private isSeeking: boolean;
   private shouldPlayAtEndOfSeek: boolean;
   private playbackInstance: Sound;
   constructor(props) {
      super(props);
      this.index = 0;
      this.isSeeking = false;
      this.shouldPlayAtEndOfSeek = false;
      this.playbackInstance = null;
      this.state = {
         showVideo: false,
         playbackInstanceName: LOADING_STRING,
         loopingType: LOOPING_TYPE_ALL,
         muted: false,
         playbackInstancePosition: null,
         playbackInstanceDuration: null,
         shouldPlay: false,
         isPlaying: false,
         isBuffering: false,
         isLoading: true,
         fontLoaded: false,
         shouldCorrectPitch: true,
         volume: 1.0,
         rate: 1.0,
         videoWidth: DEVICE_WIDTH,
         poster: false,
         useNativeControls: false,
         fullscreen: false,
         throughEarpiece: false,
         portrait: null,
      };
   }

   componentDidMount() {
      Audio.setAudioModeAsync({
         allowsRecordingIOS: false,
         staysActiveInBackground: true,
         interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
         playsInSilentModeIOS: true,
         shouldDuckAndroid: true,
         interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
         playThroughEarpieceAndroid: false
      });
      this._loadNewPlaybackInstance(false);
   }

   async _loadNewPlaybackInstance(playing) {
      if (this.playbackInstance != null) {
         // @ts-ignore
         await this.playbackInstance.unloadAsync();
         // this.playbackInstance.setOnPlaybackStatusUpdate(null);
         this.playbackInstance = null;
      }

      const source = {uri: PLAYLIST[this.index].uri};
      const initialStatus = {
         shouldPlay: playing,
         rate: this.state.rate,
         shouldCorrectPitch: this.state.shouldCorrectPitch,
         volume: this.state.volume,
         isMuted: this.state.muted,
         isLooping: this.state.loopingType === LOOPING_TYPE_ONE
      };

      const {sound, status} = await Audio.Sound.createAsync(
         source,
         initialStatus,
         this._onPlaybackStatusUpdate
      );
      this.playbackInstance = sound;

      this._updateScreenForLoading(false);
   }

   _updateScreenForLoading(isLoading) {
      if (isLoading) {
         this.setState({
            showVideo: false,
            isPlaying: false,
            playbackInstanceName: LOADING_STRING,
            playbackInstanceDuration: null,
            playbackInstancePosition: null,
            isLoading: true
         });
      } else {
         this.setState({
            playbackInstanceName: PLAYLIST[this.index].name,
            portrait: PLAYLIST[this.index].image,
            isLoading: false
         });
      }
   }

   _onPlaybackStatusUpdate = status => {
      if (status.isLoaded) {
         this.setState({
            playbackInstancePosition: status.positionMillis,
            playbackInstanceDuration: status.durationMillis,
            shouldPlay: status.shouldPlay,
            isPlaying: status.isPlaying,
            isBuffering: status.isBuffering,
            rate: status.rate,
            muted: status.isMuted,
            volume: status.volume,
            loopingType: status.isLooping ? LOOPING_TYPE_ONE : LOOPING_TYPE_ALL,
            shouldCorrectPitch: status.shouldCorrectPitch
         });
         if (status.didJustFinish && !status.isLooping) {
            this._advanceIndex(true);
            this._updatePlaybackInstanceForIndex(true);
         }
      } else {
         if (status.error) {
            console.log(`FATAL PLAYER ERROR: ${status.error}`);
         }
      }
   };

   _onLoadStart = () => {
      console.log(`ON LOAD START`);
   };

   _onLoad = status => {
      console.log(`ON LOAD : ${JSON.stringify(status)}`);
   };

   _onError = error => {
      console.log(`ON ERROR : ${error}`);
   };

   _advanceIndex(forward) {
      this.index =
         (this.index + (forward ? 1 : PLAYLIST.length - 1)) % PLAYLIST.length;
   }

   async _updatePlaybackInstanceForIndex(playing) {
      this._updateScreenForLoading(true);
      this._loadNewPlaybackInstance(playing);
   }

   _onPlayPausePressed = () => {
      if (this.playbackInstance != null) {
         if (this.state.isPlaying) {
            this.playbackInstance.pauseAsync();
         } else {
            this.playbackInstance.playAsync();
         }
      }
   };

   _onForwardPressed = () => {
      if (this.playbackInstance != null) {
         this._advanceIndex(true);
         this._updatePlaybackInstanceForIndex(this.state.shouldPlay);
      }
   };

   _onBackPressed = () => {
      if (this.playbackInstance != null) {
         this._advanceIndex(false);
         this._updatePlaybackInstanceForIndex(this.state.shouldPlay);
      }
   };

   _onSeekSliderValueChange = value => {
      if (this.playbackInstance != null && !this.isSeeking) {
         this.isSeeking = true;
         this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
         this.playbackInstance.pauseAsync();
      }
   };

   _onSeekSliderSlidingComplete = async value => {
      if (this.playbackInstance != null) {
         this.isSeeking = false;
         const seekPosition = value * this.state.playbackInstanceDuration;
         if (this.shouldPlayAtEndOfSeek) {
            this.playbackInstance.playFromPositionAsync(seekPosition);
         } else {
            this.playbackInstance.setPositionAsync(seekPosition);
         }
      }
   };

   _getSeekSliderPosition() {
      if (
         this.playbackInstance != null &&
         this.state.playbackInstancePosition != null &&
         this.state.playbackInstanceDuration != null
      ) {
         return (
            this.state.playbackInstancePosition /
            this.state.playbackInstanceDuration
         );
      }
      return 0;
   }

   _getMMSSFromMillis(millis) {
      const totalSeconds = millis / 1000;
      const seconds = Math.floor(totalSeconds % 60);
      const minutes = Math.floor(totalSeconds / 60);

      const padWithZero = number => {
         const string = number.toString();
         if (number < 10) {
            return "0" + string;
         }
         return string;
      };
      return padWithZero(minutes) + ":" + padWithZero(seconds);
   }

   _getTimestamp() {
      if (
         this.playbackInstance != null &&
         this.state.playbackInstancePosition != null &&
         this.state.playbackInstanceDuration != null
      ) {
         return `${this._getMMSSFromMillis(
            this.state.playbackInstancePosition
         )} / ${this._getMMSSFromMillis(this.state.playbackInstanceDuration)}`;
      }
      return "";
   }

   render() {
      return (
         <View style={styles.container}>
            <View/>
            <View
               style={[
                  styles.buttonsContainerBase,
                  styles.buttonsContainerTopRow,
                  {
                     opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0
                  }
               ]}
            >
               <TouchableHighlight
                  underlayColor={BACKGROUND_COLOR}
                  style={styles.wrapper}
                  onPress={this._onBackPressed}
                  disabled={this.state.isLoading}
               >
                  <Image style={styles.button} source={ICON_BACK_BUTTON.module}/>
               </TouchableHighlight>
               <TouchableHighlight
                  underlayColor={BACKGROUND_COLOR}
                  style={styles.wrapper}
                  onPress={this._onPlayPausePressed}
                  disabled={this.state.isLoading}
               >
                  <Image
                     style={styles.button}
                     source={
                        this.state.isPlaying
                           ? ICON_PAUSE_BUTTON.module
                           : ICON_PLAY_BUTTON.module
                     }
                  />
               </TouchableHighlight>
               <TouchableHighlight
                  underlayColor={BACKGROUND_COLOR}
                  style={styles.wrapper}
                  onPress={this._onForwardPressed}
                  disabled={this.state.isLoading}
               >
                  <Image style={styles.button} source={ICON_FORWARD_BUTTON.module}/>
               </TouchableHighlight>
            </View>
            <View
               style={[
                  styles.buttonsContainerBase,
                  styles.buttonsContainerMiddleRow
               ]}
            >
            </View>
            <View/>
            <View
               style={[
                  styles.playbackContainer,
                  {
                     opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0
                  }
               ]}
            >
               <Slider
                  style={styles.playbackSlider}
                  trackImage={ICON_TRACK_1.module}
                  thumbImage={ICON_THUMB_1.module}
                  value={this._getSeekSliderPosition()}
                  onValueChange={this._onSeekSliderValueChange}
                  onSlidingComplete={this._onSeekSliderSlidingComplete}
                  disabled={this.state.isLoading}
               />
               <View style={styles.timestampRow}>
                  <View style={styles.nameContainer}>
                     <Text>
                        {this.state.playbackInstanceName}
                     </Text>
                  </View>
                  <Text
                     style={[
                        styles.text,
                        styles.buffering,
                     ]}
                  >
                     {this.state.isBuffering ? BUFFERING_STRING : ""}
                  </Text>
                  <Text
                     style={[
                        styles.text,
                        styles.timestamp,
                     ]}
                  >
                     {this._getTimestamp()}
                  </Text>
               </View>
            </View>
         </View>
      );
   }
}

const styles = StyleSheet.create({
   emptyContainer: {
      alignSelf: "stretch",
      backgroundColor: BACKGROUND_COLOR
   },
   container: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      alignSelf: "stretch",
      backgroundColor: BACKGROUND_COLOR
   },
   wrapper: {},
   nameContainer: {
      height: FONT_SIZE
   },
   space: {
      height: FONT_SIZE
   },
   playbackContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      alignSelf: "stretch",
      minHeight: ICON_THUMB_1.height * 2.0,
      maxHeight: ICON_THUMB_1.height * 2.0
   },
   playbackSlider: {
      alignSelf: "stretch"
   },
   timestampRow: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      alignSelf: "stretch",
      minHeight: FONT_SIZE
   },
   text: {
      fontSize: FONT_SIZE,
      minHeight: FONT_SIZE
   },
   buffering: {
      textAlign: "left",
      paddingLeft: 20
   },
   timestamp: {
      textAlign: "right",
      paddingRight: 10
   },
   button: {
      backgroundColor: BACKGROUND_COLOR
   },
   buttonsContainerBase: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
   },
   buttonsContainerTopRow: {
      maxHeight: ICON_PLAY_BUTTON.height,
      minWidth: DEVICE_WIDTH / 2.0,
      maxWidth: DEVICE_WIDTH / 2.0
   },
   buttonsContainerMiddleRow: {
      alignSelf: "stretch",
      paddingRight: 20
   },
   volumeContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minWidth: DEVICE_WIDTH / 2.0,
      maxWidth: DEVICE_WIDTH / 2.0
   },
   volumeSlider: {
      width: DEVICE_WIDTH / 2.0
   },
   buttonsContainerBottomRow: {
      maxHeight: ICON_THUMB_1.height,
      alignSelf: "stretch",
      paddingRight: 20,
      paddingLeft: 20
   },
   buttonsContainerTextRow: {
      maxHeight: FONT_SIZE,
      alignItems: "center",
      paddingRight: 20,
      paddingLeft: 20,
      minWidth: DEVICE_WIDTH,
      maxWidth: DEVICE_WIDTH
   },
});
