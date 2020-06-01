import React, { useCallback, memo } from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import truncate from 'lodash/truncate'
import colors from 'src/styles/colors'
import { useDispatch } from 'react-redux'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { addPlayNow, addPlayNext } from 'src/playlist'
import { subscribeToPodcast, Podcast } from 'src/podcasts'
import { selectById } from 'src/search'
import { useSelector } from 'src/store'

const style = StyleSheet.create({
  container: {
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    margin: 10
  },
  centerElement: {
    width: '60%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginHorizontal: 10
  },
  icon: {
  },
  image: {
    height: 50,
    width: 50
  }
})

export interface IListItem {
  id: string
  title: string
  thumbUrl: string
  date?: string
  file?: {
    uri: string,
    type: string,
    length: number
  }
}

export function podcastToListItem (podcast: Podcast): IListItem {
  return {
    id: podcast.trackId.toString(),
    title: podcast.trackName,
    thumbUrl: podcast.artworkUrl100,
    date: podcast.releaseDate
  }
}

type ListItem = React.FunctionComponent<{
  item: IListItem
}>

type ListItemElement = React.FunctionComponent<{
  item: IListItem
}>

export const ImageListElement: ListItemElement = ({ item }) => (
  <Image style={style.image} source={{ uri: item.thumbUrl }} />
)

export const PodcastHighlightListElement: ListItemElement = ({ item }) => (
  <View style={style.centerElement}>
    <Text>{truncate(item.title)}</Text>
    <Text>{item.date}</Text>
  </View>
)

export const AddToPlayListListElement: ListItemElement = ({ item }) => {
  const dispatch = useDispatch()
  const file = item.file

  const onPress = useCallback(() => {
    if (file) { dispatch(addPlayNext(item.id)) }
  }, [item, dispatch])

  const onPlay = useCallback(() => {
    if (file) { dispatch(addPlayNow(item.id)) }
  }, [item, dispatch])

  return file ? (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
      }}
    >
      <TouchableOpacity
        onPress={onPress}
      >
        <MaterialIcons
          name="playlist-add"
          size={30}
          color={colors.darkText}/>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onPlay}
      >
        <View style={style.icon}>
          <MaterialIcons
            name="play-arrow"
            size={20}
            color={colors.darkText}/>
        </View>
      </TouchableOpacity>
    </View>
  ) : null
}

export const PlayListElement: ListItemElement = ({ item }) => {
  const dispatch = useDispatch()
  const file = item.file

  const onPress = useCallback(() => {
    if (file) { dispatch(addPlayNow(item.id)) }
  }, [item, dispatch])

  return file ? (
    <TouchableOpacity
      onPress={onPress}
    >
      <View style={style.icon}>
        <MaterialIcons
          name="play-arrow"
          size={20}
          color={colors.darkText}/>
      </View>
    </TouchableOpacity>
  ) : null
}

export const SubscribeListListElement: ListItemElement = ({ item }) => {
  const podcast: Podcast = useSelector(state => selectById(state, item.id))
  const dispatch = useDispatch()

  const onPress = useCallback(() => {
    dispatch(subscribeToPodcast(podcast))
  }, [podcast, dispatch])

  return (
    <TouchableOpacity
      onPress={onPress}
    >
      <View style={style.icon}>
        <MaterialIcons
          name="add-box"
          size={50}
          color={colors.darkText}/>
      </View>
    </TouchableOpacity>
  )
}

export const createListItem = (
  CenterElement: ListItemElement,
  LeftElement?: ListItemElement,
  RightElement?: ListItemElement): ListItem => {
  const ListItem: ListItem = ({ item }) => {
    return (
      <View style={style.container}>
        {LeftElement && <LeftElement item={item}/>}
        <CenterElement item={item}/>
        {RightElement && <RightElement item={item}/>}
      </View>
    )
  }

  return memo(ListItem)
}

export const PodcastListItem = createListItem(PodcastHighlightListElement, ImageListElement)

export const EpisodeListItem = createListItem(PodcastHighlightListElement, ImageListElement, AddToPlayListListElement)

export const SearchResultItem = createListItem(PodcastHighlightListElement, ImageListElement, SubscribeListListElement)
