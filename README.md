# softiba.com

Single-page landing site for **Softiba** — the studio behind RemoteMikrotik, Radtik, HifzDesk, WhatSwift, SwiftNotify and VoltBangla.

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

## Editing products

Each product is one `<a class="row">` in the `#products` section of `index.html`. The hero network diagram reads its list from the `products` array in `assets/js/main.js`.
