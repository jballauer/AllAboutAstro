---
name: star-mag-hover-with-slider-mag12
description: Same magnitude-depth slider mechanism as star-mag-hover-with-slider, but resolving the SIMBAD cone search down to apparent magnitude 12 instead of 10 — for a hero image with a richer, denser star field where mag-10 leaves too few markers to be interesting. Use when Jay asks for the slider "deeper" or specifically mentions magnitude 12, or when scoping a new image and a mag-10 pull comes back sparse. Pick this skill or the base mag-10 one per image, not both on the same image. Pipeline validated 2026-07-24 against the M20 Trifid Nebula's already-solved WCS (52 in-frame stars after quality-filtering and dedup, vs. 17 at mag 10) — not yet deployed to a live page.
---

# Star-magnitude slider — mag 12

Identical mechanism to `star-mag-hover-with-slider`: same plate-solve +
WCS pixel math, same `StarMagnitudeSlider.astro` component, same
cumulative 0-N reveal semantics. **Read that skill's SKILL.md first —
this file only documents the deltas for going to a magnitude-12 limit.**
Don't re-derive the shared plumbing (Phases 1-2 in `star-magnitude-hover`,
the cone-search query shape, the `coo_qual` filter, the crosshair-crop
verification step) — it's all identical here.

## Why a separate skill instead of just passing a bigger number

Jay asked for this explicitly so he can **choose per image** — a sparse
field (like a tight nebula crop with few foreground stars) stays at
mag 10; a richer field can go to mag 12 for a more interesting slider.
Keeping them as separate skills (rather than one skill with a
Jay-specified parameter) makes the choice a deliberate one at
invocation time, and keeps this file the place to document
mag-12-specific gotchas without cluttering the base skill.

## What's different

1. **Cone-search mag limit is 12, not 10** — same ADQL query shape as
   `star-mag-hover-with-slider`'s reference file, just `f.flux <= 12`.
2. **Expect roughly 2-3x more in-frame stars than the same field at mag
   10.** On the M20 Trifid pilot: 17 stars at mag 10 → 52 at mag 12 (95
   raw SIMBAD rows, 8 dropped for `coo_qual='E'`, 35 more dropped as
   near-duplicate catalog entries for the same physical star — see
   below). If a field comes back with hundreds at mag 12, that's a
   genuinely dense field (e.g. a rich open cluster) — surface the count
   to Jay before committing to rendering it rather than assuming it'll
   stay legible; the "known limitations" section in the base skill
   about label density applies more here, not less.
3. **Near-duplicate catalog entries get more common at fainter
   magnitudes** — going deeper pulls in more separate catalogs (2MASS,
   Tycho-2, various HD sub-component listings) that re-list the same
   physical star under different IDs. The base skill's position-based
   dedup (drop exact/near-identical pixel positions) isn't optional
   here the way it was borderline-optional at mag 10 — on the M20 pilot
   it collapsed 3 separate "HD 313714"/"HD 313714A"/"HD 313714B" rows
   into one marker, and merged "CD-23 13808" (`coo_qual='D'`) with
   "HD 313740" (`coo_qual='C'`, same star, better precision) by keeping
   the better-quality row. **Dedup rule: for any two rows whose computed
   pixel positions are within ~2px of each other, keep only the one
   with the better `coo_qual` (A > B > C > D), breaking ties by
   brightness (lower mag wins).** Do this after the pixel conversion,
   before rendering — see the worked script in
   `references/mag12-workflow.md`.
4. **Pass `maxMag={12}` to `<StarMagnitudeSlider>`.** The component
   (`src/components/StarMagnitudeSlider.astro`) takes an optional
   `maxMag` prop (default 10) that drives the range input's `max` and
   the tick datalist — added specifically to support this skill without
   forking the component. Don't duplicate the component; pass the prop.

## Verification — same as the base skill, same discipline

Run the full crosshair-crop check from `star-mag-hover-with-slider`'s
SKILL.md, but weight it toward the newly-included faint end (mag
10-12) since that's the range this skill adds — the bright end was
presumably already verified if a mag-10 pass on the same image came
first. On the M20 pilot, 4 spot-checks across the mag 10-12 range
(including the fainter of the two deduped `coo_qual` C/D pairs) all
landed exactly on real point sources once the `coo_qual='E'` and
near-duplicate-position filters were applied — same reliability
pattern as the base skill, just at greater depth.

## Apply only on request

Same rule as the base skill: deliberate, on-request tooling, not
something to roll out proactively. If Jay asks for "the slider" without
specifying depth, default to the mag-10 base skill (it's the
settled/original one) and ask, or use judgment from context (a sparse
field is an obvious signal to reach for this one instead) — don't
silently upgrade an existing mag-10 rollout to mag-12 without being
asked.
