# Reference site — niteshchawda.consulting

A complete, deployable static site that demonstrates the McKinsey-inspired editorial design specified in the Brand Book.

## Structure

```
reference_site/
├── index.html
├── about.html
├── services.html
├── engagements.html
├── insights.html
├── contact.html
├── privacy.html
├── terms.html
├── robots.txt
├── sitemap.xml
├── CNAME                              # for GitHub Pages custom domain
└── assets/
    ├── styles.css                     # ~330 lines, all design tokens + components
    ├── main.js                        # ~30 lines, mobile nav + safe external links
    ├── favicon.svg
    ├── og-card.svg                    # 1200×630 social share card
    ├── logo-wordmark-cream-on-navy.svg
    └── logo-wordmark-navy-on-cream.svg
```

## How to use it

The reference site exists for two reasons:

1. **A live visual reference for Wix.** Open it in a browser; rebuild section-by-section in Wix matching the layout, type and palette. Every component (hero, capability list, engagement card, insight card, footer) is shown.
2. **A backup deployment path.** If Wix is too slow or limiting, this site is ready to deploy to GitHub Pages or Netlify on the `niteshchawda.consulting` domain. Both are free under the GitHub Student Developer Pack.

## Local preview

Open `index.html` directly in a browser. For relative path correctness use a tiny local server:

```powershell
# Python 3 (already installed):
cd "C:\Users\nites\OneDrive\Desktop\NCC PTY LTD\03_Website\reference_site"
python -m http.server 8000
# then open http://localhost:8000
```

## Deploying to GitHub Pages (one-off)

1. Create a new private repo on GitHub: `niteshchawda-consulting-site` (Student Pack gives unlimited private repos already).
2. Push the contents of this folder to `main`.
3. In repo settings → Pages, set source to `main / root`. Pages will publish at `niteshchawda-consulting-site.github.io` first, then attach the custom domain via the `CNAME` file in this folder.
4. Add the DNS records detailed in `04_Email_and_Domain/DNS_Setup_Guide.md`.

## Form back-end

The contact form points at a Formspree placeholder (`REPLACE_WITH_YOUR_ENDPOINT`). Free tier supports 50 submissions/month and is the lowest-friction option. Replace the action URL once Formspree is set up. Alternatives: Wix Forms (if hosted on Wix), Cloudflare Turnstile + a tiny Worker.

## Accessibility

- Colour contrast WCAG AA throughout (AAA on hero text on Parchment).
- Keyboard navigable, visible focus states on form fields.
- `prefers-reduced-motion` respected.
- Skip link in source order before nav.

## Performance

- No JavaScript frameworks; ~30 lines of vanilla JS, deferred.
- Two web fonts (Inter, Source Serif 4) preconnected and `display=swap`.
- All SVG assets inline-scalable, ~5 KB each.
- Total page weight under 50 KB before fonts.
