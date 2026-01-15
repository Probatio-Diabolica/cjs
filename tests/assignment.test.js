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

assert(
  run(`
    int main() {
      int x = 10;
      int y = 11;
      if (x < y) x = y;
      return x;
    }
  `) === 11,
  "assignment failed"
);

assert(
  run(`
    int main() {
      int x = 1;
      x = x + 2;
      return x;
    }
  `) === 3,
  "self-assignment failed"
);
