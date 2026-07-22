# allaboutastro.com rebuild — standing rules

Astro rebuild of Jay's Weebly site, targeting close visual parity with the original (`https://oldallaboutastro.weebly.com/`). Full narrative history: [HISTORY.md](HISTORY.md).

## Scope of these rules

The layout/structural rules below are **site-wide** — they apply to any article page (Learning articles, sliderules pages, gear reviews, K&E chapters alike), since `.ke-*` components are defined once in `src/layouts/BaseLayout.astro`'s global style block.

The **content conventions** (bold-first-mention, AI-stub disclosure box) are **K&E/slide-rule pages only** — confirmed explicitly by Jay (2026-07-22) not to extend to Learning/astronomy pages.

## Site-wide layout rules (any article page)

1. Never split a heading from its own body text — a `.ke-sidebar`/`.ke-figure` can't be the first thing after a heading.
2. Avoid side-by-side images unless they're a confirmed obviously-paired photo set (e.g. front/back) — use `.ke-figure-row` for those; otherwise force stacking with `ke-clear` or same-side floats.
3. No wrapped line of body text narrower than ~3 words (~200px floor). Float smaller companion images too rather than leaving them to defer past a whole float; default to `.ke-figure-right/-left` (46%), only drop to `-third`/`-quarter` when a sidebar is actively competing.
4. `.ke-sidebar` boxes: always float to a side (never full-width/solo), never two active simultaneously, never a blank void beside one, genuine full-width gap (~1000+px ideal) between consecutive sidebars. Widen long sidebars (`data-width="wide"` 58%, `"widest"` 68% — riskier for narrow-line violations) rather than going full-width.
5. Sidebar color: boxes titled "Sidebar: X" are always teal (default); other asides use a consistent non-teal color within a given article.
6. Pull-quote/callout style is scoped to `.ke-callout` — never the bare `blockquote` selector (plain blockquotes are real quotations elsewhere).
7. Closing signature graphic only on true single-page articles, never on every page of a multi-page split.
8. `.ke-image-feature` gallery pattern for 2-3 related photos too short to fill a column alone.
9. **Never write `:global(...)` selectors inside `BaseLayout.astro`'s `<style is:global>` block** — silently dropped by the browser, no error. Always plain selectors (`.foo img`, not `.foo :global(img)`).
10. Grab hi-res images at extraction time — Weebly's `<img src>` is a small thumbnail; the real file is at the wrapping `<a href>`. Wire up `data-hires` on the wrapping element.
11. A close-up photo with Jay's cursive signature visible in-frame is an "art shot" — display it large/full-width, never in a small float.

Full detail, verification scripts, and edge cases: memory files `feedback_ke_layout_rules.md`, `feedback_ke_sidebar_layout.md`, `feedback_ke_hires_lightbox.md`, `feedback_ke_art_shot_id.md`.

## K&E / slide-rule pages only (src/content/sliderules/**)

- Bold the first mention of each distinct slide-rule model in body text, scoped per-chapter (not headings/captions/AI-stubs). See `feedback_ke_bold_first_mention.md`.
- Bare-name entries with no source prose get the `.ke-ai-stub` disclosure box (violet, "AI-drafted/unverified") rather than invented first-person history — check McCoy's catalog site and osgalleries.org for real facts first. See `feedback_ke_stub_placeholder_content.md`, `reference_mccoy_ke_catalog_site.md`.
- `.ke-scale-set` component for "Front Side/Back Side" scale-notation blocks. See `feedback_ke_scale_set_component.md`.

## Workflow

- Operate autonomously on routine work in this repo — don't pause for permission prompts or check-ins (`.claude/settings.local.json` has broad allows). Push straight to `origin main` after verifying a change.
- Ask Jay directly when a Weebly section's structure is ambiguous (column layout/proportions) rather than guessing from CSS alone — Weebly's editor caps rows at 3 columns.
- Full workflow/feedback-channel details (screenshot annotation, subagent-respawn technique, verification scripts) live in the memory system — see `MEMORY.md` in the memory directory for the full index.
