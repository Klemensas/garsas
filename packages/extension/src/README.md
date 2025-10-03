# Garsas Extension - Modular Architecture

This directory contains the modular architecture for the Garsas extension, designed to support multiple target sites and different processing modes.

## Architecture Overview

### Core Components

1. **Types** (`types/`) - TypeScript interfaces and types
2. **Configuration** (`config/`) - Configuration management system
3. **Parsers** (`parsers/`) - Site-specific DOM parsers
4. **Services** (`services/`) - External API services
5. **Content Orchestrator** - Main coordination logic

### Directory Structure

```
src/
├── types/
│   └── index.ts              # Core interfaces and types
├── config/
│   └── index.ts              # Configuration management
├── parsers/
│   ├── base-parser.ts        # Base parser class
│   ├── instagram-parser.ts   # Instagram-specific parser
│   ├── ra-parser.ts          # RA.co parser
│   ├── ade-parser.ts         # Amsterdam Dance Event parser
│   └── index.ts              # Parser factory
├── services/
│   └── artist-search/
│       ├── spotify-service.ts    # Spotify API integration
│       ├── lastfm-service.ts     # Last.fm API integration
│       ├── musicbrainz-service.ts # MusicBrainz API integration
│       └── index.ts               # Service factory
├── content-orchestrator.ts   # Main coordination logic
└── index.ts                  # Main exports
```

## Usage

### Adding a New Site Parser

1. Create a new parser class extending `BaseSiteParser`:

```typescript
import { BaseSiteParser, ParsedArtistData } from '../types/index.js';

export class NewSiteParser extends BaseSiteParser {
  parse(): ParsedArtistData[] {
    // Implement site-specific parsing logic
    const elements = document.querySelectorAll('.artist-selector');
    return elements.map(el => {
      const artist = this.extractArtistFromText(el.textContent || '');
      return this.createArtistData(el, artist);
    });
  }
}
```

2. Add the parser to the factory in `parsers/index.ts`:

```typescript
case 'newsite':
  return new NewSiteParser(domain);
```

3. Update configuration in `config/index.ts`:

```typescript
{
  name: 'new-site',
  domains: ['newsite.com'],
  parser: 'newsite',
  enabled: true,
}
```

### Adding a New Artist Search Provider

1. Create a new service implementing `ArtistSearchService`:

```typescript
import { ArtistSearchService, ArtistSearchResult } from '../../types/index.js';

export class NewProviderService implements ArtistSearchService {
  async searchArtist(name: string): Promise<ArtistSearchResult[]> {
    // Implement API integration
  }

  getProviderName(): string {
    return 'newprovider';
  }
}
```

2. Add to the service factory in `services/artist-search/index.ts`

3. Update the configuration type in `types/index.ts`

### Switching Modes

The extension supports two modes:

- **DOM Mode**: Parses HTML elements to extract artist information
- **API Mode**: Uses site APIs for more reliable data extraction

Switch modes by updating the configuration:

```typescript
configManager.setMode('api'); // or 'dom'
```

### Configuration Management

The `ConfigManager` class provides centralized configuration:

```typescript
import { configManager } from './config/index.js';

// Get current configuration
const config = configManager.getConfig();

// Switch modes
configManager.setMode('api');
configManager.setArtistSearchProvider('lastfm');

// Enable/disable sites
configManager.updateSiteConfig('instagram.com', { enabled: false });
```

## Benefits

1. **Modularity**: Easy to add new sites and services
2. **Flexibility**: Switch between DOM parsing and API modes
3. **Extensibility**: Simple to add new artist search providers
4. **Maintainability**: Clear separation of concerns
5. **Testability**: Each component can be tested independently
