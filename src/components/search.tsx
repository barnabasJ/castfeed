import React, { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { Podcast, subscribeToPodcast } from 'src/podcasts'
import map from 'lodash/fp/map'
import { searchPodcast } from 'src/search';

export const Search: React.FunctionComponent<{}> = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const dispatch = useDispatch()
  const onChange = useCallback((evt) => {
    const value = evt.target.value
    setSearchTerm(value)
    dispatch(searchPodcast(value))
  }, [setSearchTerm])

  const subscribe = useCallback((episode) => () => {
    dispatch(subscribeToPodcast(episode))
  }, [dispatch])

  const searchResults: Array<Podcast> = useSelector((state: RootState) => state.search.results)
  return (
  <div>
    <h1>Search</h1>
    <input value={searchTerm} onChange={onChange}/>
    { map((podcast: Podcast) => (
      <h2 key={podcast.trackId}>
        <a onClick={subscribe(podcast)}>
          {podcast.trackName}
        </a>
      </h2>
    ), searchResults)}
  </div>
  )
}
