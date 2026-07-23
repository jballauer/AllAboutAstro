# Verification scripts

Run these against the live dev-server render of the article (via the
Browser pane's `javascript_tool`), not against the source markdown — layout
bugs only exist once CSS floats are actually applied.

## 1. Void scan

Flags gaps larger than 150px between consecutive main-flow elements.

```js
(function(){
const article = document.querySelector('article') || document.querySelector('main');
const flow = Array.from(article.querySelectorAll('p,h2,h3,.ke-figure,.ke-image-feature,.ke-figure-row,blockquote,ul,ol'))
  .filter(el => !el.closest('.ke-sidebar'))
  .filter(el => !el.matches('p') || !el.closest('.ke-figure'));
const rects = flow.map(el=>({r:el.getBoundingClientRect(),text:el.textContent.trim().slice(0,40)}))
  .filter(x=>x.r.height>0 && x.text.length>0).sort((a,b)=>a.r.top-b.r.top);
const gaps=[];
for (let i=1;i<rects.length;i++){ const gap=rects[i].r.top-rects[i-1].r.bottom; if(gap>150) gaps.push([Math.round(gap), rects[i-1].text,'->',rects[i].text]); }
return JSON.stringify(gaps,null,1);
})();
```

**Known false positives — rule these out before reporting a finding:**

- **A `.ke-figure-row` or `.ke-figure` with no caption text** produces an
  empty `textContent`, so the `x.text.length>0` filter silently drops it
  from the flow list — the scan then sees a "gap" that's actually filled by
  that image. Fix by re-running with `.ke-figure-row,.ke-figure` matched by
  class directly (ignore the text-length filter) and checking whether its
  rect actually spans the reported gap.
- **A sidebar occupying the gap in parallel.** Sidebars are deliberately
  excluded from the flow list (they float beside the flow, not within it),
  so a heading that correctly waits for `ke-clear` after a sidebar will
  always look like a gap to this script. Pull the sidebar's own rect
  separately and check whether it (plus a small margin) accounts for the
  reported gap — if so, this is correct layout, not a bug.

If, after ruling both of those out, a gap still isn't explained by any
element's rect, it's a real void — usually caused by a plain (non-floated)
image or `.ke-figure` deferring past an active float instead of sliding into
the remaining space (see `CLAUDE.md` rule 3 / the site-wide layout memory
for the fix: float the smaller element too).

## 2. Same-side figure/sidebar overlap (squeeze check)

Flags a figure floated the same side as an active sidebar — a strong signal
of a squeezed, near-unreadable middle column.

```js
(function(){
const sidebars = [...document.querySelectorAll('.ke-sidebar')].map(s=>({el:s,rect:s.getBoundingClientRect()}));
const figures = [...document.querySelectorAll('.ke-figure-left,.ke-figure-right')].map(f=>({el:f,rect:f.getBoundingClientRect(),cls:f.className}));
const out=[];
figures.forEach(fig=>sidebars.forEach(sb=>{
  const vOverlap = fig.rect.top<sb.rect.bottom && fig.rect.bottom>sb.rect.top;
  const sameSide = fig.cls.includes('ke-figure-right') && sb.el.dataset.side==='right'
    || fig.cls.includes('ke-figure-left') && sb.el.dataset.side==='left';
  if(vOverlap&&sameSide) out.push(['OVERLAP', fig.cls, sb.el.textContent.slice(0,30)]);
}));
return JSON.stringify(out);
})();
```

## 3. Sidebar-overlaps-sidebar check

Two sidebars must never be active at the same time (rule 4 — "never two
active simultaneously").

```js
(function(){
const sidebars = [...document.querySelectorAll('.ke-sidebar')].map(s=>s.getBoundingClientRect());
const out=[];
for(let i=0;i<sidebars.length;i++) for(let j=i+1;j<sidebars.length;j++){
  const a=sidebars[i], b=sidebars[j];
  if (a.top<b.bottom && a.bottom>b.top) out.push([i,j,'overlap']);
}
return JSON.stringify({sidebarOverlaps: out, sidebarCount: sidebars.length});
})();
```

## 4. Narrow-line-wrap check

Flags any non-final wrapped line under ~200px wide (rule 3's "no wrapped
line narrower than ~3 words"). Deliberately ignores each paragraph's last
line (a short final line is normal typography) and merges same-line rects
first — a `<strong>`/`<em>` boundary mid-line otherwise reports as a false
extra "line".

```js
(function(){
const article = document.querySelector('article');
const ps = Array.from(article.querySelectorAll('p')).filter(p=>!p.closest('.ke-sidebar') && !p.closest('.ke-figure'));
const flagged = [];
ps.forEach(p=>{
  const range = document.createRange();
  range.selectNodeContents(p);
  const rects = Array.from(range.getClientRects());
  if (!rects.length) return;
  const lines = [];
  rects.forEach(r=>{
    let line = lines.find(l=>Math.abs(l.top-r.top)<2);
    if (!line){ line = {top:r.top,left:r.left,right:r.right}; lines.push(line);}
    else { line.left = Math.min(line.left,r.left); line.right = Math.max(line.right,r.right); }
  });
  lines.sort((a,b)=>a.top-b.top);
  for (let i=0;i<lines.length-1;i++){
    const w = lines[i].right - lines[i].left;
    if (w < 200) flagged.push({text:p.textContent.trim().slice(0,40), width:Math.round(w), lineIdx:i, totalLines:lines.length});
  }
});
return JSON.stringify(flagged,null,1);
})();
```

## 5. Heading-immediately-followed-by-sidebar/figure check

Rule 1: a heading's own body text must render before any sidebar or figure.
Run this against the source markdown with a plain shell command (faster and
more precise than a DOM check, since it's really a document-order question):

```bash
awk '
/^#{2,3} /{ h=$0; waiting=1; next }
waiting && /^$/{ next }
waiting && /^<div class="ke-(sidebar|figure)/{ print "VIOLATION: \"" h "\" -> " $0; waiting=0; next }
waiting { waiting=0 }
' path/to/article.md
```

No output means no violations.
