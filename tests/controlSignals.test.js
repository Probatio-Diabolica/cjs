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
        int sum = 0;
        while (x < 10) {
            x = x + 1;
            if (x == 5) continue;
            if (x == 8) break;
            sum = sum + x;
        }
        return sum;
        }
    `) === 23,
    "break/continue failed"
);
