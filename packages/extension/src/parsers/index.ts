import { BaseSiteParser } from "./base-parser.js";
import { InstagramParser } from "./instagram-parser.js";
import { RaParser } from "./ra-parser.js";
import { AdeParser } from "./ade-parser.js";

export class ParserFactory {
  static createParser(parserType: string, domain: string): BaseSiteParser {
    switch (parserType) {
      case "instagram":
        return new InstagramParser(domain);
      case "ra":
        return new RaParser(domain);
      case "ade":
        return new AdeParser(domain);
      default:
        throw new Error(`Unknown parser type: ${parserType}`);
    }
  }
}

export { InstagramParser, RaParser, AdeParser };
