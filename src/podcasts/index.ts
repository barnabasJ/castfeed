import { createSlice, PayloadAction, createEntityAdapter } from '@reduxjs/toolkit'
import { withPayloadType } from 'src/utils'
import { RootState } from 'src/store'

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
  trackId: number
  trackName: string
  trackPrice: number
  trackRentalPrice: number
  trackViewUrl: string
  wrapperType: string
}

const podcastAdapter = createEntityAdapter({
  selectId: ({ trackId }: Podcast) => trackId,
  sortComparer: (p1: Podcast, p2: Podcast) => (p1.trackId - p2.trackId) % 2
})

type PodcastState = ReturnType<typeof podcastAdapter.getInitialState>

const podcasts = createSlice({
  name: 'podcasts',
  initialState: podcastAdapter.getInitialState(),
  reducers: {
    subscribeToPodcast: {
      reducer: (state, action: PayloadAction<Podcast>) => {
        podcastAdapter.upsertOne(state, action.payload)
      },
      prepare: withPayloadType<Podcast>()
    },
    unsubscribeFromPodcast: {
      reducer: (state, action: PayloadAction<Podcast>) => {
        podcastAdapter.removeOne(state, action.payload.trackId)
      },
      prepare: withPayloadType<Podcast>()
    }
  }
})

export default podcasts.reducer

export const { subscribeToPodcast, unsubscribeFromPodcast } = podcasts.actions

export const {
  selectAll,
  selectById,
  selectEntities
} = podcastAdapter.getSelectors((state: RootState) => state.podcasts)
