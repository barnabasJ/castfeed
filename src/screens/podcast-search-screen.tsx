
import React from 'react'
import { FlatList, View } from 'react-native'
import map from 'lodash/fp/map'
import Search from 'src/components/search'
import { useSelector } from 'src/store'
import { selectAll } from 'src/search'
import { Podcast } from 'src/podcasts'
import { IListItem, SearchResultItem, podcastToListItem } from 'src/components/listitem'
import { createSelector } from '@reduxjs/toolkit'

const selectResultsAsItems = createSelector(
  selectAll,
  (results: Podcast[]) => map(podcastToListItem, results)
)

export const PodcastSearchScreen: React.FunctionComponent<{}> = () => {
  const results = useSelector(selectResultsAsItems)

  return (
    <View style={{ flex: 1 }}>
      <Search />
      <FlatList
        data={results}
        keyExtractor={({ id }: IListItem) => id}
        renderItem={({ item }) => <SearchResultItem item={item}/>}
      />
    </View>
  )
}

export default PodcastSearchScreen
