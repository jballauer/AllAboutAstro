export interface Env {
  ASTROMETRY_API_KEY: string;
}

const ASTROMETRY_API = 'https://nova.astrometry.net/api';
const ASTROMETRY_WCS_URL = 'https://nova.astrometry.net/wcs_file';
const SIMBAD_TAP = 'https://simbad.cds.unistra.fr/simbad/sim-tap/sync';

const ALLOWED_ORIGINS = new Set([
  'https://allaboutastro.com',
  'http://localhost:4321',
]);

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_RADIUS_DEG = 5;
const MAX_MAG_LIMIT = 18;

// Only categories directly queryable from SIMBAD's `basic.otype` column.
// `stars` intentionally has no otype filter -- same as the site's existing
// slider pipeline, which relies on the flux join alone to select point
// sources rather than filtering by otype (SIMBAD splits plain stars across
// many sub-type codes). HII regions are NOT supported here -- the existing
// skill pipeline sources those from NED, not SIMBAD, a materially separate
// integration left out of v1.
const CATEGORY_OTYPE: Record<string, string | null> = {
  stars: null,
  galaxies: 'G',
  globular: 'GlC',
  open: 'OpC',
};

function corsHeaders(origin: string | null): HeadersInit {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

function json(data: unknown, origin: string | null, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

function errorJson(message: string, origin: string | null, status = 400): Response {
  return json({ error: message }, origin, status);
}

async function astrometryLogin(apiKey: string): Promise<string> {
  const body = new URLSearchParams();
  body.set('request-json', JSON.stringify({ apikey: apiKey }));
  const res = await fetch(`${ASTROMETRY_API}/login`, { method: 'POST', body });
  const data = (await res.json()) as { status: string; session?: string; errormessage?: string };
  if (data.status !== 'success' || !data.session) {
    throw new Error(`astrometry.net login failed: ${data.errormessage ?? JSON.stringify(data)}`);
  }
  return data.session;
}

async function handleUpload(request: Request, env: Env, origin: string | null): Promise<Response> {
  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (contentLength > MAX_UPLOAD_BYTES) {
    return errorJson('Image too large (10MB max).', origin, 413);
  }

  const incomingForm = await request.formData();
  const file = incomingForm.get('file');
  if (!(file instanceof File)) {
    return errorJson('Missing "file" field.', origin, 400);
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return errorJson('Image too large (10MB max).', origin, 413);
  }

  const session = await astrometryLogin(env.ASTROMETRY_API_KEY);

  const uploadForm = new FormData();
  uploadForm.set(
    'request-json',
    JSON.stringify({
      session,
      publicly_visible: 'n',
      allow_modifications: 'n',
      allow_commercial_use: 'n',
    })
  );
  uploadForm.set('file', file, file.name || 'upload.jpg');

  const res = await fetch(`${ASTROMETRY_API}/upload`, { method: 'POST', body: uploadForm });
  const data = (await res.json()) as { status: string; subid?: number; errormessage?: string };
  if (data.status !== 'success' || data.subid === undefined) {
    return errorJson(`astrometry.net upload failed: ${data.errormessage ?? 'unknown error'}`, origin, 502);
  }

  return json({ subid: data.subid }, origin);
}

// Single-shot check -- the client polls this endpoint on an interval so the
// Worker never has to sleep and never risks a CPU-time/duration limit.
async function handleStatus(request: Request, origin: string | null): Promise<Response> {
  const url = new URL(request.url);
  const subid = url.searchParams.get('subid');
  if (!subid) return errorJson('Missing subid.', origin, 400);

  const subRes = await fetch(`${ASTROMETRY_API}/submissions/${encodeURIComponent(subid)}`);
  const subData = (await subRes.json()) as { jobs?: (number | null)[]; processing_finished?: string };

  const jobId = subData.jobs?.find((j) => j !== null) ?? null;
  if (!jobId) {
    return json({ status: 'submitted' }, origin);
  }

  const jobRes = await fetch(`${ASTROMETRY_API}/jobs/${jobId}`);
  const jobData = (await jobRes.json()) as { status: string };

  if (jobData.status === 'success') return json({ status: 'solved', jobId }, origin);
  if (jobData.status === 'failure') return json({ status: 'failed', jobId }, origin);
  return json({ status: 'solving', jobId }, origin);
}

function extractFitsNumber(text: string, key: string): number {
  const match = new RegExp(`\\b${key}\\s*=\\s*([-+0-9.eE]+)`).exec(text);
  if (!match) throw new Error(`Missing WCS key: ${key}`);
  return Number(match[1]);
}

async function handleWcs(request: Request, origin: string | null): Promise<Response> {
  const url = new URL(request.url);
  const jobId = url.searchParams.get('jobId');
  if (!jobId) return errorJson('Missing jobId.', origin, 400);

  const res = await fetch(`${ASTROMETRY_WCS_URL}/${encodeURIComponent(jobId)}`);
  if (!res.ok) return errorJson('Could not fetch WCS file.', origin, 502);
  const buf = await res.arrayBuffer();
  // The .wcs file is a FITS header: fixed-width 80-char ASCII cards, no
  // line breaks. It decodes cleanly as latin1 text for our purposes --
  // we only need to regex out a handful of numeric keys, not parse the
  // FITS structure itself.
  const text = new TextDecoder('latin1').decode(buf);

  try {
    const wcs = {
      CRVAL1: extractFitsNumber(text, 'CRVAL1'),
      CRVAL2: extractFitsNumber(text, 'CRVAL2'),
      CRPIX1: extractFitsNumber(text, 'CRPIX1'),
      CRPIX2: extractFitsNumber(text, 'CRPIX2'),
      CD1_1: extractFitsNumber(text, 'CD1_1'),
      CD1_2: extractFitsNumber(text, 'CD1_2'),
      CD2_1: extractFitsNumber(text, 'CD2_1'),
      CD2_2: extractFitsNumber(text, 'CD2_2'),
      IMAGEW: extractFitsNumber(text, 'IMAGEW'),
      IMAGEH: extractFitsNumber(text, 'IMAGEH'),
    };
    return json(wcs, origin);
  } catch (err) {
    return errorJson((err as Error).message, origin, 502);
  }
}

// Minimal CSV parser -- handles the SIMBAD TAP CSV output shape (quoted
// fields for main_id/otype/sp_type, no embedded commas seen in practice,
// but quotes are still respected defensively).
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    const fields: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === ',' && !inQuotes) {
        fields.push(cur);
        cur = '';
      } else {
        cur += c;
      }
    }
    fields.push(cur);
    rows.push(fields);
  }
  return rows;
}

