import React from 'react'
import { View } from 'react-native'
import map from 'lodash/fp/map'
import flow from 'lodash/flow'
import compact from 'lodash/fp/compact'
import { selectPlaylist } from 'src/playlist'
import { selectEntities } from 'src/episodes'
import { FlatList } from 'react-native-gesture-handler'
import { IListItem, episodeToListItem, PlaylistListItem } from 'src/components/listitem'
import { createSelector } from 'reselect'
import { useSelector } from 'src/store'

const playlistSelector = createSelector(
  selectPlaylist,
  selectEntities,
  (playlist, episodes) =>
    flow(
      map((id: string) => episodes[id]),
      compact,
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
        renderItem={(props) => <PlaylistListItem {...props}/>}
      />
    </View>
  )
}

export default PlaylistScreen
