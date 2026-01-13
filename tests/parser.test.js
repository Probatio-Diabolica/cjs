import lex from "../src/lexer/lexer.js";
import Parser from "../src/parser/parser.js";

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

assert(ast.functions.length === 1, "Expected one function");
assert(ast.functions[0].name === "main", "Function name should be main");
assert(ast.functions[0].body.statements.length === 2, "Expected two statements");
