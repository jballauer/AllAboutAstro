---
name: star-mag-hover-with-slider-mag16
description: Same magnitude-depth slider mechanism as star-mag-hover-with-slider and star-mag-hover-with-slider-mag12, but resolving the SIMBAD cone search down to apparent magnitude 16 -- for a hero image where even a mag-12 pull comes back too sparse to be visually interesting. Use when Jay asks for the slider even deeper than mag 12, specifically mentions magnitude 16, or when a mag-12 pull on a target image returns too few in-frame stars. Pick one depth (10, 12, or 16) per image, not more than one on the same image. Piloted 2026-07-30 on the Helix Nebula hero image, swapped in live over the page's mag-12 configuration (9 in-frame markers after dropping coo_qual='E' rows, vs. 6 at mag 12) -- notably pulled in NGC 7293's own central white dwarf star as a real, verified marker. Star density at this depth is field-dependent, not a fixed multiplier over mag-12/10 -- read this before assuming a marker-count jump or re-deriving the pipeline.
---

# Star-magnitude slider — mag 16

Identical mechanism to `star-mag-hover-with-slider` (and its mag-12
sibling, `star-mag-hover-with-slider-mag12`): same plate-solve + WCS
pixel math, same `StarMagnitudeSlider.astro` component, same cumulative
0-N reveal semantics. **Read `star-mag-hover-with-slider`'s SKILL.md
first** — this file only documents the deltas for going to a
magnitude-16 limit. Don't re-derive the shared plumbing (plate-solve
Phases 1-2, the cone-search query shape, the `coo_qual` filter, the
crosshair-crop verification step, the `tagDx`/`tagDy` overlap fix) — see
`star-mag-hover-with-slider`'s SKILL.md and, for the dedup requirement
that becomes important at depth, `star-mag-hover-with-slider-mag12`'s
SKILL.md.

## Why a separate skill instead of just passing a bigger number

Same reasoning as the mag-12 sibling: Jay picks the depth **per image**
rather than one skill silently escalating. Mag 16 is a meaningfully
different tool from mag 10/12, not just "more of the same" — see
"What's different" below. Keeping it a distinct, deliberately-invoked
skill keeps that choice explicit at the point of use.

## What's different from mag 12

1. **Cone-search mag limit is 16, not 12** — same ADQL query shape as
   the mag-12 skill's reference file, just `f.flux <= 16`.
2. **Don't assume a big jump in marker count.** Star density scaling
   with magnitude depth is *field-dependent*, not a fixed multiplier —
   the M20 Trifid pilot (mag 12) sits in a rich Milky Way field; the
   Helix Nebula pilot (mag 16, this skill) sits in a comparatively
   catalog-sparse patch of Aquarius well off the galactic plane. Going
   from mag 12 to mag 16 on the Helix field only added 3 markers (6 to
   9) — four whole magnitudes deeper for barely more stars, because
   there simply aren't many cataloged objects that faint in that patch
   of sky yet (SIMBAD's depth/completeness varies by sky region and
   survey coverage, not just by how faint a star intrinsically is).
   **Always run the actual query and look at the real count** — don't
   estimate or extrapolate from a different field's density before
   pulling the data. A rich low-galactic-latitude field could still
   return hundreds+ at mag 16; surface that to Jay before rendering if
   it does, same as the base skill's density guidance.
3. **`coo_qual='E'` rows become much more common at this depth.** The
   Helix pilot's mag-16 pull returned 20 raw rows; 8 of them (40%) were
   `coo_qual='E'` — all a block of `GEN# +9.272930XX` designations
   (quantized-position photometric-survey entries, not measured
   astrometry). The mag-10/12 pulls on other fields saw this
   occasionally; at mag 16 it's the norm, not the exception. The
   existing rule stands unchanged: drop every `coo_qual='E'` row before
   the pixel-conversion step, don't wait for a bad-looking marker to
   notice.
4. **You may pull in the imaged object's own central/embedded star(s).**
   The Helix pilot's mag-16 cone search returned `NGC 7293` itself —
   SIMBAD catalogs planetary nebulae's central stars under the same
   identifier as the nebula, and at mag 13.5 (V-band) it's well within
   a mag-16 search. This is a genuine, verifiable point source (confirmed
   via the standard crosshair-crop check, landing dead-center on a real
   star visible in the nebula's central cavity), not a data error —
   **don't filter it out reflexively just because the name matches the
   page's own object.** It's arguably the single most interesting marker
   on a planetary-nebula page (literally the dying star that made the
   nebula) — consider giving it a `commonName` like `"Central Star"`
   instead of leaving it to display the bare catalog id, since "NGC 7293"
   as a label right next to a page already titled "The Helix Nebula"
   reads as confusing/redundant otherwise. Do still verify its position
   like any other marker — don't assume a name match makes the
   coordinates trustworthy.
5. **Pass `maxMag={16}` to `<StarMagnitudeSlider>`.** Same prop as the
   mag-12 skill, no component changes needed — `maxMag` was already
   built as a free parameter, not hardcoded to 10 or 12.
6. **Dedup discipline from the mag-12 skill still applies, unchanged** —
   multiple catalogs re-listing the same physical star gets *more*
   likely at greater depth, not less. Reuse the mag-12 skill's
   position-based dedup (rows within ~2px of each other, keep the
   better `coo_qual`, tie-break on brightness) as-is. The Helix pilot
   happened not to need it (all 9 kept rows were well-separated, nearest
   pair ~85px apart) — that's a property of this particular sparse
   field, not evidence the dedup step is skippable in general.

## Verification — same as mag 12, weighted toward the new faint end

Run the full crosshair-crop check from `star-magnitude-hover`'s SKILL.md
on every *new* marker this depth adds beyond a prior mag-10/12 pass on
the same image (the brighter markers were presumably already verified).
On the Helix pilot, the 3 markers added going from mag 12 to mag 16
(`TYC 6391-936-1` at mag 12.31, the central star `NGC 7293` at mag
13.524, and `UCAC2 23772022` at mag 13.654) all landed exactly on real
point sources in a 80px crop upscaled 6x with a crosshair composited at
the target pixel — same method, same reliability, at four magnitudes
deeper than the mag-12 skill's own pilot.

## Known limitations / open questions

- **Only piloted once, on a sparse field (9 total markers).** The
  mag-12 skill's density-collision lessons (tag overlap needing
  `tagDx`/`tagDy`, position-based dedup) are carried over by reference
  but weren't freshly exercised here, since this field didn't trigger
  either. If a future mag-16 pull on a richer field hits either
  problem, the fixes already exist (see `star-mag-hover-with-slider`
  and `star-mag-hover-with-slider-mag12`'s SKILL.md sections) — apply
  them the same way, don't re-derive.
- **SIMBAD completeness at mag 16 is not uniform across the sky** — see
  point 2 above. Treat every field's count as a fresh unknown until
  queried; the depth alone doesn't predict the yield.

## Apply only on request

Same rule as every skill in this family: deliberate, on-request tooling.
Pick this skill (vs. the mag-10 base or mag-12 sibling) only when Jay
asks for mag 16 specifically, or when a mag-12 pull on a target image
comes back too sparse to be visually interesting and going deeper is the
obvious next lever — don't silently upgrade an existing mag-10 or mag-12
rollout without being asked.
