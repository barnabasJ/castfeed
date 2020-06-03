
import React from 'react'
import { FlatList } from 'react-native'
import map from 'lodash/fp/map'
import Search from 'src/components/search'
import SafeArea from 'src/components/safe-area'
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
    <SafeArea>
      <Search />
      <FlatList
        data={results}
        keyExtractor={({ id }: IListItem) => id}
        renderItem={({ item }) => <SearchResultItem item={item}/>}
      />
    </SafeArea>
  )
}

export default PodcastSearchScreen
