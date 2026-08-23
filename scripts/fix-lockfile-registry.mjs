import { readFileSync, writeFileSync } from 'node:fs';

const LOCKFILE = 'bun.lock';
const LOCAL_REGISTRY = /https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/g;
const PUBLIC_REGISTRY = 'https://registry.npmjs.org';

let content;
try {
  content = readFileSync(LOCKFILE, 'utf8');
} catch {
  process.exit(0);
}

if (!LOCAL_REGISTRY.test(content)) {
  process.exit(0);
}

writeFileSync(LOCKFILE, content.replaceAll(LOCAL_REGISTRY, PUBLIC_REGISTRY));
process.stdout.write(
  `${LOCKFILE}: local registry URLs rewritten to ${PUBLIC_REGISTRY}\n`,
);
