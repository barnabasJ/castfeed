import React, { useCallback } from 'react'
import { View } from 'react-native'
import map from 'lodash/map'
import sortBy from 'lodash/sortBy'
import reverse from 'lodash/reverse'
import slice from 'lodash/slice'
import { selectAll, Episode } from 'src/episodes'
import { FlatList } from 'react-native-gesture-handler'
import { EpisodeListItem, IListItem } from 'src/components/listitem'
import { useDispatch } from 'react-redux'
import { createSelector } from 'reselect'
import { useSelector } from 'src/store'
import { updateEpisodesForAllPodcasts } from 'src/rss'

const latestEpisodesSelector = createSelector(
  selectAll,
  (episodes) => slice(reverse(sortBy(map(episodes, ({ id, title, image, file, pubDate }: Episode): IListItem => ({
    id,
    title,
    date: pubDate,
    thumbUrl: image,
    file
  })), (item: IListItem) => new Date(item.date))), 0, 1000)
)

export const FilterScreen: React.FunctionComponent<{}> = () => {
  const episodeItems = useSelector(latestEpisodesSelector)
  console.log(episodeItems)
  const dispatch = useDispatch()
  const onRefresh = useCallback(() => {
    dispatch(updateEpisodesForAllPodcasts())
  }, [dispatch])

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={episodeItems}
        keyExtractor={({ id }: IListItem) => id}
        renderItem={({ item }) => <EpisodeListItem item={item}/>}
        onRefresh={onRefresh}
      />
    </View>
  )
}
