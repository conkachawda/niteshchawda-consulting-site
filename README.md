# Nitesh Chawda — personal career portfolio

Static, responsive website published through GitHub Pages at https://niteshchawda.consulting/.

## Pages

- `index.html`: introduction, organisation ribbon, interactive method, career journey and featured work.
- `about.html`: career story and education.
- `profile.html`: career history, concurrent appointments and print / save-as-PDF.
- `services.html`: eight-stage personal method, retaining the legacy URL.
- `engagements.html`: named professional experience.
- `insights.html`: education and academic studies.
- `quantum-commercialisation.html` and `investment-and-performance.html`: academic cases, original PDF downloads and scrollable readers.
- `contact.html`: professional contacts and the existing Formspree endpoint.
- `admin.html`: the former executive-support URL now presents personal leadership and enablement experience.
- `privacy.html`, `terms.html`, `credits.html`: site context and sources.

## Development

No framework, package installation or build step is required. Start a local server in this directory:

```sh
python -m http.server 8766 --bind 127.0.0.1
```

Open http://127.0.0.1:8766/. Edit HTML directly. Shared styles and behaviour are in `assets/portfolio.css` and `assets/portfolio.js`. Older assets remain for compatibility but are not loaded by the refreshed pages.

The method supports mouse, touch, arrow keys, Home/End and previous/next controls. Without JavaScript its content appears as a readable sequence. The organisation ribbon has a pause control and respects reduced motion. The profile has print styling.

## Editorial boundaries

The site is a personal CV and portfolio. Keep first-person career language, explicit employment/contract/education relationships and current-employer attribution. Do not reintroduce service packages, staff hiring or consulting sales offers without a change to the brief.

- McKinsey is contracted engagement leadership.
- Bond is commerce with law studies; Harvard is an ALM; Sussex follows the official programme title with AI/cybersecurity described as personal focus.
- The age-17 scholarship is the owner's account, separate from the CV's 2011 programme. Deloitte's age-21 start follows the November 2012 date.
- The owner authorised named client cases and the two original academic papers on 25 September 2026. Academic proposals and modelled benefits remain distinct from delivered professional outcomes.
- Publish only the two authorised academic papers; keep raw CV/transcript extractions out of the repository.
- The 20+ countries, 45+ clients and +$350M programme uplift figures are the owner’s updated career-wide account. Avoid adding the component examples together, since programme outcomes may overlap.
- Reference entries are first-person relationship descriptions, not quotations or endorsements.
- Generated speaking/workshop scenes must retain visible illustration captions. The welcome MP4 is a motion treatment of a still, not recorded speaking footage.
- Logos identify relationships, not endorsements. See `assets/ASSET-SOURCES.md`.

## Validation and publishing

Check desktop and mobile layouts, all method stages, keyboard controls, navigation, image/PDF links, internal anchors and required form fields. Do not send a test enquiry without the owner's instruction. The existing Formspree action is retained; delivery needs an authorised real submission.

Pages publishes the root of `main`; `.nojekyll` keeps the site static. Preserve `CNAME`, the search verification file and canonical domain. Update the sitemap when adding pages. Publish through a branch and pull request, then verify the live domain.
