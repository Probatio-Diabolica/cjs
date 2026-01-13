import fs from "fs";
import path from "path";

const tests = fs.readdirSync(new URL(".", import.meta.url))
  .filter(f => f.endsWith(".test.js"));

let failed = 0;

for (const file of tests) {
  try {
    await import(`./${file}`);
    console.log(`✓ ${file}`);
  } catch (e) {
    failed++;
    console.error(`✗ ${file}`);
    console.error(e.message);
  }
}

if (failed > 0) {
  process.exit(1);
}
