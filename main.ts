// Funniest One-Line Out-of-Office Reply
// make.fun bounty u-hamsyh-funniest-one-line-out-of-office-reply-5490c1c8
//
// The hook: the inbox itself got promoted. Instead of the usual "limited
// email access" disclaimer, the away message hands the job to the inbox —
// and the inbox already hates the promotion. One line, no setup, and it
// still reads like a message a real person would switch on.
//
// Gate (RULES.txt): /output/entry.txt must be UTF-8 text of 1 to 160
// characters, not only white space. This line is 73 characters.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I'm away. My inbox was promoted to acting manager and already regrets it.";

// Gate guard: refuse to write anything that would fail the sealed scorer.
if (LINE.length < 1 || LINE.length > 160) {
  throw new Error(`entry line fails the 1-160 char gate: ${LINE.length} chars`);
}
if (!LINE.trim()) {
  throw new Error("entry line must not be only white space");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}
// Tightening (reviser pass): no leading/trailing padding — the sealed
// scorer counts every character, so padding would waste the 1-160 budget
// and read as sloppy in an out-of-office reply.
if (LINE !== LINE.trim()) {
  throw new Error("entry line must not start or end with white space");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");
// Verify the round-trip: what the scorer reads must be exactly the line.
if (readFileSync(outPath, "utf8") !== LINE) {
  throw new Error("written entry does not match the gated line");
}
