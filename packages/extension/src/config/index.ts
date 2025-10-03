import { ExtensionConfig, SiteConfig } from "../types/index.js";

// Default configuration
export const defaultConfig: ExtensionConfig = {
  mode: "dom", // 'dom' for DOM parsing, 'api' for API calls
  artistSearchProvider: "spotify",
  sites: [
    {
      name: "ra.co",
      domains: ["ra.co"],
      parser: "ra",
      enabled: true,
    },
    {
      name: "amsterdam-dance-event",
      domains: ["amsterdam-dance-event.nl"],
      parser: "ade",
      enabled: true,
    },
    {
      name: "instagram",
      domains: ["instagram.com"],
      parser: "instagram",
      enabled: true,
    },
  ],
};

// Configuration management
export class ConfigManager {
  private config: ExtensionConfig;

  constructor(initialConfig?: Partial<ExtensionConfig>) {
    this.config = { ...defaultConfig, ...initialConfig };
  }

  getConfig(): ExtensionConfig {
    return this.config;
  }

  setMode(mode: "dom" | "api"): void {
    this.config.mode = mode;
  }

  setArtistSearchProvider(
    provider: "spotify" | "lastfm" | "musicbrainz"
  ): void {
    this.config.artistSearchProvider = provider;
  }

  getSiteConfig(domain: string): SiteConfig | undefined {
    return this.config.sites.find((site) =>
      site.domains.some((siteDomain) => domain.includes(siteDomain))
    );
  }

  isSiteEnabled(domain: string): boolean {
    const siteConfig = this.getSiteConfig(domain);
    return siteConfig?.enabled ?? false;
  }

  updateSiteConfig(domain: string, updates: Partial<SiteConfig>): void {
    const siteIndex = this.config.sites.findIndex((site) =>
      site.domains.some((siteDomain) => domain.includes(siteDomain))
    );

    if (siteIndex !== -1) {
      this.config.sites[siteIndex] = {
        ...this.config.sites[siteIndex],
        ...updates,
      };
    }
  }
}

// Global config instance
export const configManager = new ConfigManager();
