---
name: zoom-and-pan
description: Apply, extend, debug, or tune the in-frame zoom-and-pan image mechanism (the one currently live on the M31 Mosaic gallery page) — an alternative to the site's default plain fullscreen click-to-enlarge lightbox. Use this whenever the user wants to roll it out to another image or gallery entry, asks to fix/adjust its zoom, pan, or hi-res-loading behavior, or mentions "the zoom box"/"zoom and pan" and it's ambiguous which of the site's two zoom mechanisms they mean. Do not re-derive this mechanism from scratch — it took several iterations to get right and has specific, non-obvious failure modes documented below.
---

# Zoom and pan

This site has **two coexisting image-zoom mechanisms**, both implemented in
`src/layouts/BaseLayout.astro`'s single script block:

1. **In-frame zoom-and-pan** (this skill) — opt-in only, gated behind the
   `.ke-zoom-inframe` class. Currently applied to exactly one image: the M31
   Mosaic gallery page (`src/pages/gallery/[slug].astro`, set conditionally
   on `entry.id === 'm31-mosaic'`). **Do not broaden the selector to all
   images without Jay's explicit go-ahead** — he is trialing it on one image
   before deciding whether to roll it out further.
2. **Plain fullscreen click-to-enlarge lightbox** — the default for every
   other image on the site (the original, pre-trial behavior: `#ke-lightbox`
   overlay, fit-to-viewport, no pan, no click-point anchoring).

If the user's request is about zoom behavior and it's unclear which
mechanism they mean, ask or check which page they're referring to.

Full narrative history and rationale for every design decision below lives
in memory file `feedback_lightbox_native_size_pan.md` — read it before
making changes if anything here seems to conflict with what you observe in
the code, since that memory has the dated blow-by-blow of what was tried
and rejected.

## What the mechanism does

Clicking an opted-in image zooms in **within its own on-page frame** —
never a fullscreen overlay, never spilling past wherever that image already
sits on the page (a float, a flex item, a plain block). The exact pixel
clicked stays glued under the cursor as the zoom animates in. Once zoomed,
simply **moving the mouse pans** — no click-drag needed — because the image
point under the cursor is continuously recomputed on every `mousemove`
using the same anchor formula used to enter zoom (a magnifier-follows-mouse
mapping: whatever fraction across the frame the cursor sits at, that same
fraction of the image is shown right there). Clicking again (a plain click,
not a drag) toggles back to the normal fit view. Escape resets any active
zoom.

## How to extend it to another image

1. Give the target `<img>` (or Astro `<Image>`) the class `ke-zoom-inframe`,
   conditionally scoped to just that entry/page — follow the pattern in
   `src/pages/gallery/[slug].astro`:
   ```astro
   class={entry.id === 'some-id' ? 'ke-zoom-inframe' : undefined}
   ```
