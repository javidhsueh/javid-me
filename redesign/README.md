# Javid — personal website candidate

Isolated, unpublished source on `redesign/static-portfolio` (branch name predates user's clarification). Current direction is a designed personal identity website, not a portfolio or case study collection. Existing root site and GitHub Pages remain unchanged.

## Design

A memorable digital calling card: large Javid Hsueh typography; verified Staff Engineer at Apple role; brief frontend/data visualization interests; an original generative illustration; short bio; GitHub and LinkedIn links. No invented Apple work, projects, client metrics, personal hobbies, dates, or contacts.

Deep blue ink #101f2a, cool paper #f5f7f8, slate #20303b, muted slate #596874, sea glass #6de0d0, ochre #e8b970. Manrope headings, DM Sans body. Fonts self-hosted with SIL Open Font licenses. No external requests on initial page load.

Original SVG illustration: Connections, Flow, Structure layout controls; slow ambient motion; pause/resume; OS reduced motion; hidden-tab and offscreen pause; low-power/save-data defaults. The illustration is clearly described as generated artwork, not research data. Static content and social links work without JavaScript; controls are hidden until enhanced.

Reviewed and applied official Anthropic frontend-design skill: subject-specific plan, compact token system, one expressive element, restrained motion, screenshot critique. Official OpenAI Playwright skill installed for verification. Both installed under ~/.codex/skills and available next turn.

## Build

`npm run build` creates ignored `dist/`. Build needs Node only, with no npm package dependencies. Static HTML/CSS/JS and fonts are copied. Old portfolio draft and portfolio imagery are deliberately excluded from production build.

Temporary loopback preview: `python3 -m http.server 8795 --bind 127.0.0.1 --directory dist` (no persistent service installed).

## Repository/hosting evidence

https://github.com/javidhsueh/javidhsueh.github.io ; baseline master 03b4161. GitHub Pages read-only API confirms legacy build from master /, cname javid.me, HTTPS enforced, status built. This repository was cloned into the task workspace; no matching existing local source checkout was found in the checked app/site locations.

Legacy repo is compiled React/Create React App + Webpack + jQuery output, without package.json or AGENTS.md. Source maps contain original components and public content. Existing CSS identifies Ceevee/Styleshout; compiled footer credits Tim Baker and Styleshout. No governing standalone template license found. Existing root legacy code and attribution remain intact; candidate code is original and reuses none of the old template code.

## Content and preserved draft

Apple title is user-confirmed. Background at Uber/Exploratorium and UC Davis education comes from existing public site's source map. Specific date ranges, Apple team/project details, phone/street address, old resume PDF and analytics omitted.

`work-archive-draft.html` preserves the earlier portfolio candidate locally with existing public images and citations. It is unlinked from homepage and excluded from build. It is optional future source material, not a release requirement. Its bibliography and image rights would need editorial verification if reused.

LinkedIn could not be publicly fetched (no bypass attempted); link is exactly user's supplied profile. No guessed email added. No additional content clarification is required for this personal homepage candidate.

## Boundaries before migration

No live DNS, hosting, Cloudflare, GitHub Pages, account profile, Kids or Control changes. Cloudflare target, apex cutover, old-path preservation, redirects, security headers, caching, rollback and release authority need concrete review before deployment. New production monitoring belongs to the designated Control Web sole writer.
