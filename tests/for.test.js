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
      int sum = 0;
      for (int i = 1; i <= 5; i = i + 1) {
        sum = sum + i;
      }
      return sum;
    }
  `) === 15,
  "for loop failed"
);
