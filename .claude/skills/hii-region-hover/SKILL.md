---
name: hii-region-hover
description: Add hoverable/tappable markers naming the catalogued HII (emission-nebula) regions visible in a galaxy photo — plate-solve the image via astrometry.net, cross-match against SIMBAD for otype=HII entries with a formal NGC/IC designation, then render the same CSS-only tooltip markers used by star-magnitude-hover. Use when the user wants named HII regions (star-forming nebula knots) labeled on a galaxy image, or asks for "reference" on the pink/red regions in a galaxy photo. Piloted 2026-07-30 on the M33 Pinwheel Galaxy page (5 named regions: NGC 604, NGC 595, NGC 588, IC 132, IC 133).
---

# HII-region hover markers

Sibling mechanism to `star-magnitude-hover`, reusing its exact CSS
component (`.ke-star-hover*` in `BaseLayout.astro`) and plate-solve
pipeline, but querying SIMBAD for **extended emission-nebula regions**
(`otype='HII'`) instead of point-source stars. Read `star-magnitude-hover`'s
SKILL.md first — this file only covers what's different.

## What's different from star-magnitude-hover

- **Catalog query**: SIMBAD's TAP/ADQL endpoint, filtering
  `otype='HII'` within a cone of the plate-solve's field center/radius,
  rather than named-star lookups. A galaxy's full HII-region catalog is
  typically **very dense** (936 rows in M33's ~1°-diameter field) — do
  not label all of them. Curate down to entries with a genuine NGC/IC
  designation (queried individually by name, e.g. `NGC 604`) — these
  are the handful any reader might recognize or look up, the same
  "named stars only" curation principle `star-magnitude-hover` uses.
  Fainter regions carry only survey-internal designations (BCLMP,
  LGGS, CPSDP, GDK99, RVP2013, HBW, etc.) — leave those unlabeled and
  say so in the caption, don't silently omit without disclosure.
- **No magnitude field.** HII regions don't have a simple V-band
  magnitude the way stars do — SIMBAD's `basic` table has no
  meaningful flux entry for most of them. The tooltip shows the
  catalog name alone (no "— mag X" suffix), following
  `star-magnitude-hover`'s existing fallback for unnamed/no-extra-data
  stars.
- **Query HII regions by name individually**, not by scraping the cone
  search for NGC/IC-prefixed `main_id` strings — the cone search's
  `main_id` for a named region is often a cross-identification from a
  *different* catalog (e.g. NGC 592 resolves as `VGHC 2-22` in the
  `basic` table), so filtering the bulk results by string pattern will
  silently miss real named regions. Instead, indepedently query each
  candidate name (`NGC 604`, `NGC 595`, `NGC 588`, `IC 132`, `IC 133`,
  etc. — check the plate-solve's own `objects_in_field` response for
  candidates, e.g. it named `NGC 604`/`NGC 595` directly for M33) via
  the same `sim-script` batch endpoint used for stars, requesting
  `%OTYPE` in the format string to confirm it actually resolves as
  `HIIReg` before trusting the coordinates.
- **Placement: a secondary chart, never overlaid on a `ke-zoom-inframe`
  hero.** If the target image is also the page's zoomable hero (see
  the `zoom-and-pan` skill), do **not** place the hover markers
  directly on that same `<img>` — the zoom mechanism applies a live
  CSS `transform: scale()/translate()` to the image on click/hover,
  but percentage-positioned marker `<button>`s are separate sibling
  elements that don't share that transform, so they'd immediately
  drift out of alignment with the labeled features once a viewer
  zooms. Instead render the markers on a **second copy of the same
  photo** further down the page (reusing the existing image asset, no
  new file needed) as its own `.ke-star-hover` block — exactly the
  precedent `star-magnitude-hover` already set with M45's separate
  "seven sisters chart" image, not the mosaic hero. Give this second
  block a short heading (e.g. `### HII Regions in this Image`) and its
  own one-line intro sentence so it doesn't read as an accidental
  duplicate of the hero.

## Verifying region positions land on real nebulosity

Point sources (stars) are easy to eyeball-confirm as a bright dot.
Emission regions are diffuse — verify differently:

1. Crop a modest region (~150-200px square at the image's native
   resolution) centered on each computed pixel position using `sharp`
   (already a project dependency), upscale for visibility, and
   composite a red crosshair at the exact target pixel.
2. `Read` each crop. A correct position lands the crosshair on
   visible pink/magenta/reddish glow (H-alpha emission) or a
   blue-white knot of young stars embedded in nebulosity — not on
   plain starfield or dark sky. All 5 M33 regions confirmed this way
   before being committed.
3. Confirm at least one region against a source you can independently
   corroborate — e.g. the plate-solve's own `objects_in_field` naming
   the region directly, or its known status as the field's most
   visually obvious bright knot (NGC 604 in M33 is the single largest,
   brightest pink glow in frame — hard to miss once you know to look).

## How to verify the rendered markers

Same as `star-magnitude-hover`'s verification section — screenshot
pixel space and real CSS pixel space differ, so compute each marker's
real `getBoundingClientRect()`, convert to screenshot-space via the
`window.innerWidth`/screenshot-width ratio, and use `computer` hover
at those coordinates. Confirm via `document.querySelector('.ke-star-hover-dot:hover')`
and `getComputedStyle(tooltip).opacity === '1'` — dispatching a
synthetic `mouseover` JS event does **not** set the real CSS `:hover`
pseudo-class in the browser, only a genuine pointer action does.

## Apply only on request

Same rule as `star-magnitude-hover` and `zoom-and-pan`: this is a
deliberate extension of an existing finished mechanism, not a default
to roll out to every gallery/nebula image proactively. Apply it when
Jay asks for HII-region (or similarly named-substructure) labeling on
a specific image.
