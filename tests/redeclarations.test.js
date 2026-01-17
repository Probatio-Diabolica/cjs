import lex from "../src/lexer/lexer.js";
import Parser from "../src/parser/parser.js";
import Evaluator from "../src/interpreter/eval.js";

function run(src) {
    const tokens = lex(src);
    const ast = new Parser(tokens).parseProgram();
    return new Evaluator().evalProgram(ast);
}
function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

let threw = false;

try {
    run(`
        int main() {
        int c = 10;
        char c = 'A';
        return 0;
        }
    `);
    } catch (e) {
    threw = true;
}

assert(
    threw,
    "redeclaration in same scope should throw an error"
);