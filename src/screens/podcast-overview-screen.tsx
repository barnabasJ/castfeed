import React, { useCallback } from 'react'
import { View } from 'react-native'
import map from 'lodash/map'
import { Podcast, selectAll } from 'src/podcasts'
import { FlatList } from 'react-native-gesture-handler'
import { FloatingAction } from 'react-native-floating-action'
import { MaterialIcons } from '@expo/vector-icons'
import { createSelector } from 'reselect'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'src/store'
import { PodcastListItem, IListItem } from 'src/components/listitem'

const podcastAsListItemSelector = createSelector(
  selectAll,
  (podcasts) => map(podcasts, ({ trackId, trackName, artworkUrl100 }: Podcast): IListItem => ({
    id: trackId.toString(),
    title: trackName,
    thumbUrl: artworkUrl100
  })))

export const PodcastOverviewScreen: React.FunctionComponent<{}> = () => {
  const podcastsItems = useSelector(podcastAsListItemSelector)
  const navigation = useNavigation()

  const toPodcastSearch = useCallback(() => {
    navigation.navigate('PodcastSearch')
  }, [navigation])

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={podcastsItems}
        keyExtractor={({ id }: IListItem) => id}
        renderItem={({ item }) => <PodcastListItem item={item}/>}
      />
      <FloatingAction
        actions={[
          {
            text: 'Accessibility',
            icon: <MaterialIcons name='add' size={30} color='white' />,
            name: 'bt_accessibility'
          }
        ]}
        overrideWithAction
        color='red'
        onPressItem={toPodcastSearch}
      />
    </View>
  )
}

export default PodcastOverviewScreen
