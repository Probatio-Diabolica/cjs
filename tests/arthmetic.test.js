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
  run(`int main(){ return 1 + 2 * 3; }`) === 7,
  "precedence failed"
);

assert(
  run(`int main(){ return (1 + 2) * 3; }`) === 9,
  "parentheses failed"
);

assert(
  run(`int main(){ return 5 % 2; }`) === 1,
  "modulo failed"
);
