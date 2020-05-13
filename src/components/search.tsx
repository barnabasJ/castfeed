import React, { useState, useCallback } from 'react'
import { Text, TextInput, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { Podcast, subscribeToPodcast } from 'src/podcasts'
import map from 'lodash/fp/map'
import { searchPodcast } from 'src/search'

export const Search: React.FunctionComponent<{}> = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const dispatch = useDispatch()
  const onChange = useCallback(term => {
    setSearchTerm(term)
    dispatch(searchPodcast(term))
  }, [setSearchTerm])

  const subscribe = useCallback((episode) => () => {
    dispatch(subscribeToPodcast(episode))
  }, [dispatch])

  const searchResults: Array<Podcast> = useSelector((state: RootState) => state.search.results)
  return (
    <View>
      <Text>Search</Text>
      <TextInput
        value={searchTerm}
        onChangeText={onChange}
        style={{
          borderColor: 'blue',
          borderWidth: 1,
          borderRadius: 3
        }}
      />
      { map((podcast: Podcast) => (
        <Text key={podcast.trackId}
          onPress={subscribe(podcast)}>
          {podcast.trackName}
        </Text>
      ), searchResults)}
    </View>
  )
}
