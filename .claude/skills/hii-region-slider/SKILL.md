---
name: hii-region-slider
description: Add a magnitude-depth slider that reveals labels for the catalogued HII (emission-nebula) regions visible in a galaxy photo, brightest first — plate-solve the image via astrometry.net, cross-match against SIMBAD for otype=HII entries with a formal NGC/IC designation, pull real apparent magnitudes from NED, then render via a dedicated HiiRegionSlider.astro component (sibling to StarMagnitudeSlider.astro). Use when the user wants named HII regions labeled on a galaxy image with a slider control (not hover), or asks for "reference" on the pink/red regions in a galaxy photo. Piloted 2026-07-30 on the M33 Pinwheel Galaxy page (5 named regions: NGC 604, NGC 595, NGC 588, IC 132, IC 133) — started as a hover mechanism, converted to this slider same-day per Jay's explicit request (labels invisible until hovered wasn't discoverable enough; wanted brightness-ordered reveal instead).
---

# HII-region magnitude slider

Sibling mechanism to `star-mag-hover-with-slider`, reusing its
`ceil(mag) <= sliderValue` cumulative-reveal design, but for **extended
emission-nebula regions** (SIMBAD `otype='HII'`) instead of point-source
stars, via a dedicated `HiiRegionSlider.astro` component (own file, not
a reuse of `StarMagnitudeSlider.astro` — the marker shape needs no
`specType`/`commonName` fields, and the image must have zoom disabled,
both different enough to warrant a separate component). Read
`star-magnitude-hover`'s SKILL.md for the plate-solve/WCS math — this
file only covers what's different.

**History: this was originally built as a hover mechanism** (reusing
`.ke-star-hover*`, matching `star-magnitude-hover`'s interaction
model) — Jay converted it to a slider the same day because labels
invisible until moused-over weren't discoverable, and he wanted the
reveal ordered by real brightness. If asked for "the HII region thing"
on a new image, build the slider version directly — don't re-derive
the hover version first.

## What's different from star-mag-hover-with-slider

- **Catalog query**: SIMBAD's TAP/ADQL endpoint, filtering
  `otype='HII'` within a cone of the plate-solve's field center/radius.
  A galaxy's full HII-region catalog is typically **very dense** (936
  rows in M33's ~1°-diameter field) — do not label all of them. Curate
  down to entries with a genuine NGC/IC designation (queried
  individually by name, e.g. `NGC 604`) — the handful any reader might
  recognize. Fainter regions carry only survey-internal designations
  (BCLMP, LGGS, CPSDP, GDK99, RVP2013, HBW, etc.) — leave those
  unlabeled and disclose that in the caption, don't silently omit.
