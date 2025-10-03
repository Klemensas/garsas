import { ParsedArtistData } from "../types/index.js";
import { BaseSiteParser } from "./base-parser.js";

export class AdeParser extends BaseSiteParser {
  parse(): ParsedArtistData[] {
    const artistElements = this.getArtistElements();

    return artistElements.map((element) => {
      const artist = this.extractArtistFromText(element.textContent || "");
      return this.createArtistData(element, artist);
    });
  }

  private getArtistElements(): Element[] {
    // Amsterdam Dance Event specific selector for artist elements
    // You might need to adjust this based on the actual ADE site structure
    return Array.from(
      document.querySelectorAll(".artist-name, .lineup-artist, .event-artist")
    );
  }
}