2. Make sure a hi-res source is wired via `data-hires` on an ancestor
   element (see `feedback_ke_hires_lightbox` memory) — the mechanism works
   without one (falls back to a `rect.width * 2.5` default scale using the
   inline image's own natural size) but the whole point of zooming is to
   reveal genuine extra resolution, so don't skip this.
3. Reload and test per the "How to verify" section below **before**
   reporting it done — this feature has non-obvious failure modes that
   don't show up from just reading the diff.
4. If asked to roll it out broadly (all gallery images, or site-wide),
   that's a real scope expansion Jay should confirm explicitly — don't
   infer it from "make it better" or similar vague asks.

## Design constraints — why the code looks the way it does

These aren't arbitrary style choices; each one fixes a real bug found
during development. Don't simplify them away without re-reading why.

- **The wrapper frame is `display: contents` until zoom is active.**
  Every zoomable image gets wrapped at runtime in a `<span
  class="ke-zoom-frame">`. Left as `display: contents`, it has *zero*
  layout effect — doesn't participate in the box tree at all — so it can't
  disturb any surrounding float, flex-item, or absolutely-positioned layout
  (K&E floats, image-feature flex rows, the PhotoCarousel's absolute-
  positioned stage) just by existing. Only once `.ke-zoom-active` is added
  (in JS, at the instant of the click) does it become a real box, pixel-
  locked via inline `width`/`height` to the image's own current rendered
  size (captured via `getBoundingClientRect()` right before locking). This
  sidesteps every CSS circular-sizing trap (percentage-width-in-auto-
  container, absolute-position-depends-on-parent-height-depends-on-child)
  without needing per-context special-casing for floats vs. flex vs.
  absolute.
- **The pan/zoom anchor math simplifies to `tx = x * (1 - scale)`.** `x`/`y`
  are cursor position in frame-local px, `scale` is `naturalWidth /
  frameWidth` (clamped `[1.4, 6]`). This single formula is used both to
  enter zoom (anchored at the click point) and on every subsequent
  `mousemove` (anchored at the current cursor point) — they're
  algebraically identical once the `fracX * rect.width` term cancels back
  to `x`, so don't reintroduce a separate fraction-based formula for entry.
- **Panning is `mousemove`-only, not drag.** There is no `mousedown`/
  `mouseup` tracking in the current implementation — an earlier version
  used click-and-drag, which Jay explicitly rejected in favor of pure
  hover-follow ("as I move around stars in the underlying image, those same
  stars should remain over the cursor"). Don't reintroduce drag-based
  panning without checking first.
- **The hi-res image must be decoded, not just loaded, before the zoom
  transform starts.** This was the subtlest bug: `<img>` `load` event only
  means the bytes finished downloading, not that the browser finished
  *decoding* the file into a paintable bitmap. If decode was still pending
  when the CSS `transform` animation started, the viewer would see the
  small/blurry inline image visibly growing and then *pop* to sharp once
  decoding caught up — a jump, even when the target scale value was
  already correct. Both the background preload (done at page-load time,
  not click time, so it's usually already finished by the time a user
  clicks) and the visible `<img>` after its src swap must `await
  img.decode()` (with a `.catch()` fallback to the `load` event for the
  rare case `decode()` itself rejects) before the transform is allowed to
  start.
- **The plain lightbox sweep explicitly skips `.ke-zoom-inframe` images**
  (`if (img.classList.contains('ke-zoom-inframe')) return;`) so the two
  mechanisms never double-attach to the same image.

## How to verify (don't just eyeball a screenshot)

Per `feedback_browser_pane_screenshot_flakiness` memory, screenshots in the
Browser pane can desync, and this feature in particular has bugs that are
invisible in a single static screenshot (a scale-value jump mid-animation,
a decode-timing pop, a pan formula that's off by a per-pixel rounding
amount). Verify with direct DOM instrumentation instead:

1. **Always start from a genuinely fresh page load** — `navigate` to a
   *different* URL first, then back, rather than trusting `force: true`
   alone or `location.reload()`; this feature's `state.zoomed` can persist
   across a reload that doesn't fully reset (seen firsthand during
   development — a "reload" sometimes still showed the previous zoomed
   state).
2. **Sample the transform over time**, not just once: dispatch a synthetic
   `click` (or `mousemove`) with `bubbles: true` and explicit `clientX`/
   `clientY`, then poll `getComputedStyle(img).transform` every ~25-40ms
   through the ~300ms transition via `setInterval` inside a single
   `javascript_tool` call (a `setTimeout`-wrapped `Promise` that resolves
   with the collected log — don't rely on `window.__foo` persisting between
   separate `javascript_tool` calls, it doesn't reliably survive to the
   next tool invocation). Confirm the scale climbs monotonically to one
   final value with no discontinuous jump.
3. **Check `img.naturalWidth` alongside the transform** at the first
   sample — it should already read the hi-res dimensions (not the small
   inline image's), confirming decode won the race before any visible
   animation began.
4. **Test hover-pan** by dispatching a `mousemove` (not a drag) to a new
   frame-local position after zooming in, and confirm the transform's
   translate values update — panning must work without any `mousedown`.
5. **Cross-check against a real interaction**, not just synthetic events —
   `computer` click + `screenshot`, since dispatched `MouseEvent`s round
   `clientX`/`clientY` to integers and can introduce a few px of apparent
   drift when amplified by a ~5x zoom scale that isn't a real bug.
6. If extending to a **new layout context** not yet verified (the
   PhotoCarousel's absolutely-positioned `.pc-slide img` is the known
   untested case — see the memory file), spot-check that the frame's
   locked rect matches the original image's box exactly (no reflow) and
   that surrounding content isn't disturbed, the same way the gallery page
   and a floated K&E chapter image were cross-checked when this was built.
