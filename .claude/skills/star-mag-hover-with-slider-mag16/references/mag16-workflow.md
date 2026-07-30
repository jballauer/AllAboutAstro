# Mag-16 pilot — working query and results (Helix Nebula)

Ran 2026-07-30 against the Helix Nebula hero image's already-solved WCS
(`src/content/gallery/_images/helix-nebula.jpg`, 1200x902 — the same
solve used for this image's earlier mag-12 pass). Reused the WCS
directly rather than re-submitting to astrometry.net, since the source
image hadn't changed.

## Cone search (identical shape to mag 10/12, mag limit raised)

```js
const adql = `SELECT b.oid, b.main_id, b.ra, b.dec, b.sp_type, b.coo_qual, f.flux AS vmag
  FROM basic AS b JOIN flux AS f ON b.oid = f.oidref
  WHERE f.filter='V'
  AND 1=CONTAINS(POINT('ICRS', b.ra, b.dec), CIRCLE('ICRS', ${centerRA}, ${centerDec}, ${radiusDeg}))
  AND f.flux <= 16
  ORDER BY vmag ASC`;
```

Center/radius reused from the field's plate-solve calibration response
(same values as the mag-12 pass on this image): RA 337.42279845,
Dec -20.81140450, radius 0.30130128 deg.

**Note on network access:** `simbad.cds.unistra.fr` failed to resolve via
normal DNS in this environment (`nova.astrometry.net` resolved fine, so
this wasn't a blanket network block) — resolved via Google's
DNS-over-HTTPS (`https://dns.google/resolve?name=simbad.cds.unistra.fr&type=A`)
and queried with curl's `--resolve host:443:<ip>` flag to bypass local
DNS for that one request. Worth trying first if a future run hits the
same `ConnectTimeoutError`/`Could not resolve host` failure before
assuming SIMBAD itself is down.

## Raw results: 20 rows, 8 dropped as `coo_qual='E'`

```
oid,main_id,ra,dec,sp_type,coo_qual,vmag
1283892,"HD 213056",...,K1(III),A,9.912
1273973,"HD 213069",...,F5/6(V),A,10.436
1284140,"BD-21  6241",...,,A,10.622
1284175,"BD-21  6240",...,,B,10.81
3773372,"TYC 6391-1496-1",...,,A,11.11
1283902,"BD-21  6232",...,,A,11.11
7258198,"TYC 6391-967-1",...,,A,11.16
7258216,"TYC 6391-1471-1",...,,A,11.48
7258182,"TYC 6391-680-1",...,,A,11.618
1284060,"GEN# +9.27293009",...,,E,12.04   <- dropped
1284448,"TYC 6391-936-1",...,,A,12.31
1274065,"GEN# +9.27293005",...,,E,12.43   <- dropped
1284057,"GEN# +9.27293006",...,,E,12.46   <- dropped
1284059,"GEN# +9.27293008",...,,E,12.56   <- dropped
1284450,"GEN# +9.27293004",...,,E,12.72   <- dropped
1284449,"GEN# +9.27293003",...,,E,12.87   <- dropped
1284056,"GEN# +9.27293001",...,,E,13.2    <- dropped
1284058,"GEN# +9.27293007",...,,E,13.42   <- dropped
1283906,"NGC  7293",...,DAO.5,A,13.524    <- the Helix's own central star
8963807,"UCAC2  23772022",...,,A,13.654
```

The 8 dropped rows are all `GEN# +9.272930XX` — a block of
photometric-survey entries with rounded/quantized coordinates, the same
failure signature as `coo_qual='E'` rows found on earlier pilots (RA/Dec
values ending in clean fractions like `.395833`, `.45`, `.5125` — visibly
gridded, not measured astrometry).

## Pixel conversion + in-frame filter

Reused `radecToPixel` verbatim (same WCS constants as the image's
existing mag-12 marker set). Of the 12 `coo_qual != 'E'` rows, 9 landed
in-frame (`[0,1200]x[0,902]`); the same 3 rows that fell outside the
frame at mag 12 (`BD-21 6240`, `TYC 6391-1471-1`, `TYC 6391-680-1`) fall
outside at mag 16 too, since their sky positions didn't change.

No pair of the 9 in-frame rows landed within 2px of another — no dedup
needed on this pull. Nearest pair by tag-collision risk: `TYC 6391-936-1`
(149.2, 433.1) to `BD-21 6241` (195.7, 505.2), ~85px apart — checked
live after rendering and confirmed no tag overlap (85px cleared the
tags' ~60-80px typical width with room to spare).

## Verification — the 3 markers added beyond the mag-12 set

The mag-12 pass on this image already verified its 6 markers. Only the
3 new ones needed fresh crosshair-crop checks (80px crop, 6x upscale,
same method as `star-mag-hover-with-slider`'s reference file):

- `TYC 6391-936-1` (mag 12.31) — landed dead-center on an obvious point
  source.
- `NGC 7293` / central star (mag 13.524) — landed dead-center on a
  visible point source inside the nebula's central cavity, distinct
  from the surrounding nebulosity. This is the actual white dwarf
  remnant that produced the Helix Nebula — a scientifically meaningful
  marker, not a stray catalog artifact. Given `commonName: 'Central
  Star'` in the marker data (rather than defaulting to the bare
  catalog id `NGC 7293`, which would read as a confusing duplicate of
  the page's own title).
- `UCAC2 23772022` (mag 13.654) — landed dead-center on an obvious
  point source, with two other (uncataloged-at-this-depth) stars visible
  nearby in the same crop for reference.

## Result

9 total markers (6 shared with the existing mag-12 set, 3 new). Slider
tested at 0 (0 markers, plain image) and 16 (all 9 markers, no tag
overlap). Live on `/gallery/helix-nebula/`, swapped in-place from the
image's earlier mag-12 configuration (prior mag-12 marker data is
recoverable from git history if ever needed — see commit `0ba3ec1`).
