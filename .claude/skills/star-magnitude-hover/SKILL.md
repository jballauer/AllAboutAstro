---
name: star-magnitude-hover
description: Add hoverable/tappable star markers (name + real catalog magnitude) to an astrophoto on the site — plate-solve the image via astrometry.net, cross-match star identities/magnitudes against SIMBAD, then render CSS-only tooltip markers. Use whenever the user wants "mouseover shows the magnitude" on a deep-sky image, wants to label named stars in a photo accurately, or mentions this being wrong/approximate on a previous attempt. First built 2026-07-24 on the Pleiades (M45) Mosaic gallery page — read this before re-deriving the process or guessing star positions from memory/geometry by hand.
---

# Star-magnitude hover markers

Site mechanism for showing a star's name and real catalog magnitude on
hover/tap, without permanently baking text onto the photo. Two phases:

1. **Authoring-time (offline, once per image)** — plate-solve the photo to
   get an exact pixel↔sky mapping, look up real magnitudes, compute each
   named star's pixel position, hand-write the resulting markup into the
   content file.
2. **Runtime (site, no JS)** — a CSS-only tooltip component
   (`.ke-star-hover*` in `BaseLayout.astro`) that reveals a name+magnitude
   pill on `:hover`/`:focus-visible` of a small marker `<button>`.

**Do not hand-derive star positions from memory of RA/Dec figures.** The
first attempt at this (before this skill existed) used remembered
coordinates for two faint stars and got their declination wrong by ~24
arcmin — looked plausible, was wrong. Always pull real numbers from
SIMBAD and a real plate solve (below), never from recalled catalog values.

## Prerequisites

- An astrometry.net API key. Free account at nova.astrometry.net → profile
  page shows the key. Store it in the repo's gitignored `.env` as
  `ASTROMETRY_API_KEY=...` — never commit it, never send it anywhere but
  the astrometry.net API itself.
- Network access to `nova.astrometry.net` and
  `simbad.cds.unistra.fr` (both confirmed reachable from this environment
  as of 2026-07-24).

## Phase 1 — Plate-solve the image

Submit the **plain, unlabeled** source photo (not a version with text
already baked in — that pollutes the solve with non-stellar bright blobs
and defeats the point of getting fresh, accurate positions). Full
script: `references/plate-solve-workflow.md`.

1. `POST /api/login` with the API key → session token.
2. `POST /api/upload` (multipart, the session + the image file) →
   submission id.
3. Poll `GET /api/submissions/<subid>` until it returns a job id.
4. Poll `GET /api/jobs/<jobid>` until `status` is `success` (or `failure`
   — if it fails, the image likely has too few point-like stars, e.g. a
   very tight crop or a nebula-dominated frame with few pinpoint stars).
5. **Download the actual WCS file**: `GET
   https://nova.astrometry.net/wcs_file/<jobid>` (no `/api/` prefix). Do
   **not** just use the summary numbers from `/calibration/` (ra, dec,
   pixscale, orientation, parity) to hand-roll your own rotation math —
   the raw `CRVAL1/2`, `CRPIX1/2`, `CD1_1/1_2/2_1/2_2` values in the WCS
   file encode rotation and any mirror-flip in one small matrix and are
   far less error-prone to use directly (see Phase 2).
6. `GET /api/jobs/<jobid>/objects_in_field/` is a handy sanity check — it
   names known objects/stars astrometry.net recognizes in the solved
   field, confirming the solve landed on the right patch of sky before
   you invest in the catalog lookup step.

## Phase 2 — RA/Dec → pixel via the real WCS

Standard TAN (gnomonic) projection using the FITS header values pulled
from the `.wcs` file (`CRVAL1/2`, `CRPIX1/2`, `CD1_1`, `CD1_2`, `CD2_1`,
`CD2_2`). Full derivation and code: `references/plate-solve-workflow.md`.
Ignore the SIP distortion terms also present in the header (`A_ORDER`,
etc.) — sub-pixel correction, irrelevant for marker placement.

**Empirically verify orientation before trusting output** — don't assume
image row 0 is "up" or "flipped" from the `parity` field's stated meaning.
Compute pixel positions for 2-3 stars you can independently identify by
eye (the brightest star in frame, an obvious close pair), and check the
computed pixel coordinates land on those actual blobs (e.g. via the
blob-detection approach in `references/plate-solve-workflow.md`, or just
eyeballing a `Read` of the image with candidate coordinates marked). On
the Pleiades page, direct pixel output (no row flip) matched known bright
stars to within ~5px on a 797×598 image — that won't necessarily hold for
a differently-sourced or mirrored image, so re-verify every time.

