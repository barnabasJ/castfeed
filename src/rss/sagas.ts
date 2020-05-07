import { call, takeEvery, put } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'
import { Podcast } from 'src/podcasts'
import { parseString } from 'react-native-xml2js'
import get from 'lodash/get'
import curry from 'lodash/curry'
import map from 'lodash/fp/map'
import { getEpisodesForPodcast, getEpisodesForPodcastFulfilled, getEpisodesForPodcastRejected } from '.'
import { Episode } from 'src/episodes'

const CORS_ANYWHERE = 'https://cors-anywhere.herokuapp.com/'

const fetchFeed = async feedUrl => {
  const res = await fetch(feedUrl)
  return await res.text()
}

const durationStringToNumber = (durationString: string) => {
  const parts = durationString.split(':')
  const [h, m, s] = map(s => Number(s), parts)
  return h * 60 * 60 + m * 60 + s
}

const itemToEpisode = curry(
  (podcast: Podcast, item): Episode => ({
    podcastId:  podcast.trackId,
    title: item.title[0],
    pubDate: item.pubDate[0],
    link: item.link[0],
    duration: durationStringToNumber(item['itunes:duration'][0]),
    author: item['itunes:author'][0],
    summary: item['itunes:summary'][0],
    subtitle: item['itunes:subtitle'][0],
    description: item.description[0],
    image: item['itunes:image'][0]['$'].href,
    file: {
      url: item.enclosure[0]['$'].url,
      type: item.enclosure[0]['$'].type,
      length: item.enclosure[0]['$'].length
    }
  })
)

const itemsToEpisodes = (items, podcast) => map(itemToEpisode(podcast), items)

const parseFeed = async xml =>
  get(await parseString(xml), 'rss.channel[0].item')

export function * handleGetEpisodesForPodcast ({
  payload: podcast
}: PayloadAction<Podcast>) {
  try {
  const feed = yield call(fetchFeed, CORS_ANYWHERE + podcast.feedUrl)
  const items = yield call(parseFeed, feed)
  const episodes = itemsToEpisodes(items, podcast)
  yield put(getEpisodesForPodcastFulfilled(podcast, episodes))
  } catch(e) {
    yield put(getEpisodesForPodcastRejected(e))
  }
}

export function * rssSaga () {
  yield takeEvery(getEpisodesForPodcast.toString(), handleGetEpisodesForPodcast)
}
