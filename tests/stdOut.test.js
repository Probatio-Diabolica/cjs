import lex from "../src/lexer/lexer.js";
import Parser from "../src/parser/parser.js";
import Evaluator from "../src/interpreter/eval.js";

function assert(cond, msg) {
    if (!cond) throw new Error(msg);
}

function run(src) {
    const tokens = lex(src);
    const ast = new Parser(tokens).parseProgram();
    return new Evaluator().evalProgram(ast);
}

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
