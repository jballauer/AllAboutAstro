---
name: deep-sky-marker-slider
description: Add a magnitude-depth slider that labels real catalogued objects visible in a deep-sky photo — companion galaxies, HII (emission-nebula) regions, globular clusters, star clouds/associations, or a mix — revealed brightest first as the slider is dragged, with fully automatic client-side label placement (no per-marker manual offset tuning needed). Plate-solve the image via astrometry.net, identify/cross-match objects against SIMBAD (by type: otype='HII', otype='GlCl', or by name for known companion galaxies/star clouds), pull magnitudes from SIMBAD or NED, then render via the DeepSkyMarkerSlider.astro component. Use when the user wants named deep-sky objects labeled on a photo with a slider control, or asks for "reference" on visible structures/companions/clusters in an image. Started 2026-07-30 as hii-region-hover (M33), generalized to deep-sky-marker-slider (M31), rolled out to the Markarian Chain in Virgo (grew to 35 galaxies across follow-up rounds, hero upgraded to zoom-and-pan with the slider moved to a second copy), then gained a real collision-avoiding auto-layout engine on 2026-07-31 replacing all hand-tuned tagDx/tagDy offsets — read the whole history below before assuming this is HII-region-only, always-a-second-copy, or needs manual label tuning.
---

# Deep-sky marker slider

A magnitude-depth slider (native `<input type="range">`) that reveals
labels for real catalogued objects in a deep-sky photo as it's
dragged, brightest first, cumulatively. Component:
`src/components/DeepSkyMarkerSlider.astro`, a sibling to
`StarMagnitudeSlider.astro` (same `bucket <= sliderValue` cumulative-
reveal design) but general-purpose across object **types** — galaxies,
HII regions, globular clusters, star clouds, or any mix on one chart —
rather than only point-source stars. Read `star-magnitude-hover`'s
SKILL.md first for the plate-solve/WCS math; this file covers what's
different for labeling non-stellar objects.

**History, so you don't re-derive or misjudge scope:**
1. Built 2026-07-24-ish as `star-magnitude-hover`/`star-mag-hover-with-slider`
   for point-source stars (see those skills).
2. 2026-07-30: built as `hii-region-hover` for M33 — hover tooltips
   naming 5 HII regions, reusing `.ke-star-hover*` CSS directly.
3. Same session: Jay converted it to a slider (`hii-region-slider`) —
   hover wasn't discoverable, and he wanted brightness-ordered reveal.
   New component, new magnitude-sourcing problem (SIMBAD has no HII
   magnitudes; used NED instead).
4. Same session: Jay asked for the same mechanism on M31 Mosaic, but
   labeling **companion galaxies, HII regions, globular clusters, AND
   star clouds together** — not HII-only. The component and skill were
   generalized at this point: `HiiRegionSlider.astro` →
   `DeepSkyMarkerSlider.astro`, marker shape gained an optional `kind`
   label and a nullable `mag` (paired with an explicit `bucket`
   override for objects with no citable point magnitude), and a
   `step` prop for when a dataset's magnitudes cluster too tightly for
   whole-integer buckets to stagger them.
5. 2026-07-30: rolled out to the Markarian Chain in Virgo (8 named
   Messier/NGC galaxies: M84/86/87/88/89/90/91, NGC 4571), this time
   **attached directly to the hero image** per Jay's explicit request
   ("attach it to the hero image, not as a separate image") rather
   than a second copy of the photo further down the page. This only
   works because that hero isn't a `ke-zoom-inframe` image — see the
   updated placement rule below. Later the same day, extended to 35
   markers via a deep magnitude pull, then the hero was upgraded to
   zoom-and-pan and the slider moved to a second copy (see the
   placement-rule section for both).
