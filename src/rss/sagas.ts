import { all, call, takeEvery, takeLatest, put, select, spawn } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'
import { Podcast, selectAll } from 'src/podcasts'
import { parseString } from 'react-native-xml2js'
import get from 'lodash/get'
import curry from 'lodash/curry'
import map from 'lodash/fp/map'
import { getEpisodesForPodcast, getEpisodesForPodcastFulfilled, getEpisodesForPodcastRejected, updateEpisodesForAllPodcasts } from '.'
import { Episode } from 'src/episodes'
import { Platform } from 'react-native'

const CORS_ANYWHERE = 'https://cors-anywhere.herokuapp.com/'

const fetchFeed = async feedUrl => {
  let url = feedUrl
  if (Platform.OS === 'web') {
    url = CORS_ANYWHERE + url
  }
  const res = await fetch(url)
  return await res.text()
}

const durationStringToNumber = (durationString: string) => {
  const parts = durationString.split(':')
  const [h, m, s] = map(s => Number(s), parts)
  return h * 60 * 60 + m * 60 + s
}

const itemToEpisode = curry(
  (podcast: Podcast, item): Episode => ({
    id: `${podcast.trackId}-${item.pubDate[0]}`,
    podcastId: podcast.trackId,
    title: get(item, 'title[0]'),
    pubDate: get(item, 'pubDate[0]'),
    link: get(item, 'link[0]'),
    duration: durationStringToNumber(get(item,'itunes:duration[0]')),
    author: get(item, 'itunes:author[0]'),
    summary: get(item, 'itunes:summary[0]'),
    subtitle: get(item, 'itunes:subtitle[0]'),
    description: get(item, 'description[0]'),
    image: get(item, 'itunes:image[0].$.href') || podcast.artworkUrl600,
    file: {
      url: get(item, 'enclosure[0].$.url'),
      type: get(item, 'enclosure[0].$.type'),
      length: get(item, 'enclosure[0].$.length')
    }
  })
)

const itemsToEpisodes = (items, podcast) => map(itemToEpisode(podcast), items)

const parseFeed = async xml => {
  const parsedXml = await new Promise((resolve, reject) => {
    parseString(xml, (err, result) => err ? reject(err) : resolve(result))
  })
  return get(parsedXml, 'rss.channel[0].item')
}

export function * handleGetEpisodesForPodcast ({
  payload: podcast
}: PayloadAction<Podcast>) {
  try {
    debugger
    const feed = yield call(fetchFeed, podcast.feedUrl)
    console.log(feed)
    const items = yield call(parseFeed, feed)
    console.log(items)
    const episodes = itemsToEpisodes(items, podcast)
    console.log(episodes)
    yield put(getEpisodesForPodcastFulfilled(podcast, episodes))
  } catch (e) {
    console.log(e)
    yield put(getEpisodesForPodcastRejected(e))
  }
}

export function * handleUpdateAllEpisodes () {
  const podcasts = yield select(selectAll)
  const episodeFetcher = map(podcasts, (podcast) =>
    spawn(handleGetEpisodesForPodcast, getEpisodesForPodcast(podcast))
  )
  yield all(episodeFetcher)
}

export function * rssSaga () {
  yield takeEvery(getEpisodesForPodcast.toString(), handleGetEpisodesForPodcast)
  yield takeLatest(updateEpisodesForAllPodcasts.toString(), handleUpdateAllEpisodes)
}
