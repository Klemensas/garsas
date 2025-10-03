import { BaseParser, ParsedArtistData, Artist } from "../types/index.js";

export abstract class BaseSiteParser implements BaseParser {
  protected domain: string;

  constructor(domain: string) {
    this.domain = domain;
  }

  abstract parse(): ParsedArtistData[];

  getDomain(): string {
    return this.domain;
  }

  protected createArtistData(
    element: Element,
    artist: Artist
  ): ParsedArtistData {
    return {
      element,
      artist,
    };
  }

  protected extractArtistFromText(text: string): Artist {
    const artist: Artist = {
      name: "",
    };

    if (!text) return artist;

    // Pattern for artist with country code: "Artist Name (US)"
    const artistWithCountry = /^(.+?)\s*\(\s*([A-Z]{2,3})\s*\)$/;
    const matches = text.match(artistWithCountry);

    if (matches) {
      const [_, name, countryCode] = matches;
      artist.name = name.trim();
      artist.countryCode = countryCode;
    } else {
      // No country code, assume all text is the artist name
      artist.name = text.trim();
    }

    return artist;
  }
}
