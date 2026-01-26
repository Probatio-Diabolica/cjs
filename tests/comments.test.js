import {run , assert} from "./includes.js"

assert(
    run(`
        int main() {
        // this is a comment
        return 1;
        }
    `) === 1,
    "single-line comments should be ignored"
);

assert(
    run(`
        int main() {
        /* multi
            line
            comment */
        return 2;
        }
    `) === 2,
    "block comments should be ignored"
);

let threw = false;
try {
    run(`
        int main() {
        /* oops
        return 0;
        }
    `);
} catch {
    threw = true;
}
assert(threw, "unterminated block comment should throw");
