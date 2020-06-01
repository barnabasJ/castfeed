import React, { useState, useCallback } from 'react'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'
import { SearchBar } from 'react-native-elements'
import { searchPodcast, selectSearch } from 'src/search'
import { useSelector } from 'src/store'

export const Search: React.FunctionComponent<{}> = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const dispatch = useDispatch()
  const { loading } = useSelector(selectSearch)

  const onChange = useCallback(term => {
    setSearchTerm(term)
    dispatch(searchPodcast(term))
  }, [setSearchTerm])

  return (
    <View>
      <SearchBar
        placeholder={'Search'}
        value={searchTerm}
        onChangeText={onChange}
        showLoading={loading}
        lightTheme
      />
    </View>
  )
}

export default Search
