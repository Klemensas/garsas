import { ArtistSearchService, ArtistSearchResult } from "../../types/index.js";

export class MusicBrainzArtistSearchService implements ArtistSearchService {
  private readonly BASE_URL = "https://musicbrainz.org/ws/2/artist";
  private readonly USER_AGENT = "GarsasExtension/1.0";

  async searchArtist(name: string): Promise<ArtistSearchResult[]> {
    try {
      const params = new URLSearchParams({
        query: `artist:${name}`,
        fmt: "json",
        limit: "10",
      });

      const response = await fetch(`${this.BASE_URL}?${params}`, {
        headers: {
          "User-Agent": this.USER_AGENT,
        },
      });

      const data = await response.json();

      if (data.artists) {
        return data.artists.map((artist: any) => ({
          name: artist.name,
          id: artist.id,
          href: `https://musicbrainz.org/artist/${artist.id}`,
          provider: this.getProviderName(),
        }));
      }

      return [];
    } catch (error) {
      console.error("MusicBrainz search error:", error);
      return [];
    }
  }

  getProviderName(): string {
    return "musicbrainz";
  }
}