- **Query HII regions by name individually**, not by scraping the cone
  search for NGC/IC-prefixed `main_id` strings — a named region's
  cone-search `main_id` is often a cross-identification from a
  *different* catalog (e.g. NGC 592 resolves as `VGHC 2-22` in
  SIMBAD's `basic` table), so filtering bulk results by string pattern
  will silently miss real named regions. Query each candidate name
  individually (check the plate-solve's own `objects_in_field`
  response for candidates — it named `NGC 604`/`NGC 595` directly for
  M33) via the `sim-script` batch endpoint, requesting `%OTYPE` to
  confirm it resolves as `HIIReg` before trusting the coordinates.
- **SIMBAD has no usable magnitude for HII regions.** Confirmed
  directly on all 5 M33 regions — SIMBAD's `basic`/`flux` tables
  return empty `~` placeholders for every band. Use **NED** (NASA/IPAC
  Extragalactic Database) instead:
  `https://ned.ipac.caltech.edu/cgi-bin/objsearch?objname=<NGC+0604>&...&of=pre_text`
  (zero-pad NGC/IC numbers to 4 digits, e.g. `NGC+0604`) — its "Quick-Look
  Photometry" section has a `Magnitude and Filter` line (usually B-band
  for these). If that line is blank for a given object (happened for
  IC 132), fall back to its detailed photometric-data-points table
  (`datasearch?search_type=Photo_id&objid=<id>&...&of=table`, the
  `objid` comes from the object's own summary page) and pick a B-band
  point source measurement (e.g. `B (KPNO)`) instead — still real
  literature photometry, just a different aperture/survey than the
  quick-look value. **Use one consistent band (B) across all regions
  on the same chart** — mixing B and V mid-chart would misorder the
  brightness reveal for regions with different B−V colors.
- **Component**: `src/components/HiiRegionSlider.astro`, structurally
  parallel to `StarMagnitudeSlider.astro` (own `ceil(mag)` bucket
  system, `data-visible` toggling, hollow-ring+leader+tag marker
  shape) but: `HiiRegionMarker` is just `{catalogName, mag, x, y,
  tagDx?, tagDy?}` (no `specType`/`commonName`); slider `min`/`max`
  default to `floor(min mag) - 1` / `ceil(max mag)` (computed from the
  actual dataset, not a fixed 0-10/0-12 range like the star version,
  since HII region magnitudes for one field can cluster in a narrow
  band far from 0 — M33's five spanned only 11.5-16.6); the **resting
  state is `min`, not literally 0** — explicit `value <= restValue`
  check in the script, same "must be an explicit code branch, not an
  accident of the data" principle the star slider's own docs call out
  for its 0 case.
- **Zoom must be disabled on this chart's image, with a plain arrow
  cursor** — wrap the component's `<Image>` in a container with class
  `no-lightbox` (`BaseLayout.astro`'s global click-to-lightbox script
  skips `img.closest('.no-lightbox')`, so the runtime `.ke-zoomable`
  class — and its `cursor: zoom-in` CSS — never gets added). Don't
  rely on omitting a class alone; explicitly set `cursor: default` on
  the frame and image in the component's own `<style>` too, since a
  future ancestor rule could otherwise leak a different cursor in.
  Verify via `getComputedStyle(img).cursor === 'default'` and
  `!img.classList.contains('ke-zoomable')` after the page's onload
  script has run.
- **Placement: a secondary chart, never overlaid on a `ke-zoom-inframe`
  hero.** If the target image is also the page's zoomable hero (see
  the `zoom-and-pan` skill), do **not** place the slider directly on
  that same image — the zoom mechanism applies a live CSS
  `transform: scale()/translate()` on click/hover, but the slider's
  percentage-positioned markers are separate elements that don't share
  that transform, so they'd drift out of alignment once zoomed.
  Instead render the slider on a **second copy of the same photo**
  further down the page (reuse the existing image asset, no new file
  needed), with its own short heading (e.g.
  `### HII Regions in this Image`) and a one-line intro sentence.
- **Requires MDX, not plain Markdown**, since it's a real interactive
  Astro component embedded *mid-content* (between other markdown
  sections), not something `[slug].astro`'s branch-by-`entry.id`
  pattern can inject at an arbitrary point in the rendered body. If
  the target content file is `.md`, convert it to `.mdx` first (the
  gallery collection's loader already globs both extensions — check
  `src/content.config.ts` if unsure for a different collection) and
  follow the existing precedent in
  `src/content/learning/great-american-solar-eclipse-2024.mdx`:
  `import Component from '../../components/X.astro'` plus an
  `export const someData = [...]` block in the frontmatter-adjacent
  JS region, then `<Component prop={someData} />` inline in the body
  wherever it belongs. Image assets used by the component need their
  own `import name from './_images/foo.jpg'` too (can reuse the same
  file already referenced by the page's own `image:` frontmatter
  field for the hero, if this chart is a second copy of that photo).

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

## How to verify the rendered slider

Don't just eyeball a screenshot — the mechanism has real logic to
confirm:

1. **Brightness ordering**: dispatch `input.value = String(v)` +
   an `input` event for every integer from `min` to `max`, and confirm
   the cumulative set of visible catalog names matches manually
   sorting the region list by `mag` ascending, appearing at each one's
   `Math.ceil(mag)` bucket — not just that *something* appears at each
   step.
2. **Resting state**: at `value === min`, confirm zero markers have
   `data-visible` and the readout reads the "normal image" text, not
   an accidental first-region reveal.
3. **Cursor/zoom**: confirm `getComputedStyle(img).cursor === 'default'`
   and the image never gains the runtime `.ke-zoomable` class (see
   above) — check this after the full page script has run, not just
   by reading the component source.
4. A confirming screenshot at the slider's max value is still useful
   for eyeballing label legibility/overlap at full density, same as
   `star-mag-hover-with-slider`'s own verification step — just don't
   use it as the *only* check.

## Apply only on request

Same rule as `star-magnitude-hover`, `star-mag-hover-with-slider`, and
`zoom-and-pan`: this is a deliberate extension of an existing finished
mechanism, not a default to roll out to every gallery/nebula image
proactively. Apply it when Jay asks for HII-region (or similarly
named-substructure) labeling on a specific image.
