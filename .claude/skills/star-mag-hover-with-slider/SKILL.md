---
name: star-mag-hover-with-slider
description: Add a magnitude-depth slider (0-10) below an astrophoto that progressively reveals star labels (common name, catalog name, apparent magnitude, spectral type) as it's dragged — a slider-driven sibling of the star-magnitude-hover skill, meant for an article's main/hero image. Use when the user wants to control "how many stars show" via a slider or similar depth control, rather than one-at-a-time hover reveal. Piloted 2026-07-24 on the Pleiades (M45) Mosaic hero image (37 stars down to mag 10) — read this before re-deriving the plate-solve/catalog pipeline (shared with star-magnitude-hover) or reinventing the slider mechanics.
---

# Star-magnitude slider

Same underlying astrometry as `star-magnitude-hover` (plate-solve +
catalog cross-match), different interaction: instead of one tooltip per
hover, a single `<input type="range">` below the image controls how many
stars are labeled **at once**, from 0 (plain image, nothing shown) up to
10 (every catalogued star down to magnitude 10 in frame, all labeled
simultaneously). **This requires real JS** (a component with its own
`<script>`, following the `PhotoCarousel.astro` pattern) — unlike
`star-magnitude-hover`, this is not CSS-only, since visibility depends on
a live numeric comparison against the slider's current value.

Read `star-magnitude-hover`'s SKILL.md first for the plate-solve/WCS
math (Phases 1-2) — this skill only covers what's different: the catalog
query (broader, magnitude-limited, not just named stars) and the slider
UI/component.

## The slider's semantics — get this exact, it's easy to get subtly wrong

- **0 = the plain, unmarked image.** Not "stars ≤ mag 0" (which would
  usually also be empty, but 0 must be an explicit special case in code,
  not an accident of no stars being that bright — a future field
  might contain a genuinely 0-or-brighter star).
- **Slider value N (1-10) shows every star with real magnitude ≤ N** —
  compare the star's actual (unrounded) magnitude directly against the
  slider's integer value; do not pre-round each star to its own bucket
  and compare buckets to buckets. In practice: `bucket = Math.ceil(mag)`,
  marker visible when `bucket <= sliderValue`. A mag-1.8 star gets
  bucket 2 and first appears when the slider reaches 2 — confirmed
  against Jay's own worked example before building this.
- Labels **stack cumulatively** — dragging from 5 to 6 must not hide the
  5 stars already showing, only add the mag-6 ones. The reference
  implementation just re-evaluates all markers on every `input` event
  (cheap even at ~40 markers) rather than tracking a delta, which
  trivially guarantees this.
- The image must look **completely normal at 0** — same "don't deface
  the presentation image" requirement as `star-magnitude-hover`.

## Catalog query — broader than star-magnitude-hover's named-star lookups

`star-magnitude-hover` only needed ~10 stars it already knew the names
of, so per-name SIMBAD queries were enough. This skill needs **every**
star in the field down to the slider's max magnitude, named or not, so
it needs a real cone search. Full working query in
`references/slider-workflow.md`. Key points:

- **VizieR's classic ASU cone-search endpoint
  (`vizier.cds.unistra.fr/viz-bin/asu-tsv`) silently returned zero rows**
  for a plain coordinate cone search on `I/239/hip_main` during
  development, even though direct `HIP=<number>` lookups on the same
  table worked fine and object-name resolution (`-c=M45`) worked fine —
  never got to the bottom of why, possibly this VizieR mirror's
  positional index misbehaving for that table. **Don't burn time on it
  again** — go straight to the working alternative:
- **SIMBAD's own TAP/ADQL endpoint** (`simbad.cds.unistra.fr/simbad/sim-tap/sync`)
  works well: join `basic` and `flux`, filter `flux.filter='V'`, a
  `CONTAINS(POINT(...), CIRCLE(...))` cone, `flux.flux <= <mag limit>`,
  `ORDER BY vmag ASC` (using the **select alias**, not the qualified
  `f.flux` — SIMBAD's ADQL parser rejects a dotted column reference in
  `ORDER BY` specifically, even though the same expression is fine in
  `WHERE`/`SELECT`). Returns `main_id`, `ra`, `dec`, `sp_type`, and the
  V magnitude in one shot — everything needed except common names.
- **Common names aren't in this data.** Most rows come back as HD
  numbers, Flamsteed/Bayer designations (`main_id`), or variable-star
  names (`V* ...`) — genuinely no informal name exists for the vast
  majority of stars down to mag 10. Map the handful you already know
  (e.g. from a prior `star-magnitude-hover` pass on the same object) to
  their common names by hand; leave `commonName: null` for everything
  else and fall back to displaying the catalog name alone. Don't invent
  or guess a common name.
- Field radius for the cone search comes from the plate-solve
  calibration response's `radius` field (degrees) — same solve you're
  already doing for Phase 2's WCS.

## Component: `StarMagnitudeSlider.astro`

Self-contained (own `<style>`/`<script>`, not relying on `BaseLayout`'s
global CSS/JS) — same pattern as `PhotoCarousel.astro`. Props:

