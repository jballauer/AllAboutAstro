# Plate-solve + catalog cross-match — working scripts

These ran successfully end-to-end on the Pleiades (M45) Mosaic gallery
page, 2026-07-24. Copy into a scratch `.mjs` file and run with `node`
(Node 24+ has built-in `fetch`/`FormData`/`Blob` — no dependencies
needed). Requires `ASTROMETRY_API_KEY` in the environment.

## 1. Submit + poll astrometry.net

```js
import fs from 'node:fs';

const API = 'https://nova.astrometry.net/api';
const apiKey = process.env.ASTROMETRY_API_KEY;
const imagePath = process.argv[2];

async function login() {
  const body = new URLSearchParams();
  body.set('request-json', JSON.stringify({ apikey: apiKey }));
  const res = await fetch(`${API}/login`, { method: 'POST', body });
  const json = await res.json();
  if (json.status !== 'success') throw new Error(`Login failed: ${JSON.stringify(json)}`);
  return json.session;
}

async function upload(session, path) {
  const fileBuf = fs.readFileSync(path);
  const form = new FormData();
  form.set('request-json', JSON.stringify({
    session, publicly_visible: 'n', allow_modifications: 'n', allow_commercial_use: 'n',
  }));
  form.set('file', new Blob([fileBuf]), path.split(/[\\/]/).pop());
  const res = await fetch(`${API}/upload`, { method: 'POST', body: form });
  const json = await res.json();
  if (json.status !== 'success') throw new Error(`Upload failed: ${JSON.stringify(json)}`);
  return json.subid;
}

async function pollSubmission(subid) {
  for (let i = 0; i < 60; i++) {
    const json = await (await fetch(`${API}/submissions/${subid}`)).json();
    if (json.jobs?.length && json.jobs[0] !== null) return json.jobs[0];
    await new Promise(r => setTimeout(r, 5000));
  }
  throw new Error('Timed out waiting for job to be created');
}

async function pollJob(jobId) {
  for (let i = 0; i < 60; i++) {
    const json = await (await fetch(`${API}/jobs/${jobId}`)).json();
    if (json.status === 'success' || json.status === 'failure') return json.status;
    await new Promise(r => setTimeout(r, 5000));
  }
  throw new Error('Timed out waiting for job to solve');
}

const session = await login();
const subid = await upload(session, imagePath);
const jobId = await pollSubmission(subid);
const status = await pollJob(jobId);
console.log(jobId, status);
// Then: GET https://nova.astrometry.net/wcs_file/<jobId>  -> save as .wcs
// And:  GET `${API}/jobs/${jobId}/objects_in_field/`      -> sanity check
```

## 2. Parse the WCS file and convert RA/Dec → pixel

The `.wcs` file is a FITS header (80-char cards, no line breaks). Pull out
the plain-text values (they're already human-readable ASCII in this
"minimal header" FITS style astrometry.net produces):

```
CRVAL1, CRVAL2   — reference point RA/Dec, degrees
CRPIX1, CRPIX2   — reference pixel (1-indexed)
CD1_1, CD1_2,
CD2_1, CD2_2     — linear transformation matrix, degrees/pixel
IMAGEW, IMAGEH   — image dimensions
```

Standard TAN (gnomonic) projection, ignoring SIP distortion terms (fine
for marker placement, not for sub-pixel astrometry):

```js
const D2R = Math.PI / 180, R2D = 180 / Math.PI;

function radecToPixel(wcs, raDeg, decDeg) {
  const a0 = wcs.CRVAL1 * D2R, d0 = wcs.CRVAL2 * D2R;
  const a = raDeg * D2R, d = decDeg * D2R;
  const cosc = Math.sin(d0) * Math.sin(d) + Math.cos(d0) * Math.cos(d) * Math.cos(a - a0);
  const xi = (Math.cos(d) * Math.sin(a - a0) / cosc) * R2D;
  const eta = ((Math.cos(d0) * Math.sin(d) - Math.sin(d0) * Math.cos(d) * Math.cos(a - a0)) / cosc) * R2D;
  const det = wcs.CD1_1 * wcs.CD2_2 - wcs.CD1_2 * wcs.CD2_1;
  const u = (wcs.CD2_2 * xi - wcs.CD1_2 * eta) / det;
  const v = (-wcs.CD2_1 * xi + wcs.CD1_1 * eta) / det;
  return { x: wcs.CRPIX1 + u, y: wcs.CRPIX2 + v };
}
```

On the Pleiades image this produced `y` directly usable as a normal
top-down image row (no flip needed) — but that's a property of how *that*
image happened to be solved, not a universal constant. Verify against
1-2 known-bright stars every time (see SKILL.md's verification section).

Percentage position for the HTML markup:
`x_pct = (x / IMAGEW * 100).toFixed(2)`, same for y with `IMAGEH`.

## 3. SIMBAD batch lookup

```js
const stars = ['27 Tau', '17 Tau', '20 Tau']; // Flamsteed/Bayer forms resolve most reliably
const lines = stars.map(s =>
  `format object "%IDLIST(1) | %COO(d;A) | %COO(d;D) | %FLUXLIST(V)"\nquery id ${s}`
);
const body = new URLSearchParams();
body.set('script', lines.join('\n'));
const res = await fetch('https://simbad.cds.unistra.fr/simbad/sim-script', { method: 'POST', body });
console.log(await res.text());
// Data lines look like:  *  27 Tau | 057.2905960742142 | +24.0534171332803 | V (Vega) 3.63 ...
```

Parse the `| RA | Dec | V (Vega) mag ...` fields per line. If an
identifier errors ("incorrect format for catalogs" or "no known catalog
could be found"), retry with the Flamsteed/Bayer numeric form rather than
a plain English name — common names are often ambiguous against unrelated
catalog prefixes (e.g. plain "Atlas" collides with the ATLAS survey
catalog).
