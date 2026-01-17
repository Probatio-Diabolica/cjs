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
        char c = 'A';
        return c;
        }
    `) === 65,
    "char literal failed"
);

assert(
    run(`
        int main() {
        char a = 'a';
        char b = a + 1;
        return b;
        }
    `) === 98,
    "char arithmetic failed"
);

assert(
    run(`
        int main() {
        char c = 'Z';
        if (c == 90) return 1;
        return 0;
        }
    `) === 1,
    "char comparison failed"
);
