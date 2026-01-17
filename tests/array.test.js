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
        int a[3];
        a[0] = 1;
        a[1] = 2;
        a[2] = a[0] + a[1];
        return a[2];
        }
    `) === 3,
    "basic array usage failed"
);

assert(
    run(`
        int main() {
        int a[2];
        int i = 0;
        a[i] = 5;
        return a[i];
        }
    `) === 5,
    "array index expression failed"
);