```ts
interface StarMarker {
  commonName: string | null;
  catalogName: string;
  mag: number;
  specType: string;
  x: number;  // native pixel position, from the WCS math
  y: number;
}
interface Props {
  image: ImageMetadata;
  alt: string;
  imageWidth: number;
  imageHeight: number;
  stars: StarMarker[];
}
```

- Marker positions are percentages of the image box (`x/imageWidth*100`,
  same reasoning as `star-magnitude-hover`), computed once in the
  template, not by JS at runtime.
- **The marker itself must land exactly on the star, and the star must
  stay visible after labeling** — Jay's explicit correction after the
  first version. Two mistakes to not repeat:
  1. Don't `transform: translate(-50%, -50%)` the whole dot+tag block —
     that centers the *block* on the star's coordinate, which pushes the
     dot off-point and can bury the star under the tag. Only
     horizontally center the block (`translateX(-50%)`); let the ring's
     own negative top margin (`margin: -5px auto 0` for a 10px ring)
     pull just the ring itself up so its center — not the block's top
     edge — sits exactly on the star.
  2. Don't use a filled dot. Use a small hollow ring (`border`, no
     `background`) so the star shows through the middle even while
     marked. Verify with `getBoundingClientRect()` on the ring itself
     (not the wrapping marker span) against the expected pixel from
     `imageWidth/Height * style.left/top` — should match to sub-pixel
     precision.
  3. Connect ring to label with a short leader (a plain 1px-wide
     coloured div, ~7px tall, between them) rather than butting the tag
     directly against the ring — gives separation so the tag's
     background box doesn't creep over the star at high marker density.
- Visibility is a plain `data-visible` attribute the script adds/removes
  per marker on every `input` event — simplest thing that works at this
  scale (~40 markers); don't reach for a class-toggle framework or CSS
  custom-property trick unless a future pilot needs hundreds of markers.
- Native `<input type="range" list="...">` + a `<datalist>` with one
  `<option>` per integer 0-10 gives free tick marks at each whole
  magnitude — no custom slider widget needed. This was flagged upfront
  as something that "we can add if needed" — it turned out to be a
  zero-cost native HTML feature, use it from the start rather than
  waiting to be asked.
- Each visible marker shows: common name (bold, or the catalog name if
  no common name exists) → catalog name (small, italic, only shown
  *alongside* a common name — don't show it twice when there's no common
  name) → magnitude → spectral type. Keep the tag font small (~0.6-0.7rem)
  since dozens can be on-screen at once — this is not the
  `star-magnitude-hover` tooltip's roomier single-target styling.

## Wiring into a page

Follow the existing per-entry special-case pattern in
`src/pages/gallery/[slug].astro` (same one used for `ke-zoom-inframe` on
`m31-mosaic` and the `PhotoCarousel` on the eclipse page): branch on
`entry.id`, pass `entry.data.image` directly as the `image` prop (it's
already an `ImageMetadata` from the content collection's image()
schema — no separate import needed), and hardcode the star array as a
module-level constant in `[slug].astro` (see the file for the exact
shape) rather than a separate data file, matching how `hiresMap` and the
eclipse photo array are already handled there.

## How to verify

Same screenshot-space-vs-real-CSS-pixel-space caveat as
`star-magnitude-hover` applies if you need to click/drag the slider via
the `computer` tool. Simpler and more reliable for this component:
dispatch the value change directly —

```js
const input = document.querySelector('.sms-input');
input.value = '5';
input.dispatchEvent(new Event('input', { bubbles: true }));
```

then check `markers.filter(m => m.hasAttribute('data-visible')).length`
matches the expected cumulative count for that value, and take a
screenshot to eyeball label legibility/overlap at that density. Test at
least: 0 (must show zero markers, plain image), a middle value, and 10
(worst-case density — check for overlapping tags on close pairs/binaries,
e.g. two catalog entries sharing almost the same pixel position, which
*will* happen and is a known, accepted limitation, not a bug to fix
reflexively).

## Known limitations (surfaced during the pilot, not yet solved)

- **Co-located binaries produce overlapping tags** at high slider values
  (two SIMBAD entries a few arcseconds apart land on nearly the same
  pixel). Didn't need fixing on the pilot image (37 stars stayed legible
  enough), but a denser field could need per-marker manual offset
  nudging, or collision-avoidance layout — not built yet.
  don't build this speculatively — wait until a real image needs it.
- Only tested down to mag 10 on a modest ~0.6°-radius field (37 stars in
  frame). A wider or richer field could return hundreds of catalog
  entries at mag 10 — if a future target image's cone search returns an
  unreasonable count, surface that to Jay rather than silently rendering
  a wall of overlapping labels.

## Apply only on request

Same rule as `star-magnitude-hover`: this is a deliberately separate,
finished mechanism from that skill (different interaction model, same
astrometry underneath) — don't merge them, don't add the slider to a
page that already has hover markers without being asked, and don't roll
either out to more images proactively.
