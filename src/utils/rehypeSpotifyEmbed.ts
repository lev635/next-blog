import type { Root, Element, ElementContent, Parents } from 'hast';
import { visit, SKIP } from 'unist-util-visit';

const spotifyRegex = /^https:\/\/open\.spotify\.com(?:\/intl-[a-z]+)?\/track\/([A-Za-z0-9]+)/;

export default function rehypeSpotifyEmbed() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index: number | undefined, parent: Parents | undefined) => {
      if (node.tagName !== 'a') return;
      const href = node.properties?.href;
      if (typeof href !== 'string') return;

      // Only replace links where the text content matches the href
      // This preserves [Title](URL) style links
      if (
        !node.children ||
        node.children.length !== 1 ||
        node.children[0].type !== 'text' ||
        node.children[0].value !== href
      ) {
        return;
      }

      const spotifyMatch = spotifyRegex.exec(href);
      if (spotifyMatch) {
        const trackId = spotifyMatch[1];
        const src = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator`;
        const iframe: Element = {
          type: 'element',
          tagName: 'iframe',
          properties: {
            style: 'border-radius:12px',
            src,
            width: '100%',
            height: '152',
            frameborder: '0',
            allowfullscreen: true,
            allow: 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
            loading: 'lazy',
          },
          children: [],
        };
        if (parent && typeof index === 'number') {
          parent.children[index] = iframe;
          return [SKIP, index];
        }
      }
    });
  };
}
