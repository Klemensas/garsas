import { SpotifyApi } from "@spotify/web-api-ts-sdk";

function searchArtist(name: string) {
  const CLIENT_ID = "6eb3404b03234691912266d47289bc46";
  const CLIENT_SECRET = "f585cbeea72b412e9455a2604aeedff0";
  const spotifySdk = SpotifyApi.withClientCredentials(
    CLIENT_ID,
    CLIENT_SECRET,
    ["user-read-private"]
  );

  return Promise.all([
    spotifySdk.search(name, ["artist"]).then((res) =>
      res.artists.items.map((item) => ({
        name: item.name,
        id: item.id,
        href: item.href,
      }))
    ),
  ]);
}

export default defineContentScript({
  matches: [
    "*://*.ra.co/*",
    "*://*.amsterdam-dance-event.nl/*/program/*/*/*",
    "*://*.instagram.com/p/*",
  ],
  main() {
    function getDomain(hostname: string) {
      if (hostname.startsWith("www.")) return hostname.slice(4);

      return hostname;
    }

    function instagramParser() {
      function getText() {
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

        return textEl?.textContent;
      }

      const text = getText();
      console.log(text);
      return text;
    }

    const domain = getDomain(window.location.hostname);
    switch (domain) {
      case "ra.co":
        break;
      case "amsterdam-dance-event.nl":
        break;
      case "instagram.com":
        return instagramParser();
      default:
        break;
    }

    function getArtistElements() {
      return document.querySelectorAll(".link__line-up");
    }

    function extractElementArtistData(element: Element) {
      const text = element.textContent;

      let artist: {
        name: string | null;
        countryCode: string | null;
      } = {
        name: null,
        countryCode: null,
      };
      const result = {
        element,
        artist,
      };

      // Element has no text
      if (!text) return result;

      const artistWithCountry = /^(.+?)\s*\(\s*([A-Z]{2,3})\s*\)$/;

      const matches = text.match(artistWithCountry);
      if (matches) {
        const [_, name, countryCode] = matches;

        artist.name = name;
        artist.countryCode = countryCode;
        // Non happy path, assuming all text is the artist name
      } else {
        artist.name = text;
      }

      return result;
    }

    const artists = [...getArtistElements()].map(extractElementArtistData);
    const foundArtists = Promise.all(
      artists
        .filter(({ artist }) => !!artist.name)
        // @ts-expect-error - TS doesn't apply filter type narrowing
        .map(({ artist }) => searchArtist(artist.name))
    ).then((results) => console.log("wat", results));
    // console.log(artists);
  },
});