6. 2026-07-31: replaced hand-tuned `tagDx`/`tagDy` on every marker with
   a real **automatic label-placement engine** (candidate-search +
   collision-avoidance, runs client-side) after manually de-overlapping
   Markarian's 35 markers took ~9 rebuild-and-recheck rounds — see the
   "Automatic label placement" section below. Also fixed a real
   misidentification bug this surfaced: a marker Jay flagged as
   missing (NGC 4402, ~12th mag, "just above M86") turned out to have
   been swapped for an unrelated ~4px-away fainter background galaxy
   during an earlier too-tight-radius cone search — always widen the
   search radius and re-verify by crosshair crop when a "missing
   object" report doesn't match what a search returns.

If asked for "the HII region thing" or "the star-labeling slider" on a
new image, build **this** generalized component directly — don't
recreate the HII-only or hover-only versions.

## Deciding what to include

Ask what categories of object the user wants (companions, HII regions,
globulars, star clouds, something else) if it's not stated — M31's ask
was explicit ("other 2 messier objects, any listed HII regions, and
any known globulars"), which is what made the multi-type design
necessary. For each category:

- **Companion/nearby galaxies**: usually already known by name (check
  the plate-solve's own `objects_in_field` response — it names bright
  galaxies directly, e.g. `M 32`/`M 110` for M31). Query by name via
  `sim-script` for RA/Dec + V magnitude.
- **HII regions**: SIMBAD TAP, `otype='HII'`, cone search on the
  plate-solve's field. Very dense (M33: 936 rows; M31: 3,778 rows) —
  curate to entries with a genuine NGC/IC designation, queried
  **individually by name** (not by string-filtering bulk cone-search
  results — a named region's cone-search `main_id` can be a cross-ID
  from an unrelated catalog, e.g. M31's NGC 592 came back as
  `VGHC 2-22`). If none of the bulk results have a recognizable NGC/IC
  name (M31's case — all 3,778 were survey-only designations), check
  whether a well-known non-HII-typed object fills the same visual
  role (M31: NGC 206, SIMBAD-typed "Association", not "HII" — see
  below on how to handle its missing magnitude) rather than forcing a
  technically-HII label onto something that isn't one.
- **Galaxy otype filter is a curated guess, not exhaustive — expect to
  miss real ones.** Markarian Chain's deep pull filtered SIMBAD's
  cone-search results to a specific otype list (`G`, `GiG`, `GiP`,
  `GiC`, `Sy1`, `Sy2`, `AGN`, `LIN`, `LSB`, `BiC`, `rG`, `SBG`) that
  missed `H2G` (a real, fairly bright NGC galaxy — NGC 4459, mag
  11.32 — used exactly this otype) entirely, because that code wasn't
  anticipated. When Jay flags a visible smudge with no marker near
  it, don't assume it's just another too-faint dropped candidate —
  compute its RA/Dec via the inverse WCS transform (invert the same
  gnomonic+CD-matrix math used for RA/Dec→pixel, see the component's
  own frontmatter for the forward form) and run a plain
  `CONTAINS(POINT..., CIRCLE...)` cone search with **no otype filter
  at all** around that exact spot — the real object's otype tells you
  what to add to the filter list next time, rather than guessing.
- **Globular clusters**: SIMBAD TAP, `otype='GlCl'`, also very dense
  (M31: 629 rows). Try named/famous ones first by direct query (e.g.
  M31's G1/Mayall II) — **but verify they're actually within the
  plate-solved field's radius before trusting the name recognition**;
  a famous cluster can be well outside a specific image's framing (G1
  is ~2.5° from M31's center, well outside a ~1.2°-radius mosaic
  field, so it was silently absent from that particular photo). If no
  famous ones are in-frame (M31's case), fall back to a magnitude-
  sorted query (`SELECT ... FROM basic b JOIN flux f ON f.oidref=b.oid
  WHERE ... AND b.otype='GlCl' AND f.filter='V' ORDER BY vmag ASC`,
  note the `ORDER BY` must use the select alias not a qualified column
  — see `star-mag-hover-with-slider`'s SIMBAD gotcha) and take the
  brightest N that verify against real pixel data (below) — they'll
  likely have only survey-catalog names (M31: "Bol ###", Bologna
  catalog), which is fine, same as unnamed-star fallback elsewhere.
- **Star clouds/associations**: SIMBAD may type these `Association`,
  not `HII`, even when they're exactly what a viewer would call an
  "HII region" colloquially (M31's NGC 206). Label them with their
  real SIMBAD type as the `kind` field, don't relabel to `HII Region`
  just because that's what the user asked about — see the missing-
  magnitude handling below, since these objects often have none.

## Handling objects with no citable magnitude

Diffuse/extended objects (star clouds, some associations) often have
no point magnitude in SIMBAD or NED — confirmed by direct lookup, not
assumed. **Do not invent a plausible-sounding number.** Ask the user
how to handle it if the mechanism's whole point is brightness
ordering:

- Leave it out entirely.
- Give it its own always-visible marker outside the slider mechanic.
- Reveal it at an explicit `bucket` matching another real object it
  should visually accompany (M31: Jay chose this — NGC 206 reveals
  alongside M32/M110 via `{ mag: null, bucket: 8.1 }`, and the
  component's tag renders no "mag X" line at all when `mag` is
  `null`, never a fabricated value).

## Sourcing magnitudes — check SIMBAD first, NED as fallback

- **Point-source-like objects** (galaxies, most globulars): SIMBAD's
  `flux` table usually has a real V magnitude — query via `sim-script`
  (`%FLUXLIST(V)`) for named objects, or a TAP join (`basic` + `flux`,
  `filter='V'`) for a cone search.
- **HII regions**: SIMBAD has **no** usable flux data (confirmed
  directly on M33's 5 regions — every band came back as an empty `~`
  placeholder). Use NED instead: its "Quick-Look Photometry"
  `Magnitude and Filter` line (usually B-band), falling back to its
  detailed photometric-data-points table
  (`datasearch?search_type=Photo_id&objid=<id>&of=table`) for objects
  with a blank quick-look value (M33's IC 132) — pick a point-source
  measurement in the same band as the rest of the chart's other NED
  values, since mixing bands mid-chart would misorder the brightness
  reveal for objects with different color indices.
- **Objects with genuinely no data anywhere**: see "no citable
  magnitude" above — don't substitute a different band's value from a
  different source as if it were equivalent without flagging it.

## Verifying positions land on the real feature

Different verification approach per object type — a point source
(star, most galaxies/globulars) should show a clean dot/core at the
crosshair; a diffuse object (HII region, star cloud) should show
visible color/structure, not necessarily a sharp point:

1. Crop a region at the image's native resolution centered on each
   computed pixel position using `sharp` (already a project
   dependency) — use a **wide** crop (~400-500px) for a galaxy core,
   a **narrow** one (~120px) for a point-source globular/star, upscale
   for visibility, composite a red crosshair at the exact target
   pixel.
2. `Read` each crop. **If a computed position lands in a blank,
   overexposed, or otherwise empty-looking patch, don't ship it** —
   drop that candidate and verify the next-brightest one in the same
   category instead (M31: `Bol 127` computed to a position inside
   M31's overexposed core glow with no visible point source; dropped
   in favor of the 6th-brightest candidate, `Bol 218`, which verified
   cleanly). This is a real, expected outcome of automated brightness-
   sorted candidate selection near a bright, saturated galaxy core —
   budget for at least one rejection when picking globulars/point
   sources near a galaxy's center.
3. **A deep magnitude pull (V<=16) of an extended/diffuse type
   (galaxies especially) returns far more real catalogue entries than
   are actually visible in a given exposure.** Point-source depth
   (stars) doesn't transfer to diffuse-object depth — a real, correctly
   identified V=15 galaxy spreads its light over many pixels and can be
   genuinely invisible in a photo where a V=16 point-source star is
   easily seen, since surface brightness (not integrated magnitude)
   governs whether diffuse light clears the noise floor. Markarian
   Chain: a deep SIMBAD cone search returned 58 galaxy-type candidates
   in-field; only 21 beyond the 8 already-named ones verified as a real
   independently-visible smudge once crosshair-cropped (with a
   contrast boost for the faint end) — the rest were dropped, not
   shipped as markers pointing at blank sky. Don't skip this
   verification step just because a deep pull "should" be more
   thorough; more candidates from SIMBAD means *more* verification
   work, not less.
3. Confirm at least one object against independent corroboration where
   possible — the plate-solve's own `objects_in_field` naming it
   directly is the strongest signal.

## Component: `DeepSkyMarkerSlider.astro`

```ts
interface DeepSkyMarker {
  catalogName: string;
  mag: number | null;   // null for objects with no citable point magnitude
  bucket?: number;       // required when mag is null; optional override otherwise
  kind?: string;          // e.g. "Galaxy", "Globular Cluster", "Star Cloud", "HII Region"
  x: number;
  y: number;
  tagDx?: number; tagDy?: number;  // optional PIN override -- see "Automatic label placement" below. Omit for normal markers; the layout engine positions them.
}
interface Props {
  image: ImageMetadata;
  alt: string;
  imageWidth: number;
  imageHeight: number;
  markers: DeepSkyMarker[];
  step?: number;   // bucket granularity, default 1 -- see below
  minMag?: number; // override the computed resting/floor value
  maxMag?: number; // override the computed max/ceiling value
  hires?: string;  // path to a genuine hi-res file -- see below
}
```

- **`hires`**: when set, the frame keeps the site's default fullscreen
  click-to-zoom lightbox (and a "Click to Zoom" hint below the chart)
  instead of the usual `no-lightbox` treatment. This is safe to combine
  with the slider because that lightbox is a full-page modal overlay,
  not an in-place CSS transform — it doesn't move or resize the inline
  image, so the percentage-positioned markers never drift out of
  alignment the way they would under `ke-zoom-inframe`. Omit `hires`
  (the default) to keep the chart slider-only with no zoom affordance,
  same as before this prop existed.

- **`step` matters when a dataset's real magnitudes cluster within one
  whole magnitude of each other.** M31's five globular candidates
  spanned only 14.168-14.682 mag — with the default integer-bucket
  step (1), `Math.ceil()` collapses all five into the *same* bucket
  (15), destroying the brightness ordering entirely (they'd all
  appear simultaneously instead of staggered). Pass `step={0.1}` in
  that case; the component recomputes bucket rounding, the resting
  floor, the max ceiling, and the slider's `step` attribute all
  consistently from it. Datalist tick marks still only render at
  whole-number positions regardless of `step`, to avoid a visually
  cluttered control — the slider itself still moves in `step`
  increments between them.
- **`bucket` on a marker overrides the computed-from-`mag` value** —
  use it to co-locate a magnitude-less object's reveal point with a
  real object's (see NGC 206 above), or to manually force any other
  object's reveal position for a documented reason. Always required
  when `mag` is `null` (no fallback default — an object with no
  magnitude and no explicit bucket has nowhere sensible to appear).
- Image is wrapped in `.no-lightbox` (skips `BaseLayout.astro`'s
  runtime `.ke-zoomable` class/cursor entirely) plus an explicit
  `cursor: default` in the component's own CSS — this chart is
  slider-driven only, never click-to-zoom.
- **Never overlay this on a `ke-zoom-inframe` hero** (see the
  `zoom-and-pan` skill) — that mechanism live-transforms the image via
  CSS `scale()`/`translate()` on click/hover, but this slider's
  percentage-positioned markers don't share that transform and would
  drift out of alignment once zoomed. On a `ke-zoom-inframe` page,
  render the slider on a **second copy of the same photo** further
  down the page instead, with its own short heading (e.g.
  `### Objects in this Image`) and one-line intro (M31, M33).
- **On a plain hero with no click-to-zoom of any kind, it can attach
  directly to the hero itself** instead of adding a second copy. Do
  this the same way the existing `StarMagnitudeSlider` hero pages
  work: add an `entry.id === '<slug>'` branch in
  `src/pages/gallery/[slug].astro` that renders
  `<DeepSkyMarkerSlider image={entry.data.image} ... />` in place of
  the plain `<Image>`. `imageWidth`/`imageHeight` must be the same
  1000-wide render dimensions the plain-`<Image>` branch would have
  used (`Math.round(1000 * nativeHeight / nativeWidth)` for the
  height) since marker `x`/`y` are pixel coordinates at that render
  size, not the source image's native resolution — plate-solve and
  verify against the native file, then scale the resulting pixel
  positions by `1000 / nativeWidth` before writing them into the
  marker array.
- **If the hero later gains a hires image and Click-to-Zoom (or
  Click-to-Zoom-and-Pan), move the slider off the hero.** The plain
  fullscreen lightbox *can* coexist with the slider on the same image
  (see the `hires` prop above), but `ke-zoom-inframe` cannot — and
  Jay upgraded Markarian Chain from "hero-attached slider" to
  "zoom-and-pan hero + slider on a second copy" in the same session
  this rule was first written, which is exactly the scenario the
  earlier revision of this doc didn't anticipate. When that happens:
  convert the `.md` to `.mdx`, move the `markers` array and the
  `<DeepSkyMarkerSlider>` call into the content file (same as the
  MDX/second-copy pattern below), delete the `entry.id === '<slug>'`
  branch and its marker data from `[slug].astro` entirely, and add
  the slug to the `isInFrameZoom` boolean per the `zoom-and-pan`
  skill. Don't leave stale marker data sitting unused in
  `[slug].astro` after moving it — delete it, don't comment it out.
- **Requires MDX** only for the *second-copy* placement, since that's
  a real interactive component embedded *mid-content*, not something
  `[slug].astro`'s branch-by-`entry.id` pattern can inject at an
  arbitrary point in rendered markdown. Convert the target `.md` to
  `.mdx` (gallery collection's loader already globs both) and follow
  the precedent in
  `src/content/learning/great-american-solar-eclipse-2024.mdx`:
  `import DeepSkyMarkerSlider from '../../components/DeepSkyMarkerSlider.astro'`
  plus an `export const someMarkers = [...]` block, then
  `<DeepSkyMarkerSlider markers={someMarkers} ... />` inline in the
  body wherever it belongs. Reuse the page's own hero image file via
  a second `import` if the chart is a second copy of that photo.

## Automatic label placement

Don't hand-tune `tagDx`/`tagDy` per marker — the component does this
itself, client-side, and it's what makes a dense field (dozens of
close-together markers) usable without per-image manual iteration.
Author markers with just `x`/`y` (and `mag`/`kind`/etc); leave
`tagDx`/`tagDy` unset unless you genuinely need to pin one.

**How it works** (in the component's `<script>` block, function
`layoutLabels`): for every marker, in array order (so brightness-first
authoring order doubles as placement priority), search a ring of
candidate tag positions at increasing radius and 16 angles around it.
A candidate is accepted only if it (a) stays within the frame's own
bounds, (b) doesn't cover **any** other marker's ring — labeled,
unlabeled, or not yet revealed by the current slider position, doesn't
matter, since the layout is computed once for the full (all-visible)
set — and (c) doesn't overlap any tag already placed for a
higher-priority marker. Among valid candidates at the closest usable
radius, it further prefers the one whose leader line threads past the
fewest other rings. If literally nothing satisfies (b)+(c) — a
maximally packed cluster — it falls back to the least-overlapping spot
that still respects (b), so a marker is never placed on top of an
unrelated object even under extreme density.

**Constraint (b) checks every ring, including the marker's own.** The
first version of this engine excluded self from the ring-clearance
check, on the assumption that a tag sitting near/over its own target
was fine — Jay corrected this immediately: "the target should exist
with the target clearly visible," i.e. a label must never cover the
very object it names either, not just avoid other labels/objects. Any
future edit to `ringClear()` must keep checking every marker
(including `i` itself), not just the others.

**Why computing against the full set (not the currently-revealed
subset) is correct and sufficient**: a non-overlapping layout for the
complete marker set is automatically non-overlapping for any subset of
it too. So one computation at page load covers every slider position
from rest to max — no need to recompute as the slider moves, and it's
what makes "all labels clearly shown even at max density" hold
directly, matching what Jay asked for rather than something that only
happens to look right at whatever density you tested.

**Re-runs**: once on initial page load, again once `document.fonts.ready`
resolves (a webfont swap after first paint would otherwise leave stale
measurements), and on window `resize` (debounced ~200ms) — the search
operates in actual rendered CSS pixels via `getBoundingClientRect()`,
not the logical 1000-ish px coordinate space markers are authored in,
so a responsive width change genuinely changes the geometry and needs
a fresh pass.

**The `tagDx`/`tagDy` pin escape hatch**: set either one on a marker to
place its tag at an exact fixed offset instead of running the search
for it. Use this for a case the algorithm can't judge well on its own
— most commonly co-locating a magnitude-less marker's label with the
real object it should visually accompany (M31's NGC 206 pattern). A
pinned marker's final tag box still counts as an obstacle when placing
every other (auto-placed) marker, so it won't get silently covered.
M31 and M33's existing hand-authored `tagDx`/`tagDy` values from before
this engine existed still work as pins and don't need to be removed.

**Verifying it worked** — same DOM-measurement approach as before, but
now you're confirming the algorithm's output rather than hand-iterating
toward it:
```js
const input = document.querySelector('.dsm-input');
input.value = input.max;
input.dispatchEvent(new Event('input', { bubbles: true }));
// then getBoundingClientRect() + pairwise AABB overlap over every
// .dsm-tag, same script as documented in "How to verify" below --
// should return zero collisions with no manual intervention.
```
If it doesn't, that's a real bug in the algorithm (or in the frame's
actual rendered dimensions vs. what was assumed), not something to
patch around with a manual `tagDx`/`tagDy` — fix the search/scoring
logic in the component instead, since this is meant to work
zero-config on any future image, not just the ones already rolled out.

## How to verify the rendered slider

1. **Brightness ordering**: dispatch `input.value = String(v)` + an
   `input` event across the full range (respecting `step`), confirm
   the cumulative visible set matches sorting markers by effective
   bucket ascending — not just that *something* appears at each step.
2. **Resting state**: at `value === min`, zero markers visible,
   readout reads "Normal image."
3. **No-magnitude markers**: confirm the specific marker's tag has no
   `.dsm-mag` element, and that it appears at its intended `bucket`
   alongside whatever it's meant to co-locate with.
4. **Cursor/zoom**: `getComputedStyle(img).cursor === 'default'` and
   the image never gains `.ke-zoomable`.
5. A confirming screenshot at max density is useful for eyeballing tag
   legibility/overlap — a close pair (M31: `Bol 225`/`Bol 218`, ~33px
   apart) can stack tags tightly without necessarily overlapping;
   check the actual rendered text (not just a quick screenshot glance,
   which can misread small stacked text) before assuming a `tagDx`/
   `tagDy` nudge is needed.
6. **De-overlapping a dense cluster is now the layout engine's job, not
   yours** — see "Automatic label placement" above. Just confirm it
   actually reached zero collisions on the specific image (the
   algorithm can still fall back to an overlapping "least-bad" spot on
   a genuinely maximally-packed cluster): the `getBoundingClientRect()`
   pairwise-AABB-overlap script there. If it doesn't reach zero,
   that's a real bug worth fixing in the component's search/scoring
   (radius steps, angle count, ring-exclusion radius), not something
   to patch with a per-marker `tagDx`/`tagDy` on this one image —
   fixing it in the algorithm keeps the component genuinely zero-config
   for the next image and the next person who uses it.
7. Also confirm no tag covers **any** marker's ring, including its
   own: compare every tag's bounding box against every marker's dot
   center (self included), should be zero hits.

## Apply only on request

Same rule as every sibling skill here: a deliberate, per-image
extension of a finished mechanism, not a default to roll out to every
gallery/nebula/galaxy image proactively.
