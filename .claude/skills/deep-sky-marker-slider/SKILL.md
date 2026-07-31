---
name: deep-sky-marker-slider
description: Add a magnitude-depth slider that labels real catalogued objects visible in a deep-sky photo — companion galaxies, HII (emission-nebula) regions, globular clusters, star clouds/associations, or a mix — revealed brightest first as the slider is dragged. Plate-solve the image via astrometry.net, identify/cross-match objects against SIMBAD (by type: otype='HII', otype='GlCl', or by name for known companion galaxies/star clouds), pull magnitudes from SIMBAD or NED, then render via the DeepSkyMarkerSlider.astro component. Use when the user wants named deep-sky objects labeled on a photo with a slider control, or asks for "reference" on visible structures/companions/clusters in an image. Started 2026-07-30 as hii-region-hover (M33, 5 HII regions, mouseover), same-day converted to hii-region-slider (brightness-ordered reveal), then generalized to deep-sky-marker-slider when rolled out to M31 Mosaic (2 companion galaxies, 1 star cloud, 5 globular clusters), then rolled out again to the Markarian Chain in Virgo (8 named Messier/NGC galaxies) attached directly to the plain (non-zoom) hero image itself rather than a second copy of the photo — read the whole history below before assuming this is HII-region-only or always-a-second-copy.
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
   updated placement rule below.

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
  tagDx?: number; tagDy?: number;  // same overlap-nudge mechanism as StarMagnitudeSlider
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
6. **De-overlapping a dense cluster (10+ markers close together, e.g.
   Markarian Chain's 35) needs actual DOM measurement, not mental math
   or eyeballing.** `tagDx`/`tagDy` are *raw CSS pixels applied at
   whatever width the frame is actually rendered at* (`getComputedStyle`/
   `getBoundingClientRect`, not the logical 1000px the marker
   coordinates were authored against) — trying to hand-compute two
   tags' post-offset positions from their `x`/`y` + `tagDx`/`tagDy`
   values doesn't reliably predict collisions or clearances (repeatedly
   wrong during Markarian's 35-marker cleanup: pushing a tag "150px
   right" against a neighbor computed as "should clear by 150+px" in
   practice landed 12px apart, because the actual rendered frame width
   differs from 1000 and every other marker's own translate is stacked
   into the same crowded region). Do this instead: dispatch an `input`
   event with `value = input.max` to reveal every marker, then run a
   `getBoundingClientRect()` pairwise-AABB-overlap script over every
   `.dsm-tag` and read back the exact list of still-colliding name
   pairs. Adjust only those, rebuild, re-run the same script — repeat
   until it returns an empty list. For a tag that keeps colliding with
   several neighbors no matter which direction it's nudged (it's
   boxed in on all sides in a genuinely crowded cluster), query the
   *actual* neighboring tag positions within e.g. a 250px radius (not
   just the colliding pair) to find real open space before choosing
   the next offset, and consider shortening an unusually long
   `catalogName` (a long survey ID makes the tag itself wide enough to
   collide with things a shorter name wouldn't reach) rather than only
   pushing it further away.

## Apply only on request

Same rule as every sibling skill here: a deliberate, per-image
extension of a finished mechanism, not a default to roll out to every
gallery/nebula/galaxy image proactively.
