---
name: audit-article-layout
description: Audit a migrated article-style page on this Astro site (a Learning article, a K&E/sliderules chapter, or a gear review) for visual-parity gaps against the original Weebly source and for violations of the site's ke-* layout rules (blank voids beside sidebars, narrow-wrapped text, heading/body splits, missing closing signatures, etc.). Use this whenever the user says "audit the next article", "audit/check <article name>", asks to verify a page's layout, mentions blank space or void or a sidebar problem on a specific page, or wants to confirm a migrated page matches the old site. Fixes what it finds and pushes to main, matching this project's autonomous workflow — don't ask for permission before applying a confirmed fix.
---

# Audit article layout

This project (allaboutastro.com) is an Astro rebuild of a Weebly site
(`https://oldallaboutastro.weebly.com/`), aiming for close visual parity.
Every article-style page — Learning articles, sliderules/K&E chapters, gear
reviews — shares one set of layout components (`.ke-figure`, `.ke-sidebar`,
`.ke-image-feature`, `.ke-clear`, etc.) defined once in
`src/layouts/BaseLayout.astro`. This skill runs the two-part audit that
catches the two failure modes seen repeatedly on this project: **content
that got dropped during migration**, and **layout rules that got violated**.

Read `C:\Users\Jay Ballauer\.claude\allaboutastro_rebuild\CLAUDE.md` first if
it hasn't already been loaded this session — it has the numbered rule list
this audit checks against, and notes which rules are site-wide vs.
K&E-specific.

## Step 0: Pick the target page

If the user named a specific page, use it. Otherwise, work out "the next
one":

1. List the content collection the user implied (default to
   `src/content/learning/*.md` if unspecified), and read each file's
   `order:` frontmatter field.
2. Check `git log --oneline -- <file>` for each candidate, lowest `order`
   first. **Trust this over any prose summary in `HISTORY.md`** — a line
   like "All 12 Learning articles reached visual parity" is a snapshot that
   goes stale the moment a later session fixes something without updating
   it (this happened: a session fixed Globular Clusters, HISTORY.md's count
   was never revised, and the next audit re-picked the same already-fixed
   article instead of moving on). `HISTORY.md`'s dated bullet entries are
   more trustworthy than its narrative rollup lines, but even those can lag
   — a recent, specific-sounding commit on the file (not just the original
   migration-batch commit) is the strongest signal that it's already been
   audited.
3. Pick the lowest-`order` file that has no such recent audit-shaped
   commit. If everything in the current collection looks covered, say so
   and ask which collection to move to next (Learning → sliderules/K&E →
   gear) rather than guessing.

## Step 1: Find the original page and extract its structure

Old-site URLs are flat: `https://oldallaboutastro.weebly.com/<slug>.html`.
Don't guess the slug from the new Astro route — nested content (e.g. K&E
chapters) didn't necessarily nest on Weebly. Instead, open the old site and
use `read_page` on its nav, or `find`, to locate the actual link text
matching the article's title, and take its `href`.

Once on the old page, don't trust `get_page_text` alone for structure —
Weebly often collapses an entire article's paragraphs into one `div.paragraph`
with `<br>` separators, and figures/sidebars live in sibling `<div>`s around
it. Use `javascript_tool` to walk `.wsite-elements.wsite-not-footer`'s
direct children in order and note each one's type (heading / paragraph /
image / other) — this ordering is the ground truth for where each image
belongs relative to the text. For any `<img>`, resolve the real full-size
file: Weebly's `<img src>` is a small thumbnail, the original is usually at
the image's wrapping `<a href>` — check `img.closest('a')`.

This tells you what the original page actually contains: how many images,
where they sit relative to which paragraph, whether the last thing on the
page is Jay's signature graphic (`855696628_orig.jpg`, a 278x97 cursive
signature — always the same file, already used at
`src/content/learning/_images/space-landscape-8-signature.jpg` and
`globular-01-signature.jpg`; copy the existing file rather than
re-downloading it if you spot it again), and roughly how it was floated
(the `text-align`/no-float styling on Weebly doesn't map directly to a
`ke-figure-left/-right` — use judgment plus the rules below).

