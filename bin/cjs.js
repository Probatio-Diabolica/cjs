#!/usr/bin/env node

import fs from "fs";
import path from "path";
import process from "process";
import run from "../src/index.js";

function usage() {
  console.error("usage: cjs <file.c> [--ub]");
  process.exit(1);
}

const args = process.argv.slice(2);

if (args.length === 0) {
  usage();
}

const file = args.find(a => !a.startsWith("--"));
const ubMode = args.includes("--ub");

if (!file) {
  usage();
}

const filePath = path.resolve(process.cwd(), file);

if (!fs.existsSync(filePath)) {
  console.error(`error: file not found: ${file}`);
  process.exit(1);
}

if (!file.endsWith(".c")) {
  console.error("error: not a .c file. stay in your lane.");
  process.exit(1);
}

const source = fs.readFileSync(filePath, "utf8");

try {
  run(source, { ub: ubMode });
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

