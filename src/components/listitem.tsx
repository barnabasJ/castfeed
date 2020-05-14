import React, { useCallback, memo } from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import truncate from 'lodash/truncate'
import colors from '../styles/colors'
import { useDispatch } from 'react-redux'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { addPlayNow } from 'src/playlist'

const style = StyleSheet.create({
  container: {
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    margin: 10
  },
  edgeElement: {
    width: '20%'
  },
  centerElement: {
    width: '60%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginHorizontal: 10
  },
  icon: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  image: {
    height: '100%',
    width: 'auto'
  }
})

export interface IListItem {
  id: string
  title: string
  thumbUrl: string
  date?: string
  file?: {
    url: string,
    type: string,
    length: number
  }
}

type ListItem = React.FunctionComponent<{
  item: IListItem
}>

type ListItemElement = React.FunctionComponent<{
  item: IListItem
}>

export const ImageListElement: ListItemElement = ({ item }) => (
  <View style={style.edgeElement}>
    <Image style={style.image} source={{ uri: item.thumbUrl }} />
  </View>
)

export const PodcastHighlightListElement: ListItemElement = ({ item }) => (
  <View style={style.centerElement}>
    <Text>{truncate(item.title)}</Text>
    <Text>{item.date}</Text>
  </View>
)

export const PlayListElement: ListItemElement = ({ item }) => {
  const dispatch = useDispatch()
  const file = item.file

  const onPress = useCallback(() => {
    if (file) { dispatch(addPlayNow(item.id)) }
  }, [item, dispatch])

  return file ? (
    <TouchableOpacity
      style={style.edgeElement}
      onPress={onPress}
    >
      <View style={style.icon}>
        <MaterialIcons
          name="play-arrow"
          size={50}
          color={colors.darkText}/>
      </View>
    </TouchableOpacity>
  ) : null
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

export const EpisodeListItem = createListItem(PodcastHighlightListElement, ImageListElement, PlayListElement)
