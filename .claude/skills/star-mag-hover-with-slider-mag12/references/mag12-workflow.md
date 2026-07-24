# Mag-12 pilot — working query, dedup, and results (M20 Trifid)

Ran 2026-07-24 against the M20 Trifid Nebula's already-solved WCS
(`src/content/gallery/_images/m20-trifid-nebula.jpg`, 1082x800). Initially
validated pipeline-only, reusing the WCS from the site's earlier mag-10
`star-mag-hover-with-slider` pass on the same image without touching the
live page. Jay then asked to see it live, so the M20 hero's star list was
swapped from the mag-10 set (17 markers) to this mag-12 set (52 markers)
and `maxMag={12}` passed to the component — it is now the live
configuration on that page (prior mag-10 marker data is recoverable from
git history if ever reverted).

## Cone search (identical shape to the base skill, mag limit raised)

```js
const adql = `SELECT b.oid, b.main_id, b.ra, b.dec, b.sp_type, b.coo_qual, f.flux AS vmag
  FROM basic AS b JOIN flux AS f ON b.oid = f.oidref
  WHERE f.filter='V'
  AND 1=CONTAINS(POINT('ICRS', b.ra, b.dec), CIRCLE('ICRS', ${centerRA}, ${centerDec}, ${radiusDeg}))
  AND f.flux <= 12
  ORDER BY vmag ASC`;
```

Raw SIMBAD rows: 95. After dropping `coo_qual='E'`: 87 candidates.
After the in-frame pixel filter (`radecToPixel`, same WCS math as
`star-magnitude-hover`): fewer still land inside `[0,IMAGEW]x[0,IMAGEH]`
than the raw cone-search count, since the cone is circular and the
frame is rectangular.

## Position-based dedup (new requirement at this depth)

Multiple catalogs (HD sub-components, 2MASS, Tycho-2, CD/BD
designations) frequently re-list the same physical star. Rows whose
computed pixel positions land within ~2px of each other are the same
star, not a resolvable close pair — collapse to one marker, keeping the
best `coo_qual` (ties broken by brightness):

```js
function qualRank(q) { return { A: 0, B: 1, C: 2, D: 3 }[q] ?? 9; } // 'E' already excluded upstream

const kept = [];
for (const s of candidates) {
  const dupIdx = kept.findIndex(k => Math.hypot(k.x - s.x, k.y - s.y) < 2);
  if (dupIdx === -1) { kept.push(s); continue; }
  const existing = kept[dupIdx];
  const better = (qualRank(s.qual) < qualRank(existing.qual)) ||
    (qualRank(s.qual) === qualRank(existing.qual) && s.mag < existing.mag);
  if (better) kept[dupIdx] = s;
}
```

On the M20 field this collapsed 55 in-frame rows to 52 markers:
- `HD 313714A` / `HD 313714` / `HD 313714B` (all within 1px) → kept
  `HD 313714` (`coo_qual='A'`, better than the other two's `B`/`C`).
- `CD-23 13808` (`coo_qual='D'`) / `HD 313740` (`coo_qual='C'`, same
  star) → kept `HD 313740` (better quality, despite being the fainter
  listed magnitude of the pair — quality wins over brightness in the
  tiebreak order, only falling back to magnitude when quality ties).

This is a *different* problem from the base skill's "co-located
binaries produce overlapping tags" limitation — that's about
genuinely separate stars a few arcsec apart that still overlap visually
at this image scale; this is the *same star* appearing as 2-3 rows.
Both can coexist: after this dedup pass, real close pairs (e.g. `EM*
LkHA 123` and `HD 164492`, ~5px apart, both real Trifid-region O/B
stars) still remain as separate markers, which is correct — and their
tags did in fact collide once actually rendered on the live page. Fixed
with the base skill's per-marker `tagDx`/`tagDy` label offset (see its
"Fixing overlapping tags on a real close pair" section) rather than
merging or dropping either marker — both are real stars, they just
needed their labels nudged apart.

Took two tries to get the leader (stem) right: first, offsetting a
wrapper around both leader and tag together detached the stem from its
ring entirely. Second, making the leader a fixed, always-vertical
sibling of the ring fixed *that* but couldn't reach a tag relocated
sideways — Jay: "your leaders are all vertical... you need a way for
such labels to draw the leader from the text box to the side of the
ring." Final fix computes the leader's length/angle at build time
(`leaderGeometry()` in the component) so it always points from the
ring to the tag's actual position, offset or not — see the base
skill's "Fixing overlapping tags on a real close pair" section for the
trig and verification method.

## Density check

52 markers in a ~0.43°-radius field. Nearest-neighbor spacing: minimum
3.5px (the LkHA 123 / HD 164492 real close pair, expected and
accepted), only 6 of 52 markers have any neighbor within 20px. Legible
at this density on a 1082px-wide image — didn't need to reach for the
"known limitations" collision-avoidance escape hatch. A field returning
noticeably more than this (low hundreds+) would need that judgment call
made explicitly with Jay before rendering, per the base skill's density
guidance.

## Verification spot-checks (crosshair crop against source pixels)

Confirmed dead-on for: the field's brightest star (already verified in
the mag-10 pass), the faintest in-frame star at mag 11.8
(`2MASS J18034968-2246519`), a Tycho-2-only entry with no HD number
(`TYC 6842-729-1`, mag 11.02), an OB-type star (`Ve 2-43`, mag 11.14),
and the `coo_qual='C'` survivor of the `HD 313740`/`CD-23 13808` dedup
pair. All five landed exactly on an obvious point source in a 60px
crop upscaled 6x with a crosshair composited at the target pixel — same
method as the base skill's verification section.
