# softiba.com

Single-page landing site for **Softiba** — a custom software development company from Savar, Dhaka, and the team behind RemoteMikrotik, Radtik, WhatSwift, SwiftNotify and HifzDesk.

Plain static HTML/CSS/JS. No build step: open `index.html` or upload the folder to any static host.

```
index.html
assets/
  css/style.css      design tokens at the top (:root)
  js/main.js         Dhaka clock, mobile menu, scroll reveals, hero constellation
  img/
    softiba-logo.svg          primary logo (ink on light)
    softiba-logo-reverse.svg  logo for dark backgrounds
    softiba-mark.svg          symbol only (hub + nodes)
    favicon.svg / favicon-64.png / apple-touch-icon.png
    og-image.png              1200×630 social preview
```

## Brand

| Token | Hex | Use |
|---|---|---|
| Ink | `#0D2463` | type, primary surfaces |
| Night | `#081638` | dark sections |
| Paper | `#F4F1EA` | page background |
| Signal | `#1EF0D8 → #0A9BEA` | the mark, links, highlights |
| Ember | `#FF6B3D` | "live" status and message flow only |

Type: **Schibsted Grotesk** (headings/body), **Newsreader Italic** (accents), **Martian Mono** (labels). All from Google Fonts.

The logo is a redrawn, all-vector version of the original: a monoline wordmark where the "o" is the hub-and-nodes mark, the dot of the "i" is a node, and f/t share one crossbar.

## Page structure

Hero → Services (`#services`) → Process (`#process`) → Own products (`#products`) → How systems connect → Why Softiba → Studio → Project brief (`#contact`).

- **Services:** one `<article class="svc">` each in `index.html`. The hero network diagram reads the same six from the `products` array in `assets/js/main.js` (each node's `target` is the service card's id).
- **Products:** one `<a class="row">` each in the `#products` section.
- **Project brief form:** a static site has no backend, so the form opens the visitor's email app (to info@softiba.com) or WhatsApp (+880 1303-705753) with the brief already filled in. To collect submissions on a server instead, point the form at Formspree, a Laravel endpoint or similar.
