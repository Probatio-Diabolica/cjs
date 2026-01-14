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
      int x = 5;
      int y = x + 2;
      return y;
    }
  `) === 7,
  "variable evaluation failed"
);
