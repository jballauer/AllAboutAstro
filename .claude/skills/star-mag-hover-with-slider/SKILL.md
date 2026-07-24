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

A sibling skill, `star-mag-hover-with-slider-mag12`, does the exact
same thing but resolves down to magnitude 12 instead of 10, for a
richer/denser field — pick whichever depth fits the target image rather
than always defaulting to this one. The `StarMagnitudeSlider.astro`
component takes an optional `maxMag` prop (default 10) so both skills
share one component.

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
- **Pull `b.coo_qual` in the SELECT and exclude any row with `coo_qual = 'E'`.**
  Found on the M20 Trifid pilot: two rows from an old cluster-photometry
  catalog (`[SC96] GC 361`/`Mis 935`, `[SC96] GC 363`) had `coo_qual='E'`
  — SIMBAD's lowest quality tier, meaning the RA/Dec are rounded to
  ~0.001° (~3.6 arcmin), not measured astrometry — and both landed in
  empty space between stars when checked against the real pixel data,
  several tens of pixels from any actual point source. Every A/B-quality
  row checked on the same image landed exactly on a real star. Add
  `b.coo_qual` to the SELECT and drop `coo_qual='E'` rows before doing
  the pixel conversion, same as the existing `inFrame` filter — don't
  wait for Jay to spot a bad marker first.

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
  tagDx?: number;  // optional label-only nudge, px -- see "Fixing overlapping tags" below
  tagDy?: number;
}
interface Props {
  image: ImageMetadata;
  alt: string;
  imageWidth: number;
  imageHeight: number;
  stars: StarMarker[];
  maxMag?: number;  // default 10
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
  4. **Outline both the ring and the leader in black.** A bare gold
     (`#ffd54a`) ring/stem all but disappears against a blown-out,
     saturated white star core — Jay flagged this directly on the M20
     pilot. Fix: the ring gets both an inset and an outset black
     `box-shadow` (`inset 0 0 0 1px black, 0 0 0 1px black`) sandwiching
     the gold `border`, and the leader gets a black `box-shadow` flanking
     each side (`-1px 0 0 black, 1px 0 0 black`) so it reads as a 1px
     gold line inside a black bar. Gold stays the primary color for
     normal (unsaturated) backgrounds; black is what keeps it legible on
     a saturated one. Applies to every marker by default — not
     opt-in, no per-star flag needed.
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
*will* happen; see "Fixing overlapping tags" below rather than treating
it as unfixable).

## Fixing overlapping tags on a real close pair

Found on the M20 Trifid pilot: `HD 164492` and `EM* LkHA 123` are a
genuine ~5px-separated close pair (both real stars, not a `coo_qual`
dedup case), and their tags rendered directly on top of each other,
fully hiding one. `StarMarker` takes optional `tagDx`/`tagDy` (px, at
the frame's natural render width) that nudges **only the `.sms-tag` box**
— **the ring, and the leader connecting it to the tag, both stay exactly
on the star's real pixel position regardless of this offset; only the
label moves.**

Get this right the first time — there were two wrong attempts before
landing on the working design, both caught by Jay live rather than by
self-review:

1. Applying the offset to a wrapper spanning both the leader *and* the
   tag, which detached the leader from its own ring (the stem floated
   off toward the relocated tag instead of connecting to anything) —
   "the LkHA 123 stem looks broken."
2. Fixing that by making the leader a plain, unshifted, always-vertical
   sibling of the ring — better, but a fixed vertical stem obviously
   can't reach a tag that's been moved sideways; it just dangles
   straight down next to a tag that's no longer below it — "I think
   it's because your leaders are all vertical... you need a way for
   such labels to draw the leader from the text box to the side of the
   ring."

**The actual fix: compute the leader's length and angle at build time
so it always points from the ring to wherever the tag ends up**, offset
or not. The component's frontmatter has a `leaderGeometry(s)` helper:
with `dx = tagDx ?? 0` and `dy = 7 + (tagDy ?? 0)` (7 is the base
ring-to-tag gap with no offset), `length = Math.sqrt(dx*dx + dy*dy)` and
`angleDeg = Math.atan2(-dx, dy) * 180 / Math.PI`. The leader renders as
an absolutely-positioned 1px bar anchored at the ring's exact bottom
edge (`top: 5px` in the marker's local coordinate space — the ring's
own centering trick puts its bottom edge there), with
`transform-origin: top center` so it pivots at the ring end, and a
per-marker inline `height`/`rotate()` from that helper. With no offset
this reduces to a 0°-rotated 7px vertical bar — pixel-identical to the
original design, confirmed via `getComputedStyle().transform` showing
an identity-ish matrix (`matrix(1,0,0,1,-0.5,0)`) on unoffset markers.
`.sms-tag` needs an explicit `margin-top: 7px` to reproduce the gap the
leader used to provide implicitly through flow, since the leader is now
`position: absolute` (out of flow).

Don't reach for a simpler-looking shortcut here (a fixed-angle diagonal,
a CSS-only skew, an SVG `<line>` per marker) — the trig approach handles
any `tagDx`/`tagDy` combination correctly including the zero case, and
was verified to sub-pixel precision by reconstructing the leader's
rendered tip position (via its `DOMMatrix` and `transform-origin`) and
confirming it lands within ~0.3px of the tag's actual `getBoundingClientRect()`
top-center.

