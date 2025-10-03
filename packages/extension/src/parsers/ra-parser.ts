import { ParsedArtistData } from "../types/index.js";
import { BaseSiteParser } from "./base-parser.js";

export class RaParser extends BaseSiteParser {
  parse(): ParsedArtistData[] {
    const artistElements = this.getArtistElements();

    return artistElements.map((element) => {
      const artist = this.extractArtistFromText(element.textContent || "");
      return this.createArtistData(element, artist);
    });
  }

  private getArtistElements(): Element[] {
    // RA.co specific selector for artist elements
    return Array.from(document.querySelectorAll(".link__line-up"));
  }
}
