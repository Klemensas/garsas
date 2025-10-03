import { configManager } from "./config/index.js";
import { ParserFactory } from "./parsers/index.js";
import { ArtistSearchServiceFactory } from "./services/artist-search/index.js";
import { ParsedArtistData } from "./types/index.js";

export class ContentOrchestrator {
  private config = configManager.getConfig();

  async processPage(): Promise<void> {
    const domain = this.getDomain(window.location.hostname);

    if (!configManager.isSiteEnabled(domain)) {
      console.log(`Site ${domain} is not enabled`);
      return;
    }

    const siteConfig = configManager.getSiteConfig(domain);
    if (!siteConfig) {
      console.log(`No configuration found for domain: ${domain}`);
      return;
    }

    try {
      if (this.config.mode === "dom") {
        await this.processWithDOMParsing(siteConfig.parser, domain);
      } else {
        await this.processWithAPI(siteConfig, domain);
      }
    } catch (error) {
      console.error("Error processing page:", error);
    }
  }

  private async processWithDOMParsing(
    parserType: string,
    domain: string
  ): Promise<void> {
    console.log(
      `Processing ${domain} with DOM parsing using ${parserType} parser`
    );

    const parser = ParserFactory.createParser(parserType, domain);
    const parsedArtists = parser.parse();

    if (parsedArtists.length === 0) {
      console.log("No artists found on page");
      return;
    }

    console.log(
      `Found ${parsedArtists.length} artists:`,
      parsedArtists.map((p: ParsedArtistData) => p.artist.name)
    );

    // Search for additional artist information
    await this.searchArtists(parsedArtists);
  }

  private async processWithAPI(siteConfig: any, domain: string): Promise<void> {
    console.log(`Processing ${domain} with API calls`);

    if (!siteConfig.apiEndpoint) {
      console.warn(
        `No API endpoint configured for ${domain}, falling back to DOM parsing`
      );
      await this.processWithDOMParsing(siteConfig.parser, domain);
      return;
    }

    // TODO: Implement API-based processing
    // This would involve calling the site's API to get structured data
    console.log("API processing not yet implemented");
  }

  private async searchArtists(
    parsedArtists: ParsedArtistData[]
  ): Promise<void> {
    const artistSearchService = ArtistSearchServiceFactory.createService(
      this.config.artistSearchProvider
    );

    const artistsWithNames = parsedArtists.filter(
      ({ artist }) => !!artist.name
    );

    if (artistsWithNames.length === 0) {
      console.log("No artists with names found");
      return;
    }

    console.log(
      `Searching for ${artistsWithNames.length} artists using ${this.config.artistSearchProvider}`
    );

    try {
      const searchPromises = artistsWithNames.map(({ artist }) =>
        artistSearchService.searchArtist(artist.name!)
      );

      const results = await Promise.all(searchPromises);

      // Flatten results and log them
      const allResults = results.flat();
      console.log(`Found ${allResults.length} search results:`, allResults);

      // TODO: Process and display results in the UI
      this.displayResults(parsedArtists, allResults);
    } catch (error) {
      console.error("Error searching for artists:", error);
    }
  }

  private displayResults(
    parsedArtists: ParsedArtistData[],
    searchResults: any[]
  ): void {
    // TODO: Implement UI display logic
    // This could involve:
    // 1. Adding visual indicators to artist elements
    // 2. Creating a popup or sidebar with search results
    // 3. Storing results for later use

    console.log("Displaying results:", {
      parsedArtists: parsedArtists.length,
      searchResults: searchResults.length,
    });
  }

  private getDomain(hostname: string): string {
    if (hostname.startsWith("www.")) {
      return hostname.slice(4);
    }
    return hostname;
  }
}
