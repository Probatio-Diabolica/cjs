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
  run(`int main(){ if (5 > 3) return 1; return 0; }`) === 1,
  "> failed"
);

assert(
  run(`int main(){ if (5 < 3) return 1; return 0; }`) === 0,
  "< failed"
);

assert(
  run(`int main(){ if (5 == 5) return 1; return 0; }`) === 1,
  "== failed"
);

assert(
  run(`int main(){ if (5 != 5) return 1; return 0; }`) === 0,
  "!= failed"
);

assert(
  run(`int main(){ if (3 + 2 * 2 == 7) return 1; return 0; }`) === 1,
  "precedence + comparison failed"
);
