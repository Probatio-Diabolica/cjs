import {run , assert} from "./includes.js";

assert(
  run(`
    int main() {
      int x = 0;
      while (x < 5) {
        x = x + 1;
      }
      return x;
    }
  `) === 5,
  "while loop failed"
);

assert(
  run(`
    int main() {
      int x = 10;
      while (x < 5) {
        x = x + 1;
      }
      return x;
    }
  `) === 10,
  "zero-iteration while failed"
);
