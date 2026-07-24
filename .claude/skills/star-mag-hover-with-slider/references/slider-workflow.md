# Slider pilot — working query and pixel math

Ran successfully end-to-end on the Pleiades (M45) Mosaic hero image,
2026-07-24 (`src/content/gallery/_images/m45-pleiades-mosaic.jpg`,
1030×800). Phases 1-2 (plate-solve, WCS→pixel) are identical to
`star-magnitude-hover`'s `references/plate-solve-workflow.md` — only the
catalog query differs, shown here in full.

## Catalog cone search (SIMBAD TAP/ADQL)

```js
const centerRA = 56.5320, centerDec = 24.1340; // from the plate-solve calibration
const radiusDeg = 0.6274;                       // calibration's `radius` field
const magLimit = 10;

const adql = `SELECT b.oid, b.main_id, b.ra, b.dec, b.sp_type, f.flux AS vmag
  FROM basic AS b JOIN flux AS f ON b.oid = f.oidref
  WHERE f.filter='V'
  AND 1=CONTAINS(POINT('ICRS', b.ra, b.dec), CIRCLE('ICRS', ${centerRA}, ${centerDec}, ${radiusDeg}))
  AND f.flux <= ${magLimit}
  ORDER BY vmag ASC`;

const body = new URLSearchParams();
body.set('request', 'doQuery');
body.set('lang', 'adql');
body.set('format', 'csv');
body.set('query', adql);
const res = await fetch('https://simbad.cds.unistra.fr/simbad/sim-tap/sync?' + body.toString());
const csv = await res.text();
```

**Gotcha:** `ORDER BY f.flux ASC` (the qualified column) fails to parse
with a cryptic `Encountered "."` error pointing at the ORDER BY clause
specifically — use the `AS vmag` alias in ORDER BY instead. The same
qualified form works fine elsewhere in the query (WHERE, SELECT).

**Abandoned approach, don't retry:** the classic VizieR cone-search CGI
(`vizier.cds.unistra.fr/viz-bin/asu-tsv?-source=I/239/hip_main&-c=<ra>
+<dec>&-c.rs=<radius_arcmin>&...`) returned **zero rows** for this exact
field, with both raw coordinates and a resolved object name (`-c=M45`),
despite direct `HIP=<number>` lookups against the same table working
correctly. Root cause not identified — likely a broken positional index
on that particular VizieR mirror/table combination. Went straight to the
SIMBAD TAP query above instead; no need to re-attempt VizieR first.

## Output shape (CSV columns)

`oid, main_id, ra, dec, sp_type, vmag` — `main_id` is quoted and is
whatever SIMBAD considers the primary identifier (often a Bayer/
Flamsteed form like `"* 17 Tau"`, an HD number, or a variable-star
designation like `"V* V1229 Tau"`). Strip a leading `* ` and surrounding
quotes to get a clean catalog-name string.

## Per-star pixel position + bucket

Reuse `radecToPixel` from `star-magnitude-hover`'s reference file
verbatim (same TAN/WCS math) with this image's own solved WCS constants.
Then, per row:

```js
const { x, y } = radecToPixel(wcs, row.ra, row.dec);
const inFrame = x >= 0 && x <= IMAGEW && y >= 0 && y <= IMAGEH;
const bucket = Math.ceil(row.vmag); // slider value at which this star first appears
```

Filter to `inFrame` rows only — a circular cone search will always
include some points outside a rectangular frame's corners/edges.

## Common-name mapping (hand-maintained, not derivable from this query)

```js
const commonNames = {
  'eta Tau': 'Alcyone', '17 Tau': 'Electra', '20 Tau': 'Maia',
  '23 Tau': 'Merope', 'q Tau': 'Taygeta', '16 Tau': 'Celaeno',
  '21 Tau': 'Asterope 1', '22 Tau': 'Asterope 2',
};
```

Everything else in the Pleiades field down to mag 10 (HD numbers,
variable-star names, a couple of Flamsteed numbers like `24 Tau` with no
popular name) gets `commonName: null` and displays its catalog name as
the primary label instead — confirmed correct rather than an oversight
by checking each against SIMBAD's own identifier list, not assumed.

## Verified result

37 stars landed in-frame down to mag 10 (none brighter than mag 3 exists
in this particular crop, since Atlas and Pleione fall just outside this
tighter hero-image framing — confirmed both by their computed pixel
coordinates landing outside `[0,1030]×[0,800]` and by their absence from
the plate-solve's own `objects_in_field` list). Positions cross-checked
against independently blob-detected bright spots in the image (several
faint HD stars' computed positions matched detected blobs to within a
few pixels), giving high confidence in the WCS conversion for faint
stars too, not just the handful of named ones already verified in the
`star-magnitude-hover` pilot.
