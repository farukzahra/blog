import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: node scripts/verify-mermaid.mjs <file.mmd|--stdin>');
  process.exit(2);
}

const source =
  arg === '--stdin' ? readFileSync(0, 'utf8').trim() : readFileSync(arg, 'utf8').trim();

if (!source) {
  console.error('Empty diagram');
  process.exit(1);
}

const dir = mkdtempSync(join(tmpdir(), 'mermaid-verify-'));
const input = join(dir, 'diagram.mmd');
const output = join(dir, 'diagram.svg');

try {
  writeFileSync(input, source, 'utf8');
  execSync(`npx -y @mermaid-js/mermaid-cli@11.4.0 -i "${input}" -o "${output}"`, {
    stdio: 'pipe',
    encoding: 'utf8',
  });
  console.log('Mermaid OK');
} catch (err) {
  const msg = err.stderr?.toString() || err.stdout?.toString() || err.message;
  console.error('Mermaid syntax error:', msg.trim());
  process.exit(1);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
