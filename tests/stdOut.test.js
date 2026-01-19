import {run , assert} from "./includes.js";

let output = [];
const originalLog = console.log;
console.log = (x) => output.push(x);

assert(
  run(`
    int main() {
      out(42);
      out(1 + 2 * 3);
      return 0;
    }
  `) === 0,
  "out affected return value"
);

assert(
  output.join(",") === "42,7",
  "out printed wrong values"
);

console.log = originalLog;
