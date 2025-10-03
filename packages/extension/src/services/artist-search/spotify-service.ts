import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { ArtistSearchService, ArtistSearchResult } from "../../types/index.js";

export class SpotifyArtistSearchService implements ArtistSearchService {
  private spotifySdk: SpotifyApi;
  private readonly CLIENT_ID = "6eb3404b03234691912266d47289bc46";
  private readonly CLIENT_SECRET = "f585cbeea72b412e9455a2604aeedff0";

  constructor() {
    this.spotifySdk = SpotifyApi.withClientCredentials(
      this.CLIENT_ID,
      this.CLIENT_SECRET,
      ["user-read-private"]
    );
  }

  async searchArtist(name: string): Promise<ArtistSearchResult[]> {
    try {
      const response = await this.spotifySdk.search(name, ["artist"]);

      return response.artists.items.map((item) => ({
        name: item.name,
        id: item.id,
        href: item.href,
        provider: this.getProviderName(),
      }));
    } catch (error) {
      console.error("Spotify search error:", error);
      return [];
    }
  }

  getProviderName(): string {
    return "spotify";
  }
}
