import { ParsedArtistData } from "../types/index.js";
import { BaseSiteParser } from "./base-parser.js";

export class InstagramParser extends BaseSiteParser {
  parse(): ParsedArtistData[] {
    const text = this.extractInstagramText();
    if (!text) return [];

    // For Instagram, we'll extract potential artist names from hashtags and mentions
    const artistNames = this.extractArtistNamesFromText(text);

    return artistNames.map((name) => {
      // Create a dummy element since Instagram doesn't have structured artist elements
      const dummyElement = document.createElement("span");
      dummyElement.textContent = name;

      return this.createArtistData(dummyElement, { name });
    });
  }

  private extractInstagramText(): string | null {
    try {
      // Very brittle selector here, also doesn't seem to work on resolutions smaller than ~738, as image gets hidden there
      const profileImageEl = document.querySelector("a img");
      const profileLinkEl = profileImageEl?.closest("a");
      const profileHref = profileLinkEl?.getAttribute("href");

      const profileLinkElNextToText = document.querySelectorAll(
        `a[href="${profileHref}"]`
      )[2];
      const sharedContainerEl =
        profileLinkElNextToText?.parentElement?.parentElement?.parentElement
          ?.parentElement;
      const textEl = sharedContainerEl?.nextElementSibling;

      return textEl?.textContent || null;
    } catch (error) {
      console.error("Instagram text extraction error:", error);
      return null;
    }
  }

  private extractArtistNamesFromText(text: string): string[] {
    const artistNames: string[] = [];

    // Extract hashtags that might be artist names
    const hashtagMatches = text.match(/#[a-zA-Z0-9_]+/g);
    if (hashtagMatches) {
      artistNames.push(...hashtagMatches.map((tag) => tag.substring(1))); // Remove #
    }

    // Extract mentions that might be artist names
    const mentionMatches = text.match(/@[a-zA-Z0-9_]+/g);
    if (mentionMatches) {
      artistNames.push(
        ...mentionMatches.map((mention) => mention.substring(1))
      ); // Remove @
    }

    // Look for common artist name patterns in the text
    // This is a simple heuristic - you might want to improve this
    const words = text.split(/\s+/).filter(
      (word) =>
        word.length > 2 &&
        /^[A-Z][a-z]+$/.test(word) && // Capitalized words
        !["The", "And", "Or", "But", "For", "With", "From"].includes(word)
    );

    artistNames.push(...words.slice(0, 5)); // Limit to first 5 potential names

    return [...new Set(artistNames)]; // Remove duplicates
  }
}
