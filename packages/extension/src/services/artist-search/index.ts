import { ArtistSearchService } from "../../types/index.js";
import { SpotifyArtistSearchService } from "./spotify-service.js";
import { MusicBrainzArtistSearchService } from "./musicbrainz-service.js";

export class ArtistSearchServiceFactory {
  static createService(
    provider: "spotify" | "lastfm" | "musicbrainz"
  ): ArtistSearchService {
    switch (provider) {
      case "spotify":
        return new SpotifyArtistSearchService();
      case "musicbrainz":
        return new MusicBrainzArtistSearchService();
      default:
        throw new Error(`Unknown artist search provider: ${provider}`);
    }
  }
}

export { SpotifyArtistSearchService, MusicBrainzArtistSearchService };
