import {run , assert} from "./includes.js";

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