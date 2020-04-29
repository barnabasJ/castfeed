import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { withPayloadType } from 'src/utils'
import filter from 'lodash/fp/filter'

export interface Podcast {
  artistName: string
  artworkUrl100: string
  artworkUrl30: string
  artworkUrl600: string
  artworkUrl60: string
  collectionCensoredName: string
  collectionExplicitness: string
  collectionHdPrice: number
  collectionId: string
  collectionName: string
  collectionPrice: number
  collectionViewUrl: string
  contentAdvisoryRating: string
  country: string
  currency: string
  feedUrl: string
  genreIds: Array<number>
  genres: Array<string>
  kind: string
  primaryGenreName: string
  releaseDate: string
  trackCensoredName: string
  trackCount: number
  trackExplicitness: string
  trackHdPrice: number
  trackHdRentalPrice: number
  trackId: string
  trackName: string
  trackPrice: number
  trackRentalPrice: number
  trackViewUrl: string
  wrapperType: string
}

const unsubscribePodcasts = (
  subscribedPodcasts: Array<Podcast>,
  podcast: Podcast
) =>
  filter(
    (subscribedPodcast: Podcast) =>
      subscribedPodcast.trackId != podcast.trackId,
    subscribedPodcasts
  )

interface PodcastState {
  subscribedPodcasts: {
    [key: string]: Podcast
  }
}

const initialState: PodcastState = {
  subscribedPodcasts: {}
}

const podcasts = createSlice({
  name: 'podcasts',
  initialState,
  reducers: {
    subscribeToPodcast: {
      reducer: (state, action: PayloadAction<Podcast>) => {
        const podcast = action.payload
        state.subscribedPodcasts[podcast.trackId]= podcast
      },
      prepare: withPayloadType<Podcast>()
    },
    unsubscribeFromPodcast: {
      reducer: (state, action: PayloadAction<Podcast>) => {
        const podcast = action.payload
        delete state.subscribedPodcasts[podcast.trackId]
      },
      prepare: withPayloadType<Podcast>()
    }
  }
})

export default podcasts.reducer

export const { subscribeToPodcast, unsubscribeFromPodcast } = podcasts.actions
