# Website fonts

These are the exact WOFF2 files returned by the website's existing Google Fonts request on 2 October 2026, using Chrome 140's user agent. No font outlines, metrics, names, tables or subsets were modified. Only the local filenames and CSS source URLs changed.

`../fonts.css` retains Google's individual declarations for DM Sans normal 400/500/600/700, Source Serif 4 normal 400/500/600 and Source Serif 4 italic 400/500. Every declaration retains `font-display: swap` and its original Unicode range. Several weights use the same upstream variable-font binary, so the browser reuses the downloaded file.

The Latin and Latin-ext files are retained. All text and accessible labels in the 13 current portfolio HTML pages fit the retained ranges; their non-ASCII characters all fit Latin. The active portfolio, roadmap and map JavaScript sources also contain no characters outside those ranges. Latin-ext files are not preloaded and are fetched only if matching text needs them. The original request's Cyrillic, Greek and Vietnamese subsets are omitted because the current site does not use them.

`google-fonts-source.css` preserves the complete upstream response for comparison. `SOURCES.json` records the request, user agent, individual source URLs, sizes, SHA-256 hashes, retained face declarations and coverage check. Each local WOFF2 hash was also compared with a fresh download of its exact upstream URL and matched. WOFF2 signatures and declared file lengths were checked.

The font software is licensed under the SIL Open Font License 1.1. Keep `DM-Sans-OFL.txt` and `Source-Serif-4-OFL.txt` with these assets. They contain the upstream copyright and license text without modification.

## Integration

Replace the external Google Fonts stylesheet and its two Google preconnect links with the local font stylesheet before the portfolio styles. If the build minifies this source, load its generated minified equivalent.

```html
<link rel="stylesheet" href="assets/fonts.css?v=20261002b">
```

The present page headings use both upright and italic Source Serif 4 above the fold. Those two Latin files are suitable targeted preloads; use the exact same URLs as the CSS to prevent duplicate downloads:

```html
<link rel="preload" href="assets/fonts/source-serif-4-normal-latin-v15.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/source-serif-4-italic-latin-v15.woff2" as="font" type="font/woff2" crossorigin>
```

DM Sans Latin is 36,932 bytes and is also used above the fold. Preloading it is optional; assess request priority against the hero image rather than preloading every file. Do not preload any Latin-ext file. This removes the Google stylesheet round trip and extra font origins; it is not proof of a measured LCP or ranking improvement. Verify loaded faces, typography and network requests in the browser after integration.
