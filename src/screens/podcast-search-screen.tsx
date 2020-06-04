
import React from 'react'
import { FlatList } from 'react-native'
import flow from 'lodash/flow'
import map from 'lodash/fp/map'
import filter from 'lodash/fp/filter'
import Search from 'src/components/search'
import SafeArea from 'src/components/safe-area'
import { useSelector } from 'src/store'
import { selectAll as selectAllSearchResults } from 'src/search'
import { Podcast, selectEntities as selectPodcastEntities } from 'src/podcasts'
import { IListItem, SearchResultItem, podcastToListItem } from 'src/components/listitem'
import { createSelector } from '@reduxjs/toolkit'

const selectResultsAsItems = createSelector(
  selectAllSearchResults,
  selectPodcastEntities,
  (results, podcasts) => podcasts
    ? flow(
      filter((result: Podcast) => podcasts[result.trackId] == null),
      map(podcastToListItem)
    )(results) : map(podcastToListItem, results)
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
