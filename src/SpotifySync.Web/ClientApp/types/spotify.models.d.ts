export type AlbumGroup = 'album' | 'single' | 'compilation' | 'appears_on';
export type AlbumType = 'album' | 'single' | 'compilation';
export type ReleaseDatePrecision = 'year' | 'month' | 'day';

export interface Album {
    album_type: AlbumType;
    artists: ArtistSimplified[];
    available_markets: strings[];
    copyrights: Copyright[];
    external_ids: ExternalIds;
    external_urls: ExternalUrls;
    genres: strings[];
    href: string;
    id: string;
    images: Image[];
    label: string;
    name: string;
    popularity: number;
    release_date: string;
    release_date_precision: ReleaseDatePrecision;
    tracks: Paging<TrackSimplified>;
    type: 'album';
    uri: string;
}

export interface AlbumSimplified {
    album_group: AlbumGroup;
    album_type: AlbumType;
    artists: ArtistSimplified[];
    available_markets: string[];
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: Image[];
    name: string;
    release_date: string;
    release_date_precision: ReleaseDatePrecision;
    type: string;
    uri: string;
}

export interface Artist {
    external_urls: ExternalUrls;
    followers: Followers;
    genres: string[];
    href: string;
    id: string;
    images: Image[];
    name: string;
    popularity: number;
    type: string;
    uri: string;
}

export interface ArtistSimplified {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}

export interface AudioFeatures {
    acousticness: number;
    analysis_url: string;
    danceability: number;
    duration_ms: number;
    energy: number;
    id: string;
    instrumentalness: number;
    key: number;
    liveness: number;
    loudness: number;
    mode: number;
    speechiness: number;
    tempo: number;
    time_signature: number;
    track_href: string;
    type: string;
    uri: string;
    valence: number;
}

export interface Category {
    href: string;
    icons: Image[];
    id: string;
    name: string;
}

export interface Context {
    type: 'artist' | 'playlist' | 'album';
    href: string;
    external_urls: ExternalUrls;
    uri: string;
}

export interface Copyright {
    text: string;
    type: 'C' | 'P';
}

export interface Cursor {
    after: string;
}

export interface Error {
    status: number;
    message: string;
}

export interface ExternalIds {
    [key: string]: string;
}

export interface ExternalUrls {
    [key: string]: string;
}

export interface Followers {
    href: string | null;
    total: number;
}

export interface Image {
    height: number | null;
    url: string;
    width: number | null;
}

export interface Paging<T> {
    href: string;
    items: T[];
    limit: number;
    next: string;
    offset: integer;
    previous: string;
    total: number;
}

export interface PagingCursor<T> {
    href: string;
    items: T[];
    limit: number;
    next: string | null;
    cursors: Cursor;
    total: number;
}

export interface PlayHistory {
    track: TrackSimplified;
    played_at: string;
    context: Context;
}

export interface Playlist {
    collaborative: boolean;
    description: string | null;
    external_urls: externalurls;
    followers: Followers;
    href: string;
    id: string;
    images: Image[];
    name: string;
    owner: UserPublic;
    public: boolean | null;
    snapshot_id: string;
    tracks: Paging<PlaylistTrack>;
    type: 'playlist';
    uri: string;
}

export interface PlaylistTrack {
    added_at: string | null;
    added_by: UserPublic | null;
    is_local: boolean;
    track: Track;
}

export interface Recommendations {
    seeds: RecommendationSeed[];
    tracks: TrackSimplified[];
}

export interface RecommendationSeed {
    afterFilteringSize: number;
    afterRelinkingSize: number;
    href: string | null;
    id: string;
    initialPoolSize: number;
    type: 'artist' | 'track' | 'genre';
}

export interface SavedTrack {
    added_at: string;
    track: Track;
}

export interface SavedAlbum {
    added_at: string;
    album: Album;
}

export interface Track {
    album;
    artists;
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: ExternalIds;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    is_playable: boolean;
    linked_from: TrackLink;
    restrictions: Restrictions;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: 'track';
    uri: string;
}

export interface TrackSimplified {
    artists: ArtistSimplified[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    is_playable: boolean;
    linked_from: TrackLink;
    restrictions: Restrictions;
    name: string;
    preview_url: string;
    track_number: number;
    type: 'track';
    uri: string;
}

export interface TrackLink {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    type: string;
    uri: string;
}

export interface Restrictions {
    [reason: string]: string;
}

export interface UserPrivate {
    birthdate: string;
    country: string;
    display_name: string;
    email: string;
    external_urls: ExternalUrls;
    followers: Followers;
    href: string;
    id: string;
    images: Image[];
    product: 'premium' | 'free' | 'open';
    type: 'user';
    uri: string;
}

export interface UserPublic {
    display_name: string | null;
    external_urls: ExternalUrls;
    followers: Followers;
    href: string;
    id: string;
    images: Image[];
    type: 'user';
    uri: string;
}

export interface PlaybackDevice {
    id: string | null;
    is_active: boolean;
    is_restricted: boolean;
    name: string;
    type: 'Computer' | 'Smartphone' | 'Speaker';
    volume_percent: number | null;
}

export interface PlaybackState {
    timestamp: number;
    device: PlaybackDevice;
    progress_ms: string;
    is_playing: boolean;
    item: Track | null;
    shuffle_state: boolean;
    repeat_state: 'off' | 'track' | 'context';
    context: Context;
}
