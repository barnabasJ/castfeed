import React from 'react'
import { View } from 'react-native'
import map from 'lodash/map'
import { Podcast, selectAll } from 'src/podcasts'
import { FlatList } from 'react-native-gesture-handler'
import { PodcastListItem, IListItem } from 'src/components/listitem'
import { createSelector } from 'reselect'
import { useSelector } from 'src/store'
import { Search } from 'src/components/search'

const podcastAsListItemSelector = createSelector(
  selectAll,
  (podcasts) => map(podcasts, ({ trackId, trackName, artworkUrl100 }: Podcast): IListItem => ({
    id: trackId.toString(),
    title: trackName,
    thumbUrl: artworkUrl100
  })))

export const PodcastScreen: React.FunctionComponent<{}> = () => {
  const podcastsItems = useSelector(podcastAsListItemSelector)
  return (
    <View style={{ flex: 1 }}>
      <Search />
      <FlatList
        data={podcastsItems}
        keyExtractor={({ id }: IListItem) => id}
        renderItem={({ item }) => <PodcastListItem item={item}/>}
      />
    </View>
  )
}
