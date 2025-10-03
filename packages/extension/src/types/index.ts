// Base types for the extension

export interface Artist {
  name: string;
  id?: string;
  href?: string;
  countryCode?: string;
}

export interface ParsedArtistData {
  element: Element;
  artist: Artist;
}

export interface SiteConfig {
  name: string;
  domains: string[];
  parser: string;
  apiEndpoint?: string;
  enabled: boolean;
}

export interface ExtensionConfig {
  mode: "dom" | "api";
  sites: SiteConfig[];
  artistSearchProvider: "spotify" | "lastfm" | "musicbrainz";
}

export interface ArtistSearchResult {
  name: string;
  id: string;
  href: string;
  provider: string;
}

export interface BaseParser {
  parse(): ParsedArtistData[];
  getDomain(): string;
}

export interface ArtistSearchService {
  searchArtist(name: string): Promise<ArtistSearchResult[]>;
  getProviderName(): string;
}
