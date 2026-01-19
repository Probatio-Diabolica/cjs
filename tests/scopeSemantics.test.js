import {run , assert} from "./includes.js";


assert(
    run(`
        int main() {
        int x = 1;
        {
            int x = 2;
        }
        return x;
        }
    `) === 1,
    "block scope shadowing failed"
);

let threw = false;
try {
    run(`
        int main() {
        {
            int x = 5;
        }
        return x;
        }
    `);
    } catch (e) {
    threw = true;
}

assert(threw, "block variable leaked outside scope");
