import { execFileSync } from 'node:child_process';

// Returns a human-readable date ("July 17, 2026") for the most recent commit
// that touched the given repo-relative path, or null if it can't be
// determined (not a git checkout, or a shallow clone with no matching commit
// in its history).
export function getLastUpdated(relativePath) {
  try {
    const output = execFileSync(
      'git',
      ['log', '-1', '--date=format:%Y-%m-%d', '--format=%cd', '--', relativePath],
      { cwd: process.cwd(), encoding: 'utf-8' }
    ).trim();
    if (!output) return null;
    const [year, month, day] = output.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return null;
  }
}

// Convenience wrapper for a content-collection entry.  Astro exposes the
// source file on the entry as `filePath`; older entries (or a collection
// loader that omits it) fall back to trying both markdown extensions, since
// the collection id is the filename without one.
export function getEntryLastUpdated(entry, collectionDir) {
  if (entry && entry.filePath) {
    const hit = getLastUpdated(entry.filePath);
    if (hit) return hit;
  }
  for (const ext of ['.md', '.mdx']) {
    const hit = getLastUpdated(`${collectionDir}/${entry.id}${ext}`);
    if (hit) return hit;
  }
  return null;
}
