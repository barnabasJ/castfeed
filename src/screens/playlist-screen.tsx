import React, { useCallback } from 'react'
import { View } from 'react-native'
import map from 'lodash/fp/map'
import flow from 'lodash/flow'
import { selectPlaylist } from 'src/playlist'
import { selectEntities } from 'src/episodes'
import { FlatList } from 'react-native-gesture-handler'
import { IListItem, episodeToListItem, PlaylistListItem } from 'src/components/listitem'
import { useDispatch } from 'react-redux'
import { createSelector } from 'reselect'
import { useSelector } from 'src/store'

const playlistSelector = createSelector(
  selectPlaylist,
  selectEntities,
  (playlist, episodes) =>
    flow(
      map((id: string) => episodes[id]),
      map(episodeToListItem)
    )(playlist)

)

export const PlaylistScreen: React.FunctionComponent<{}> = () => {
  const playlist = useSelector(playlistSelector)

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={playlist}
        keyExtractor={({ id }: IListItem) => id}
        renderItem={({ item }) => <PlaylistListItem item={item}/>}
      />
    </View>
  )
}

export default PlaylistScreen
