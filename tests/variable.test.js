import {run , assert} from "./includes.js";

assert(
  run(`
    int main() {
      int x = 5;
      int y = x + 2;
      return y;
    }
  `) === 7,
  "variable evaluation failed"
);