Apply the offset to one marker in a colliding pair (leave the other at
0,0), pick a value large enough to clear the other tag's width (~60-80px
horizontal is usually enough for these tags' width), and re-check with a
screenshot at the slider value where both first appear together —
specifically confirm (via `getBoundingClientRect()`) that the leader's
bottom edge still meets the ring's bottom edge, not just that the tags
no longer overlap. Comment the data entry explaining it's a real pair,
not a dedup miss, so a future editor doesn't "clean it up" by merging
them.

This is a real fix, not a workaround to avoid — don't leave overlapping
tags unfixed by default just because the base skill once called this an
"accepted limitation." Reach for `tagDx`/`tagDy` whenever a genuine
collision surfaces (Jay noticing one, or your own density check at
step above).

**Also verify markers land on real stars before calling it done — don't
rely on the WCS math being right just because it compiled.** The `coo_qual`
filter above catches known-bad catalog positions, but confirm the pixel
math itself against the actual image too (a bad WCS constant or an
orientation flip would pass the `coo_qual` filter and still be wrong):

1. Using `sharp` (already a project dependency — run any scratch script
   from the repo root so it resolves), crop a small (~60px) region of
   the *source* image centered on each of the 2-3 brightest computed
   marker positions, upscale 4-6x with `kernel: 'nearest'` so individual
   pixels are visible, and composite a red crosshair SVG at the exact
   target pixel.
2. `Read` each crop. A correct position lands the crosshair dead-center
   on an obvious point source (ideally one bright enough to show
   diffraction spikes). If it lands in a gap, on nebulosity, or offset
   from the nearest star, something's wrong — recheck the WCS constants,
   the row/column orientation (see `star-magnitude-hover`'s Phase 2
   verification note), or that specific catalog row's `coo_qual`.
3. Spot-check a few faint/borderline ones too, not just the brightest —
   the brightest stars are the least likely to expose an orientation or
   scale bug (they're easy to eyeball-confirm even when slightly off).
4. Do this *before* reporting the slider done, not just when the user
   flags a marker as looking wrong.

## Known limitations (surfaced during the pilot)

- **Co-located binaries produce overlapping tags** at high slider values
  (two SIMBAD entries a few arcseconds apart land on nearly the same
  pixel) — **now fixable** via the per-marker `tagDx`/`tagDy` offset, see
  "Fixing overlapping tags on a real close pair" above (built on the M20
  Trifid pilot after Jay flagged `HD 164492`/`LkHA 123` overlapping).
  Didn't need it on the original M45 pilot image (37 stars stayed legible
  without it) — apply the offset only to markers that actually collide,
  don't pre-emptively nudge every close pair.
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
