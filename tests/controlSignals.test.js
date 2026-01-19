import {run , assert} from "./includes.js";

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
