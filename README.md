# Chong Chen - Personal Homepage

A minimalist, premium personal academic homepage. Hand-built static site: plain
HTML, CSS, and a small amount of vanilla JavaScript. No build step, no framework,
instant load.


## Preview locally

Any static file server works. For example:

```bash
cd Personal-Page
python3 -m http.server 8013
# then open http://localhost:8013
```

## Project structure

```
index.html              All content + markup (edit your content here)
assets/
  css/style.css         Design system: colors, type, layout, motion
  js/main.js            Theme toggle, mobile menu, scroll reveal, QR dialog
  fonts/                Self-hosted Geist + Geist Mono (variable woff2)
  img/
    profile.jpg         Hero portrait
    wechat-qr.jpg       WeChat QR (opens in a dialog)
    favicon.svg         Monogram favicon
```

## Editing content

Everything visible lives in `index.html`, grouped by section with clear comments:
`HERO`, `ABOUT`, `EDUCATION`, `PUBLICATIONS`, `AWARDS`, `SERVICE`, `CONTACT`.

- To add a publication, copy one `<li class="pub reveal"> ... </li>` block and edit
  the year, venue tag, title, authors (wrap your own name in `<span class="me">`),
  venue, and link chips.
- To add an award, copy one `<li class="reveal"> ... </li>` block in `.awards`.
- Section anchor IDs (`#about-me`, `#publications`, etc.) match the previous site,
  so existing inbound links and bookmarks keep working.

## Theming

- Light and dark modes are both supported. The page follows the visitor's system
  preference and offers a manual toggle (top right); the choice is remembered.
- All colors are CSS variables at the top of `style.css`. The single accent color
  (a restrained pine emerald) is `--accent`; change it in two places (`:root` for
  light, `[data-theme="dark"]` plus the `prefers-color-scheme` block for dark).

## Deploying to GitHub Pages

This is a static site, so deployment is just publishing the folder.

1. Commit `index.html`, `assets/`, and `README.md` to your Pages repository
   (the same one currently serving `bugmakercc.github.io/chong/`).
2. In the repo settings, make sure GitHub Pages is enabled for the branch/folder.
3. Push. The site goes live at the same URL.

Paths in `index.html` are all relative, so the site works whether it is served
from the domain root or a sub-path like `/chong/`.

If you move to a different URL, update the absolute `og:image`, `og:url`, and
`canonical` values in the `<head>` of `index.html` so link previews stay correct.

## Notes

- Fonts are self-hosted (no Google Fonts request). Latin glyphs render in Geist;
  Chinese characters fall back to the system CJK font automatically.
- Icons are from Simple Icons (brand logos) and Tabler (UI), inlined as an SVG
  sprite. No icon font or external request.
- Motion respects `prefers-reduced-motion`; transparency effects respect
  `prefers-reduced-transparency`.
```
