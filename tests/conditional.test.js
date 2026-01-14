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
      if (0) return 1;
      else return 2;
    }
  `) === 2,
  "else branch not executed"
);

assert(
  run(`
    int main() {
      if (1) return 1;
      else return 2;
    }
  `) === 1,
  "then branch incorrect"
);
