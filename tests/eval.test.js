import lex from "../src/lexer/lexer.js";
import Parser from "../src/parser/parser.js";
import Evaluator from "../src/interpreter/eval.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const source = `
int main() {
  if(0) return 11;
  return 0;
}
`;

const tokens = lex(source);
const parser = new Parser(tokens);
const ast = parser.parseProgram();

const evaluator = new Evaluator();
const result = evaluator.evalProgram(ast);

assert(result === 0, "Expected program to return 0");
