# All About Astro — Weebly → Astro Migration Plan

## Goal
Migrate allaboutastro.com from Weebly to a self-built static site using **Astro**, hosted free on **GitHub Pages**, keeping the custom domain (allaboutastro.com).

## Why this stack
- Astro's `astro:assets` handles image optimization automatically — important for an astrophotography gallery with large images.
- Content collections let each section (blog, learning, gear, slide rules) live as organized Markdown/MDX files.
- GitHub Pages hosting is free forever and supports custom domains natively.
- No database, no backend — the current site is entirely static content (text + images), so this is a clean fit.

## Known site structure (from allaboutastro.com, current Weebly site)
Top-level nav:
- Home (`/`)
- Blog (`/blog.html`)
- Astro Gallery (`/astro-gallery.html`)
- Astro Gear (`/astro-gear.html`)
  - Software Bisque Mounts (`/software-bisque-mounts.html`)
- Learning (`/learning.html`)
  - How to Learn Astrophotography
  - A Telescope Buyer's Guide
  - Space is a Landscape
  - Developing a Plan for Our Images
  - Best Data Acquisition Practices
  - The Task of Image Processing
  - Where to Setup Your Telescope
  - Do Dark Skies Really Matter?
  - Astronomy and the Weather
  - Globular Clusters
  - Building a Roll-Off Roof Observatory
  - Choosing a 35mm Film Camera
  - Great American Solar Eclipse 2024
- About Me (`/about-me.html`)
- Jay's Slide Rules (`/sliderules.html`)
  - All the Rules
  - My Favorite Slide Rules
  - Pickett
    - Pickett N600-ES
    - Pickett N4-T
  - All About K&E Rules
  - The Educational Value of Slide Rules

Also present: individual image/gallery post pages (e.g. M42 First Light, M20 Trifid Nebula, M45 Pleiades Mosaic, Flame and Horsehead, M31 Mosaic), each with their own URL.

**Note:** Weebly does not offer a clean content export, so migration is manual — copying text and re-downloading images page by page rather than an automated import. Budget time for this; it's mechanical but not hard.

## First Claude Code session — suggested steps
1. **Create project folder** locally (e.g. `allaboutastro-rebuild`), open it in Claude Code.
2. **Ask Claude Code to scaffold a new Astro project** with content collections for: `blog`, `learning`, `gear`, `sliderules`, and a standalone `gallery` page/collection.
3. **Migrate a small test batch first** — e.g. the Home page, About Me, and 2–3 Learning articles — to confirm the layout, nav, and image handling feel right before doing the rest.
4. **Content migration workflow per page:**
   - Copy the page text from the live Weebly site (or from browser view-source) into the corresponding Markdown file.
   - Download images (right-click → save, or batch via browser tools) and place them in the Astro `src/assets` or `public` folder, then reference them in the page.
5. **Once the test batch looks right**, continue migrating the remaining pages in batches (Gear pages → Learning articles → Slide Rules section → Gallery/blog posts).
6. **Push to GitHub**, enable GitHub Pages in repo settings.
7. **Connect the custom domain (registrar confirmed: GoDaddy):**
   - In GitHub repo → Settings → Pages, enter `allaboutastro.com` as the custom domain (this auto-creates a `CNAME` file in the repo root).
   - In GoDaddy's DNS management for allaboutastro.com:
     - Add four **A records**, host `@`, pointing to: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
     - Add a **CNAME record**, host `www`, pointing to `<your-github-username>.github.io`
     - Remove any default GoDaddy parking-page A record on `@`
   - Wait for DNS propagation (usually under an hour, up to 24hrs), then confirm with `dig allaboutastro.com +noall +answer -t A` — should return the four IPs above.
   - GitHub auto-issues an SSL certificate once DNS resolves correctly. If it was issued before both apex and www were pointed correctly, you may need to force-regenerate it in Pages settings.
8. **Verify SSL** is issued (GitHub Pages provisions this automatically once DNS is correctly pointed) and test the live domain.

## Open items to resolve during the build
- Decide final URL structure (keep `.html`-style slugs to preserve any external links/SEO, or move to cleaner Astro-style paths with redirects).
- Decide how the photo gallery should behave (simple grid vs. lightbox vs. individual pages per image, as it is now).
