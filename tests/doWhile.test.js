import {run , assert} from "./includes.js";

assert(
    run(`
        int main() {
        int x = 0;
        do {
            x = x + 1;
        } while (x < 5);
        return x;
        }
    `) === 5,
    "do-while loop failed"
);


assert(
    run(`
        int main() {
        int x = 0;
        do {
            x = 42;
        } while (0);
        return x;
        }
    `) === 42,
    "do-while single iteration failed"
);

