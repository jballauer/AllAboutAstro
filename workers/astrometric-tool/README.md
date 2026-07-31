# astrometric-tool Worker

Proxies astrometry.net (plate-solving) and SIMBAD (object catalog) for the
unlisted `/unlisted/astrometric-tool/` page, so the astrometry.net API key
never reaches the browser and the site itself can stay on GitHub Pages
(static, no server functions).

## One-time setup

1. **Get a free astrometry.net API key**: create an account at
   https://nova.astrometry.net/, then find your API key under your profile
   page (`https://nova.astrometry.net/api_help`).

2. **Install dependencies** (from this `workers/astrometric-tool/` folder):
   ```bash
   npm install
   ```

3. **Log in to Cloudflare** (opens a browser to authorize):
   ```bash
   npx wrangler login
   ```

4. **Set the API key as a secret** (never committed to the repo):
   ```bash
   npx wrangler secret put ASTROMETRY_API_KEY
   ```
   Paste the key when prompted.

5. **Deploy**:
   ```bash
   npx wrangler deploy
   ```
   Wrangler prints the deployed URL, something like:
   `https://astrometric-tool.<your-subdomain>.workers.dev`

   Send that URL back so it can be wired into the `WORKER_URL` constant at
   the top of `src/pages/unlisted/astrometric-tool.astro`.

## Redeploying after a code change

```bash
npx wrangler deploy
```

## Local dev (optional)

```bash
npx wrangler dev
```
Runs the Worker locally; update `WORKER_URL` to `http://localhost:8787`
temporarily to test against it from the Astro dev server.