## Phase 3 — Star identities and magnitudes (SIMBAD)

Query SIMBAD's script interface for each candidate star (named Bayer/
Flamsteed designations, e.g. "27 Tau", or common names) to get verified
RA/Dec + V-band magnitude:

```
POST https://simbad.cds.unistra.fr/simbad/sim-script
body: script=format object "%IDLIST(1) | %COO(d;A) | %COO(d;D) | %FLUXLIST(V)"
             query id <identifier>
```

Batch multiple stars by repeating the `format object ...` + `query id
...` pair per star in one script body (see reference file for a working
example). Notes from the first run:
- Common English names sometimes fail to resolve directly (e.g. "Atlas"
  alone is ambiguous with unrelated catalogs) — use the Flamsteed/Bayer
  form instead (e.g. "27 Tau" for Atlas in the Pleiades) when the plain
  name errors out.
- Cross-check every result's coordinates against the plate-solved pixel
  position (Phase 2) before trusting it — a wrong catalog match will
  place the marker on empty sky, not on the star.

## Phase 4 — Render the markers

No new JS. Reuse the `.ke-star-hover*` classes already defined in
`BaseLayout.astro`:

```html
<div class="ke-star-hover">

![alt text](./_images/photo.jpg)

<button class="ke-star-hover-dot" type="button" style="left:39.22%; top:52.88%;"><span class="ke-star-hover-tip">Alcyone &mdash; mag 2.9</span></button>
<!-- one <button> per star -->

</div>
```

- **Blank lines around the `![]()` matter** — Astro's markdown processor
  only optimizes/converts the image if it's its own paragraph (blank line
  before and after), even nested inside a raw HTML `<div>`. Without the
  blank lines it won't get the same `astro:assets` treatment as every
  other image on the site.
- **Positions are percentages** (`pixel_x / image_width * 100`, `pixel_y
  / image_height * 100`), computed from the plate-solved pixel
  coordinates and the source image's native dimensions — not fixed
  pixels — so markers stay correctly placed regardless of what width the
  responsive layout renders the image at (verified at the ~404px width
  `.ke-two-col-about` actually renders images at).
- Each marker is a real `<button>` (not a bare `<span>`), so it's
  natively focusable/tappable — `:focus-visible` shows the same tooltip
  as `:hover`, covering keyboard and touch users without any JS.

## How to verify

Per `feedback_browser_pane_screenshot_flakiness` memory, don't trust a
screenshot alone here — the Browser pane's screenshot pixel space and the
page's real CSS pixel space are **different scales** (confirmed on the
Pleiades page: 800px screenshot vs. 1186px real `window.innerWidth`, a
~0.6745 ratio), so clicking/hovering "where it looks right" in a
screenshot lands in the wrong place. Instead:

1. Read `window.innerWidth`/`innerHeight` and the screenshot's reported
   dimensions, compute the real scale ratio.
2. Get each marker's real `getBoundingClientRect()` center, convert to
   screenshot-space coordinates using that ratio, and use those for
   `computer` hover/click actions.
3. Confirm via `document.querySelector(':hover')` chain (or
   `elementFromPoint` at the real, unscaled coordinate) that the actual
   `.ke-star-hover-dot` button — not just the image underneath it — is
   what's hovered.
4. Check `getComputedStyle(tooltip).opacity === '1'` for definitive proof
   the CSS `:hover` rule fired, then take a confirming screenshot.

## Extending to another image

1. Make sure you're plate-solving the clean, unlabeled source file (check
   `git log`/memory for whether a prior pass already baked text into it —
   if so, get a fresh unlabeled copy first, e.g. re-download from the
   original source rather than trying to reverse a lossy JPEG composite).
2. Run Phases 1-3, producing a small table of {name, mag, x_pct, y_pct}.
3. Hand-write the Phase 4 markup into the content file.
4. Verify per above before reporting done.
5. If the user wants this rolled out broadly (all gallery images), treat
   that as a real scope expansion to confirm explicitly, same as the
   zoom-and-pan skill's rollout rule — don't infer it from a single
   successful page.
