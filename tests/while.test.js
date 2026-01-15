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
      int x = 0;
      while (x < 5) {
        x = x + 1;
      }
      return x;
    }
  `) === 5,
  "while loop failed"
);

assert(
  run(`
    int main() {
      int x = 10;
      while (x < 5) {
        x = x + 1;
      }
      return x;
    }
  `) === 10,
  "zero-iteration while failed"
);
