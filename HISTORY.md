# Project History

A chronological log of the allaboutastro.com Astro rebuild, grouped by day. Generated from git log.

## 2026-07-15 — Scaffold and initial migration

- Scaffolded the Astro site for the allaboutastro.com migration
- Migrated test batch: Home, About Me, 3 Learning articles, 5 Gallery entries
- Migrated Gear, Slide Rules, remaining Learning articles, Blog, and Gallery
- Fixed deploy workflow (pinned Node 22 for withastro/action)
- Added CNAME file for custom domain
- Added dropdown submenus to nav, matching original site structure
- Added inline images across Learning articles (Best Data Acquisition Practices, Task of Image Processing, Where to Setup Your Telescope, Astronomy and the Weather, Choosing a 35mm Film Camera, Great American Solar Eclipse 2024, How to Learn Astrophotography, A Telescope Buyer's Guide, Software Bisque Mounts and Pickett catalog)
- Added construction photos to Building a Roll-Off Roof Observatory
- Added classroom photos to The Educational Value of Slide Rules
- Added full 122-image catalog to All the Rules slide rule page
- Rebuilt home page to match original Weebly layout and visual design; refined proportions and footer
- Fixed home page text column height alongside slideshow

## 2026-07-16 — Nav/hero fixes, K&E Rules begins

- Fixed nav dropdown bug, hero box styling, slideshow auto-scroll
- Fixed nav current-page indicator and site title text
- Kept "Jay Ballauer" from splitting across lines in hero title
- Added divider between slideshow caption and 2024 Eclipse News heading
- Removed hero panel background, kept drop-shadow on image only
- Added visible border to hero image; fixed background color seam and nav header color mismatch
- Backed callout-box color with solid gray instead of raw page background
- Added temporary under-construction stamp (with fly-in animation) to every page
- Fixed slideshow images being cropped to a uniform aspect ratio
- **Began K&E Rules migration:** landing page + Chapter 1
- Added book-style sidebar for K&E content; moved "Problems" sidebar to Chapter 1
- Fixed nav dropdown disappearing on mouseover
- Fixed K&E landing page banner, added missing logo image
- Added persistent Table of Contents to every K&E Rules page (collapsible outside landing page)
- Reworked K&E Chapter 1 to float images/sidebar alongside text; fixed image accuracy; added click-to-enlarge lightbox
- Built out **Chapter 2**: Rules of the Single-Sided, Mannheim-Type
- Multiple Chapter 2 sidebar fixes: prevented simultaneous floating, eliminated void gaps, kept sidebars always floated to a side, gave real breathing room
- Fixed heading-split, 3-column, and side-by-side image issues in Ch2
- Fixed Ch2 image/sidebar deferral, scoped pull-quote style, corrected signature placement

## 2026-07-17 — K&E Chapters 3-4, typography, lightbox rollout

- Paired Model 4098A images side by side, centered captions, fixed Doric sidebar trailing past chapter end
- Unified Model 4098A photos into one gallery feature; fixed orphaned paragraph fragment
- Refined 4098A gallery layout, fixed dead `:global()` selectors, centered orphan figures
- Added **Chapter 3**: Rules of the Double-Sided, Duplex-Type
- Moved 4181-1 art shot to lead its section as an uncaptioned inline image
- Slowed under-construction banner animation, added K&E version history appendix
- Added double-space-after-sentence typography and automated last-updated date
- Fetched full git history in deploy workflow for accurate last-updated dates
- Added **Chapter 4**: The Specialty Rules
- Split merged stub entries in Ch4; added AI-generated placeholder component
- Fixed mistranscribed azimuth formula in Ch4 Surveyor's Duplex section
- Moved/fixed several Ch4 image placements (Merchant's Family, N4096, Radio section mismatches)
- Enlarged 4095-3 back image; linked Syphers' site; bolded first mention of each rule
- Added `.ke-scale-set` component for Front/Back scale layout blocks
- Wired up real click-to-zoom (`data-hires`) for Ch4 images and for Chapters 1-3
- Fixed ~3000px void beside Doric Family sidebar in Chapter 2

## 2026-07-18 — K&E Chapters 5-7, appendices

- Added **Chapter 5**: Miscellaneous K&E Rules; fixed void beside Manloves sidebar; enlarged signed Thacher art shot
- Added **Chapter 6**: Out of Catalog, Custom Rules
- Marked Chemco and American Optical entries as AI-drafted; later sourced real catalog images for 5 of Ch6's AI-drafted stubs
- Centered/resized AI-stub photos at ~half width; widened Ch6 floated images from third- to half-width
- Sourced real catalog images for Chapter 4's and Chapter 5's AI-drafted stubs
- Added **Chapter 7**: My Portfolio of K&E Slide Rules
- Added real stats and Weebly photos to Chapter 7 portfolio entries; added two more portfolio rules from Weebly source data
- Corrected Cooke Radio Rule sample count (two → three)
- Filled out Chapter 7 with every rule from the Weebly accordion list; reordered entries to match book introduction sequence; title cleanup
- Filled out **Appendix 2** with the K&E product catalog history from Weebly
- Filled out Appendices 1, 3, 4; fixed TOC missing Appendix 5
- Applied visual-parity styling to How to Learn Astrophotography

## 2026-07-19 — Learning article fixes

- Fixed voided sidebar gap in How to Learn Astrophotography
- Repositioned the Internet-forums sidebar to eliminate a large void
- Moved the Lagoon Nebula image into Data Repositories, fixed its caption
- Fixed mislabeled books photo in How to Learn Astrophotography
- Fixed another orphaned caption: Jason Ware starship image

## 2026-07-21 — Caption/image fidelity audit, visual-parity pass begins

- Fixed Chapter 1 caption fidelity; made aside color consistent site-wide
- Fixed Chapter 2 T-G/1892-catalog caption and image position; fixed misidentified image (not an Oughtred screenshot)
- Fixed Chapter 3, 4, 5, and 7 caption/image fidelity against the old Weebly source (Ch7: mislabeled 9071-3 Doric photo)
- Applied ke-* visual parity styling to: Space is a Landscape, Do Dark Skies Really Matter, Astronomy and the Weather, roll-off roof observatory article, Choosing a 35mm Film Camera

## 2026-07-22 — Visual parity completion, banners, gear carousel, blank-space fixes

- Applied visual-parity styling to Where to Setup Your Telescope
- Restored dropped sidebars and fixed image structure in Developing a Plan for Our Images
- Brought The Task of Image Processing, Great American Solar Eclipse 2024, Best Data Acquisition Practices, and A Telescope Buyer's Guide up to ke-* visual parity
- Restored Equipment Images gallery on Astro Gear landing page; matched layout to original Weebly image/text flow
- Replaced Astro Gear equipment photos with a captioned carousel; floated it at 2/3 width with text wrap (full-width at end); moved Gear Reviews into the carousel's left column, restored inline photo
- Restored missing page-header banner images across landing pages
- Moved page banners above the title, immediately below the navbar (site-wide, then K&E-specific)
- Added missing "Continue to next chapter" links across K&E pages
- Added per-page header banners to Learning articles, gear reviews, and blog posts
- Fixed blank space and narrow-line wrapping on Developing a Plan for Our Images
- Audited remaining Learning articles for trailing-sidebar blank space
- Fixed blank-space voids and float layout across 5 Learning articles
- Fixed blank void beside the NexStar Evolution image
- Audited Globular Clusters: added the missing closing signature graphic (13th Learning article, previously uncovered by the "all 12" rollup below)
- Audited Building a Roll-Off Roof Observatory: clean, no changes (multi-page split, correctly has no closing signature)
- Audited Globular Clusters again: restored dropped inline emphasis (`*side*`, `*front*`, `***globular clusters***`) lost during migration
- Added the `audit-article-layout` project skill (`.claude/skills/`) to standardize this per-article audit process going forward
- Audited Choosing a 35mm Film Camera: restored 86 dropped inline emphasis spans (nearly every camera/lens model name was bold+italic in the original) and converted two flattened `<ul>` lists (the FOREWORD reasons list, the ACCESSORIZING gear list) back into real markdown bullet lists

- Audited My Favorite Slide Rules: restored the missing 18-image "art shot" photo gallery from the old page's bottom slideshow (extracted a reusable `PhotoCarousel` component from the Astro Gear carousel and used it in both places)
- Built out the Learning landing page (previously a bare title list): restored the categorized article list with thumbnails/descriptions, the "Learning Astrophotography" sidebar essay, and a Presentations section (4 old talks, linked out to the legacy Weebly host since the files are 22-135MB and too large to commit into this repo)
- Refined the Learning landing page per Jay's feedback: moved the closing signature into the sidebar essay (enlarged, recolored gray-to-white), gave the article list a fixed width so every entry wraps identically, moved the intro prose above the sidebar so it runs full-width, shifted the sidebar down to start level with the article list, and renamed the first category heading to "Theory - Learning Resources - Casual Reading"
- Audited All the Rules: converted all 57 front/back image pairs from stacked full-width to side-by-side `.ke-figure-row` pairs with "Front"/"Back" captions, matching the original Weebly two-column layout; content/count already complete, no missing images or captions found
- Added an under-construction note and a linked "Version History" reference to All the Rules; added a "Last updated" label beside the page title (shared with the K&E Rules landing page)
- Audited Jay's Slide Rules landing page: restored 9 images entirely dropped during migration (K&E Celanese Celcon and Faber-Castell 8/10 Circular art shots, the Deci-Lon-in-a-truck-bed and classroom-wall-display photos, and 5 "ruler basics" demonstration photos in the Slide Rule Basics section), restored 2 missing hyperlinks (The Educational Value of Slide Rules, MY FAVORITE SLIDE RULES) and 1 external link (logarithm explainer), and restored several "shown at right" / "at right" phrases and trailing sentences dropped alongside the images they referenced
- Rebuilt the 9-logo manufacturer grid ("Portfolio of Rules") on Jay's Slide Rules landing page, another casualty of the original migration; added a new `.ke-maker-grid` component (white card behind each logo so mismatched source backgrounds read as one set), linked the K&E and Pickett logos to their real pages and left the rest zoomable via the sitewide lightbox, and kept the existing dynamic page list underneath as a separate "All Pages" section; wrapping the page content in `<article>` for this also retroactively enabled lightbox zoom on the images added earlier in the same audit
- Made all 9 manufacturer-grid logos active links: created stub pages for the 7 makers without one yet (Aristo, Dietzgen, Faber-Castell, Nestler, Post, Hemmi, SIC), each with an honest "buildout forthcoming" placeholder and a cross-link to All the Rules where that maker already has photos; removed the now-redundant "All Pages" list at the bottom of the landing page; rewrote the 4th intro paragraph's first sentence to point readers at the logo grid; converted "My Favorite Slide Rules" into a floating `.ke-sidebar` pull-out linking to its full page at the bottom; and rebuilt "New to the Collection" as a real photo gallery, restoring 6 more images silently dropped during the original migration (each acquisition had a matching photo on the old Weebly page), sized to wrap the sidebar's full height with no void beside it

---

## 2026-07-23 — Pickett landing page audit

- Audited the Pickett landing page: restored bold+italic emphasis on "seven" (distinct eras) dropped during migration; fixed a Date/Condition data-swap bug where the N4-T and N600-ES subpages had each other's Date field (and N600-ES had N4-T's Condition and was missing its own "# of Scales: 22"), traced back to the original page's accordion-widget catalog which never fully migrated; created two new subpages (Pickett 111-ES Circular, Pickett Model 100 Douglas Sky Rule) recovering real spec/scale content from that same 53-item accordion (only 4 of the 53 items had real content — the other 49 are legitimately-unwritten bare entries, matching the existing flat bullet-list treatment) — 111-ES's own accordion photo turned out to be a mislabeled duplicate of the 103-ES art shot already used elsewhere on the page, so it was deliberately left without a photo rather than perpetuating that mismatch; linked all 4 documented rules (N4-T, N600-ES, 111-ES, Model 100) from the landing page's bullet lists, which previously had no links at all despite N4-T/N600-ES subpages already existing
- Follow-up pass on the Pickett landing page against the old Weebly source: confirmed all three "103-ES circular" image placements on the original page are the exact same photo reused (byte-identical, verified via md5), not three distinct rules — including the closing full-width art shot with Jay's signature visible in-frame, captioned "Pickett Model 103-ES Circular Rule," which had been dropped during migration. Restored it in its original closing position (after the Specialty > Circular Rules bullet list, not before) with its real caption; confirmed the intro paragraphs already carried over completely with no other lost emphasis or flattened lists
- Converted the Pickett landing page's flat bullet-list rule catalog into the same `<details>/<summary>` accordion pattern used by K&E Chapter 7's portfolio (`.ke-portfolio-list`/`.ke-portfolio-item`/`.ke-portfolio-stats`), matching all 53 entries from the original Weebly accordion widget. Deleted the 4 standalone subpages (N4-T, N600-ES, 111-ES, Model 100) and folded their photos/specs/write-ups directly into their accordion entries instead; the other 49 rules became bare accordion rows with the same "haven't written up its details yet" placeholder sentence used in Ch7. Moved the N4-T and N600-ES front/back photos out of the now-deleted `pickett/_images/` subfolder into the shared `_images/` root. Simplified the Nav dropdown's Pickett submenu (which listed the 4 now-deleted subpages) back to a plain top-level link, matching every other slide-rule maker
- Reordered the "Jay's Slide Rules" nav dropdown so The Educational Value of Slide Rules sits above Pickett (and above the K&E book); floated the Pickett landing page's 3 intro images (logo, N4-T hero shot, 1968 catalog cover) inline beside the intro paragraphs instead of stacking them as one full-width block before all the text, alternating sides and clearing before the "General-Purpose Rules" heading

---

*All 13 Learning articles reached visual parity as of 2026-07-22. See project memory for open items (image lightbox rollout, stub landing pages, nav sweep). Per-article audit status is now tracked via dated bullets above and `git log` per file, not this rollup line — treat this note as a snapshot, not a source of truth.*