async function handleSimbadCone(request: Request, origin: string | null): Promise<Response> {
  const url = new URL(request.url);
  const ra = Number(url.searchParams.get('ra'));
  const dec = Number(url.searchParams.get('dec'));
  const radiusDeg = Number(url.searchParams.get('radiusDeg'));
  const maglimit = Number(url.searchParams.get('maglimit') ?? '12');
  const category = url.searchParams.get('category') ?? '';

  if (!Number.isFinite(ra) || !Number.isFinite(dec) || !Number.isFinite(radiusDeg)) {
    return errorJson('Missing/invalid ra, dec, or radiusDeg.', origin, 400);
  }
  if (!(category in CATEGORY_OTYPE)) {
    return errorJson(`Unknown category "${category}".`, origin, 400);
  }
  const clampedRadius = Math.min(Math.max(radiusDeg, 0), MAX_RADIUS_DEG);
  const clampedMag = Math.min(Math.max(maglimit, -5), MAX_MAG_LIMIT);
  const otype = CATEGORY_OTYPE[category];

  const otypeClause = otype ? `AND b.otype = '${otype}'` : '';
  const adql = `SELECT b.main_id, b.ra, b.dec, b.otype, b.sp_type, b.coo_qual, f.flux AS vmag
    FROM basic AS b JOIN flux AS f ON b.oid = f.oidref
    WHERE f.filter='V'
    ${otypeClause}
    AND 1=CONTAINS(POINT('ICRS', b.ra, b.dec), CIRCLE('ICRS', ${ra}, ${dec}, ${clampedRadius}))
    AND f.flux <= ${clampedMag}
    ORDER BY vmag ASC`;

  const body = new URLSearchParams();
  body.set('request', 'doQuery');
  body.set('lang', 'adql');
  body.set('format', 'csv');
  body.set('query', adql);

  const res = await fetch(`${SIMBAD_TAP}?${body.toString()}`);
  if (!res.ok) return errorJson('SIMBAD query failed.', origin, 502);
  const csv = await res.text();
  const rows = parseCsv(csv);
  if (rows.length < 2) return json([], origin);

  const header = rows[0].map((h) => h.trim());
  const idx = (col: string) => header.indexOf(col);
  const iName = idx('main_id');
  const iRa = idx('ra');
  const iDec = idx('dec');
  const iOtype = idx('otype');
  const iSpType = idx('sp_type');
  const iCooQual = idx('coo_qual');
  const iMag = idx('vmag');

  const objects = rows
    .slice(1)
    .filter((r) => r[iCooQual] !== 'E')
    .map((r) => ({
      name: r[iName].replace(/^\*\s*/, '').trim(),
      ra: Number(r[iRa]),
      dec: Number(r[iDec]),
      otype: r[iOtype],
      spType: r[iSpType] || null,
      mag: Number(r[iMag]),
    }))
    .filter((o) => Number.isFinite(o.ra) && Number.isFinite(o.dec) && Number.isFinite(o.mag));

  return json(objects, origin);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin');
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    try {
      if (request.method === 'POST' && url.pathname === '/solve/upload') {
        return await handleUpload(request, env, origin);
      }
      if (request.method === 'GET' && url.pathname === '/solve/status') {
        return await handleStatus(request, origin);
      }
      if (request.method === 'GET' && url.pathname === '/solve/wcs') {
        return await handleWcs(request, origin);
      }
      if (request.method === 'GET' && url.pathname === '/simbad/cone') {
        return await handleSimbadCone(request, origin);
      }
      return errorJson('Not found.', origin, 404);
    } catch (err) {
      return errorJson((err as Error).message, origin, 500);
    }
  },
};
