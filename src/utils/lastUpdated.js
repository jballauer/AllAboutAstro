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
