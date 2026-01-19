import {run , assert} from "./includes.js";


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