## Step 2: Diff against the migrated file

Read the target `.md` file and compare against what Step 1 found:

- Every image on the old page should have a counterpart in the new file
  (check `_images/` for the collection, and the per-collection banner map in
  the relevant `[slug].astro` / `[...slug].astro` route file — banners are
  wired up separately from the body content, don't assume a missing banner
  import means a missing image).
- The closing-signature rule (`CLAUDE.md` rule 7): a true single-page
  article should end with the signature graphic if the original did; a
  multi-page split (several old Weebly pages merged into one new article, or
  a K&E chapter) should not — check `HISTORY.md` and the article's own text
  for "Part 1 / Part 2" or similar merge markers before deciding.
- Caption text and image identity — Jay has caught mismatched or
  misattributed captions/images before (see `HISTORY.md`'s 2026-07-21
  entries); spot-check a couple of captions against the old page's
  surrounding text, don't just check counts.
- Inline emphasis (`<em>`/`<strong>` in the old page's HTML → `*.../*`/
  `**...**` in the migrated markdown). This is easy to lose silently since
  it doesn't change word count or paragraph structure — a plain-text diff
  of word counts won't catch it. Check the old page's raw `innerHTML` (not
  just its rendered text) for `<em>`/`<strong>` spans and confirm each has
  a markdown counterpart in the same spot.

If this is a K&E/sliderules page, also check the two content conventions
that only apply there (not to Learning/gear pages): bold-first-mention of
each slide-rule model, and the `.ke-ai-stub` disclosure box on bare-name
entries with no real source prose — see `CLAUDE.md`'s K&E section.

## Step 3: Verify layout rules against the live render

Start (or reuse) the dev server preview and navigate to the article's local
URL. Then run the checks in `references/verification-scripts.md` against
it — a void scan, a sidebar-overlap/squeeze check, a narrow-line-wrap check,
and a heading-immediately-followed-by-sidebar/figure check. Read that file
now if you haven't already; it has the exact scripts and, importantly, notes
on their false-positive patterns (a `.ke-figure-row` or an intentionally
still-active sidebar can both look like a "void" to the naive version of
these checks — don't report a finding without ruling those out first).

Treat every flagged gap as a lead to investigate, not a confirmed bug —
pull the actual bounding rects for the elements on either side of the gap
before concluding anything.

## Step 4: Fix, verify, ship

For each confirmed issue (missing content or a layout-rule violation):

1. Fix it directly in the `.md` file, following the relevant numbered rule
   in `CLAUDE.md`. When a fix needs a new image, prefer copying a
   byte-identical file already in the repo (as with the signature graphic)
   over re-downloading if one exists.
2. Re-render and re-run the specific check that flagged the issue to
   confirm it's actually resolved — don't assume from reading the diff.
3. Once the page is clean, commit and push to `origin main` without
   pausing for approval — this project's standing instruction is to operate
   autonomously and push right after verifying (see `CLAUDE.md` Workflow
   section). Write a commit message that names the actual gap fixed (e.g.
   "Add missing closing signature to X"), not a generic "fix layout" message.

If the page is already clean, say so plainly and don't invent busywork —
several audited pages will have nothing wrong with them, and that's a
useful, reportable outcome on its own.

## Step 5: Record the audit, every time — even a clean pass

This is what makes Step 0 reliable for the *next* run, so don't skip it
just because nothing needed fixing. Add one bullet to `HISTORY.md` under
today's date section (create the section if today isn't there yet) naming
the specific page and the outcome — e.g. "Audited Choosing a 35mm Film
Camera: clean, no changes" or "Audited X: fixed missing closing signature."
Commit this together with any content fix from Step 4 (or by itself, for a
clean pass) and push it. A dated, specific bullet per page beats a
periodic prose rollup ("all N articles at parity") — the rollup is what
went stale and caused a wasted duplicate audit last time this skill ran.

## Reporting

End with a short summary: what page was audited, what (if anything) was
found and fixed, and confirmation that it's pushed (including the
`HISTORY.md` bullet from Step 5). If everything passed, list which checks
were run so it's clear the audit was real, not skipped.
