# Javid — personal website

Source: https://github.com/javidhsueh/javid-me, production branch `redesign/static-portfolio`.
Live: https://javid.me. Cloudflare Worker `javid-website` serves the site; www redirects to the apex with path and query preserved.

## Design and content

Identity-first layout with self-hosted Manrope and DM Sans, an original interactive SVG illustration, restrained CSS effects, and brief entrance motion. Connections, Flow and Structure controls support keyboard use. Reduced-motion, offscreen, background-tab and low-power preferences are respected. No external requests occur on initial homepage load; video links open only on click.

The complete original collection remains: 8 works, 27 media entries, 6 video links, 5 publications and 11 related references. `WORKS-INVENTORY.md` and `content-inventory.json` audit the collection. Career dates and Apple role descriptions were supplied by the user from LinkedIn. Private contacts and the obsolete resume are excluded.

## Build and deployment

From the repository root:

```
npm --prefix redesign run build
npm --prefix redesign test
npx --yes wrangler@4.92.0 deploy --config redesign/wrangler.jsonc
```

The build uses Node with zero npm dependencies, generates ignored `dist/` and release metadata, and preserves research paper and slide downloads. The original large `/explo/video.mp4` is stored in private R2, served through the Worker's exact media route with HEAD, byte-range and ETag support. The configuration retains the two approved production custom domains on subsequent deployments.

`/_health` reports actual source revision, artifact digest, observation time and media readiness. Monitoring registration is coordinated with the designated Control Web writer.

## Attribution and history

The original compiled React/Webpack/jQuery homepage remains in the repository root for history. Its Ceevee/Styleshout and Tim Baker attribution remains intact. The new design is original; legacy research pages retain their existing attribution. Font license files are included alongside self-hosted fonts.

Official frontend-design and Playwright skills were installed and used during design and verification.
